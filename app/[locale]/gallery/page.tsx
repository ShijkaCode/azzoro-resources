import { CaseStudyCard } from '@/components/gallery/CaseStudyCard';
import { PhotoMasonry } from '@/components/gallery/PhotoMasonry';
import { VideoGrid } from '@/components/gallery/VideoGrid';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { CaseStudy, GalleryContent, GalleryPhoto, GalleryVideo } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [gallery, photos, videos, cases] = await Promise.all([
    loadSingleton<GalleryContent>('pages/gallery', locale),
    loadCollection<GalleryPhoto>('gallery/photos', locale),
    loadCollection<GalleryVideo>('gallery/videos', locale),
    loadCollection<CaseStudy>('gallery/case-studies', locale),
  ]);

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

      <section className="mt-12">
        <h2 className="text-3xl font-semibold">Photos</h2>
        <div className="mt-8">
          <PhotoMasonry photos={photos} />
        </div>
      </section>

      <VideoGrid videos={videos} />

      {cases.length > 0 ? (
        <section className="py-12">
          <h2 className="text-3xl font-semibold">Case studies</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cases.map((study) => (
              <CaseStudyCard key={study.slug} study={study} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}