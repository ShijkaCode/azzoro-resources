import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { loadSingleton } from '@/lib/content/loadSingleton';
import type { FooterSettings, NavSettings } from '@/lib/content/types';
import { isLocale, locales } from '@/lib/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, nav, footer] = await Promise.all([
    getMessages(),
    loadSingleton<NavSettings>('settings/nav', locale),
    loadSingleton<FooterSettings>('settings/footer', locale),
  ]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-background">
        <Navbar items={nav.items} locale={locale} />
        <div className="pt-24">{children}</div>
        <Footer settings={footer} locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}