import Image from 'next/image';
import { cn } from '@/lib/utils';

type CloudflareStreamHeroProps = {
  streamUid?: string;
  poster: string;
  className?: string;
  priority?: boolean;
};

export function CloudflareStreamHero({
  streamUid,
  poster,
  className,
  priority = false,
}: CloudflareStreamHeroProps) {
  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_ACCOUNT_ID?.trim();
  const hasVideo = Boolean(accountId && streamUid?.trim());

  return (
    <div className={cn('overflow-hidden', className)} aria-hidden="true">
      <Image src={poster} alt="" fill priority={priority} className="object-cover" sizes="100vw" />
      {hasVideo ? (
        <iframe
          src={`https://customer-${accountId}.cloudflarestream.com/${streamUid}/iframe?autoplay=true&muted=true&loop=true&controls=false&preload=metadata`}
          title="Azzoro Resources hero video"
          className="absolute inset-0 h-full w-full scale-[1.02] pointer-events-none"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}