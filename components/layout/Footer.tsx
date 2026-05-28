import Link from 'next/link';
import type { FooterSettings } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function Footer({ settings, locale }: { settings: FooterSettings; locale: Locale }) {
  const year = new Date().getFullYear();

  const brandLine = locale === 'mn' ? 'Монгол дахь чухал ашигт малтмалын нээлт.' : 'Critical mineral discoveries in Mongolia.';

  return (
    <footer className="bg-ink text-white">
      <div className="grid gap-x-12 gap-y-10 px-6 py-14 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:px-16 lg:py-16">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-white/55">Azzoro Resources</p>
          <h2 className="mt-4 max-w-[20ch] font-display text-balance text-2xl font-medium leading-[1.1] tracking-[-0.01em] sm:text-3xl">
            {brandLine}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-white/65">{settings.tagline}</p>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.32em] text-white/45">ASX: AZ9</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {settings.link_columns.map((column) => (
            <div key={column.heading}>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">{column.heading}</p>
              <ul className="mt-5 space-y-3 text-[15px] text-white/80">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={localizeHref(locale, link.href)} className="transition-colors hover:text-white">
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

      <div className="border-t border-white/15">
        <div className="flex flex-col gap-4 px-6 py-7 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <p>
            © {year} {settings.copyright_holder}.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {settings.legal_links.map((link) => (
              <Link key={link.label} href={localizeHref(locale, link.href)} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}