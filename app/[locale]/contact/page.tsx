import type { Metadata } from 'next';
import { OfficeCard } from '@/components/contact/OfficeCard';
import { PhoneDropdown } from '@/components/contact/PhoneDropdown';
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
          investorTitle: 'Хөрөнгө оруулагчийн асуултад',
          investorBody: 'Хувьцааны мэдээлэл, танилцуулга, investor relations холбоосыг investor portal дээрээс үзнэ үү.',
          investorCta: 'Investor Center рүү очих',
        }
      : {
          title: 'Contact',
          subtitle: 'This page is informational only. Investor enquiries continue through the external investor portal.',
          byPhone: 'By phone',
          byEmail: 'By email',
          investorTitle: 'For investor inquiries',
          investorBody: 'Visit the investor portal for stock information, presentations, and dedicated IR updates.',
          investorCta: 'Visit Investor Center',
        };

  const officesLabel = locale === 'mn' ? 'Оффисууд' : 'Offices';

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
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 border-t border-rule pt-12 lg:grid-cols-2">
          <div>
            <p className="kicker">{labels.byPhone}</p>
            <div className="mt-6">
              <PhoneDropdown groups={contact.phone_groups} />
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