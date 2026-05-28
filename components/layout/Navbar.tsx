'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { NavItem } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import LanguageToggle from './LanguageToggle';

function NavAnchor({ href, label, external, onNavigate }: NavItem & { onNavigate?: () => void }) {
  const className = 'text-sm font-medium text-white/80 transition hover:text-white';

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onNavigate}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {label}
    </Link>
  );
}

export default function Navbar({ items, locale }: { items: NavItem[]; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div
        className={[
          'container-wide rounded-[1.75rem] border border-white/10 bg-navy-dark/85 px-5 py-4 text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.78)] backdrop-blur',
          isScrolled ? 'ring-1 ring-white/10' : '',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image src="/new_logo.png" alt="" width={160} height={40} className="h-10 w-auto" priority />
            <span className="sr-only">Azzoro Resources</span>
            <span aria-hidden="true" className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-white/72 sm:inline">Azzoro Resources</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {items.map((item) => (
              <NavAnchor
                key={`${item.label}-${item.href}`}
                label={item.label}
                href={item.external ? item.href : localizeHref(locale, item.href)}
                external={item.external}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <Link
              href={localizeHref(locale, '/contact')}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Contact
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-5 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:hidden">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <NavAnchor
                  key={`${item.label}-${item.href}-mobile`}
                  label={item.label}
                  href={item.external ? item.href : localizeHref(locale, item.href)}
                  external={item.external}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <LanguageToggle />
              <Link
                href={localizeHref(locale, '/contact')}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}