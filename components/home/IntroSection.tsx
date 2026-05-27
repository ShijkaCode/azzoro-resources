import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type IntroProps = {
  locale: Locale;
  intro: string;
  cards: HomeContent['why_mongolia_cards'];
};

const fallbackCards = [
  {
    title: 'Strategic geology',
    body: 'The foundation shell keeps room for the resource story, regional map narrative, and investor portal cross-links.',
  },
  {
    title: 'Bilingual structure',
    body: 'Locale-prefixed routing is already in place so EN and MN content can be seeded without reworking the URL model.',
  },
  {
    title: 'CMS-ready sections',
    body: 'This page is rendered from markdown frontmatter, which gives the client-editable shape the spec requires.',
  },
];

export default function IntroSection({ intro, cards }: IntroProps) {
  const items = cards.length > 0 ? cards : fallbackCards;

  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="section-kicker">Why Mongolia</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold sm:text-4xl">A content-driven section now exists for strategic positioning.</h2>
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