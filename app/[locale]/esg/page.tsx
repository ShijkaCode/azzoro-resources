import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export default async function EsgPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  return (
    <main className="container-wide py-16 sm:py-20">
      <section className="surface-card overflow-hidden p-8 sm:p-10 lg:p-12">
        <p className="section-kicker">ESG</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">Sustainability foundation page</h1>
        <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-muted-foreground">{esg.approach_body}</p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="surface-card p-6 sm:p-8">
          <p className="section-kicker">Environment</p>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">{esg.environment.body}</p>
        </article>
        <article className="surface-card p-6 sm:p-8">
          <p className="section-kicker">Community</p>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">{esg.community.body}</p>
        </article>
      </section>
    </main>
  );
}