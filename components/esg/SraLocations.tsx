import { MediaImage as Image } from '@/components/shared/MediaImage';
import { MarkdownBody } from '@/components/shared/MarkdownBody';

type LocationEntry = { location: string; region?: string; items: string[] };

export function SraLocations({
  eyebrow,
  heading,
  body,
  image,
  locations,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  image?: string;
  locations: LocationEntry[];
}) {
  return (
    <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <div className={image ? 'grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:items-center' : ''}>
        <div className="max-w-[60ch]">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-[hsl(var(--eco))]">{eyebrow}</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-3xl font-medium leading-[1.05] tracking-[-0.01em] text-ink sm:text-4xl">
            {heading}
          </h2>
          <MarkdownBody className="mt-6 max-w-[52ch] prose-p:text-ink/75">{body}</MarkdownBody>
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden border border-rule">
            <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      <ul className="mt-12 border-t border-rule">
        {locations.map((entry) => (
          <li
            key={entry.location}
            className="group grid grid-cols-1 gap-x-10 gap-y-3 border-b border-rule py-6 transition-colors duration-300 hover:bg-ink/[0.015] sm:grid-cols-[16rem_1fr]"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-lg font-medium leading-tight text-ink">{entry.location}</h3>
              {entry.region ? (
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--eco))]">{entry.region}</span>
              ) : null}
            </div>
            <ul className="flex flex-col gap-2">
              {entry.items.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-[14px] leading-snug text-ink/75">
                  <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 bg-[hsl(var(--copper))]" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SraLocations;
