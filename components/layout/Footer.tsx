import Link from 'next/link';
import type { FooterSettings } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function Footer({ settings, locale }: { settings: FooterSettings; locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-navy-dark text-white">
      <div className="container-wide grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:py-20">
        <div>
          <p className="section-kicker text-sky-line">Azzuro Resources</p>
          <h2 className="mt-5 max-w-2xl text-balance text-4xl font-semibold sm:text-5xl">
            Discover, develop, and communicate the next phase of the corporate site.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/68">{settings.tagline}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {settings.link_columns.map((column) => (
            <div key={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">{column.heading}</p>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={localizeHref(locale, link.href)} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col gap-4 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.copyright_holder}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {settings.legal_links.map((link) => (
              <Link key={link.label} href={localizeHref(locale, link.href)} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}