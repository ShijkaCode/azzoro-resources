'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { switchLocaleInPath } from '@/lib/i18n/pathname';

export default function LanguageToggle() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;
  const otherLocale: Locale = currentLocale === 'en' ? 'mn' : 'en';

  return (
    <Link
      href={switchLocaleInPath(pathname, otherLocale)}
      aria-label={otherLocale === 'mn' ? 'Switch to Mongolian' : 'Switch to English'}
      className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.32em] text-white/85 transition-colors hover:text-white"
    >
      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
      {currentLocale.toUpperCase()}
    </Link>
  );
}
