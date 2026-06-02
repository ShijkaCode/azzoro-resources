/* Shared Open Graph "share card" used by the opengraph-image routes. Renders a
 * 1200x630 image with a darkened brand photo, the Azzuro logomark + wordmark,
 * a headline and caption — the preview shown when a link is pasted into
 * Messenger, Viber, WhatsApp, Slack, etc.
 *
 * Fonts (Inter, Latin + Cyrillic so Mongolian titles render) and the logomark
 * are bundled via `new URL(..., import.meta.url)` so they are traced into the
 * serverless function. Background photos are fetched by absolute URL at render.
 */

import { readFile } from 'fs/promises';
import { join } from 'path';

export const ogSize = { width: 1200, height: 630 };

const OG_DIR = join(process.cwd(), 'lib', 'og');

const ACCENT = '#ff6600'; // brand copper — keep in sync with --copper in globals.css
const INK = '#0d1f2d'; // brand navy — keep in sync with --navy in globals.css

type FontEntry = { name: string; data: Buffer; weight: 400 | 600; style: 'normal' };
let fontCache: FontEntry[] | null = null;

export async function loadOgFonts(): Promise<FontEntry[]> {
  if (fontCache) return fontCache;
  const load = async (file: string, weight: 400 | 600): Promise<FontEntry> => {
    const data = await readFile(join(OG_DIR, 'fonts', file));
    return { name: 'Inter', data, weight, style: 'normal' };
  };
  fontCache = await Promise.all([
    load('inter-latin-400.ttf', 400),
    load('inter-cyrillic-400.ttf', 400),
    load('inter-latin-600.ttf', 600),
    load('inter-cyrillic-600.ttf', 600),
  ]);
  return fontCache;
}

let logoCache: string | null = null;
export async function loadLogomark(): Promise<string> {
  if (logoCache) return logoCache;
  const buf = await readFile(join(OG_DIR, 'logomark.png'));
  logoCache = `data:image/png;base64,${buf.toString('base64')}`;
  return logoCache;
}

export function ShareCard({
  bg,
  logo,
  eyebrow,
  title,
  caption,
  chips = [],
}: {
  bg?: string | null;
  logo: string;
  eyebrow?: string;
  title: string;
  caption?: string;
  chips?: string[];
}) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', backgroundColor: INK, fontFamily: 'Inter' }}>
      {bg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bg} width={1200} height={630} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          background: `linear-gradient(105deg, ${INK} 0%, rgba(6,17,31,0.86) 42%, rgba(6,17,31,0.40) 100%)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: 72,
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={62} height={62} alt="" />
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '0.26em' }}>AZZURO RESOURCES</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {chips.length > 0 ? (
            <div style={{ display: 'flex', gap: 12, marginBottom: 26 }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: 'flex',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontSize: 22,
                    letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          ) : null}

          {eyebrow ? (
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
              {eyebrow}
            </div>
          ) : null}

          <div style={{ fontSize: 74, fontWeight: 600, lineHeight: 1.04, maxWidth: 960 }}>{title}</div>

          {caption ? (
            <div
              style={{
                fontSize: 30,
                fontWeight: 400,
                marginTop: 22,
                maxWidth: 920,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.82)',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
              }}
            >
              {caption}
            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 38 }}>
            <div style={{ width: 52, height: 4, backgroundColor: ACCENT }} />
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.78)' }}>azzuroresources.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
