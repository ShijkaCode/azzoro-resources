import { MediaImage as Image } from '@/components/shared/MediaImage';
import type { Project } from '@/lib/content/types';

export function ProjectDetailHero({ project, locale }: { project: Project; locale: 'en' | 'mn' }) {
  const flagshipLabel = locale === 'mn' ? 'Гол төсөл' : 'Flagship';

  return (
    <section className="relative -mt-24 flex min-h-[68vh] w-full flex-col justify-end overflow-hidden bg-ink text-white">
      {project.hero_image ? (
        <Image src={project.hero_image} alt={project.title} fill priority className="object-cover" sizes="100vw" />
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

      <div className="relative px-6 pb-12 pt-36 sm:px-10 sm:pb-16 lg:px-16">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {project.is_flagship ? (
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">{flagshipLabel}</span>
          ) : null}
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
            {project.commodity.join(' · ')}
          </span>
        </div>

        <h1 className="mt-5 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.0] tracking-[-0.015em] sm:text-6xl lg:text-7xl">
          {project.title}
        </h1>

        {project.tagline ? (
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-white/80 sm:text-lg">{project.tagline}</p>
        ) : null}

        <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.28em] text-white/55">
          {project.region} · {project.status}
        </p>
      </div>
    </section>
  );
}
