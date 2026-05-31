import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { loadGlobal } from '@/lib/content/loadGlobal';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { FooterSettings, NavSettings, SiteSettings } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Base Open Graph / Twitter card metadata for every page under a locale. Pages
// supply their own title/description (Next falls those through to og/twitter),
// and the opengraph-image route supplies the preview image. This is what
// renders the rich preview when a link is shared in Messenger, Viber, etc.
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const { locale } = params;
  const isMn = locale === 'mn';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';
  return {
    openGraph: {
      type: 'website',
      siteName: 'Azzoro Resources',
      locale: isMn ? 'mn_MN' : 'en_US',
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzororesources.com';

  const [messages, nav, footer, site] = await Promise.all([
    getMessages(),
    loadSingleton<NavSettings>('settings/nav', locale),
    loadSingleton<FooterSettings>('settings/footer', locale),
    loadGlobal<SiteSettings>('settings/site'),
  ]);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brand_name,
    url: siteUrl,
    logo: `${siteUrl}${site.logo || '/new_logo.png'}`,
    sameAs: Object.values(site.social ?? {}).filter(Boolean),
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Ulaanbaatar',
        addressCountry: 'MN',
        streetAddress: '305 MERU tower, Jamiyangun street, 1st khoroo, Sukhbaatar district',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Subiaco',
        addressRegion: 'WA',
        addressCountry: 'AU',
        streetAddress: 'Suite 8, 16 Nicholson road',
        postalCode: '6008',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
        streetAddress: 'The Broadgate Tower, 20 Primrose Street',
        postalCode: 'EC2A 2EW',
      },
    ],
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
      >
        Skip to main content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <div className="min-h-screen bg-background">
        <Navbar items={nav.items} locale={locale} investorLinks={nav.investor_links} />
        <div className="pt-24">{children}</div>
        <Footer settings={footer} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}