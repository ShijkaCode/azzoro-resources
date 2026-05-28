import Image from 'next/image';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type WhatWeDoProps = {
  locale: Locale;
  intro: string;
  cards: HomeContent['why_azzoro_cards'];
};

type Pillar = { number: string; title: string; body: string; tag: string };

const COPY: Record<Locale, { eyebrow: string; headline: string; imageAlt: string; pillars: Pillar[]; footnote: string }> = {
  en: {
    eyebrow: 'Why Azzoro',
    headline: 'A discovery-stage explorer with an operator’s discipline.',
    imageAlt: 'Drilling operations at an Azzoro Resources exploration site, Mongolia',
    pillars: [
      {
        number: '01',
        title: 'Next big metals play',
        body: 'The only ASX-listed junior with a high-grade Cu·Ni·PGE discovery aligned to the energy-transition metals trend.',
        tag: 'ASX: AZ9',
      },
      {
        number: '02',
        title: 'Proven execution',
        body: 'A Mongolian team with global perspective — delivering rapid exploration and efficient, low-cost drilling campaigns.',
        tag: 'Local + global team',
      },
      {
        number: '03',
        title: 'External validation',
        body: 'Technical endorsement and non-dilutive funding awarded through the BHP Xplor program.',
        tag: 'BHP Xplor · 2023',
      },
    ],
    footnote: 'BHP Xplor is a global accelerator program; participation does not constitute an investment by or affiliation with BHP. Refer to asianbatterymetals.com for disclosures.',
  },
  mn: {
    // TODO — client to verify Mongolian copy
    eyebrow: 'Яагаад Azzoro',
    headline: 'Үйлдвэрлэгчийн сахилга баттай, нээлтийн үе шатны хайгуулын компани.',
    imageAlt: 'Azzoro Resources-ийн хайгуулын талбай дахь өрөмдлөгийн ажил, Монгол',
    pillars: [
      {
        number: '01',
        title: 'Дараагийн томоохон тоглогч',
        body: 'Эрчим хүчний шилжилтийн металын чиг хандлагад нийцсэн өндөр агуулгатай Cu·Ni·PGE нээлттэй цорын ганц ASX-д бүртгэлтэй жуниор компани.',
        tag: 'ASX: AZ9',
      },
      {
        number: '02',
        title: 'Батлагдсан гүйцэтгэл',
        body: 'Дэлхийн туршлагатай Монгол баг — хурдан хайгуул, үр ашигтай, бага зардлаар өрөмдлөг хийдэг.',
        tag: 'Орон нутаг + дэлхийн баг',
      },
      {
        number: '03',
        title: 'Гадаад баталгаажуулалт',
        body: 'BHP Xplor хөтөлбөрийн хүрээнд техникийн дэмжлэг болон хувьцаа бууруулдаггүй санхүүжилт авсан.',
        tag: 'BHP Xplor · 2023',
      },
    ],
    footnote: 'BHP Xplor нь дэлхийн хэмжээний хурдасгуур хөтөлбөр бөгөөд оролцоо нь BHP-ийн хөрөнгө оруулалт эсвэл харьяалал болохгүй. Мэдээллийг asianbatterymetals.com сайтаас үзнэ үү.',
  },
};

export default function WhatWeDo({ locale, intro }: WhatWeDoProps) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="bg-ink text-white">
      <div className="relative aspect-[21/9] w-full overflow-hidden lg:aspect-[3/1]">
        <Image
          src="/uploads/field/drill%201.jpg"
          alt={copy.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        <div className="absolute inset-0 flex items-end px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/70">{copy.eyebrow}</p>
            <h2 className="mt-4 max-w-[20ch] font-display text-balance text-3xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-4xl lg:text-5xl">
              {copy.headline}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <p className="max-w-[60ch] text-lg leading-[1.6] text-white/80 sm:text-xl">{intro}</p>

        <div className="mt-14 grid grid-cols-1 border-t border-white/15 md:grid-cols-3 lg:mt-16">
          {copy.pillars.map((pillar, idx) => {
            const isLast = idx === copy.pillars.length - 1;
            const borderClass = isLast ? '' : 'border-b border-white/15 md:border-b-0 md:border-r';
            return (
              <div key={pillar.number} className={`flex flex-col py-10 md:px-8 md:py-12 md:first:pl-0 lg:px-10 ${borderClass}`}>
                <span className="num-display text-3xl font-medium leading-none text-white/40 sm:text-4xl">{pillar.number}</span>
                <h3 className="mt-6 text-[13px] font-medium uppercase tracking-[0.32em] text-white">{pillar.title}</h3>
                <p className="mt-4 max-w-[40ch] flex-1 text-[15px] leading-relaxed text-white/70">{pillar.body}</p>
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{pillar.tag}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-14 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-16">{copy.footnote}</p>
      </div>
    </section>
  );
}
