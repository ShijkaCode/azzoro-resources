import type { Metadata } from 'next';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import { readdirSync } from 'fs';
import path from 'path';
import { CaseStudyCard } from '@/components/gallery/CaseStudyCard';
import { FieldGallery } from '@/components/gallery/FieldGallery';
import { VideoGrid } from '@/components/gallery/VideoGrid';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { CaseStudy, GalleryContent, GalleryVideo } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const gallery = await loadSingleton<GalleryContent>('pages/gallery', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Галерей' : 'Gallery',
    description: gallery.intro_body,
    locale,
    path: '/gallery',
  });
}

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [gallery, videos, cases] = await Promise.all([
    loadSingleton<GalleryContent>('pages/gallery', locale),
    loadCollection<GalleryVideo>('gallery/videos', locale),
    loadCollection<CaseStudy>('gallery/case-studies', locale),
  ]);

  // Auto-collect every web-renderable image in public/uploads/field (alphabetical).
  let fieldImages: string[] = [];
  try {
    fieldImages = readdirSync(path.join(process.cwd(), 'public/uploads/field'))
      .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
      .sort()
      .map((name) => `/uploads/field/${encodeURIComponent(name)}`);
  } catch {
    fieldImages = [];
  }

  const t =
    locale === 'mn'
      ? { eyebrow: 'Түүхүүд', stories: 'Кейс судалгаа', photos: 'Талбайн гэрэл зураг', videos: 'Видео', read: 'Унших' }
      : { eyebrow: 'Stories', stories: 'Case studies', photos: 'Field photography', videos: 'Video', read: 'Read the story' };

  // Draft case studies are hidden from the site (toggled in the CMS). When the
  // collection is effectively empty, the featured + grid blocks render nothing.
  const publishedCases = cases.filter((study) => !study.draft);
  const [featured, ...restCases] = publishedCases;

  return (
    <main id="main-content">
      <section className="-mt-24 bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">{t.eyebrow}</p>
          <h1 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {gallery.intro_heading}
          </h1>
          <p className="mt-7 max-w-[60ch] text-base leading-relaxed text-white/75 sm:text-lg">{gallery.intro_body}</p>
        </div>
      </section>

      {featured ? (
        <section className="bg-paper">
          <Link
            href={localizeHref(locale, `/gallery/case-studies/${featured.slug}`)}
            className="group grid grid-cols-1 lg:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[36rem]">
              <Image
                src={featured.hero_image}
                alt={featured.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center border-rule px-6 py-16 sm:px-10 sm:py-20 lg:border-l lg:px-16">
              <p className="kicker">
                {t.stories} · {new Date(featured.date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU', { year: 'numeric', month: 'short' })}
              </p>
              <h2 className="mt-6 max-w-[18ch] font-display text-balance text-3xl font-medium leading-[1.05] tracking-[-0.01em] sm:text-4xl lg:text-5xl">
                {featured.title}
              </h2>
              {featured.pull_quote ? (
                <p className="mt-6 max-w-[40ch] font-display text-xl italic leading-snug text-ink/80">“{featured.pull_quote}”</p>
              ) : null}
              <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-ink/70">{featured.summary}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-ink transition-colors group-hover:border-[hsl(var(--copper))]">
                {t.read}
                <span aria-hidden="true" className="text-[hsl(var(--copper))] transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      {restCases.length > 0 ? (
        <section className="bg-paper px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {restCases.map((study) => (
              <CaseStudyCard key={study.slug} study={study} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}

      <FieldGallery images={fieldImages} heading={t.photos} />

      <VideoGrid videos={videos} heading={t.videos} />
    </main>
  );
}