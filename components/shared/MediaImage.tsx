'use client';

import Image, { type ImageProps } from 'next/image';
import blurManifest from '@/lib/media/blur-manifest.json';

const manifest = blurManifest as Record<string, string>;

/**
 * Drop-in replacement for next/image that auto-applies a blur-up (LQIP)
 * placeholder for any /uploads asset processed by scripts/optimize-media.mjs.
 * The tiny blurred preview shows instantly and the sharp image fades in over
 * it, so gallery images stop popping in one by one. Falls back to a plain
 * <Image> for sources without a generated placeholder (e.g. SVG logos).
 */
export function MediaImage({ src, ...props }: ImageProps) {
  let blur: string | undefined;
  if (typeof src === 'string') {
    // Gallery srcs may be URL-encoded (e.g. "drill%201.jpg"); manifest keys are decoded.
    let key = src;
    try {
      key = decodeURIComponent(src);
    } catch {
      /* malformed escape — fall back to raw src */
    }
    blur = manifest[key] ?? manifest[src];
  }

  return (
    <Image
      src={src}
      {...(blur ? { placeholder: 'blur' as const, blurDataURL: blur } : {})}
      {...props}
    />
  );
}

export default MediaImage;
