'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
import { useState } from 'react';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

export default function IntroSection({
  content,
}: {
  locale: Locale;
  content: HomeContent['why_mongolia'];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = content.cards ?? [];
  const total = String(cards.length).padStart(2, '0');
  const hasImages = cards.some((card) => card.image);

  return (
    <section className="bg-primary text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className={`grid grid-cols-1 gap-x-16 gap-y-12 lg:items-start ${hasImages ? 'lg:grid-cols-2' : ''}`}>
          {hasImages ? (
          <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28 lg:aspect-auto lg:min-h-[640px]">
            {cards.map((card, idx) =>
              card.image ? (
                <Image
                  key={card.title}
                  src={card.image}
                  alt={card.image_alt || card.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-opacity duration-500 ease-out ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                  priority={idx === 0}
                />
              ) : null
            )}
            <div aria-hidden="true" className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-white/85 sm:bottom-6 sm:right-6">
              <span className="num-display text-[11px] leading-none text-[hsl(var(--copper))]">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span aria-hidden="true" className="text-white/40">/</span>
              <span className="num-display text-[11px] leading-none text-white/70">{total}</span>
            </div>
          </div>
          ) : null}

          <div>
            <p className="kicker kicker-invert">{content.eyebrow}</p>
            <h2 className="mt-6 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {content.headline}
            </h2>
            <p className="mt-7 max-w-[44ch] text-base leading-[1.65] text-white/75 sm:text-lg">{content.intro}</p>

            <div className="mt-12 border-b border-white/15 lg:mt-16">
              {cards.map((card, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={card.title}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`group relative block w-full border-t border-white/15 py-5 pl-4 text-left transition-colors sm:py-6 sm:pl-5 ${isActive ? '' : 'hover:bg-white/[0.025]'}`}
                    aria-expanded={isActive}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 h-full w-0.5 origin-top bg-[hsl(var(--copper))] transition-transform duration-300 ease-out ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`}
                    />
                    <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 sm:grid-cols-[4rem_1fr] sm:gap-x-6">
                      <span className={`num-display text-xl font-medium leading-none transition-colors sm:text-2xl ${isActive ? 'text-[hsl(var(--copper))]' : 'text-white/40 group-hover:text-[hsl(var(--copper))]'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className={`text-[12px] font-medium uppercase tracking-[0.24em] transition-colors ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}>
                          {card.title}
                        </p>
                        {isActive ? (
                          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/75 sm:text-[15px]">{card.body}</p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {content.footnote ? (
              <p className="mt-10 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-14">{content.footnote}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
