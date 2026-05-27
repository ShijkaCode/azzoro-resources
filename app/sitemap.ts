import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';

const routes = ['', '/about', '/projects', '/esg', '/gallery', '/contact', '/legal/privacy', '/legal/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azzororesources.com';
  const now = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteUrl}/${locale}${route}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [alternateLocale, `${siteUrl}/${alternateLocale}${route}`])
        ),
      },
    }))
  );
}