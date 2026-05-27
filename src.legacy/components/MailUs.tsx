import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const channels = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@asianbatterymetals.com',
    href: 'mailto:info@asianbatterymetals.com',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'Ulaanbaatar, Mongolia',
  },
];

const MailUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mail us submission:', formData);
    setSent(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT — Editorial intro & contact channels */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                Get in Touch
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-[-0.03em] leading-[1.02]"
            >
              Mail{' '}
              <span className="font-display italic font-normal text-primary">us</span>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6 max-w-md"
            >
              Investor enquiries, partnership opportunities, or general questions —
              we read every message and respond personally.
            </motion.p>

            {/* Channels */}
            <div className="mt-10 space-y-3">
              {channels.map((c, i) => {
                const Icon = c.icon;
                const Wrapper: any = c.href ? 'a' : 'div';
                return (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                  >
                    <Wrapper
                      {...(c.href ? { href: c.href } : {})}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                          {c.label}
                        </div>
                        <div className="text-sm font-semibold text-foreground tracking-tight truncate">
                          {c.value}
                        </div>
                      </div>
                      {c.href && (
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Form on a navy card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-navy-dark p-8 sm:p-10 lg:p-12 shadow-2xl"
          >
            <div className="absolute inset-0 chevron-pattern opacity-25 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />

            {sent ? (
              <div className="relative min-h-[420px] flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                  Message received.
                </h3>
                <p className="text-white/65 max-w-sm">
                  Thanks {formData.name || 'for reaching out'} — we'll get back to
                  you at <span className="text-white">{formData.email}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-8 text-sm text-white/65 hover:text-white tracking-wide border-b border-white/30 hover:border-white pb-0.5 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-primary">
                    New Enquiry
                  </span>
                  <span className="text-[11px] tracking-[0.24em] uppercase text-white/45">
                    Form · 2026
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="mailus-name"
                    className="block text-[11px] tracking-[0.24em] uppercase text-white/55"
                  >
                    Your name
                  </label>
                  <Input
                    id="mailus-name"
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="h-12 rounded-xl bg-white/[0.04] border-white/15 text-white placeholder:text-white/35 focus-visible:ring-primary/60 focus-visible:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="mailus-email"
                    className="block text-[11px] tracking-[0.24em] uppercase text-white/55"
                  >
                    Email address
                  </label>
                  <Input
                    id="mailus-email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="h-12 rounded-xl bg-white/[0.04] border-white/15 text-white placeholder:text-white/35 focus-visible:ring-primary/60 focus-visible:border-primary/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="mailus-message"
                    className="block text-[11px] tracking-[0.24em] uppercase text-white/55"
                  >
                    Message
                  </label>
                  <Textarea
                    id="mailus-message"
                    name="message"
                    placeholder="Tell us a little about your enquiry…"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="rounded-xl bg-white/[0.04] border-white/15 text-white placeholder:text-white/35 focus-visible:ring-primary/60 focus-visible:border-primary/60 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <span className="text-[11px] text-white/40 leading-snug max-w-[14rem]">
                    By sending you agree to be contacted regarding your enquiry.
                  </span>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-7 py-6 rounded-full text-sm btn-glow group"
                  >
                    Send message
                    <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MailUs;
