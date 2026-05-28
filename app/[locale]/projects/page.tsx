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

  return (
    <main id="main-content" className="container-wide py-16 sm:py-20">
      <section className="hero-shell p-8 sm:p-10 lg:p-12">
        <p className="section-kicker text-sky-line">Projects</p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl">Interactive project map with commodity filters</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
          Click any pin to open the project side panel. The map uses MapTiler when a key is present and falls back to OpenStreetMap in development.
        </p>
      </section>

      <section className="mt-12">
        <ProjectsMapWithFilters projects={projects} />
      </section>
    </main>
  );
}