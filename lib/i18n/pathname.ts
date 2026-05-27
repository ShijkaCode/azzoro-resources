import { isLocale, type Locale } from './config';

export function localizeHref(locale: Locale, href: string) {
  if (!href) {
    return `/${locale}`;
  }

  if (/^(https?:\/\/|mailto:|tel:|#)/.test(href)) {
    return href;
  }

  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) {
    return href;
  }

  if (href === '/en' || href.startsWith('/en/') || href === '/mn' || href.startsWith('/mn/')) {
    return href;
  }

  if (href === '/') {
    return `/${locale}`;
  }

  return `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
}

export function switchLocaleInPath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return `/${nextLocale}`;
  }

  if (isLocale(parts[0])) {
    parts[0] = nextLocale;
    return `/${parts.join('/')}`;
  }

  return `/${nextLocale}/${parts.join('/')}`;
}