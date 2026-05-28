'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { Locale } from '@/lib/i18n/config';
import { switchLocaleInPath } from '@/lib/i18n/pathname';

export default function LanguageToggle() {
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  return (
    <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.32em]">
      <Link
        href={currentLocale === 'en' ? pathname : switchLocaleInPath(pathname, 'en')}
        className={currentLocale === 'en' ? 'text-white' : 'text-white/55 transition-colors hover:text-white'}
        aria-current={currentLocale === 'en' ? 'true' : undefined}
      >
        EN
      </Link>
      <span aria-hidden="true" className="text-white/30">·</span>
      <Link
        href={currentLocale === 'mn' ? pathname : switchLocaleInPath(pathname, 'mn')}
        className={currentLocale === 'mn' ? 'text-white' : 'text-white/55 transition-colors hover:text-white'}
        aria-current={currentLocale === 'mn' ? 'true' : undefined}
      >
        MN
      </Link>
    </div>
  );
}
