import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';

const SITE_NAME = 'Azzoro Resources';
const DEFAULT_SITE_URL = 'https://staging.azzororesources.com';

type PageMetadataArgs = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  imagePath?: string;
  type?: 'website' | 'article';
};

function normalizeSiteUrl(input: string) {
  return input.endsWith('/') ? input.slice(0, -1) : input;
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path,
  imagePath,
  type = 'website',
}: PageMetadataArgs): Metadata {
  const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
  const normalizedPath = path === '/' ? '' : path;
  const url = `${siteUrl}/${locale}${normalizedPath}`;
  const ogImage = imagePath ? `${siteUrl}${imagePath}` : `${siteUrl}/${locale}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${normalizedPath}`,
        mn: `${siteUrl}/mn${normalizedPath}`,
        'x-default': `${siteUrl}/en${normalizedPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'mn' ? 'mn_MN' : 'en_US',
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}