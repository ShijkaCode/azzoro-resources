'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
import { useRef } from 'react';

type GalleryItem = { image: string; caption?: string };

// Accent is the ESG green by default; project pages pass "copper" to match their theme.
const ACCENT = {
  eco: {
    text: 'text-[hsl(var(--eco))]',
    btn: 'border-[hsl(var(--eco))] text-[hsl(var(--eco))] hover:bg-[hsl(var(--eco))]',
  },
  copper: {
    text: 'text-[hsl(var(--copper))]',
    btn: 'border-[hsl(var(--copper))] text-[hsl(var(--copper))] hover:bg-[hsl(var(--copper))]',
  },
} as const;

export function EsgGallery({
  items,
  heading,
  accent = 'eco',
}: {
  items: GalleryItem[];
  heading: string;
  accent?: keyof typeof ACCENT;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const a = ACCENT[accent];

  if (items.length === 0) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="flex items-end justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <p className={`text-[12px] font-medium uppercase tracking-[0.24em] ${a.text}`}>{heading}</p>
        <div className="flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Previous"
            className={`flex h-11 w-11 items-center justify-center border transition-colors hover:text-white ${a.btn}`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Next"
            className={`-ml-px flex h-11 w-11 items-center justify-center border transition-colors hover:text-white ${a.btn}`}
          >
            →
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 sm:px-10 lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <li
            key={`${item.image}-${idx}`}
            className="group w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-rule">
              <Image
                src={item.image}
                alt={item.caption ?? `Gallery ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            {item.caption ? (
              <p className="mt-3 text-[13px] leading-snug text-ink/70">
                <span className={`num-tabular mr-2 ${a.text}`}>{String(idx + 1).padStart(2, '0')}</span>
                {item.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
