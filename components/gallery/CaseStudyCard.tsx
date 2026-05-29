import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import type { CaseStudy } from '@/lib/content/types';
import { localizeHref } from '@/lib/i18n/pathname';

export function CaseStudyCard({ study, locale }: { study: CaseStudy; locale: 'en' | 'mn' }) {
  const readLabel = locale === 'mn' ? 'Унших' : 'Read the story';
  return (
    <Link href={localizeHref(locale, `/gallery/case-studies/${study.slug}`)} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={study.hero_image}
          alt={study.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="num-tabular mt-5 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
        {new Date(study.date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU', { year: 'numeric', month: 'short' })}
      </div>
      <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-ink">{study.title}</h3>
      <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink/70">{study.summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.28em] text-ink/50 transition-colors group-hover:text-ink">
        {readLabel}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
