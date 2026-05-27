import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function ESGSection({
  locale,
  teaser,
}: {
  locale: Locale;
  teaser: HomeContent['sustainability_teaser'];
}) {
  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="surface-card p-8 sm:p-10">
          <p className="section-kicker">Sustainability</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">{teaser.heading}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{teaser.body}</p>
          <Link
            href={localizeHref(locale, teaser.cta_href)}
            className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {teaser.cta_label}
          </Link>
        </article>
        <article className="hero-shell flex min-h-[20rem] flex-col justify-end p-8 sm:p-10">
          <p className="section-kicker text-sky-line">Next slice</p>
          <h3 className="mt-4 text-3xl font-semibold">Map, gallery, and API integrations are isolated from this foundation release.</h3>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/72">
            That keeps the migration reversible while the core routing, locale model, and content shape settle.
          </p>
        </article>
      </div>
    </section>
  );
}