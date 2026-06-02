import { ImageResponse } from 'next/og';
import { ShareCard, ogSize, loadOgFonts, loadLogomark } from '@/lib/og/share-card';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Azzuro Resources project';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staging.azzuroresources.com';

export default async function Image({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadLogomark()]);

  let project: Project | undefined;
  if (isLocale(locale)) {
    const projects = await loadCollection<Project>('projects', locale);
    project = projects.find((entry) => entry.slug === slug);
  }

  const bgPath = project?.hero_image ?? '/uploads/hero-poster.jpg';

  return new ImageResponse(
    (
      <ShareCard
        bg={`${SITE_URL}${bgPath}`}
        logo={logo}
        chips={project?.commodity.slice(0, 3) ?? []}
        eyebrow={project ? [project.status, project.region].filter(Boolean).join(' · ') : undefined}
        title={project?.title ?? 'Azzuro Resources'}
        caption={project?.summary}
      />
    ),
    { ...size, fonts }
  );
}
