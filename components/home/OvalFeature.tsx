import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

type Stat = { value: string; label: string };
type CoreItem = { src: string; alt: string; caption: string };

const COPY: Record<Locale, {
  eyebrow: string;
  headline: string;
  lead: string;
  stats: Stat[];
  cta: string;
  imageAlt: string;
  footnote: string;
  coreItems: CoreItem[];
}> = {
  en: {
    eyebrow: '01 — Flagship',
    headline: 'Oval Cu·Ni·PGE Discovery',
    lead: 'A new high-grade magmatic sulphide system in the Central Asian Orogenic Belt. Mineralisation confirmed from surface to 290 m depth across an 880 m strike, with copper recoveries of 89–95% on a simple two-product flow sheet.',
    stats: [
      { value: '880 m', label: 'Continuous mineralisation' },
      { value: '89–95%', label: 'Copper recovery' },
      { value: '6.08% Cu', label: 'Best intercept · OVD021' },
      { value: '2026', label: 'Initial JORC target' },
    ],
    cta: 'Read the project',
    imageAlt: 'Aerial view of the Oval Cu·Ni·PGE discovery site, Mongolia',
    footnote: 'Source: ASX announcements 28 Oct 2024, 24 Sep 2025, 29 Jan 2026. Refer to asianbatterymetals.com for full disclosures.',
    coreItems: [
      { src: '/uploads/minerals/1.jpg', alt: 'Drill core sample from the Oval discovery', caption: 'Drill core from the OVD021 discovery hole.' },
      { src: '/uploads/minerals/021.JPG', alt: 'Massive sulphide intercept', caption: 'Massive sulphide intercept · Oval discovery zone.' },
      { src: '/uploads/minerals/core%202.jpg', alt: 'Mineralised drill core close-up', caption: 'Disseminated Cu·Ni mineralisation envelope.' },
    ],
  },
  mn: {
    // TODO — client to verify Mongolian copy
    eyebrow: '01 — Гол төсөл',
    headline: 'Oval Cu·Ni·PGE нээлт',
    lead: 'Төв Азийн Орогенийн Бүсэд илрүүлсэн өндөр агуулгатай магмын сульфидын шинэ систем. Гадаргуугаас 290 м гүн хүртэлх 880 м үргэлжилсэн ашигт малтмалжилт батлагдсан бөгөөд зэсийн нөхөн авалт 89–95%.',
    stats: [
      { value: '880 м', label: 'Үргэлжилсэн ашигт малтмалжилт' },
      { value: '89–95%', label: 'Зэсийн нөхөн авалт' },
      { value: '6.08% Cu', label: 'Шилдэг тогтоц · OVD021' },
      { value: '2026', label: 'Анхны JORC зорилт' },
    ],
    cta: 'Төслийн дэлгэрэнгүй',
    imageAlt: 'Oval Cu·Ni·PGE нээлтийн талбайн агаарын зураг, Монгол',
    footnote: 'Эх сурвалж: ASX-ийн 2024.10.28, 2025.09.24, 2026.01.29 мэдэгдлүүд. Бүрэн мэдээллийг asianbatterymetals.com сайтаас үзнэ үү.',
    coreItems: [
      { src: '/uploads/minerals/1.jpg', alt: 'Oval нээлтийн өрөмдлөгийн дээж', caption: 'OVD021 нээлтийн өрөмдлөгийн зүсэлт.' },
      { src: '/uploads/minerals/021.JPG', alt: 'Их сульфидын зүсэлт', caption: 'Oval нээлтийн их сульфидын зүсэлт.' },
      { src: '/uploads/minerals/core%202.jpg', alt: 'Ашигт малтмалжсан өрөмдлөгийн зүсэлтийн ойролцоо зураг', caption: 'Тархан байрласан Cu·Ni ашигт малтмалжилтын бүс.' },
    ],
  },
};

export default function OvalFeature({ locale }: { locale: Locale }) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="bg-paper text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="relative aspect-[4/3] lg:aspect-[16/9]">
            <Image
              src="/uploads/gallery/photos/discovery_4k.png"
              alt={copy.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <ul className="grid grid-cols-3 lg:flex-1">
            {copy.coreItems.map((item) => (
              <li key={item.src} className="group relative aspect-square overflow-hidden lg:aspect-auto">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="font-display text-lg leading-tight text-white px-4 pb-4 sm:px-6 sm:pb-6 sm:text-xl">
                    {item.caption}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center border-rule px-6 py-16 sm:px-10 sm:py-20 lg:border-l lg:px-16 lg:py-24">
          <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-muted-ink">{copy.eyebrow}</p>
          <h2 className="mt-6 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {copy.headline}
          </h2>
          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">{copy.lead}</p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-rule pt-10">
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="num-display text-4xl font-medium leading-none text-ink sm:text-5xl">{stat.value}</dt>
                <dd className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={localizeHref(locale, '/projects/yambat')}
            className="mt-14 inline-flex w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-ink transition-colors hover:border-ink"
          >
            {copy.cta}
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-10 max-w-prose text-[11px] leading-relaxed text-muted-ink">{copy.footnote}</p>
        </div>
      </div>
    </section>
  );
}
