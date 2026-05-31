import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function ESGSection({
  locale,
  teaser,
  sustainability,
}: {
  locale: Locale;
  teaser: HomeContent['sustainability_teaser'];
  sustainability?: HomeContent['home_sustainability'];
}) {
  const eyebrow = sustainability?.eyebrow ?? '';
  const pillars = sustainability?.cards ?? [];

  return (
    <section className="bg-paper text-ink">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="kicker">{eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {teaser.heading}
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">{teaser.body}</p>
            <Link
              href={localizeHref(locale, teaser.cta_href)}
              className="cta-link mt-8"
            >
              {teaser.cta_label}
              <span aria-hidden="true" className="cta-arrow">→</span>
            </Link>
          </div>
        </div>

        {pillars.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 border-t border-rule sm:grid-cols-3 lg:mt-20">
            {pillars.map((pillar, idx) => {
              const isLast = idx === pillars.length - 1;
              const borderClass = isLast ? '' : 'border-b border-rule sm:border-b-0 sm:border-r';
              return (
                <article key={pillar.tag} className={`group flex flex-col ${borderClass}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {pillar.image ? (
                      <Image
                        src={pillar.image}
                        alt={pillar.image_alt || pillar.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col px-0 py-7 sm:px-6 sm:py-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-ink">{pillar.tag}</p>
                    <h3 className="mt-4 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">{pillar.title}</h3>
                    <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-ink/70 sm:text-[15px]">{pillar.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
