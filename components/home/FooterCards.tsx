import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function FooterCards({
  locale,
  leadership,
}: {
  locale: Locale;
  leadership: HomeContent['leadership_teaser'];
}) {
  const cards = [
    {
      title: leadership.heading,
      body: leadership.body,
      href: leadership.cta_href,
      cta: leadership.cta_label,
    },
    {
      title: 'Projects route shell',
      body: 'Projects now resolve as a dedicated locale-aware route backed by placeholder collection data.',
      href: '/projects',
      cta: 'View projects',
    },
    {
      title: 'Contact route shell',
      body: 'Contact is intentionally informational only, matching the scope decision in the design spec.',
      href: '/contact',
      cta: 'Open contact page',
    },
  ];

  return (
    <section className="container-wide py-12 sm:py-16">
      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="surface-card flex h-full flex-col p-6 sm:p-8">
            <p className="section-kicker">Next route</p>
            <h2 className="mt-4 text-2xl font-semibold">{card.title}</h2>
            <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{card.body}</p>
            <Link href={localizeHref(locale, card.href)} className="mt-6 text-sm font-semibold text-primary transition hover:text-primary/80">
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}