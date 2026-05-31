import { MediaImage as Image } from '@/components/shared/MediaImage';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

export default function WhatWeDo({
  content,
}: {
  locale: Locale;
  content: HomeContent['why_azzoro'];
}) {
  const cards = content.cards ?? [];

  return (
    <section className="bg-primary text-white">
      <div className="relative aspect-[21/9] w-full overflow-hidden lg:aspect-[3/1]">
        {content.image ? (
          <Image src={content.image} alt={content.image_alt || content.headline} fill className="object-cover" sizes="100vw" />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex items-end px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12">
          <div>
            <p className="kicker kicker-invert">{content.eyebrow}</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-balance text-3xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-4xl lg:text-5xl">
              {content.headline}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <p className="max-w-[60ch] text-lg leading-[1.6] text-white/80 sm:text-xl">{content.intro}</p>

        <div className="mt-14 grid grid-cols-1 border-t border-white/15 md:grid-cols-3 lg:mt-16">
          {cards.map((card, idx) => {
            const isLast = idx === cards.length - 1;
            const borderClass = isLast ? '' : 'border-b border-white/15 md:border-b-0 md:border-r';
            return (
              <div key={card.title} className={`group relative flex flex-col py-10 transition-colors duration-300 hover:bg-white/[0.02] md:px-8 md:py-12 lg:px-10 ${borderClass}`}>
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-0 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <span className="num-display text-3xl font-medium leading-none text-white/40 transition-colors duration-300 group-hover:text-[hsl(var(--copper))] sm:text-4xl">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-[13px] font-medium uppercase tracking-[0.32em] text-white">{card.title}</h3>
                <p className="mt-4 max-w-[40ch] flex-1 text-[15px] leading-relaxed text-white/70">{card.body}</p>
                {card.tag ? (
                  <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{card.tag}</p>
                ) : null}
              </div>
            );
          })}
        </div>

        {content.footnote ? (
          <p className="mt-14 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-16">{content.footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
