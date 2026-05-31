import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { ProjectsMapPreview } from '@/components/home/ProjectsMapPreview';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildPageMetadata({
    title: locale === 'mn' ? 'Төслүүд' : 'Projects',
    description:
      locale === 'mn'
        ? 'Azzoro Resources-ийн төслүүдийг интерактив газрын зураг, түүхий эдийн шүүлтүүрээр үзнэ үү.'
        : 'Explore Azzoro Resources projects through an interactive map with commodity filters.',
    locale,
    path: '/projects',
  });
}

export default async function ProjectsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const projects = (await loadCollection<Project>('projects', locale)).sort(
    (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
  );

  const labels =
    locale === 'mn'
      ? {
          eyebrow: 'Төслүүд',
          title: 'Монгол даяарх хайгуулын багц',
          intro: 'Төслийг сонгон газрын зураг дээр байршлыг нь харж, дэлгэрэнгүй техникийн мэдээллийг нь нээнэ үү.',
        }
      : {
          eyebrow: 'Projects',
          title: 'An exploration portfolio across Mongolia',
          intro: 'Select a project to locate it on the map, then open its full technical profile.',
        };

  return (
    <main id="main-content" className="-mt-24">
      <section className="bg-ink text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{labels.eyebrow}</p>
          <h1 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {labels.title}
          </h1>
          <p className="mt-7 max-w-[56ch] text-base leading-relaxed text-white/75 sm:text-lg">{labels.intro}</p>
        </div>
      </section>

      <ProjectsMapPreview projects={projects} showHeading={false} showViewAll={false} />
    </main>
  );
}