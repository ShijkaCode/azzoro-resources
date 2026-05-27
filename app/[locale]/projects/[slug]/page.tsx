import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import { ProjectDetailHero } from '@/components/projects/ProjectDetailHero';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
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

  return (
    <main id="main-content">
      <ProjectDetailHero project={project} />

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <MarkdownBody>{project.markdown || project.body}</MarkdownBody>
        </div>
        <div className="space-y-4">
          {project.data_cards?.map((card) => (
            <div key={card.label} className="surface-card p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{card.label}</div>
              <div className="mt-1 text-lg font-semibold">{card.value}</div>
            </div>
          ))}
          {project.license_area_km2 ? (
            <div className="surface-card p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">License area</div>
              <div className="mt-1 text-lg font-semibold">{project.license_area_km2} km²</div>
            </div>
          ) : null}
          {project.acquired_date ? (
            <div className="surface-card p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Acquired</div>
              <div className="mt-1 text-lg font-semibold">{new Date(project.acquired_date).getFullYear()}</div>
            </div>
          ) : null}
          <div className="surface-card p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Coordinates</div>
            <div className="mt-1 text-lg font-semibold">
              {project.lat.toFixed(2)}, {project.lng.toFixed(2)}
            </div>
          </div>
        </div>
      </section>

      {nearby.length > 0 ? (
        <section className="bg-muted/60 py-16">
          <div className="container-wide">
            <h2 className="text-2xl font-semibold">Nearby projects</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {nearby.map((entry) => (
                <Link
                  key={entry.slug}
                  href={localizeHref(locale, `/projects/${entry.slug}`)}
                  className="surface-card p-6 transition hover:-translate-y-0.5"
                >
                  <div className="text-lg font-semibold">{entry.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{entry.region}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}