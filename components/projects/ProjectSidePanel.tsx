'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
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
      className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto border-l border-rule bg-white md:max-w-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project details"
        className="absolute right-4 top-4 z-10 border border-rule bg-white p-2 text-ink transition-colors hover:bg-paper"
      >
        <X className="h-4 w-4" />
      </button>
      {project.hero_image ? (
        <div className="relative h-56 w-full">
          <Image src={project.hero_image} alt={project.title} fill className="object-cover" sizes="448px" />
        </div>
      ) : null}
      <div className="p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.commodity.map((commodity) => (
            <span
              key={commodity}
              className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ backgroundColor: colorForCommodity(commodity), color: textColorForCommodity(commodity) }}
            >
              {commodity}
            </span>
          ))}
        </div>
        <h2 className="font-display text-2xl font-medium leading-tight text-ink">{project.title}</h2>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
          {project.region} · {project.status}
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-ink/70">{project.summary}</p>
        <Link
          href={localizeHref(locale as 'en' | 'mn', `/projects/${project.slug}`)}
          className="mt-7 inline-flex w-fit items-center gap-3 border-b border-ink/40 pb-1 text-[12px] font-medium uppercase tracking-[0.32em] text-ink transition-colors hover:border-ink"
        >
          View full project
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}