'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
import { useRef } from 'react';

type GalleryItem = { image: string; caption?: string };

export function EsgGallery({ items, heading }: { items: GalleryItem[]; heading: string }) {
  const trackRef = useRef<HTMLUListElement>(null);

  if (items.length === 0) return null;

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="bg-[hsl(var(--eco-paper))] py-20 sm:py-24">
      <div className="flex items-end justify-between gap-6 px-6 sm:px-10 lg:px-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{heading}</p>
        <div className="flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Previous"
            className="flex h-11 w-11 items-center justify-center border border-[hsl(var(--eco))] text-[hsl(var(--eco))] transition-colors hover:bg-[hsl(var(--eco))] hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Next"
            className="-ml-px flex h-11 w-11 items-center justify-center border border-[hsl(var(--eco))] text-[hsl(var(--eco))] transition-colors hover:bg-[hsl(var(--eco))] hover:text-white"
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
                <span className="num-tabular mr-2 text-[hsl(var(--eco))]">{String(idx + 1).padStart(2, '0')}</span>
                {item.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
