'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { Project } from '@/lib/content/types';

const ClientProjectsMap = dynamic(() => import('./ProjectsMap').then((module) => module.ProjectsMap), {
  ssr: false,
  loading: () => <div className="h-[70vh] min-h-[32rem] animate-pulse border border-rule bg-muted" />,
});

type ProjectsMapWithFiltersProps = {
  projects: Project[];
};

export function ProjectsMapWithFilters({ projects }: ProjectsMapWithFiltersProps) {
  const [activeCommodity, setActiveCommodity] = useState<string | null>(null);

  const allCommodities = useMemo(() => {
    const items = new Set<string>();
    projects.forEach((project) => project.commodity.forEach((commodity) => items.add(commodity)));
    return Array.from(items).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!activeCommodity) {
      return projects;
    }

    return projects.filter((project) => project.commodity.includes(activeCommodity));
  }, [activeCommodity, projects]);

  const buttonClass = (active: boolean) =>
    [
      'border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.28em] transition-colors',
      active ? 'border-ink bg-ink text-white' : 'border-rule bg-white text-ink hover:bg-paper',
    ].join(' ');

  return (
    <div>
      <div className="mb-px flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveCommodity(null)} className={buttonClass(activeCommodity === null)}>
          All
        </button>
        {allCommodities.map((commodity) => (
          <button
            key={commodity}
            type="button"
            onClick={() => setActiveCommodity(commodity)}
            className={buttonClass(activeCommodity === commodity)}
          >
            {commodity}
          </button>
        ))}
      </div>
      <ClientProjectsMap projects={filteredProjects} />
    </div>
  );
}