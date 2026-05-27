'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';
import { switchLocaleInPath } from '@/lib/i18n/pathname';

export default function LanguageToggle() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const nextLocale = currentLocale === 'en' ? 'mn' : 'en';

  return (
    <Link
      href={switchLocaleInPath(pathname, nextLocale)}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      <span className={currentLocale === 'en' ? 'text-white' : 'text-white/75'}>EN</span>
      <span className="text-white/55">/</span>
      <span className={currentLocale === 'mn' ? 'text-white' : 'text-white/75'}>MN</span>
    </Link>
  );
}