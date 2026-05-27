import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import { loadCollection } from '@/lib/content/loadCollection';
import type { CaseStudy } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';

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

  return (
    <main>
      <section className="relative h-[50vh] min-h-[24rem] overflow-hidden bg-navy-dark">
        <Image src={study.hero_image} alt={study.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/30 to-transparent" />
        <div className="container-wide absolute inset-x-0 bottom-0 pb-10 text-white">
          <div className="text-xs uppercase tracking-[0.18em] text-white/70">{new Date(study.date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU')}</div>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{study.title}</h1>
        </div>
      </section>

      <article className="container-wide max-w-3xl py-16">
        <p className="mb-8 text-xl text-muted-foreground">{study.summary}</p>
        <MarkdownBody>{study.markdown || study.body}</MarkdownBody>
        {study.pull_quote ? (
          <blockquote className="my-12 border-l-4 border-primary pl-6 text-2xl italic text-foreground/90">
            {study.pull_quote}
          </blockquote>
        ) : null}
      </article>
    </main>
  );
}