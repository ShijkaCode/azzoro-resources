import { Mail, MapPin } from 'lucide-react';
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
  return (
    <footer id="contact" className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#home" className="inline-block mb-6">
              <img
                src={logo}
                alt="Asian Battery Metals PLC"
                className="h-12 w-auto"
              />
            </a>

            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">
              Diversified and multi-assets (all 100% owned) focused on graphite, lithium and nickel projects.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="mailto:contact@asianbatterymetals.com"
                className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                contact@asianbatterymetals.com
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  Suite 8, 16 Nicholson Road<br />
                  Subiaco, WA 6008
                </span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors hover-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-lg mb-6">Useful Links</h4>
            <ul className="space-y-3">
              {footerLinks.useful.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors hover-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-white/50 text-sm text-center">
              © {new Date().getFullYear()} Asian Battery Metals PLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
