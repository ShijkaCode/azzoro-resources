import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default async function ProjectsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);

  return (
    <main className="container-wide py-16 sm:py-20">
      <section className="hero-shell p-8 sm:p-10 lg:p-12">
        <p className="section-kicker text-sky-line">Projects</p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold sm:text-5xl">Projects route shell with CMS-backed placeholder data</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
          Interactive mapping and side-panel behaviour are deferred to the next plan. This page now reads typed project entries from the content directory.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.slug} className="surface-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-primary">
              <span>{project.region}</span>
              <span className="h-1 w-1 rounded-full bg-primary/50" />
              <span>{project.status}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{project.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.commodity.map((item) => (
                <span key={item} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-5 text-sm text-muted-foreground">
              <span>
                {project.lat.toFixed(2)}, {project.lng.toFixed(2)}
              </span>
              <Link href={localizeHref(locale, '/contact')} className="font-semibold text-primary transition hover:text-primary/80">
                Enquire about this asset
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}