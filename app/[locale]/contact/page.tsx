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
          investorCta: 'Investor Center рүү очих ↗',
        }
      : {
          title: 'Contact',
          subtitle: 'This page is informational only. Investor enquiries continue through the external investor portal.',
          byPhone: 'By phone',
          byEmail: 'By email',
          investorTitle: 'For investor inquiries',
          investorBody: 'Visit the investor portal for stock information, presentations, and dedicated IR updates.',
          investorCta: 'Visit Investor Center ↗',
        };

  return (
    <main id="main-content" className="container-wide py-16 sm:py-20">
      <section className="surface-card p-8 sm:p-10 lg:p-12">
        <p className="section-kicker">{labels.title}</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">{labels.title}</h1>
        <p className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-muted-foreground">{contact.intro_body || labels.subtitle}</p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {contact.offices.map((office) => (
          <OfficeCard key={office.name} office={office} />
        ))}
      </section>

      <section className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="surface-card p-8">
          <p className="section-kicker">{labels.byPhone}</p>
          <div className="mt-6">
            <PhoneDropdown groups={contact.phone_groups} />
          </div>
        </div>
        <div className="surface-card p-8">
          <p className="section-kicker">{labels.byEmail}</p>
          <a href={`mailto:${contact.general_email}`} className="mt-6 inline-flex text-lg font-semibold text-primary transition hover:text-primary/80">
            {contact.general_email}
          </a>
        </div>
      </section>

      <section className="mt-12 rounded-[1.75rem] border border-border bg-muted/60 p-8 text-center sm:p-10">
        <p className="text-lg font-semibold">{labels.investorTitle}</p>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{labels.investorBody}</p>
        <a
          href={site.investor_portal_url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {labels.investorCta}
        </a>
      </section>
    </main>
  );
}