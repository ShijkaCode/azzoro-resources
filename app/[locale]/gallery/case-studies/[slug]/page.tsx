import type { Metadata } from 'next';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import { loadCollection } from '@/lib/content/loadCollection';
import type { CaseStudy } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export async function generateStaticParams() {
  const params: Array<{ locale: 'en' | 'mn'; slug: string }> = [];

  for (const locale of locales) {
    const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
    cases.forEach((study) => {
      params.push({ locale, slug: study.slug });
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

  const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
  const study = cases.find((entry) => entry.slug === slug);

  if (!study) {
    return {};
  }

  return buildPageMetadata({
    title: study.title,
    description: study.summary,
    locale,
    path: `/gallery/case-studies/${slug}`,
    type: 'article',
  });
}

export default async function CaseStudyPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const cases = await loadCollection<CaseStudy>('gallery/case-studies', locale);
  const study = cases.find((entry) => entry.slug === slug);

  if (!study) {
    notFound();
  }

  const backLabel = locale === 'mn' ? 'Бүх түүх' : 'All stories';

  return (
    <main id="main-content">
      <section className="relative -mt-24 flex min-h-[64vh] w-full flex-col justify-end overflow-hidden bg-primary text-white">
        <Image src={study.hero_image} alt={study.title} fill priority className="object-cover" sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
        <div className="relative px-6 pb-14 pt-36 sm:px-10 lg:px-16">
          <p className="num-tabular text-[12px] font-medium uppercase tracking-[0.24em] text-white/70">
            {new Date(study.date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="mt-5 max-w-[22ch] font-display text-balance text-4xl font-medium leading-[1.0] tracking-[-0.015em] sm:text-6xl lg:text-7xl">
            {study.title}
          </h1>
        </div>
      </section>

      <article className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[68ch]">
          <p className="border-l-2 border-ink pl-6 font-display text-2xl font-medium leading-snug text-ink">{study.summary}</p>
          <div className="mt-12">
            <MarkdownBody>{study.markdown || study.body}</MarkdownBody>
          </div>
          {study.pull_quote ? (
            <blockquote className="my-14 border-t border-rule pt-10 font-display text-3xl italic leading-snug text-ink">
              “{study.pull_quote}”
            </blockquote>
          ) : null}
          <div className="mt-16 border-t border-rule pt-8">
            <Link
              href={localizeHref(locale, '/gallery')}
              className="inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.24em] text-ink/60 transition-colors hover:text-ink"
            >
              <span aria-hidden="true">←</span>
              {backLabel}
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}