import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import { MarkdownBody } from '@/components/shared/MarkdownBody';
import type { InvestorCommunicationContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const COPY = {
  en: { address: 'Address', email: 'Email', website: 'Website', seeAlso: 'Office locations and general enquiries' },
  mn: { address: 'Хаяг', email: 'Имэйл', website: 'Вэбсайт', seeAlso: 'Оффисын байршил, ерөнхий лавлагаа' },
} as const;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  if (!isLocale(locale)) return {};
  const content = await loadSingleton<InvestorCommunicationContent>('pages/investor-communication', locale);
  return buildPageMetadata({
    title: content.headline,
    description: content.intro ?? content.listing_statements[0],
    locale,
    path: '/investor-communication',
  });
}

export default async function InvestorCommunicationPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const content = await loadSingleton<InvestorCommunicationContent>('pages/investor-communication', locale);
  const labels = COPY[locale];

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="-mt-24 bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">{content.eyebrow}</p>
          <h1 className="mt-6 max-w-[26ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]">
            {content.headline}
          </h1>
          {content.intro ? (
            <p className="mt-7 max-w-[60ch] text-base leading-relaxed text-white/75 sm:text-lg">
              {content.intro}
            </p>
          ) : null}
        </div>
      </section>

      {/* Listing information */}
      <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker">{content.listing_heading}</p>
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {content.listing_statements.map((statement, idx) => (
            <div key={idx} className="border-t border-rule pt-6">
              <span className="num-display text-[hsl(var(--copper))] text-[13px] font-medium uppercase tracking-[0.28em]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 max-w-[44ch] font-display text-2xl font-medium leading-snug text-ink sm:text-[1.625rem]">
                {statement}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Registries */}
      <section className="border-t border-rule bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker">{content.registries_heading}</p>
        <div className="mt-10 max-w-[60ch]">
          <MarkdownBody className="prose-p:text-ink/75">{content.registries_intro}</MarkdownBody>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {content.registries.map((registry) => (
            <article
              key={registry.name}
              className="group relative flex flex-col border border-rule bg-white"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <div className="border-b border-rule p-7 sm:p-8">
                {registry.section_label ? (
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                    {registry.section_label}
                  </p>
                ) : null}
                <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-ink sm:text-[1.625rem]">
                  {registry.name}
                </h3>
              </div>

              <dl className="flex flex-1 flex-col divide-y divide-rule text-[14px] text-ink/80">
                {registry.address ? (
                  <div className="px-7 py-5 sm:px-8">
                    <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                      {labels.address}
                    </dt>
                    <dd className="mt-2 whitespace-pre-line not-italic leading-relaxed">{registry.address}</dd>
                  </div>
                ) : null}
                {registry.email ? (
                  <div className="px-7 py-5 sm:px-8">
                    <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                      {labels.email}
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${registry.email}`}
                        className="inline-flex w-fit items-center border-b border-ink/40 pb-0.5 font-medium text-ink transition-colors hover:border-[hsl(var(--copper))]"
                      >
                        {registry.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {registry.website_url ? (
                  <div className="px-7 py-5 sm:px-8">
                    <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                      {labels.website}
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={registry.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit items-center border-b border-ink/40 pb-0.5 font-medium text-ink transition-colors hover:border-[hsl(var(--copper))]"
                      >
                        {registry.website_label ?? registry.website_url}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {registry.phones?.map((block, idx) => (
                  <div key={`${block.label ?? 'phones'}-${idx}`} className="px-7 py-5 sm:px-8">
                    {block.label ? (
                      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-ink">
                        {block.label}
                      </p>
                    ) : null}
                    <ul className={block.label ? 'mt-2 space-y-1.5' : 'space-y-1.5'}>
                      {block.numbers.map((number, numIdx) => (
                        <li key={numIdx} className="flex items-baseline gap-x-3">
                          <span className="num-tabular font-medium text-ink">{number.number}</span>
                          {number.label ? (
                            <span className="text-[12px] uppercase tracking-[0.2em] text-muted-ink">
                              {number.label}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Receiving documents */}
      <section className="bg-primary text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker kicker-invert">{content.receiving_heading}</p>
        <div className="mt-8 max-w-[60ch]">
          <MarkdownBody className="prose-invert prose-p:text-white/75 prose-strong:text-white">
            {content.receiving_body}
          </MarkdownBody>
        </div>
      </section>

      {/* Shareholders' rights */}
      <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker">{content.rights_heading}</p>
        <div className="mt-8 max-w-[68ch]">
          <MarkdownBody>{content.rights_body}</MarkdownBody>
        </div>
      </section>

      {/* Contacts */}
      <section className="bg-primary text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker kicker-invert">{content.contacts_heading}</p>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.contacts.map((contact) => (
            <article
              key={contact.name}
              className="group relative border border-white/15 p-7 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">
                {contact.role}
              </p>
              <h3 className="mt-4 font-display text-2xl font-medium leading-tight text-white sm:text-[1.625rem]">
                {contact.name}
              </h3>
              <div className="mt-6 space-y-3 text-[14px] text-white/75">
                {contact.phone ? (
                  <p>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="num-tabular inline-flex items-center border-b border-white/30 pb-0.5 transition-colors hover:border-[hsl(var(--copper))] hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </p>
                ) : null}
                {contact.email ? (
                  <p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center border-b border-white/30 pb-0.5 transition-colors hover:border-[hsl(var(--copper))] hover:text-white"
                    >
                      {contact.email}
                    </a>
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 border-t border-white/15 pt-8">
          <Link
            href={localizeHref(locale, '/contact')}
            className="cta-link cta-link-invert"
          >
            {labels.seeAlso}
            <span aria-hidden="true" className="cta-arrow">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
