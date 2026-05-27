import Link from 'next/link';
import { CloudflareStreamHero } from '@/components/home/CloudflareStreamHero';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

type HeroProps = {
  locale: Locale;
  hero: HomeContent['hero'];
  metrics: HomeContent['metrics'];
};

export default function HeroSection({ locale, hero, metrics }: HeroProps) {
  return (
    <section className="container-wide pb-8 pt-8 sm:pt-10">
      <div className="hero-shell px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <CloudflareStreamHero
          streamUid={hero.video_id}
          poster="/uploads/hero-poster.jpg"
          className="absolute inset-0"
          priority
        />
        <div className="absolute inset-0 bg-navy-dark/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.22),_transparent_32%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-kicker text-sky-line">Foundation release</p>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[0.95] sm:text-6xl lg:text-[4.5rem]">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{hero.subline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={localizeHref(locale, hero.cta_href)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                {hero.cta_label}
              </Link>
              <Link
                href={localizeHref(locale, '/about')}
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Learn about the rebuild
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {metrics.map((metric) => (
              <article key={metric.label} className="dark-card p-5">
                <p className="text-3xl font-semibold sm:text-4xl">{metric.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">{metric.label}</p>
                {metric.source ? <p className="mt-3 text-sm text-white/72">{metric.source}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}