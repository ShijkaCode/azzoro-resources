// Generate brand favicons from the Azzuro logomark.
//
// Crops the four-circle logomark out of public/logo-azzuro-light.png (the wide
// wordmark), squares it, and emits:
//   app/icon.png        512x512 transparent   (browser tab / modern)
//   app/apple-icon.png  180x180 on white      (iOS home screen)
//   public/favicon.ico  16/32/48              (legacy /favicon.ico)
//
// Re-run if the logo changes:  node scripts/make-favicon.mjs

import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const LOGO = path.join(ROOT, 'public', 'logo-azzuro-light.png');

// The logomark sits in the left ~250px of the 828px-wide wordmark. Crop that
// region, then tightly trim transparent padding via the alpha channel (sharp's
// built-in .trim() misbehaves on transparent edges in this version).
async function alphaTrim(buf) {
  const img = sharp(buf);
  const { width, height } = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return buf; // fully transparent — leave as-is
  return sharp(buf)
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();
}

const cropped = await sharp(LOGO)
  .extract({ left: 0, top: 0, width: 250, height: 301 })
  .png()
  .toBuffer();
const markBuf = await alphaTrim(cropped);

const PAD = 0.12; // breathing room around the mark inside the square

async function squarePng(size, background) {
  const inner = Math.round(size * (1 - PAD * 2));
  const resized = await sharp(markBuf)
    .resize({ width: inner, height: inner, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// app/icon.png — transparent, modern browser tab
writeFileSync(path.join(ROOT, 'app', 'icon.png'), await squarePng(512, transparent));

// app/apple-icon.png — white bg (iOS shows transparency as black)
writeFileSync(path.join(ROOT, 'app', 'apple-icon.png'), await squarePng(180, white));

// public/favicon.ico — multi-size from white-bg PNGs (crisp at tiny sizes)
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(icoSizes.map((s) => squarePng(s, white)));
const ico = await pngToIco(icoPngs);
writeFileSync(path.join(ROOT, 'public', 'favicon.ico'), ico);

console.log('favicons generated: app/icon.png, app/apple-icon.png, public/favicon.ico');
