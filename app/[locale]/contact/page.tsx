import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { ContactContent } from '@/lib/content/types';
import { isLocale } from '@/lib/i18n/config';

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const contact = await loadSingleton<ContactContent>('pages/contact', locale);

  return (
    <main className="container-wide py-16 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card p-8 sm:p-10">
          <p className="section-kicker">Contact</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold sm:text-5xl">Informational contact route without a form</h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-muted-foreground">{contact.intro_body}</p>
          <a href={`mailto:${contact.general_email}`} className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            {contact.general_email}
          </a>
        </div>
        <div className="grid gap-5">
          {contact.offices.map((office) => (
            <article key={office.name} className="surface-card p-6">
              <h2 className="text-2xl font-semibold">{office.name}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{office.address}</p>
              {office.email ? (
                <a href={`mailto:${office.email}`} className="mt-5 inline-block text-sm font-semibold text-primary transition hover:text-primary/80">
                  {office.email}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 surface-card p-8 sm:p-10">
        <p className="section-kicker">Phone routing</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {contact.phone_groups.map((group) => (
            <article key={group.category} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h2 className="text-lg font-semibold">{group.category}</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {group.numbers.map((number) => (
                  <div key={`${group.category}-${number.label}`}>
                    <div className="font-medium text-foreground">{number.label}</div>
                    <a href={`tel:${number.number.replace(/\s+/g, '')}`} className="transition hover:text-primary">
                      {number.number}
                    </a>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}