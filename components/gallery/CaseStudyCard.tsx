import Image from 'next/image';
import Link from 'next/link';
import type { CaseStudy } from '@/lib/content/types';
import { localizeHref } from '@/lib/i18n/pathname';

export function CaseStudyCard({ study, locale }: { study: CaseStudy; locale: 'en' | 'mn' }) {
  return (
    <Link
      href={localizeHref(locale, `/gallery/case-studies/${study.slug}`)}
      className="group block overflow-hidden rounded-[1.5rem] border border-border bg-background transition hover:-translate-y-0.5 hover:border-primary"
    >
      <div className="relative aspect-[4/3]">
        <Image src={study.hero_image} alt={study.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{new Date(study.date).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-AU')}</div>
        <h3 className="mt-2 text-lg font-semibold">{study.title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{study.summary}</p>
      </div>
    </Link>
  );
}