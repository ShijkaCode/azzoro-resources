import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import { ProjectDetailHero } from '@/components/projects/ProjectDetailHero';
import { TenureBar, DrillResultsTable, ResourceTable, CautionaryCallout, ProjectFigures, ProjectContent } from '@/components/projects/ProjectBlocks';
import { EsgGallery } from '@/components/esg/EsgGallery';
import type { Project } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateStaticParams() {
  const params: Array<{ locale: 'en' | 'mn'; slug: string }> = [];

  for (const locale of locales) {
    const projects = await loadCollection<Project>('projects', locale);
    projects.forEach((project) => {
      params.push({ locale, slug: project.slug });
    });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const projects = await loadCollection<Project>('projects', locale);
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    return {};
  }

  return buildPageMetadata({
    title: `${project.title} | ${project.commodity.join(', ')}`,
    description: project.summary,
    locale,
    path: `/projects/${slug}`,
    imagePath: `/${locale}/projects/${slug}/opengraph-image`,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    notFound();
  }

  const nearby = projects.filter((entry) => entry.slug !== slug && entry.region === project.region).slice(0, 3);

  const figures = project.gallery_images ?? [];
  // Drill table can be placed inline via a `drill` content block; if so, skip the standalone section.
  const hasInlineDrill = (project.content_blocks ?? []).some((block) => block.type === 'drill');
  const leadFigure = figures[0];
  const restFigures = figures.slice(1);

  const t =
    locale === 'mn'
      ? { draft: 'Ноорог — тоо баримтыг Эрх бүхий мэргэжилтнээр баталгаажуулах шаардлагатай.', nearby: 'Ойролцоох төслүүд', fromTheField: 'Хээрээс' }
      : { draft: 'Draft — figures pending Competent Person sign-off prior to publication.', nearby: 'Nearby projects', fromTheField: 'From the field' };

  return (
    <main id="main-content">
      <ProjectDetailHero project={project} locale={locale} />

      {project.is_draft ? (
        <div className="border-b border-rule bg-paper px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-ink sm:px-10 lg:px-16">
          {t.draft}
        </div>
      ) : null}

      <section className="bg-paper">
        <TenureBar project={project} locale={locale} />
      </section>

      <section className="bg-paper px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        {/* Width tiers: prose is centred at a reading measure (set per text block);
            images and two-column "split" rows break out to the full container. */}
        <div className="mx-auto max-w-6xl space-y-16">
          {leadFigure ? <ProjectFigures figures={[leadFigure]} title={project.title} /> : null}

          <ProjectContent project={project} locale={locale} />

          <ProjectFigures figures={restFigures} title={project.title} />

          {hasInlineDrill ? null : <DrillResultsTable project={project} locale={locale} />}

          {project.historical_estimate ? (
            <CautionaryCallout
              label={project.historical_estimate.label}
              statement={project.historical_estimate.statement}
              cautionary={project.historical_estimate.cautionary}
              locale={locale}
            />
          ) : null}

          <ResourceTable project={project} locale={locale} />

          {project.exploration_target ? (
            <CautionaryCallout
              label={project.exploration_target.label}
              statement={project.exploration_target.statement}
              cautionary={project.exploration_target.cautionary}
              locale={locale}
            />
          ) : null}

          {project.documents && project.documents.length > 0 ? (
            <ul className="border-t border-rule">
              {project.documents.map((doc) => (
                <li key={doc.file}>
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-rule py-5 text-[15px] text-ink transition-colors hover:bg-ink/[0.025]"
                  >
                    <span className="font-medium">{doc.label}</span>
                    <span aria-hidden="true" className="text-ink/40 transition-all group-hover:translate-x-1 group-hover:text-[hsl(var(--copper))]">
                      ↓
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {project.show_gallery ? (
        <EsgGallery items={project.gallery ?? []} heading={project.gallery_heading || t.fromTheField} accent="copper" />
      ) : null}

      {nearby.length > 0 ? (
        <section className="bg-primary text-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">{t.nearby}</h2>
          <div className="mt-10 grid grid-cols-1 border-l border-t border-white/15 sm:grid-cols-3">
            {nearby.map((entry) => (
              <Link
                key={entry.slug}
                href={localizeHref(locale, `/projects/${entry.slug}`)}
                className="group relative border-b border-r border-white/15 px-6 py-8 transition-colors hover:bg-white/[0.04]"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{entry.commodity.join(' · ')}</p>
                <p className="mt-4 font-display text-2xl font-medium leading-tight text-white">{entry.title}</p>
                <p className="mt-2 text-[13px] text-white/60">{entry.region}</p>
                <span aria-hidden="true" className="mt-6 inline-block text-white/40 transition-all group-hover:translate-x-1 group-hover:text-[hsl(var(--copper))]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}