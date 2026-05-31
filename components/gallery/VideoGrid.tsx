import type { GalleryVideo } from '@/lib/content/types';

export function VideoGrid({ videos, heading }: { videos: GalleryVideo[]; heading: string }) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <span aria-hidden="true" className="mb-5 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
      <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{heading}</h2>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <article key={video.slug} className="group relative border border-rule">
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <div className="relative aspect-video">
              <iframe
                src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID ?? 'placeholder'}.cloudflarestream.com/${video.stream_uid}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={video.title}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="border-t border-rule p-5">
              <h3 className="font-display text-lg font-medium text-ink">{video.title}</h3>
              {video.description ? <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{video.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
