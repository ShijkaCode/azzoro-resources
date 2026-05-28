import type { Metadata } from 'next';
import FooterCards from '@/components/home/FooterCards';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import OvalFeature from '@/components/home/OvalFeature';
import { LatestNewsSection } from '@/components/home/LatestNewsSection';
import { ProjectsMapPreview } from '@/components/home/ProjectsMapPreview';
import ESGSection from '@/components/home/ESGSection';
import { StockPriceCard } from '@/components/home/StockPriceCard';
import WhatWeDo from '@/components/home/WhatWeDo';
import PartnerLogos from '@/components/layout/PartnerLogos';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadGlobal } from '@/lib/content/loadGlobal';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { HomeContent, Partner, Project, SiteSettings } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const home = await loadSingleton<HomeContent>('pages/home', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Azzoro Resources' : 'Azzoro Resources',
    description: home.hero.subline,
    locale,
    path: '/',
  });
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [home, partners, projects, site] = await Promise.all([
    loadSingleton<HomeContent>('pages/home', locale),
    loadCollection<Partner>('partners'),
    loadCollection<Project>('projects', locale),
    loadGlobal<SiteSettings>('settings/site'),
  ]);

  return (
    <main id="main-content">
      <HeroSection locale={locale} hero={home.hero} metrics={home.metrics} />
      <OvalFeature locale={locale} />
      <IntroSection locale={locale} intro={home.why_mongolia_intro} cards={home.why_mongolia_cards} />
      <ProjectsMapPreview projects={projects} />
      <WhatWeDo locale={locale} intro={home.why_azzoro_intro} cards={home.why_azzoro_cards} />
      <ESGSection locale={locale} teaser={home.sustainability_teaser} />
      {home.stock_section_enabled ? (
        <StockPriceCard investorPortalUrl={site.investor_portal_url} liveEnabled={site.stock_api_enabled} locale={locale} />
      ) : null}
      {home.news_section_enabled ? <LatestNewsSection investorPortalUrl={site.investor_portal_url} locale={locale} /> : null}
      <FooterCards locale={locale} leadership={home.leadership_teaser} />
      <PartnerLogos partners={partners} locale={locale} />
    </main>
  );
}