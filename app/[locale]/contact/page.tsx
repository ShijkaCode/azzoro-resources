import type { Metadata } from 'next';
import { OfficeCard } from '@/components/contact/OfficeCard';
import { loadGlobal } from '@/lib/content/loadGlobal';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { ContactContent, SiteSettings } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  if (!isLocale(locale)) {
    return {};
  }

  const contact = await loadSingleton<ContactContent>('pages/contact', locale);

  return buildPageMetadata({
    title: locale === 'mn' ? 'Холбоо барих' : 'Contact',
    description: contact.intro_body,
    locale,
    path: '/contact',
  });
}

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [contact, site] = await Promise.all([
    loadSingleton<ContactContent>('pages/contact', locale),
    loadGlobal<SiteSettings>('settings/site'),
  ]);

  const labels =
    locale === 'mn'
      ? {
          title: 'Холбоо барих',
          subtitle: 'Энэ хуудас нь зөвхөн мэдээллийн зориулалттай. Хөрөнгө оруулагчийн асуултыг investor portal руу чиглүүлнэ.',
          byPhone: 'Утсаар',
          byEmail: 'Имэйлээр',
          investorRelations: 'Хөрөнгө оруулагчийн харилцаа',
          investorRelationsHeading: 'Хөрөнгө оруулагчийн холбоо барих',
          investorTitle: 'Хөрөнгө оруулагчийн асуултад',
          investorBody: 'Хувьцааны мэдээлэл, танилцуулга, investor relations холбоосыг investor portal дээрээс үзнэ үү.',
          investorCta: 'Investor Center рүү очих',
        }
      : {
          title: 'Contact',
          subtitle: 'This page is informational only. Investor enquiries continue through the external investor portal.',
          byPhone: 'By phone',
          byEmail: 'By email',
          investorRelations: 'Investor Relations',
          investorRelationsHeading: 'Investor contacts',
          investorTitle: 'For investor inquiries',
          investorBody: 'Visit the investor portal for stock information, presentations, and dedicated IR updates.',
          investorCta: 'Visit Investor Center',
        };

  const officesLabel = locale === 'mn' ? 'Оффисууд' : 'Offices';
  const investorContacts = contact.investor_contacts ?? [];

  return (
    <main id="main-content">
      <section className="-mt-24 bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">{labels.title}</p>
          <h1 className="mt-6 max-w-[20ch] font-display text-balance text-4xl font-medium leading-[1.02] tracking-[-0.01em] sm:text-5xl lg:text-[3.75rem]">
            {labels.title}
          </h1>
          <p className="mt-7 max-w-[60ch] text-base leading-relaxed text-white/75 sm:text-lg">{contact.intro_body || labels.subtitle}</p>
        </div>
      </section>

      <section className="bg-paper px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <p className="kicker">{officesLabel}</p>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contact.offices.map((office) => (
            <OfficeCard key={office.name} office={office} />
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 border-t border-rule pt-12 sm:grid-cols-2">
          <div>
            <p className="kicker">{labels.byPhone}</p>
            <div className="mt-6 border-t border-rule">
              {contact.phone_groups.map((group) => (
                <div key={group.category} className="border-b border-rule py-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-ink">{group.category}</p>
                  <div className="mt-4 space-y-3">
                    {group.numbers.map((number) => (
                      <div key={`${group.category}-${number.label}`} className="flex items-baseline justify-between gap-4">
                        <span className="text-base text-ink/65">{number.label}</span>
                        <a
                          href={`tel:${number.number.replace(/\s+/g, '')}`}
                          className="num-tabular text-base font-medium text-ink transition-colors hover:text-[hsl(var(--copper))]"
                        >
                          {number.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="kicker">{labels.byEmail}</p>
            <a
              href={`mailto:${contact.general_email}`}
              className="mt-6 inline-flex w-fit items-center border-b border-ink/40 pb-1 font-display text-2xl font-medium text-ink transition-colors hover:border-[hsl(var(--copper))] sm:text-3xl"
            >
              {contact.general_email}
            </a>
          </div>
        </div>
      </section>

      {investorContacts.length > 0 ? (
        <section className="bg-paper px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
          <div className="border-t border-rule pt-12">
            <p className="kicker">{labels.investorRelations}</p>
            <h2 className="mt-6 max-w-[22ch] font-display text-3xl font-medium leading-tight sm:text-4xl">
              {labels.investorRelationsHeading}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {investorContacts.map((person) => (
                <article
                  key={person.name}
                  className="group relative flex flex-col border border-rule bg-white p-7 sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[hsl(var(--copper))] transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[hsl(var(--copper))]">
                    {person.role}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium text-ink sm:text-[1.75rem]">
                    {person.name}
                  </h3>
                  {person.email ? (
                    <a
                      href={`mailto:${person.email}`}
                      className="mt-5 inline-flex w-fit items-center border-b border-ink/40 pb-0.5 text-[14px] font-medium text-ink transition-colors hover:border-[hsl(var(--copper))]"
                    >
                      {person.email}
                    </a>
                  ) : null}
                  {person.phones && person.phones.length > 0 ? (
                    <div className="mt-6 space-y-2 border-t border-rule pt-5">
                      {person.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                          className="num-tabular block text-[15px] font-medium text-ink transition-colors hover:text-[hsl(var(--copper))]"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-primary text-white px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="max-w-[18ch] font-display text-3xl font-medium leading-tight sm:text-4xl">{labels.investorTitle}</h2>
            <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/75">{labels.investorBody}</p>
          </div>
          <a
            href={site.investor_portal_url}
            target="_blank"
            rel="noreferrer"
            className="cta-link cta-link-invert"
          >
            {labels.investorCta}
            <span aria-hidden="true" className="cta-arrow">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}
