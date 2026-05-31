import type { Metadata } from 'next';
import { MediaImage as Image } from '@/components/shared/MediaImage';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { GovernanceList } from '@/components/about/GovernanceList';
import { TeamGrid } from '@/components/about/TeamGrid';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { AboutContent, GovernanceDocument, TeamMember } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const about = await loadSingleton<AboutContent>('pages/about', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Azzoro Resources-ийн тухай' : 'About Azzoro Resources',
    description: about.mission,
    locale,
    path: '/about',
  });
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [about, team, governance] = await Promise.all([
    loadSingleton<AboutContent>('pages/about', locale),
    loadCollection<TeamMember>('team', locale),
    loadCollection<GovernanceDocument>('governance', locale),
  ]);

  const labels =
    locale === 'mn'
      ? {
          kicker: 'Бидний тухай',
          title: 'Azzoro Resources-ийн тухай',
          mission: 'Эрхэм зорилго',
          governance: 'Манлайлал ба засаглал',
          board: 'Төлөөлөн удирдах зөвлөл',
          technical: 'Удирдлага ба техникийн баг',
        }
      : {
          kicker: 'About us',
          title: 'About Azzoro Resources',
          mission: 'Mission',
          governance: 'Leadership & Governance',
          board: 'Board of Directors',
          technical: 'Management & Technical Team',
        };

  return (
    <main id="main-content">
      <section className="-mt-24 bg-ink text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-end px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16 lg:pb-24">
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{labels.kicker}</p>
            <h1 className="mt-6 max-w-[16ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
              {labels.title}
            </h1>
          </div>
          <div className="relative min-h-[44vh] w-full lg:min-h-[68vh]">
            {about.hero_image ? (
              <Image
                src={about.hero_image}
                alt={labels.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : null}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <MarkdownBody className="max-w-[60ch] prose-p:text-lg">{about.story_body}</MarkdownBody>
          <div className="border-t-2 border-ink pt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-ink">{labels.mission}</p>
            <p className="mt-5 font-display text-2xl font-medium leading-snug text-ink">{about.mission}</p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 border-l border-t border-rule md:grid-cols-3">
          {about.values.map((value) => (
            <article key={value.title} className="border-b border-r border-rule px-6 py-8 sm:px-8 sm:py-10">
              <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">{value.title}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
        <div className="space-y-20">
          <TeamGrid members={team} section="Board" heading={labels.board} locale={locale} columns={4} />
          <TeamGrid members={team} section="Technical" heading={labels.technical} locale={locale} columns={6} />
        </div>
      </section>

      <section id="governance" className="bg-ink text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">{labels.governance}</p>
            <MarkdownBody className="mt-6 max-w-[44ch] prose-p:text-white/75 prose-headings:text-white prose-strong:text-white">
              {about.leadership_governance_body}
            </MarkdownBody>
          </div>
          <div className="rounded-none bg-white p-8 text-ink sm:p-10">
            {about.governance_documents_intro ? (
              <p className="mb-8 max-w-2xl text-[14px] leading-relaxed text-ink/65">{about.governance_documents_intro}</p>
            ) : null}
            <GovernanceList documents={governance} locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}