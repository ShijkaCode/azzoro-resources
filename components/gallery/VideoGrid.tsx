import type { GalleryVideo } from '@/lib/content/types';

export function VideoGrid({ videos }: { videos: GalleryVideo[] }) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-semibold">Videos</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <article key={video.slug} className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-[0_18px_50px_-28px_rgba(15,23,42,0.16)]">
            <div className="relative aspect-video">
              <iframe
                src={`https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID ?? 'placeholder'}.cloudflarestream.com/${video.stream_uid}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={video.title}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{video.title}</h3>
              {video.description ? <p className="mt-2 text-sm text-muted-foreground">{video.description}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}