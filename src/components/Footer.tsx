import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Team', href: '#team' },
    { label: 'Careers', href: '#careers' },
    { label: 'News', href: '#news' },
  ],
  services: [
    { label: 'Renewable Energy', href: '#' },
    { label: 'Mining', href: '#' },
    { label: 'Infrastructure', href: '#' },
    { label: 'Construction', href: '#' },
  ],
  resources: [
    { label: 'Case Studies', href: '#' },
    { label: 'Certifications', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Contact', href: '#contact' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ME</span>
              </div>
              <span className="font-semibold text-xl">MongolEngineering</span>
            </div>
            
            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">
              Delivering world-class engineering solutions and infrastructure 
              development across Mongolia since 1999.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <a 
                href="mailto:info@mongolengineering.mn" 
                className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@mongolengineering.mn
              </a>
              <a 
                href="tel:+97611123456" 
                className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                +976 11 123 456
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  Peace Avenue 123, Sukhbaatar District<br />
                  Ulaanbaatar, Mongolia
                </span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
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

          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
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

          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} MongolEngineering. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
