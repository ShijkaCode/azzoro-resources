import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { GalleryContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const gallery = await loadSingleton<GalleryContent>('pages/gallery', locale);

  return (
    <main className="container-wide py-16 sm:py-20">
      <section className="surface-card p-8 sm:p-10 lg:p-12">
        <p className="section-kicker">Gallery</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{gallery.intro_heading}</h1>
        <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-muted-foreground">{gallery.intro_body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {gallery.filter_tags.map((tag) => (
            <span key={tag.slug} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
              {tag.label}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}