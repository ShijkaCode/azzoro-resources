import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { FeaturedProject } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function FeaturedProjectSection({
  project,
  locale,
  mirrored,
}: {
  project: FeaturedProject;
  locale: Locale;
  mirrored: boolean;
}) {
  const isExternal = /^https?:\/\//.test(project.cta_href);
  const ctaHref = isExternal ? project.cta_href : localizeHref(locale, project.cta_href);

  return (
    <section className="bg-paper text-ink">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Media column — first on mobile; moves to the right on desktop when mirrored */}
        <div className={`flex flex-col ${mirrored ? 'border-rule lg:order-2 lg:border-l' : ''}`}>
          <div className="relative aspect-[4/3] lg:aspect-[16/9]">
            <Image
              src={project.image}
              alt={project.image_alt || project.headline}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {project.thumbnails?.length ? (
            <ul className="grid grid-cols-3">
              {project.thumbnails.map((thumb) => (
                <li key={thumb.image} className="group relative aspect-square overflow-hidden">
                  <Image
                    src={thumb.image}
                    alt={thumb.alt || thumb.caption || project.headline}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                  {thumb.caption ? (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="font-display text-lg leading-tight text-white px-4 pb-4 sm:px-6 sm:pb-6 sm:text-xl">
                        {thumb.caption}
                      </p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className={`flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20 ${
            mirrored ? 'lg:order-1' : 'border-rule lg:border-l'
          }`}
        >
          {project.eyebrow ? (
            <p className="kicker">{project.eyebrow}</p>
          ) : null}
          <h2 className="mt-5 max-w-[18ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {project.headline}
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-soft sm:text-lg">{project.lead}</p>

          {project.stats?.length ? (
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-rule pt-8">
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="num-display text-4xl font-medium leading-none text-ink sm:text-5xl">{stat.value}</dt>
                  <dd className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">{stat.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {project.cta_label ? (
            isExternal ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noreferrer"
                className="cta-link mt-10"
              >
                {project.cta_label}
                <span aria-hidden="true" className="cta-arrow">↗</span>
              </a>
            ) : (
              <Link
                href={ctaHref}
                className="cta-link mt-10"
              >
                {project.cta_label}
                <span aria-hidden="true" className="cta-arrow">→</span>
              </Link>
            )
          ) : null}

          {project.footnote ? (
            <p className="mt-8 max-w-prose text-[11px] leading-relaxed text-muted-ink">{project.footnote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
