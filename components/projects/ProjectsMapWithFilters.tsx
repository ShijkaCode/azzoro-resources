'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { Project } from '@/lib/content/types';

const ClientProjectsMap = dynamic(() => import('./ProjectsMap').then((module) => module.ProjectsMap), {
  ssr: false,
  loading: () => <div className="h-[70vh] min-h-[32rem] animate-pulse rounded-[1.75rem] bg-muted" />,
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

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCommodity(null)}
          className={[
            'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
            activeCommodity === null
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:bg-muted',
          ].join(' ')}
        >
          All
        </button>
        {allCommodities.map((commodity) => (
          <button
            key={commodity}
            type="button"
            onClick={() => setActiveCommodity(commodity)}
            className={[
              'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
              activeCommodity === commodity
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted',
            ].join(' ')}
          >
            {commodity}
          </button>
        ))}
      </div>
      <ClientProjectsMap projects={filteredProjects} />
    </div>
  );
}