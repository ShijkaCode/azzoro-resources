import type { Metadata } from 'next';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { EsgMetrics } from '@/components/esg/EsgMetrics';
import { EsgApproach } from '@/components/esg/EsgApproach';
import { EngagementSteps } from '@/components/esg/EngagementSteps';
import { EnvironmentStewardship } from '@/components/esg/EnvironmentStewardship';
// import { SraLocations } from '@/components/esg/SraLocations'; // temporarily hidden — see SRA section below
import { LocalInvestment } from '@/components/esg/LocalInvestment';
import { CommunityStories } from '@/components/esg/CommunityStories';
import { EsgGallery } from '@/components/esg/EsgGallery';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Тогтвортой байдал' : 'ESG',
    description: esg.hero_subline || esg.reports_intro,
    locale,
    path: '/esg',
  });
}

// Section eyebrows / headings are UI chrome (dev-managed i18n); all data below
// them comes from the CMS markdown in both locales.
const LABELS = {
  en: {
    eyebrow: 'Sustainability',
    title: 'Exploring responsibly, alongside our communities.',
    metrics: 'By the numbers',
    approach: 'Our approach',
    commitments: 'Standards we hold ourselves to',
    engagementEyebrow: 'Stakeholder engagement',
    engagementHeading: 'How we engage — step by step',
    environmentEyebrow: 'Environmental stewardship',
    environmentHeading: 'Protecting the land we explore',
    sraEyebrow: 'Stakeholder engagement',
    sraHeading: 'Social Responsibility Agreements, by location',
    investmentEyebrow: 'Local investment',
    investmentHeading: 'Investing in communities',
    storiesEyebrow: 'Community stories',
    storiesHeading: 'Real people, real communities',
    gallery: 'From the field',
    reports: 'Reports & disclosures',
  },
  mn: {
    eyebrow: 'Тогтвортой байдал',
    title: 'Хариуцлагатай хайгуул, орон нутагтайгаа хамт.',
    metrics: 'Тоо баримтаар',
    approach: 'Бидний арга барил',
    commitments: 'Бидний баримталдаг стандарт',
    engagementEyebrow: 'Талуудын оролцоо',
    engagementHeading: 'Бид хэрхэн хамтран ажилладаг вэ — алхам алхмаар',
    environmentEyebrow: 'Байгаль орчны хариуцлага',
    environmentHeading: 'Хайгуул хийж буй газраа хамгаалах нь',
    sraEyebrow: 'Талуудын оролцоо',
    sraHeading: 'Нийгмийн хариуцлагын гэрээ, байршлаар',
    investmentEyebrow: 'Орон нутгийн хөрөнгө оруулалт',
    investmentHeading: 'Орон нутагтаа хөрөнгө оруулах нь',
    storiesEyebrow: 'Орон нутгийн түүхүүд',
    storiesHeading: 'Нутгийн иргэд, орон нутаг',
    gallery: 'Хээрээс',
    reports: 'Тайлан ба нээлттэй мэдээлэл',
  },
} as const;

export default async function EsgPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);
  const labels = LABELS[locale];

  return (
    <main id="main-content">
      <section className="relative -mt-24 flex min-h-[60vh] w-full flex-col justify-end overflow-hidden bg-primary text-white">
        {esg.hero_image ? (
          <Image src={esg.hero_image} alt="" fill priority className="object-cover object-bottom" sizes="100vw" />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="relative px-6 pb-14 pt-36 sm:px-10 lg:px-16">
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/75">{labels.eyebrow}</p>
          <h1 className="mt-5 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {esg.hero_headline || labels.title}
          </h1>
          {esg.hero_subline ? (
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/80">{esg.hero_subline}</p>
          ) : null}
        </div>
      </section>

      <EsgMetrics items={esg.metrics ?? []} eyebrow={labels.metrics} />

      <EsgApproach
        eyebrow={labels.approach}
        body={esg.approach_body}
        principles={esg.principles ?? []}
        commitmentsEyebrow={labels.commitments}
        commitments={esg.commitments ?? []}
      />

      <EngagementSteps steps={esg.engagement_steps ?? []} eyebrow={labels.engagementEyebrow} heading={labels.engagementHeading} />

      <EnvironmentStewardship
        eyebrow={labels.environmentEyebrow}
        heading={labels.environmentHeading}
        body={esg.environment.body}
        image={esg.environment.image}
        topics={esg.environment.topics ?? []}
      />

      {/* Social Responsibility Agreements by-location section (Yesunbulag soum,
          Taishir soum, and others) — temporarily hidden per client request.
          Restore by uncommenting this block (and the SraLocations import). */}
      {/* <SraLocations
        eyebrow={labels.sraEyebrow}
        heading={labels.sraHeading}
        body={esg.community.body}
        image={esg.community.image}
        locations={esg.sra_locations ?? []}
      /> */}

      <LocalInvestment
        eyebrow={labels.investmentEyebrow}
        heading={labels.investmentHeading}
        body={esg.investment?.body ?? ''}
        categories={esg.investment?.categories ?? []}
      />

      <CommunityStories
        eyebrow={labels.storiesEyebrow}
        heading={labels.storiesHeading}
        intro={esg.stories_intro ?? ''}
        stories={esg.stories ?? []}
      />

      <EsgGallery items={esg.gallery ?? []} heading={labels.gallery} />

      <section className="bg-primary text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/55">{labels.reports}</p>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/75">{esg.reports_intro}</p>
      </section>
    </main>
  );
}
