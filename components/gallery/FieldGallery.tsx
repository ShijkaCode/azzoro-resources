'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const PER_PAGE = 8;

export function FieldGallery({ images, heading }: { images: string[]; heading: string }) {
  const [page, setPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const totalPages = Math.ceil(images.length / PER_PAGE);
  const start = page * PER_PAGE;
  const pageImages = images.slice(start, start + PER_PAGE);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="bg-primary px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span aria-hidden="true" className="mb-4 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
          <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">{heading}</h2>
        </div>
        {totalPages > 1 ? (
          <div className="flex items-center gap-5">
            <span className="num-tabular text-[12px] font-medium uppercase tracking-[0.28em] text-white/55">
              <span className="text-[hsl(var(--copper))]">{pad(page + 1)}</span> / {pad(totalPages)}
            </span>
            <div className="flex">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous"
                className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white/10 enabled:hover:border-[hsl(var(--copper))] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next"
                className="-ml-px flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white/10 enabled:hover:border-[hsl(var(--copper))] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                →
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {pageImages.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(start + idx)}
            className="group relative aspect-[4/3] overflow-hidden bg-white/[0.04]"
            aria-label="Open photo"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        close={() => setLightboxIndex(null)}
        slides={images.map((src) => ({ src }))}
      />
    </section>
  );
}
