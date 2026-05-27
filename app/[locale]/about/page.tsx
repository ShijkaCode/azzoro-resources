import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadCollection } from '@/lib/content/loadCollection';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { AboutContent, TeamMember } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [about, team] = await Promise.all([
    loadSingleton<AboutContent>('pages/about', locale),
    loadCollection<TeamMember>('team', locale),
  ]);

  const board = team.filter((member) => member.team_section === 'Board');
  const technical = team.filter((member) => member.team_section === 'Technical');

  return (
    <main className="container-wide py-16 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-5">
          <p className="section-kicker">About us</p>
          <h1 className="text-balance text-4xl font-semibold sm:text-5xl">Building the bilingual corporate shell</h1>
          <p className="max-w-3xl whitespace-pre-line text-lg leading-8 text-muted-foreground">{about.story_body}</p>
        </div>
        <div className="surface-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Mission</p>
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

      <section className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="section-kicker">Board</p>
          <div className="mt-6 grid gap-4">
            {board.map((member) => (
              <article key={member.slug} className="surface-card p-5">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-primary">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="section-kicker">Technical team</p>
          <div className="mt-6 grid gap-4">
            {technical.map((member) => (
              <article key={member.slug} className="surface-card p-5">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-primary">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 surface-card p-8">
        <p className="section-kicker">Governance</p>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">{about.leadership_governance_body}</p>
      </section>
    </main>
  );
}