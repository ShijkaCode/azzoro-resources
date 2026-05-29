// Optimize site media for fast, reliable, free-tier delivery.
//
// Why this exists:
//   public/uploads originals are raw camera output (12-65MB images, 24-38MB
//   video). Committing those to git is unviable and serving them is slow. This
//   script reads the full-resolution originals from media-source/uploads (kept
//   out of git) and writes web-optimized copies into public/uploads (committed,
//   deployed). Filenames, paths and extensions are preserved so no code or CMS
//   content references need to change.
//
// What counts as "live" (everything else in the source is left behind):
//   1. Every /uploads/... path referenced in content/, components/, app/, lib/.
//   2. Every web-renderable image in field/ (the gallery page dir-scans it).
//
// Re-run any time after dropping new originals into media-source/uploads:
//   node scripts/optimize-media.mjs

import { readdirSync, existsSync, mkdirSync, statSync, copyFileSync, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { execFileSync } from 'child_process';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'media-source', 'uploads');
const OUT = path.join(ROOT, 'public', 'uploads');
const SCAN_DIRS = ['content', 'components', 'app', 'lib'];

// Tuning — drop quality/size here if the client wants smaller still.
const IMG_MAX_DIM = 2000;   // px, longest edge; never upscales
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 80;
const PNG_MAX_DIM = 2000;
const VIDEO_MAX_WIDTH = 1920;
const VIDEO_CRF = 28;       // higher = smaller/lower quality

const IMG_RE = /\.(jpe?g|png|webp)$/i;
const VIDEO_RE = /\.(mp4|mov)$/i;

const mb = (n) => (n / 1048576).toFixed(2) + ' MB';

// ---- 1. Discover the live set --------------------------------------------

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

async function collectReferencedPaths() {
  // Images/videos get optimized; pdf/svg are referenced (e.g. governance
  // downloads, icons) and copied through verbatim so they stay deployed.
  const refRe = /\/uploads\/[A-Za-z0-9_./%-]+\.(?:jpe?g|png|webp|avif|mp4|mov|pdf|svg)/gi;
  const found = new Set();
  for (const d of SCAN_DIRS) {
    const dir = path.join(ROOT, d);
    if (!existsSync(dir)) continue;
    for (const file of walk(dir)) {
      if (/\.(tsx?|jsx?|md|mdx|ya?ml|json)$/i.test(file)) {
        const text = await readFile(file, 'utf8');
        const matches = text.match(refRe);
        if (matches) for (const m of matches) found.add(decodeURIComponent(m));
      }
    }
  }
  return found; // e.g. "/uploads/team/_CP11385.jpg"
}

function collectFieldImages() {
  const dir = path.join(SRC, 'field');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((n) => IMG_RE.test(n))
    .map((n) => `/uploads/field/${n}`);
}

// ---- 2. Optimizers --------------------------------------------------------

async function optimizeImage(srcFile, outFile) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  const ext = path.extname(srcFile).toLowerCase();
  const img = sharp(srcFile, { failOn: 'none' }).rotate(); // honor EXIF orientation
  const meta = await img.metadata();
  const maxDim = ext === '.png' ? PNG_MAX_DIM : IMG_MAX_DIM;
  if (meta.width > maxDim || meta.height > maxDim) {
    img.resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true });
  }
  if (ext === '.png') {
    await img.png({ compressionLevel: 9, palette: true }).toFile(outFile);
  } else if (ext === '.webp') {
    await img.webp({ quality: WEBP_QUALITY }).toFile(outFile);
  } else {
    await img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outFile);
  }
}

function optimizeVideo(srcFile, outFile) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  execFileSync('ffmpeg', [
    '-y', '-i', srcFile,
    '-vf', `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(VIDEO_CRF),
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outFile,
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
}

// ---- 3. Run ---------------------------------------------------------------

const refs = await collectReferencedPaths();
const fieldRefs = collectFieldImages();
const live = new Set([...refs, ...fieldRefs]);

// LQIP: tiny blurred base64 preview per image, keyed by the decoded /uploads
// path. MediaImage feeds these to next/image's placeholder="blur" so sharp
// images fade in instead of popping in one by one.
async function makeBlur(file) {
  const buf = await sharp(file).resize(20).webp({ quality: 30 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

const blurManifest = {};
const missing = [];
let srcTotal = 0;
let outTotal = 0;
let count = 0;

for (const ref of [...live].sort()) {
  const rel = ref.replace(/^\/uploads\//, '');
  const srcFile = path.join(SRC, rel);
  const outFile = path.join(OUT, rel);

  if (!existsSync(srcFile)) {
    missing.push(ref);
    continue;
  }

  const srcSize = statSync(srcFile).size;
  srcTotal += srcSize;

  try {
    if (IMG_RE.test(srcFile)) {
      await optimizeImage(srcFile, outFile);
    } else if (VIDEO_RE.test(srcFile)) {
      optimizeVideo(srcFile, outFile);
    } else {
      mkdirSync(path.dirname(outFile), { recursive: true });
      copyFileSync(srcFile, outFile);
    }
  } catch (err) {
    console.error(`  ! failed ${rel}: ${err.message} — copying original`);
    mkdirSync(path.dirname(outFile), { recursive: true });
    copyFileSync(srcFile, outFile);
  }

  // If optimization somehow grew the file, keep the smaller original.
  if (existsSync(outFile) && statSync(outFile).size > srcSize) {
    copyFileSync(srcFile, outFile);
  }

  const outSize = statSync(outFile).size;
  outTotal += outSize;
  count++;

  if (IMG_RE.test(outFile)) {
    try {
      blurManifest[ref] = await makeBlur(outFile);
    } catch {
      /* non-fatal: image just won't get a blur-up placeholder */
    }
  }

  console.log(`  ${rel}\n      ${mb(srcSize)} -> ${mb(outSize)}`);
}

// Hero poster MUST match the hero video's first frame, or it flashes on reload.
// Derive it straight from the optimized video.
const heroVideo = path.join(OUT, 'drone', 'hero_drone.MP4');
const heroPoster = path.join(OUT, 'hero-poster.jpg');
if (existsSync(heroVideo)) {
  const tmp = path.join(OUT, '.hero-frame.png');
  execFileSync('ffmpeg', ['-y', '-i', heroVideo, '-frames:v', '1', tmp], {
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  await sharp(tmp)
    .resize({ width: IMG_MAX_DIM, height: IMG_MAX_DIM, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(heroPoster);
  try { (await import('fs')).unlinkSync(tmp); } catch {}
  console.log('  hero-poster.jpg regenerated from video first frame');
}

// Write the blur manifest for MediaImage to import.
const manifestDir = path.join(ROOT, 'lib', 'media');
mkdirSync(manifestDir, { recursive: true });
writeFileSync(path.join(manifestDir, 'blur-manifest.json'), JSON.stringify(blurManifest, null, 0));
console.log(`  blur manifest: ${Object.keys(blurManifest).length} entries`);

console.log('\n--- summary ---');
console.log(`optimized files : ${count}`);
console.log(`source total    : ${mb(srcTotal)}`);
console.log(`output total    : ${mb(outTotal)}`);
console.log(`reduction       : ${(100 - (outTotal / srcTotal) * 100).toFixed(1)}%`);

if (missing.length) {
  console.log(`\n!! ${missing.length} referenced file(s) NOT FOUND in media-source/uploads:`);
  for (const m of missing) console.log(`   ${m}`);
  console.log('   (these will 404 on the site — restore the originals or fix the reference)');
  process.exitCode = 1;
}
