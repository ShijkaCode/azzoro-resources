import Image from 'next/image';
import type { Project } from '@/lib/content/types';
import { colorForCommodity, textColorForCommodity } from '@/lib/map/markers';

export function ProjectDetailHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[60vh] min-h-[24rem] w-full overflow-hidden bg-navy-dark text-white">
      {project.hero_image ? (
        <Image src={project.hero_image} alt={project.title} fill priority className="object-cover" sizes="100vw" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/50 to-transparent" />
      <div className="container-wide absolute inset-x-0 bottom-0 pb-12">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.commodity.map((commodity) => (
            <span
              key={commodity}
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: colorForCommodity(commodity), color: textColorForCommodity(commodity) }}
            >
              {commodity}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-base text-white/80 sm:text-lg">
          {project.region} · {project.status}
        </p>
      </div>
    </section>
  );
}