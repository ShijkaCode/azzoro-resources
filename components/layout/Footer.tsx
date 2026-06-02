import Link from 'next/link';
import type { FooterSettings } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';

export default function Footer({
  settings,
  locale,
  social,
}: {
  settings: FooterSettings;
  locale: Locale;
  social?: { linkedin?: string; x?: string };
}) {
  const year = new Date().getFullYear();

  const brandLine = locale === 'mn' ? 'Монгол дахь чухал ашигт малтмалын нээлт.' : 'Critical mineral discoveries in Mongolia.';

  const socialLinkClass =
    'flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-[hsl(var(--copper))] hover:text-white';

  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="grid gap-x-12 gap-y-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:px-16 lg:py-12">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.24em] text-white/55">Azzuro Resources</p>
          <h2 className="mt-4 max-w-[20ch] font-display text-balance text-2xl font-medium leading-[1.1] tracking-[-0.01em] sm:text-3xl">
            {brandLine}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-white/65">{settings.tagline}</p>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-white/45">ASX: AZ9</p>

          {social && (social.linkedin || social.x) ? (
            <div className="mt-6 flex items-center gap-3">
              {social.linkedin ? (
                <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={socialLinkClass}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
              ) : null}
              {social.x ? (
                <a href={social.x} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className={socialLinkClass}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[15px] w-[15px]">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {settings.link_columns.map((column) => (
            <div key={column.heading}>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/55">{column.heading}</p>
              <ul className="mt-5 space-y-3 text-[15px] text-white/80">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-[hsl(var(--copper))]">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={localizeHref(locale, link.href)} className="transition-colors hover:text-[hsl(var(--copper))]">
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
        <div className="flex flex-col gap-4 px-6 py-6 text-[13px] text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <p>
            © {year} {settings.copyright_holder}.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {settings.legal_links.map((link) => (
              <Link key={link.label} href={localizeHref(locale, link.href)} className="transition-colors hover:text-[hsl(var(--copper))]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}