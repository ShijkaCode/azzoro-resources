import Image from 'next/image';
import Link from 'next/link';
import type { HomeContent } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

type Director = { name: string; role: string; credential: string; image: string };

const COPY: Record<Locale, { eyebrow: string; directors: Director[] }> = {
  en: {
    eyebrow: 'Leadership & governance',
    directors: [
      {
        name: 'David Paull',
        role: 'Non-Executive Chairman',
        credential: '30+ years in mining, including a decade in Mongolia as MD and Chairman of Aspire Mining.',
        image: '/uploads/team/technical_team/david-300x300.png',
      },
      {
        name: 'Gan-Ochir Zunduisuren',
        role: 'Managing Director',
        credential: '22+ years across the industry, with board roles at Aspire Mining and Oyu Tolgoi LLC.',
        image: '/uploads/team/technical_team/Ganochir-Photo-v03-scaled-e1683614731135.webp',
      },
      {
        name: 'Kirsten Livermore',
        role: 'Non-Executive Director',
        credential: '25+ years in mining policy and regulation; led the Australia–Mongolia Extractives Program.',
        image: '/uploads/team/technical_team/kirstenok-300x300.jpg',
      },
      {
        name: 'Neil Young',
        role: 'Non-Executive Director',
        credential: 'Energy-sector founder with ~30 years’ experience, including as CEO of Elixir Energy.',
        image: '/uploads/team/technical_team/Neil-300x300.png',
      },
    ],
  },
  mn: {
    // TODO — client to verify Mongolian copy
    eyebrow: 'Удирдлага ба засаглал',
    directors: [
      {
        name: 'David Paull',
        role: 'Гүйцэтгэх бус дарга',
        credential: 'Уул уурхайд 30+ жил, үүнээс 10 жил Монголд Aspire Mining-ийн ГЗ, даргаар ажилласан.',
        image: '/uploads/team/technical_team/david-300x300.png',
      },
      {
        name: 'Ган-Очир Зүндүйсүрэн',
        role: 'Гүйцэтгэх захирал',
        credential: 'Салбартаа 22+ жил, Aspire Mining болон Оюу Толгой ХХК-д удирдах албан тушаал хашсан.',
        image: '/uploads/team/technical_team/Ganochir-Photo-v03-scaled-e1683614731135.webp',
      },
      {
        name: 'Kirsten Livermore',
        role: 'Гүйцэтгэх бус захирал',
        credential: 'Уул уурхайн бодлого, зохицуулалтад 25+ жил; Австрали–Монголын олборлох хөтөлбөрийг удирдсан.',
        image: '/uploads/team/technical_team/kirstenok-300x300.jpg',
      },
      {
        name: 'Neil Young',
        role: 'Гүйцэтгэх бус захирал',
        credential: 'Эрчим хүчний салбарын үүсгэн байгуулагч, ~30 жилийн туршлагатай, Elixir Energy-ийн ГЗ байсан.',
        image: '/uploads/team/technical_team/Neil-300x300.png',
      },
    ],
  },
};

export default function FooterCards({
  locale,
  leadership,
}: {
  locale: Locale;
  leadership: HomeContent['leadership_teaser'];
}) {
  const copy = COPY[locale] ?? COPY.en;

  return (
    <section className="bg-ink text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{copy.eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {leadership.heading}
            </h2>
            <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-white/75 sm:text-lg">{leadership.body}</p>
          </div>
          <Link
            href={localizeHref(locale, leadership.cta_href)}
            className="inline-flex w-fit items-center gap-3 border-b border-white/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-white transition-colors hover:border-white"
          >
            {leadership.cta_label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
          {copy.directors.map((director) => (
            <article key={director.name} className="group flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04]">
                <Image
                  src={director.image}
                  alt={director.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-5 font-display text-xl font-medium leading-tight text-white sm:text-2xl">{director.name}</h3>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{director.role}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/65">{director.credential}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
