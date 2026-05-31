import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { HomeContent, TeamMember } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

const EYEBROW: Record<Locale, string> = {
  en: 'Leadership & governance',
  mn: 'Удирдлага ба засаглал',
};

export default function FooterCards({
  locale,
  leadership,
  team,
}: {
  locale: Locale;
  leadership: HomeContent['leadership_teaser'];
  team: TeamMember[];
}) {
  const directors = team.filter((member) => member.team_section === 'Board').sort((a, b) => a.order - b.order);
  const eyebrow = EYEBROW[locale] ?? EYEBROW.en;

  return (
    <section className="bg-primary text-white">
      <div className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker kicker-invert">{eyebrow}</p>
            <h2 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
              {leadership.heading}
            </h2>
            <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-white/75 sm:text-lg">{leadership.body}</p>
          </div>
          <Link
            href={localizeHref(locale, leadership.cta_href)}
            className="cta-link cta-link-invert"
          >
            {leadership.cta_label}
            <span aria-hidden="true" className="cta-arrow">→</span>
          </Link>
        </div>

        {directors.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-10">
            {directors.map((director) => (
              <article key={director.slug} className="flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.04]">
                  {director.photo ? (
                    <Image
                      src={director.photo}
                      alt={director.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <h3 className="mt-5 font-display text-xl font-medium leading-tight text-white sm:text-2xl">{director.name}</h3>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{director.role}</p>
                {director.home_credential ? (
                  <p className="mt-4 text-[14px] leading-relaxed text-white/65">{director.home_credential}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
