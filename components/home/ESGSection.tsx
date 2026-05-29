import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

type Pillar = { tag: string; title: string; body: string; image: string; imageAlt: string };

const COPY: Record<Locale, { eyebrow: string; pillars: Pillar[] }> = {
  en: {
    eyebrow: 'Sustainability',
    pillars: [
      {
        tag: 'Environment',
        title: 'Groundwater monitored from day one',
        body: 'We sample and monitor wells across our licence areas to protect the water sources communities depend on.',
        image: '/uploads/esg/Well%20monitoring%20at%20Anjiin%20bulag.jpg',
        imageAlt: 'Well monitoring at Anjiin Bulag, Mongolia',
      },
      {
        tag: 'Community',
        title: 'Investing in the places we explore',
        body: 'From playgardens to local infrastructure, we direct tangible investment into the soums hosting our work.',
        image: '/uploads/esg/Playgarden%20in%20Yesunbulag.jpg',
        imageAlt: 'Community playgarden in Yesunbulag, Mongolia',
      },
      {
        tag: 'Governance',
        title: 'Open engagement with stakeholders',
        body: 'We meet local stakeholders regularly and report transparently — including through public industry forums.',
        image: '/uploads/esg/Mining%20Week%202025_with%20Local%20stakeholders.jpg',
        imageAlt: 'Mining Week 2025 engagement with local stakeholders',
      },
    ],
  },
  mn: {
    // TODO — client to verify Mongolian copy
    eyebrow: 'Тогтвортой байдал',
    pillars: [
      {
        tag: 'Байгаль орчин',
        title: 'Газрын доорх усыг эхэн өдрөөс хянадаг',
        body: 'Иргэдийн түшиглэдэг усны эх үүсвэрийг хамгаалахын тулд лицензийн талбай даяар худгийн дээж авч хянадаг.',
        image: '/uploads/esg/Well%20monitoring%20at%20Anjiin%20bulag.jpg',
        imageAlt: 'Анжийн булаг дахь худгийн хяналт, Монгол',
      },
      {
        tag: 'Орон нутаг',
        title: 'Ажилладаг газартаа хөрөнгө оруулдаг',
        body: 'Тоглоомын талбайгаас орон нутгийн дэд бүтэц хүртэл бид үйл ажиллагаа явуулдаг сумдад бодит хөрөнгө оруулалт хийдэг.',
        image: '/uploads/esg/Playgarden%20in%20Yesunbulag.jpg',
        imageAlt: 'Есөнбулаг дахь хүүхдийн тоглоомын талбай, Монгол',
      },
      {
        tag: 'Засаглал',
        title: 'Оролцогч талуудтай нээлттэй харилцаа',
        body: 'Бид орон нутгийн оролцогч талуудтай тогтмол уулзаж, нийтийн салбарын чуулга уулзалтаар дамжуулан ил тод тайлагнадаг.',
        image: '/uploads/esg/Mining%20Week%202025_with%20Local%20stakeholders.jpg',
        imageAlt: 'Уул уурхайн долоо хоног 2025 — орон нутгийн оролцогч талуудтай',
      },
    ],
  },
};

export default function ESGSection({
  locale,
  teaser,
}: {
  locale: Locale;
  teaser: HomeContent['sustainability_teaser'];
}) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="bg-paper text-ink">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-muted-ink">{copy.eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {teaser.heading}
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">{teaser.body}</p>
            <Link
              href={localizeHref(locale, teaser.cta_href)}
              className="mt-8 inline-flex w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-ink transition-colors hover:border-ink"
            >
              {teaser.cta_label}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 border-t border-rule sm:grid-cols-3 lg:mt-20">
          {copy.pillars.map((pillar, idx) => {
            const isLast = idx === copy.pillars.length - 1;
            const borderClass = isLast ? '' : 'border-b border-rule sm:border-b-0 sm:border-r';
            return (
              <article key={pillar.tag} className={`group flex flex-col ${borderClass}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-0 py-7 sm:px-6 sm:py-8">
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-ink">{pillar.tag}</p>
                  <h3 className="mt-4 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">{pillar.title}</h3>
                  <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-ink/70 sm:text-[15px]">{pillar.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
