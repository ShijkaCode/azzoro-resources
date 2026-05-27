import type { MetadataRoute } from 'next';
import { loadCollection } from '@/lib/content/loadCollection';
import type { CaseStudy, Project } from '@/lib/content/types';
import { locales } from '@/lib/i18n/config';

const routes = ['', '/about', '/projects', '/esg', '/gallery', '/contact', '/legal/privacy', '/legal/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azzororesources.com';
  const now = new Date();
  const [projectRoutes, caseStudyRoutes] = await Promise.all([
    Promise.all(
      locales.map(async (locale) => {
        const projects = await loadCollection<Project>('projects', locale);
        return projects.map((project) => `/${locale}/projects/${project.slug}`);
      })
    ).then((entries) => entries.flat()),
    Promise.all(
      locales.map(async (locale) => {
        const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
        return cases.map((study) => `/${locale}/gallery/case-studies/${study.slug}`);
      })
    ).then((entries) => entries.flat()),
  ]);

  const staticRoutes = locales.flatMap((locale) =>
    routes.map((route) => ({
      locale,
      route,
    }))
  );

  const dynamicRoutes = [...projectRoutes, ...caseStudyRoutes].map((urlPath) => {
    const [, locale, ...rest] = urlPath.split('/');
    return {
      locale,
      route: `/${rest.join('/')}`,
    };
  });

  return [...staticRoutes, ...dynamicRoutes].map(({ locale, route }) => ({
      url: `${siteUrl}/${locale}${route === '' ? '' : route}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alternateLocale) => [alternateLocale, `${siteUrl}/${alternateLocale}${route}`])
        ),
      },
    }));
}