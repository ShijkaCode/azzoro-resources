import Image from 'next/image';
import type { ContactOffice } from '@/lib/content/types';

export function OfficeCard({ office }: { office: ContactOffice }) {
  const mapKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const mapImageUrl = office.lat && office.lng && mapKey
    ? `https://api.maptiler.com/maps/streets/static/${office.lng},${office.lat},14/400x200@2x.png?key=${mapKey}`
    : null;

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-[0_18px_50px_-28px_rgba(15,23,42,0.16)]">
      {mapImageUrl ? (
        <div className="relative h-36 w-full">
          <Image src={mapImageUrl} alt={`Map of ${office.name}`} fill className="object-cover" sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" unoptimized />
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center bg-muted text-sm text-muted-foreground">Map preview unavailable</div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold">{office.name}</h3>
        <address className="mt-3 whitespace-pre-line text-sm not-italic leading-7 text-muted-foreground">{office.address}</address>
        {office.hours ? <p className="mt-3 text-sm text-muted-foreground">{office.hours}</p> : null}
        {office.email ? (
          <a href={`mailto:${office.email}`} className="mt-4 inline-flex text-sm font-semibold text-primary transition hover:text-primary/80">
            {office.email}
          </a>
        ) : null}
      </div>
    </article>
  );
}