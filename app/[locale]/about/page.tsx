import type { Metadata } from 'next';
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
          technical: 'Техникийн баг',
        }
      : {
          kicker: 'About us',
          title: 'About Azzoro Resources',
          mission: 'Mission',
          governance: 'Leadership & Governance',
          board: 'Board of Directors',
          technical: 'Technical Team',
        };

  return (
    <main id="main-content" className="container-wide py-16 sm:py-20">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <p className="section-kicker">{labels.kicker}</p>
          <h1 className="text-balance text-4xl font-semibold sm:text-5xl">{labels.title}</h1>
          <MarkdownBody className="max-w-3xl text-lg leading-8">{about.story_body}</MarkdownBody>
        </div>
        <div className="surface-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{labels.mission}</p>
          <p className="mt-4 text-lg leading-8 text-foreground">{about.mission}</p>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {about.values.map((value) => (
          <article key={value.title} className="surface-card p-6">
            <h2 className="text-xl font-semibold">{value.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.body}</p>
          </article>
        ))}
      </section>

      <TeamGrid members={team} section="Board" heading={labels.board} />
      <TeamGrid members={team} section="Technical" heading={labels.technical} />

      <section className="mt-16 surface-card p-8">
        <p className="section-kicker">{labels.governance}</p>
        <MarkdownBody className="mt-4">{about.leadership_governance_body}</MarkdownBody>
      </section>

      <section id="governance" className="mt-16">
        {about.governance_documents_intro ? (
          <p className="mb-8 max-w-3xl text-base leading-8 text-muted-foreground">{about.governance_documents_intro}</p>
        ) : null}
        <GovernanceList documents={governance} locale={locale} />
      </section>
    </main>
  );
}