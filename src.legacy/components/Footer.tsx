import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logoWithText.png';

const footerLinks = {
  company: [
    { label: 'About us', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'News & Articles', href: '#investor' },
    { label: 'Corporate governance', href: '#' },
  ],
  useful: [
    { label: 'Sustainability', href: '#esg' },
    { label: 'Presentations', href: '#investor' },
    { label: 'Announcements', href: '#investor' },
    { label: 'Contact us', href: '#contact' },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-dark text-white overflow-hidden">
      {/* Atmospherics */}
      <div className="absolute inset-0 chevron-pattern opacity-25 mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      {/* Oversized brand statement */}
      <div className="relative container-wide pt-20 lg:pt-28 pb-14 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                Asian Battery Metals · ASX: AZ9
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-[-0.03em] leading-[0.98] text-white">
              Discover. Develop.{' '}
              <span className="font-display italic font-normal text-primary">
                Deliver.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-white/65 leading-relaxed mt-6 max-w-xl">
              Critical battery minerals — sourced ethically, developed
              responsibly, delivered to power Asia’s energy transition.
            </p>
          </div>

          <div className="lg:col-span-3 lg:flex lg:justify-end">
            <a
              href="#home"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 backdrop-blur-md transition-all"
            >
              <span className="text-[11px] tracking-[0.28em] uppercase text-white/80">
                Back to top
              </span>
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Hairline */}
      <div className="relative">
        <div className="container-wide">
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
      </div>

      {/* Columns */}
      <div className="relative container-wide py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <a href="#home" className="inline-block mb-6">
              <img
                src={logo}
                alt="Asian Battery Metals PLC"
                className="h-11 w-auto"
              />
            </a>

            <p className="text-white/65 mb-8 max-w-sm leading-relaxed text-sm">
              Diversified, multi-asset (100% owned) portfolio focused on
              graphite, lithium and nickel projects across Mongolia.
            </p>

            <div className="space-y-3">
              <a
                href="mailto:contact@asianbatterymetals.com"
                className="group flex items-center gap-3 text-white/75 hover:text-white transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </span>
                <span className="text-sm">contact@asianbatterymetals.com</span>
              </a>
              <div className="flex items-start gap-3 text-white/65 text-sm">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <span className="pt-1.5 leading-relaxed">
                  Suite 8, 16 Nicholson Road
                  <br />
                  Subiaco, WA 6008
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] tracking-[0.28em] uppercase font-semibold text-white/50 mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-primary transition-colors" />
                    <span className="border-b border-transparent group-hover:border-white/40 pb-0.5 transition-colors">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] tracking-[0.28em] uppercase font-semibold text-white/50 mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.useful.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-primary transition-colors" />
                    <span className="border-b border-transparent group-hover:border-white/40 pb-0.5 transition-colors">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Listing card */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] tracking-[0.28em] uppercase font-semibold text-white/50 mb-6">
              Listing
            </h4>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-5">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] tracking-[0.28em] uppercase text-white/45">
                  ASX
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
              </div>
              <div className="text-3xl font-bold tracking-tight">AZ9</div>
              <div className="text-xs text-white/55 mt-1">
                Asian Battery Metals PLC
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/45 text-xs tracking-wide">
              © {year} Asian Battery Metals PLC. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-[11px] tracking-[0.22em] uppercase text-white/45">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <span className="w-px h-3 bg-white/15" />
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <span className="w-px h-3 bg-white/15" />
              <a href="#" className="hover:text-white transition-colors">
                Disclosures
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
