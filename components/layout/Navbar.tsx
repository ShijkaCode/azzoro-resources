'use client';

import { MediaImage as Image } from '@/components/shared/MediaImage';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import type { NavItem } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import LanguageToggle from './LanguageToggle';

const underline =
  'relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100';

const INVESTOR_LINKS: Record<Locale, { label: string; href: string }[]> = {
  en: [
    { label: 'Investor Centre Home', href: 'https://investors.asianbatterymetals.com/' },
    { label: 'Stock Information', href: 'https://investors.asianbatterymetals.com/' },
    { label: 'Announcements', href: 'https://investors.asianbatterymetals.com/announcements' },
    { label: 'Presentations', href: 'https://investors.asianbatterymetals.com/announcements?filter=Presentation' },
    { label: 'News and Media', href: 'https://investors.asianbatterymetals.com/news-insights' },
    { label: 'Company reports', href: 'https://investors.asianbatterymetals.com/announcements?filter=reports' },
  ],
  mn: [
    { label: 'Хөрөнгө оруулагчийн төв', href: 'https://investors.asianbatterymetals.com/' },
    { label: 'Хувьцааны мэдээлэл', href: 'https://investors.asianbatterymetals.com/' },
    { label: 'Мэдэгдлүүд', href: 'https://investors.asianbatterymetals.com/announcements' },
    { label: 'Танилцуулга', href: 'https://investors.asianbatterymetals.com/announcements?filter=Presentation' },
    { label: 'Мэдээ ба хэвлэл', href: 'https://investors.asianbatterymetals.com/news-insights' },
    { label: 'Компанийн тайлан', href: 'https://investors.asianbatterymetals.com/announcements?filter=reports' },
  ],
};

function isInvestorItem(item: NavItem) {
  return Boolean(item.external && /investors\./.test(item.href));
}

export default function Navbar({
  items,
  locale,
  investorLinks,
}: {
  items: NavItem[];
  locale: Locale;
  investorLinks?: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const useTransparent = isHome && !isScrolled && !isOpen && !openDropdown;

  const headerClass = [
    'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
    useTransparent ? 'bg-transparent border-b border-transparent' : 'bg-[hsl(var(--ink))] border-b border-white/10',
  ].join(' ');

  const investorLinkItems =
    investorLinks && investorLinks.length > 0 ? investorLinks : INVESTOR_LINKS[locale] ?? INVESTOR_LINKS.en;

  const dropdownFor = (item: NavItem): { key: string; links: { label: string; href: string; external: boolean }[] } | null => {
    if (isInvestorItem(item)) {
      return { key: 'investor', links: investorLinkItems.map((l) => ({ ...l, external: true })) };
    }
    return null;
  };

  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between gap-4 px-6 py-5 text-white sm:px-10 lg:px-16">
        <Link href={`/${locale}`} className="flex items-center" aria-label="Azzoro Resources">
          <Image src="/new_logo.png" alt="Azzoro Resources" width={180} height={44} priority className="h-10 w-auto brightness-0 invert" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {items.map((item) => {
            const dropdown = dropdownFor(item);
            const href = item.external ? item.href : localizeHref(locale, item.href);

            if (dropdown) {
              const open = openDropdown === dropdown.key;
              return (
                <div
                  key={`${item.label}-${item.href}`}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(dropdown.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(open ? null : dropdown.key)}
                    className="flex items-center gap-1.5 text-[15px] font-medium text-white/85 transition-colors hover:text-white"
                    aria-expanded={open}
                  >
                    <span className={underline}>{item.label}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open ? (
                    <div className="absolute left-0 top-full min-w-[16rem] border border-white/15 bg-[hsl(var(--ink))] py-2">
                      {dropdown.links.map((link) =>
                        link.external ? (
                          <a
                            key={link.href + link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 px-5 py-2.5 text-[14px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          </a>
                        ) : (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            className="block px-5 py-2.5 text-[14px] text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                          >
                            {link.label}
                          </Link>
                        )
                      )}
                    </div>
                  ) : null}
                </div>
              );
            }

            return item.external ? (
              <a
                key={`${item.label}-${item.href}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[15px] font-medium text-white/85 transition-colors hover:text-white"
              >
                <span className={underline}>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/50" />
              </a>
            ) : (
              <Link
                key={`${item.label}-${item.href}`}
                href={href}
                className="text-[15px] font-medium text-white/85 transition-colors hover:text-white"
              >
                <span className={underline}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LanguageToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[hsl(var(--ink))] px-6 pb-8 pt-6 text-white sm:px-10 lg:hidden">
          <div className="flex flex-col">
            {items.map((item) => {
              const dropdown = dropdownFor(item);
              const href = item.external ? item.href : localizeHref(locale, item.href);

              if (dropdown) {
                const expanded = mobileExpanded === dropdown.key;
                return (
                  <div key={`${item.label}-${item.href}-m`} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(expanded ? null : dropdown.key)}
                      className="flex w-full items-center justify-between py-4 text-[15px] font-medium text-white"
                      aria-expanded={expanded}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded ? (
                      <div className="flex flex-col gap-1 pb-4 pl-4">
                        {dropdown.links.map((link) =>
                          link.external ? (
                            <a
                              key={link.href + link.label}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 py-2 text-[14px] text-white/70"
                              onClick={() => setIsOpen(false)}
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                            </a>
                          ) : (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              className="py-2 text-[14px] text-white/70"
                              onClick={() => setIsOpen(false)}
                            >
                              {link.label}
                            </Link>
                          )
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return item.external ? (
                <a
                  key={`${item.label}-${item.href}-m`}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 border-b border-white/10 py-4 text-[15px] font-medium text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-white/50" />
                </a>
              ) : (
                <Link
                  key={`${item.label}-${item.href}-m`}
                  href={href}
                  className="border-b border-white/10 py-4 text-[15px] font-medium text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-6">
            <LanguageToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
