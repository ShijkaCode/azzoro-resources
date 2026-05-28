'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';

type IntroProps = {
  locale: Locale;
  intro: string;
  cards: HomeContent['why_mongolia_cards'];
};

type Pillar = {
  number: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

const COPY: Record<Locale, { eyebrow: string; headline: string; pillars: Pillar[]; footnote: string }> = {
  en: {
    eyebrow: 'Why Mongolia',
    headline: 'Mature ground. Neighbour to global demand.',
    pillars: [
      {
        number: '01',
        title: 'Tier-1 success',
        body: 'Home to Oyu Tolgoi — one of the few tier-1 copper discoveries to reach production in the past 25 years.',
        image: '/uploads/field/_CP11422.jpg',
        imageAlt: 'Field exploration in Mongolia',
      },
      {
        number: '02',
        title: 'Prospectivity',
        body: 'Top-5 jurisdiction in Asia for mineral potential, per the Fraser Institute mining survey.',
        image: '/uploads/field/IMG_9481.JPG',
        imageAlt: 'Geological prospecting in Mongolian terrain',
      },
      {
        number: '03',
        title: 'Strategic position',
        body: 'Direct rail and road access into China — the world’s largest consumer of copper and battery metals.',
        image: '/uploads/field/dji_fly_20250528_122142_614_1748406744047_photo.jpg',
        imageAlt: 'Aerial drone view of Mongolian landscape',
      },
      {
        number: '04',
        title: 'Infrastructure',
        body: 'Export-ready logistics, paved access, and an established service ecosystem of majors, mid-tiers, and contractors.',
        image: '/uploads/field/camp-bilgun.jpg',
        imageAlt: 'Field camp at the Bilgun project site',
      },
      {
        number: '05',
        title: 'Underexplored',
        body: 'Large tracts of prospective ground remain under-drilled compared with mature tier-1 copper provinces.',
        image: '/uploads/field/IMG_8982.JPG',
        imageAlt: 'Open Mongolian steppe under exploration',
      },
    ],
    footnote: 'Sources: Fraser Institute Annual Survey of Mining Companies; Mongolia Ministry of Mining and Heavy Industry; National Statistical Organization of Mongolia.',
  },
  mn: {
    // TODO — client to verify Mongolian copy
    eyebrow: 'Яагаад Монгол',
    headline: 'Хөгжсөн орчин. Дэлхийн эрэлтийн хөрш.',
    pillars: [
      {
        number: '01',
        title: 'Тэргүүлэх ангиллын амжилт',
        body: 'Сүүлийн 25 жилд үйлдвэрлэлд орсон цөөн тэргүүлэх ангиллын зэсийн ордуудын нэг болох Оюу Толгойн нутаг.',
        image: '/uploads/field/_CP11422.jpg',
        imageAlt: 'Монгол дахь хайгуулын ажил',
      },
      {
        number: '02',
        title: 'Хэтийн төлөв',
        body: 'Фрейзерийн институтын уул уурхайн судалгаагаар ашигт малтмалын нөөцийн хувьд Азид топ-5-д ордог.',
        image: '/uploads/field/IMG_9481.JPG',
        imageAlt: 'Монголын газар нутаг дахь геологийн ажил',
      },
      {
        number: '03',
        title: 'Стратегийн байршил',
        body: 'Дэлхийн хамгийн том зэс ба батерейн металын хэрэглэгч Хятад руу шууд төмөр зам, авто замтай.',
        image: '/uploads/field/dji_fly_20250528_122142_614_1748406744047_photo.jpg',
        imageAlt: 'Монголын газар нутгийн агаарын зураг',
      },
      {
        number: '04',
        title: 'Дэд бүтэц',
        body: 'Экспортод бэлэн логистик, хатуу хучилттай зам, томоохон болон дунд хэмжээний компани, гүйцэтгэгчдийн тогтсон экосистем.',
        image: '/uploads/field/camp-bilgun.jpg',
        imageAlt: 'Бэлгүний төслийн талбайн хээрийн бааз',
      },
      {
        number: '05',
        title: 'Бага судлагдсан',
        body: 'Боловсорсон тэргүүлэх ангиллын зэсийн нутагтай харьцуулахад өргөн тал газар судлагдаагүй хэвээр үлдсэн.',
        image: '/uploads/field/IMG_8982.JPG',
        imageAlt: 'Хайгуул хийгдэж буй Монголын талд',
      },
    ],
    footnote: 'Эх сурвалж: Фрейзерийн институтын уул уурхайн жилийн судалгаа; Монгол Улсын Уул уурхай, хүнд үйлдвэрийн яам; Үндэсний статистикийн хороо.',
  },
};

export default function IntroSection({ locale, intro }: IntroProps) {
  const copy = COPY[locale] ?? COPY.en;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-ink text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28 lg:aspect-auto lg:min-h-[640px]">
            {copy.pillars.map((pillar, idx) => (
              <Image
                key={pillar.number}
                src={pillar.image}
                alt={pillar.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-500 ease-out ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                priority={idx === 0}
              />
            ))}
            <div aria-hidden="true" className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-white/85 sm:bottom-6 sm:right-6">
              <span className="num-display text-[11px] leading-none text-white">{copy.pillars[activeIndex]?.number}</span>
              <span aria-hidden="true" className="text-white/40">/</span>
              <span className="num-display text-[11px] leading-none text-white/70">{String(copy.pillars.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{copy.eyebrow}</p>
            <h2 className="mt-6 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {copy.headline}
            </h2>
            <p className="mt-7 max-w-[44ch] text-base leading-[1.65] text-white/75 sm:text-lg">{intro}</p>

            <div className="mt-12 border-b border-white/15 lg:mt-16">
              {copy.pillars.map((pillar, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={pillar.number}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`group block w-full border-t border-white/15 py-5 text-left transition-colors sm:py-6 ${isActive ? '' : 'hover:bg-white/[0.025]'}`}
                    aria-expanded={isActive}
                  >
                    <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 sm:grid-cols-[4rem_1fr] sm:gap-x-6">
                      <span className={`num-display text-xl font-medium leading-none transition-colors sm:text-2xl ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/75'}`}>
                        {pillar.number}
                      </span>
                      <div>
                        <p className={`text-[12px] font-medium uppercase tracking-[0.32em] transition-colors ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}>
                          {pillar.title}
                        </p>
                        {isActive ? (
                          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/75 sm:text-[15px]">{pillar.body}</p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-10 max-w-prose text-[11px] leading-relaxed text-white/45 lg:mt-14">{copy.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
