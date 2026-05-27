'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { GalleryPhoto } from '@/lib/content/types';

export function PhotoMasonry({ photos, activeTag }: { photos: GalleryPhoto[]; activeTag?: string | null }) {
  const filtered = activeTag ? photos.filter((photo) => photo.tags.includes(activeTag)) : photos;
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {filtered.map((photo, itemIndex) => (
          <button
            key={photo.slug}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-[1rem]"
            aria-label={photo.caption ?? 'Open photo'}
          >
            <div className="relative w-full overflow-hidden rounded-[1rem]" style={{ aspectRatio: '4 / 3' }}>
              <Image src={photo.image} alt={photo.caption ?? ''} fill className="object-cover transition duration-300 hover:scale-[1.03]" sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw" />
            </div>
          </button>
        ))}
      </div>
      <Lightbox
        open={index !== null}
        index={index ?? 0}
        close={() => setIndex(null)}
        slides={filtered.map((photo) => ({ src: photo.image, alt: photo.caption ?? '' }))}
      />
    </>
  );
}