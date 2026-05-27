'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { Project } from '@/lib/content/types';
import { colorForCommodity, textColorForCommodity } from '@/lib/map/markers';
import { localizeHref } from '@/lib/i18n/pathname';

type ProjectSidePanelProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectSidePanel({ project, onClose }: ProjectSidePanelProps) {
  const locale = useLocale();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-label={project.title}
      className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto border-l border-border bg-background/95 shadow-2xl backdrop-blur md:max-w-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project details"
        className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 text-foreground transition hover:bg-background"
      >
        <X className="h-4 w-4" />
      </button>
      {project.hero_image ? (
        <div className="relative h-48 w-full">
          <Image src={project.hero_image} alt={project.title} fill className="object-cover" sizes="448px" />
        </div>
      ) : null}
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.commodity.map((commodity) => (
            <span
              key={commodity}
              className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: colorForCommodity(commodity), color: textColorForCommodity(commodity) }}
            >
              {commodity}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.region} · {project.status}
        </p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.summary}</p>
        <Link
          href={localizeHref(locale as 'en' | 'mn', `/projects/${project.slug}`)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
        >
          View full project →
        </Link>
      </div>
    </aside>
  );
}