import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import { ProjectContent } from '@/components/projects/ProjectBlocks';
import type { Project } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const COPY = {
  en: {
    eyebrow: 'Portfolio',
    title: 'Other projects',
    intro:
      "Earlier-stage and smaller-footprint exploration interests across the Azzuro Resources portfolio. Each project is summarised below; follow 'View full detail' for the project's complete technical profile.",
    viewDetail: 'View full detail',
    backToList: 'Back to all projects',
    draft: 'Draft — figures pending Competent Person sign-off prior to publication.',
  },
  mn: {
    eyebrow: 'Багц',
    title: 'Бусад төслүүд',
    intro:
      'Аззуро Ресоурсесийн багц дахь эрт үе шатанд буй болон бага хэмжээний хайгуулын төслүүд. Доор төсөл тус бүрийг товчоор танилцуулав; бүрэн техникийн профайлыг харахын тулд "Дэлгэрэнгүй үзэх" товчийг сонгоно уу.',
    viewDetail: 'Дэлгэрэнгүй үзэх',
    backToList: 'Бүх төслүүд рүү буцах',
    draft: 'Ноорог — тоо баримтыг Эрх бүхий мэргэжилтнээр баталгаажуулах шаардлагатай.',
  },
} as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  if (!isLocale(locale)) return {};
  const copy = COPY[locale];
  return buildPageMetadata({
    title: copy.title,
    description: copy.intro,
    locale,
    path: '/projects/other',
  });
}

export default async function OtherProjectsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const projects = await loadCollection<Project>('projects', locale);
  const others = projects
    .filter((project) => project.group_as_other)
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  if (others.length === 0) {
    notFound();
  }

  const copy = COPY[locale];

  return (
    <main id="main-content">
      <section className="-mt-24 bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">{copy.eyebrow}</p>
          <h1 className="mt-6 max-w-[22ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {copy.title}
          </h1>
          <p className="mt-7 max-w-[60ch] text-base leading-relaxed text-white/75 sm:text-lg">{copy.intro}</p>
        </div>
      </section>

      <section className="bg-paper">
        {others.map((project, idx) => (
          <article
            key={project.slug}
            className={`px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28 ${idx > 0 ? 'border-t border-rule' : ''}`}
          >
            <div className="mx-auto max-w-5xl">
              <span aria-hidden="true" className="block h-0.5 w-12 bg-[hsl(var(--copper))]" />
              <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                <span className="num-display text-[hsl(var(--copper))]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true" className="mx-3 text-muted-ink/50">/</span>
                <span>{project.commodity.join(' · ')}</span>
                <span aria-hidden="true" className="mx-3 text-muted-ink/50">/</span>
                <span>{project.region}</span>
                <span aria-hidden="true" className="mx-3 text-muted-ink/50">/</span>
                <span>{project.status}</span>
              </p>

              <h2 className="mt-6 max-w-[22ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]">
                {project.title}
              </h2>

              {project.hero_image ? (
                <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-paper">
                  <Image
                    src={project.hero_image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 64rem, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <p className="mt-12 max-w-[60ch] font-display text-2xl font-medium leading-snug text-ink sm:text-[1.75rem]">
                {project.summary}
              </p>

              <div className="mt-10 max-w-[68ch] space-y-10">
                <ProjectContent project={project} />
              </div>

              {project.is_draft ? (
                <p className="mt-10 max-w-[60ch] border-l-2 border-[hsl(var(--copper))] pl-4 text-[12px] font-medium uppercase tracking-[0.24em] text-muted-ink">
                  {copy.draft}
                </p>
              ) : null}

              <Link
                href={localizeHref(locale, `/projects/${project.slug}`)}
                className="cta-link mt-10"
              >
                {copy.viewDetail}
                <span aria-hidden="true" className="cta-arrow">→</span>
              </Link>
            </div>
          </article>
        ))}

        <div className="border-t border-rule px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <Link href={localizeHref(locale, '/projects')} className="cta-link">
              <span aria-hidden="true" className="cta-arrow mr-2">←</span>
              {copy.backToList}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
