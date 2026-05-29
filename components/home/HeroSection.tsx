import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

type HeroProps = {
  locale: Locale;
  hero: HomeContent['hero'];
  metrics: HomeContent['metrics'];
};

type Pathway = {
  number: string;
  eyebrow: string;
  title: string;
  href: string;
  external: boolean;
};

const COPY: Record<Locale, { kicker: string; pathways: Pathway[] }> = {
  en: {
    kicker: 'Mongolia — Central Asian Orogenic Belt',
    pathways: [
      { number: '01', eyebrow: 'Flagship', title: 'Oval Cu·Ni·PGE Discovery', href: '/projects/yambat', external: false },
      { number: '02', eyebrow: 'Stewardship', title: 'Community & environment', href: '/esg', external: false },
      { number: '03', eyebrow: 'Investors', title: 'ASX reports & live stock', href: 'https://investors.asianbatterymetals.com', external: true },
    ],
  },
  mn: {
    // TODO — client to verify Mongolian copy
    kicker: 'Монгол — Төв Азийн Орогенийн Бүс',
    pathways: [
      { number: '01', eyebrow: 'Гол төсөл', title: 'Oval Cu·Ni·PGE нээлт', href: '/projects/yambat', external: false },
      { number: '02', eyebrow: 'Тогтвортой байдал', title: 'Иргэд ба байгаль орчин', href: '/esg', external: false },
      { number: '03', eyebrow: 'Хөрөнгө оруулагч', title: 'ASX тайлан ба хувьцаа', href: 'https://investors.asianbatterymetals.com', external: true },
    ],
  },
};

export default function HeroSection({ locale, hero }: HeroProps) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="relative -mt-24 flex min-h-[88vh] w-full flex-col overflow-hidden bg-[hsl(var(--ink))] text-white md:min-h-[85vh]">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/uploads/hero-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/uploads/drone/hero_drone.MP4" type="video/mp4" />
        <source src="/videos/hero-720.mp4" type="video/mp4" />
      </video>

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      <div className="relative flex flex-1 flex-col justify-end px-6 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-36 lg:px-16 lg:pb-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">{copy.kicker}</p>
        <h1 className="mt-5 max-w-[22ch] font-display text-balance text-[2.5rem] font-medium leading-[0.98] tracking-[-0.015em] sm:mt-7 sm:text-[3.5rem] sm:leading-[0.96] lg:text-[5rem] xl:text-[6rem] xl:leading-[0.95]">
          {hero.headline}
        </h1>
        {hero.subline ? (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg">{hero.subline}</p>
        ) : null}
      </div>

      <div className="relative grid grid-cols-1 border-t border-white/15 md:grid-cols-3">
        {copy.pathways.map((pathway, index) => {
          const isLast = index === copy.pathways.length - 1;
          const borderClass = isLast ? '' : 'border-b border-white/15 md:border-b-0 md:border-r';
          const className = `group relative flex items-start gap-4 px-6 py-7 transition hover:bg-white/[0.05] sm:px-10 sm:py-9 lg:px-16 ${borderClass}`;

          const inner = (
            <>
              <div className="flex flex-1 flex-col gap-2 pr-10 sm:gap-3">
                <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
                  {pathway.number} — {pathway.eyebrow}
                </span>
                <span className="font-display text-xl font-medium leading-tight sm:text-2xl lg:text-3xl">{pathway.title}</span>
              </div>
              <span
                aria-hidden="true"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 transition group-hover:translate-x-1 sm:right-10 lg:right-12"
              >
                {pathway.external ? '↗' : '→'}
              </span>
            </>
          );

          if (pathway.external) {
            return (
              <a key={pathway.number} href={pathway.href} target="_blank" rel="noreferrer" className={className}>
                {inner}
              </a>
            );
          }

          return (
            <Link key={pathway.number} href={localizeHref(locale, pathway.href)} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
