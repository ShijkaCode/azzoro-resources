import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Roboto, Inter, Montserrat, Lora, Playfair_Display, Oswald, Raleway, PT_Serif, Poppins, Space_Grotesk, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { loadGlobal } from '@/lib/content/loadGlobal';
import type { SiteSettings } from '@/lib/content/types';

// CMS-selectable fonts. Each gets its own CSS variable; the chosen body/display
// fonts are aliased to --font-sans / --font-display below. Add a font here AND to
// the `font_body`/`font_display` select options in public/admin/config.yml.
//
// IMPORTANT: fonts WITH Cyrillic use subsets ['latin','cyrillic'] (the site is
// bilingual en/mn). Latin-only fonts must NOT request 'cyrillic' (it fails the
// build); Mongolian text then falls back to a system font for those.
const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '700'], style: ['normal', 'italic'], variable: '--f-roboto', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'cyrillic'], style: ['normal', 'italic'], variable: '--f-inter', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--f-montserrat', display: 'swap' });
const lora = Lora({ subsets: ['latin', 'cyrillic'], style: ['normal', 'italic'], variable: '--f-lora', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], style: ['normal', 'italic'], variable: '--f-playfair', display: 'swap' });
// More Cyrillic-capable fonts
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600'], variable: '--f-oswald', display: 'swap' });
const raleway = Raleway({ subsets: ['latin', 'cyrillic'], style: ['normal', 'italic'], variable: '--f-raleway', display: 'swap' });
const ptSerif = PT_Serif({ subsets: ['latin', 'cyrillic'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--f-pt-serif', display: 'swap' });
// Latin-only fonts (no Cyrillic — Mongolian falls back to a system font)
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--f-poppins', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--f-space-grotesk', display: 'swap' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--f-dm-serif', display: 'swap' });

const FONTS = {
  Roboto: roboto,
  Inter: inter,
  Montserrat: montserrat,
  Lora: lora,
  'Playfair Display': playfair,
  Oswald: oswald,
  Raleway: raleway,
  'PT Serif': ptSerif,
  Poppins: poppins,
  'Space Grotesk': spaceGrotesk,
  'DM Serif Display': dmSerif,
} as const;

const DEFAULT_BODY = 'Roboto';
const DEFAULT_DISPLAY = 'Montserrat';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzuroresources.com'),
  title: {
    default: 'Azzuro Resources',
    template: '%s | Azzuro Resources',
  },
  description: 'Bilingual corporate website foundation for Azzuro Resources.',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let site: SiteSettings | null = null;
  try {
    site = await loadGlobal<SiteSettings>('settings/site');
  } catch {
    site = null;
  }

  const bodyFont = FONTS[(site?.font_body as keyof typeof FONTS)] ?? FONTS[DEFAULT_BODY];
  const displayFont = FONTS[(site?.font_display as keyof typeof FONTS)] ?? FONTS[DEFAULT_DISPLAY];

  // Load the chosen fonts (their .variable classes emit the @font-face) and alias
  // them to the variables the rest of the app reads.
  const fontVars = { '--font-sans': bodyFont.style.fontFamily, '--font-display': displayFont.style.fontFamily } as CSSProperties;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable}`}
      style={fontVars}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
