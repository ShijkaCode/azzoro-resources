import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="container-wide py-16 sm:py-20">
      <article className="prose prose-slate max-w-3xl">
        <p className="section-kicker not-prose">Legal</p>
        <h1>Privacy</h1>
        <p>This foundation release includes a placeholder privacy page so legal links resolve during the migration.</p>
      </article>
    </main>
  );
}