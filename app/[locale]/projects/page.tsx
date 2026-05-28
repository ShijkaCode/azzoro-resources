import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { ProjectsMapWithFilters } from '@/components/projects/ProjectsMapWithFilters';
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

  const projects = await loadCollection<Project>('projects', locale);

  const labels =
    locale === 'mn'
      ? {
          eyebrow: 'Төслүүд',
          title: 'Монгол даяарх хайгуулын багц',
          intro: 'Pin дээр дарж төслийн дэлгэрэнгүйг нээнэ үү. Дээрх шүүлтүүрээр түүхий эдээр шүүж болно.',
        }
      : {
          eyebrow: 'Projects',
          title: 'An exploration portfolio across Mongolia',
          intro: 'Click any pin to open the project panel, or filter the map by commodity. Each project links through to its full technical profile.',
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

      <section className="bg-paper px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <ProjectsMapWithFilters projects={projects} />
      </section>
    </main>
  );
}