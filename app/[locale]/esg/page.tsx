import Image from 'next/image';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { EsgContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export default async function EsgPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const esg = await loadSingleton<EsgContent>('pages/esg', locale);

  const labels =
    locale === 'mn'
      ? {
          title: 'Тогтвортой байдал',
          environment: 'Байгаль орчин',
          community: 'Орон нутгийн оролцоо',
          reports: 'Тайлан ба нээлттэй мэдээлэл',
        }
      : {
          title: 'ESG',
          environment: 'Environment',
          community: 'Community',
          reports: 'Reports & disclosures',
        };

  return (
    <main className="container-wide py-16 sm:py-20">
      {esg.hero_image ? (
        <section className="relative mb-12 overflow-hidden rounded-[2rem]">
          <div className="relative h-[40vh] min-h-[18rem] w-full">
            <Image src={esg.hero_image} alt="" fill priority className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent" />
          <div className="container-wide absolute inset-x-0 bottom-0 pb-10 text-white">
            <p className="section-kicker text-sky-line">{labels.title}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">Sustainability approach and operating context</h1>
          </div>
        </section>
      ) : null}

      <section className="surface-card p-8 sm:p-10 lg:p-12">
        <p className="section-kicker">{labels.title}</p>
        <MarkdownBody className="mt-4 max-w-3xl text-lg leading-8">{esg.approach_body}</MarkdownBody>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <article className="surface-card overflow-hidden p-6 sm:p-8">
          {esg.environment.image ? (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-[1.25rem]">
              <Image src={esg.environment.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          ) : null}
          <p className="section-kicker">{labels.environment}</p>
          <MarkdownBody className="mt-4">{esg.environment.body}</MarkdownBody>
        </article>
        <article className="surface-card overflow-hidden p-6 sm:p-8">
          {esg.community.image ? (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-[1.25rem]">
              <Image src={esg.community.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          ) : null}
          <p className="section-kicker">{labels.community}</p>
          <MarkdownBody className="mt-4">{esg.community.body}</MarkdownBody>
        </article>
      </section>

      <section className="mt-12 surface-card p-8 sm:p-10">
        <p className="section-kicker">{labels.reports}</p>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{esg.reports_intro}</p>
      </section>
    </main>
  );
}