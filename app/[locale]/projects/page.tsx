import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { Project, ProjectsPageContent } from '@/lib/content/types';
import { ProjectsMapPreview } from '@/components/home/ProjectsMapPreview';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
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
        ? 'Azzuro Resources-ийн төслүүдийг интерактив газрын зураг, түүхий эдийн шүүлтүүрээр үзнэ үү.'
        : 'Explore Azzuro Resources projects through an interactive map with commodity filters.',
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

  const [page, projects] = await Promise.all([
    loadSingleton<ProjectsPageContent>('pages/projects', locale),
    loadCollection<Project>('projects', locale),
  ]);

  projects.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  const mainProjects = projects.filter((project) => !project.group_as_other);
  const otherProjects = projects.filter((project) => project.group_as_other);

  const otherListItem =
    otherProjects.length > 0
      ? {
          title: locale === 'mn' ? 'Бусад төслүүд' : 'Other projects',
          meta: otherProjects.map((project) => project.title).join(' · '),
          href: localizeHref(locale, '/projects/other'),
        }
      : undefined;

  const labels = page;

  return (
    <main id="main-content" className="-mt-24">
      <section className="bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">{labels.eyebrow}</p>
          <h1 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {labels.title}
          </h1>
          <p className="mt-7 max-w-[56ch] text-base leading-relaxed text-white/75 sm:text-lg">{labels.intro}</p>
        </div>
      </section>

      <ProjectsMapPreview
        projects={projects}
        mainProjects={mainProjects}
        extraListItem={otherListItem}
        showHeading={false}
        showViewAll={false}
      />
    </main>
  );
}