import type { TeamMember } from '@/lib/content/types';
import { TeamMemberCard } from './TeamMemberCard';

type TeamGridProps = {
  members: TeamMember[];
  section: 'Board' | 'Technical';
  heading: string;
  locale?: 'en' | 'mn';
  columns?: 4 | 6;
};

export function TeamGrid({ members, section, heading, locale = 'en', columns = 4 }: TeamGridProps) {
  const filtered = members
    .filter((member) => member.team_section === section)
    .sort((left, right) => left.order - right.order);

  if (filtered.length === 0) {
    return null;
  }

  const compact = columns === 6;
  const gridClass = compact
    ? 'grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6'
    : 'grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4';

  return (
    <section>
      <span aria-hidden="true" className="mb-5 block h-0.5 w-10 bg-[hsl(var(--copper))]" />
      <h2 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{heading}</h2>
      <div className={`mt-10 ${gridClass}`}>
        {filtered.map((member) => (
          <TeamMemberCard key={member.slug} member={member} locale={locale} compact={compact} />
        ))}
      </div>
    </section>
  );
}
