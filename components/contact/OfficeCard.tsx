import { MediaImage as Image } from '@/components/shared/MediaImage';
import type { ContactOffice } from '@/lib/content/types';

export function OfficeCard({ office }: { office: ContactOffice }) {
  const mapKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const mapImageUrl =
    office.lat && office.lng && mapKey
      ? `https://api.maptiler.com/maps/dataviz-dark/static/${office.lng},${office.lat},13/600x320@2x.png?key=${mapKey}`
      : null;
  const media = office.image || mapImageUrl;

  return (
    <article className="group relative flex flex-col border border-rule bg-white">
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      {media ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-rule">
          <Image
            src={media}
            alt={office.image ? office.name : `Map of ${office.name}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, 100vw"
            unoptimized={!office.image}
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center border-b border-rule bg-paper text-[11px] uppercase tracking-[0.28em] text-muted-ink">
          —
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">{office.name}</h2>
        <address className="mt-4 whitespace-pre-line text-[14px] not-italic leading-relaxed text-ink/70">{office.address}</address>
        {office.hours ? <p className="mt-3 text-[13px] text-muted-ink">{office.hours}</p> : null}
        {office.email ? (
          <a
            href={`mailto:${office.email}`}
            className="mt-5 inline-flex w-fit items-center border-b border-ink/40 pb-0.5 text-[13px] font-medium text-ink transition-colors hover:border-[hsl(var(--copper))]"
          >
            {office.email}
          </a>
        ) : null}
      </div>
    </article>
  );
}
