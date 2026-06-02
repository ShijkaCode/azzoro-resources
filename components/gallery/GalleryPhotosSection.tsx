'use client';

import { useState } from 'react';
import { PhotoMasonry } from './PhotoMasonry';
import type { GalleryPhoto } from '@/lib/content/types';

type FilterTag = { slug: string; label: string };

export function GalleryPhotosSection({
  photos,
  tags,
  heading,
}: {
  photos: GalleryPhoto[];
  tags: FilterTag[];
  heading: string;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  if (photos.length === 0) return null;

  // Only show a chip if it's "all" or at least one photo carries that tag.
  const usableTags = tags.filter(
    (tag) =>
      tag.slug === 'all' ||
      photos.some((photo) => photo.tags?.some((pt) => pt.toLowerCase() === tag.slug.toLowerCase()))
  );

  return (
    <section className="bg-primary px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16">
      <span aria-hidden="true" className="mb-4 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">{heading}</h2>
        {usableTags.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {usableTags.map((tag) => {
              const isActive = tag.slug === 'all' ? activeTag === null : activeTag === tag.slug;
              return (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => setActiveTag(tag.slug === 'all' ? null : tag.slug)}
                  className={`border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors ${
                    isActive
                      ? 'border-[hsl(var(--copper))] bg-[hsl(var(--copper))] text-white'
                      : 'border-white/25 text-white/70 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-10">
        <PhotoMasonry photos={photos} activeTag={activeTag} />
      </div>
    </section>
  );
}
