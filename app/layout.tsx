import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com'),
  title: {
    default: 'Azzuro Resources',
    template: '%s | Azzuro Resources',
  },
  description: 'Bilingual corporate website foundation for Azzuro Resources.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}