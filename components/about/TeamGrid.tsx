import type { TeamMember } from '@/lib/content/types';
import { TeamMemberCard } from './TeamMemberCard';

type TeamGridProps = {
  members: TeamMember[];
  section: 'Board' | 'Technical';
  heading: string;
};

export function TeamGrid({ members, section, heading }: TeamGridProps) {
  const filtered = members
    .filter((member) => member.team_section === section)
    .sort((left, right) => left.order - right.order);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-semibold">{heading}</h2>
      <div className="mt-8 grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((member) => (
          <TeamMemberCard key={member.slug} member={member} />
        ))}
      </div>
    </section>
  );
}