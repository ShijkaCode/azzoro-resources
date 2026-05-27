import FooterCards from '@/components/home/FooterCards';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import ESGSection from '@/components/home/ESGSection';
import WhatWeDo from '@/components/home/WhatWeDo';
import PartnerLogos from '@/components/layout/PartnerLogos';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { HomeContent, Partner } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [home, partners] = await Promise.all([
    loadSingleton<HomeContent>('pages/home', locale),
    loadCollection<Partner>('partners'),
  ]);

  return (
    <main>
      <HeroSection locale={locale} hero={home.hero} metrics={home.metrics} />
      <IntroSection locale={locale} intro={home.why_mongolia_intro} cards={home.why_mongolia_cards} />
      <WhatWeDo locale={locale} intro={home.why_azzuro_intro} cards={home.why_azzuro_cards} />
      <ESGSection locale={locale} teaser={home.sustainability_teaser} />
      <FooterCards locale={locale} leadership={home.leadership_teaser} />
      <PartnerLogos partners={partners} />
    </main>
  );
}