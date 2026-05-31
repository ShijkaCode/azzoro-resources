import { MediaImage as Image } from '@/components/shared/MediaImage';
import type { Partner } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

const T = {
  en: { eyebrow: 'Partners & suppliers' },
  mn: { eyebrow: 'Хамтрагч ба нийлүүлэгчид' },
} as const;

// ── MVP DEMO PARTNER STRIP ──────────────────────────────────────────────
// Placeholder logos + invented names for the client demo. These are NOT
// confirmed partnerships. To hide the strip: set USE_DEMO_PARTNERS = false.
// To make real: move confirmed partners into the CMS content/partners/
// collection (one .yml each) and the component will render them automatically.
const USE_DEMO_PARTNERS = true;
const DEMO_PARTNERS: Partner[] = [
  { slug: 'd1', name: 'Tsenkher Holdings', logo: '/partner_logos/bodi_logo.png', order: 1 },
  { slug: 'd2', name: 'Nomad Freight', logo: '/partner_logos/miat_mongolian_airlines.png', order: 2 },
  { slug: 'd3', name: 'Ider Mining Services', logo: '/partner_logos/izmone_logo_2000x2000.jpg', order: 3 },
  { slug: 'd4', name: 'Munkh Trans', logo: '/partner_logos/mtct_logo_mono_v1_1.jpg', order: 4 },
  { slug: 'd5', name: 'Sansar Equipment', logo: '/partner_logos/smam-logo.ai_.png', order: 5 },
  { slug: 'd6', name: 'Tumen Resources', logo: '/partner_logos/tumb_1.jpg', order: 6 },
  { slug: 'd7', name: 'Selenge Industrial', logo: '/partner_logos/untitled-2_3.png', order: 7 },
  { slug: 'd8', name: 'Oron Group', logo: '/partner_logos/brand.gif', order: 8 },
];
// ────────────────────────────────────────────────────────────────────────

export default function PartnerLogos({ partners, locale = 'en' }: { partners: Partner[]; locale?: Locale }) {
  const source = USE_DEMO_PARTNERS ? DEMO_PARTNERS : partners;

  if (source.length === 0) {
    return null;
  }

  const copy = T[locale] ?? T.en;
  const sorted = [...source].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-paper text-ink">
      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-ink">{copy.eyebrow}</p>

        <ul className="mt-8 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-4">
          {sorted.map((partner) => {
            const inner = partner.logo ? (
              <span className="relative block h-16 w-full max-w-[180px] opacity-80 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0">
                <Image src={partner.logo} alt={partner.name} fill className="object-contain object-center" sizes="180px" />
              </span>
            ) : (
              <span className="font-display text-lg font-medium text-ink/70 transition-colors group-hover:text-ink">
                {partner.name}
              </span>
            );

            const cellClass =
              'group flex h-28 items-center justify-center border-b border-r border-rule px-6';

            if (partner.url) {
              return (
                <li key={partner.slug}>
                  <a href={partner.url} target="_blank" rel="noreferrer" className={cellClass}>
                    {inner}
                  </a>
                </li>
              );
            }

            return (
              <li key={partner.slug} className={cellClass}>
                {inner}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
