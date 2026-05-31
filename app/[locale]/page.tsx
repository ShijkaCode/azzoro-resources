import type { Metadata } from 'next';
import FooterCards from '@/components/home/FooterCards';
import HeroSection from '@/components/home/HeroSection';
import IntroSection from '@/components/home/IntroSection';
import FeaturedProjectSection from '@/components/home/FeaturedProjectSection';
import { LatestNewsSection } from '@/components/home/LatestNewsSection';
import ESGSection from '@/components/home/ESGSection';
import { StockPriceCard } from '@/components/home/StockPriceCard';
import WhatWeDo from '@/components/home/WhatWeDo';
// import PartnerLogos from '@/components/layout/PartnerLogos'; // Partners & suppliers section hidden — uncomment to restore
import { loadCollection } from '@/lib/content/loadCollection';
import { loadGlobal } from '@/lib/content/loadGlobal';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { HomeContent, Partner, SiteSettings, TeamMember } from '@/lib/content/types';
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
    description: home.hero.subline || home.hero.headline,
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

  const [home, partners, team, site] = await Promise.all([
    loadSingleton<HomeContent>('pages/home', locale),
    loadCollection<Partner>('partners'),
    loadCollection<TeamMember>('team', locale),
    loadGlobal<SiteSettings>('settings/site'),
  ]);

  return (
    <main id="main-content">
      <HeroSection
        locale={locale}
        hero={home.hero}
        metrics={home.metrics}
        liveEnabled={site.stock_api_enabled}
        ticker={site.stock_ticker}
      />
      {home.featured_projects?.map((project, index) => (
        <FeaturedProjectSection
          key={`${project.headline}-${index}`}
          project={project}
          locale={locale}
          mirrored={index % 2 === 1}
        />
      ))}
      <IntroSection locale={locale} content={home.why_mongolia} />
      <WhatWeDo locale={locale} content={home.why_azzoro} />
      <ESGSection locale={locale} teaser={home.sustainability_teaser} sustainability={home.home_sustainability} />
      {home.stock_section_enabled ? (
        <StockPriceCard
          investorPortalUrl={site.investor_portal_url}
          liveEnabled={site.stock_api_enabled}
          locale={locale}
          ticker={site.stock_ticker}
          content={home.investor_snapshot}
        />
      ) : null}
      {home.news_section_enabled ? <LatestNewsSection investorPortalUrl={site.investor_portal_url} locale={locale} /> : null}
      <FooterCards locale={locale} leadership={home.leadership_teaser} team={team} />
      {/* Partners & suppliers section hidden — uncomment to restore */}
      {/* <PartnerLogos partners={partners} locale={locale} /> */}
    </main>
  );
}