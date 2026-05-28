import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type WhatWeDoProps = {
  locale: Locale;
  intro: string;
  cards: HomeContent['why_azzoro_cards'];
};

const fallbackCards = [
  {
    title: 'Next.js foundation',
    body: 'The repo now runs on the App Router instead of the single-page Vite proof of concept.',
  },
  {
    title: 'Typed content layer',
    body: 'Pages and collections are loaded through reusable helpers instead of hard-coded JSX content.',
  },
  {
    title: 'CMS staging surface',
    body: 'Admin scaffolding and placeholder content are added so the next plan can focus on real content and interactions.',
  },
];

export default function WhatWeDo({ intro, cards }: WhatWeDoProps) {
  const items = cards.length > 0 ? cards : fallbackCards;

  return (
    <section className="bg-white/70 py-12 sm:py-16">
      <div className="container-wide grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="section-kicker">Why Azzoro</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">The corporate story is ready to be filled with actual launch content.</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">{intro}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((card) => (
            <article key={card.title} className="surface-card p-6">
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}