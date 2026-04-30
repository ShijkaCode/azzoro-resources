import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Announcement = {
  title: string;
  date: string;
  type: 'Announcement' | 'Report';
  tag: string;
};

const featured: Announcement = {
  title: 'Maikhan Uul Assays Confirm Thick & High-Grade Copper & Gold',
  date: 'Recent',
  type: 'Announcement',
  tag: 'Cu · Au',
};

const recent: Announcement[] = [
  {
    title: 'Oval Assays Confirm Further Mineralisation',
    date: 'Recent',
    type: 'Announcement',
    tag: 'Ni · Cu · PGE',
  },
  {
    title: 'Quarterly Activities & Appendix 5B Cash Flow Report',
    date: 'Recent',
    type: 'Report',
    tag: 'Q · Filings',
  },
];

const FooterCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="investor" ref={ref} className="py-24 md:py-32 bg-secondary/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between gap-6 flex-wrap mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                ASX · AZ9 · Live Filings
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Investor{' '}
              <span className="font-display italic font-normal text-primary">updates</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Latest announcements, quarterly reports and regulatory filings.
            </p>
          </div>

          <a
            href="#investor"
            className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span className="border-b border-foreground/40 group-hover:border-foreground pb-0.5 transition-colors">
              All announcements
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Featured Announcement */}
          <motion.a
            href="#investor"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 group relative overflow-hidden rounded-3xl bg-navy-dark text-white p-8 lg:p-10 min-h-[360px] flex flex-col justify-between shadow-xl"
          >
            {/* Background image */}
            <img
              src="/maikhan_uul.jpg"
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            {/* Legibility overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/75 to-navy-dark/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/70 via-transparent to-transparent" />
            <div className="absolute inset-0 chevron-pattern opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[120px] pointer-events-none transition-opacity duration-700 group-hover:opacity-150" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold tracking-[0.22em] uppercase">
                  {featured.type}
                </span>
                <span className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/80 text-[10px] tracking-[0.22em] uppercase">
                  {featured.tag}
                </span>
              </div>
              <span className="text-[11px] tracking-[0.24em] uppercase text-white/50">
                {featured.date}
              </span>
            </div>

            <div className="relative">
              <div className="text-[11px] tracking-[0.3em] uppercase font-semibold text-primary mb-4">
                Featured Filing
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] mb-6 max-w-2xl">
                {featured.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-white/85 text-sm font-medium">
                <span className="border-b border-white/40 group-hover:border-white pb-0.5 transition-colors">
                  Read announcement
                </span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </motion.a>

          {/* Recent Stack */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {recent.map((item, index) => {
              const Icon = item.type === 'Report' ? FileText : TrendingUp;
              return (
                <motion.a
                  key={item.title}
                  href="#investor"
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35 + index * 0.12 }}
                  className="group relative flex-1 overflow-hidden rounded-3xl bg-card border border-border p-6 lg:p-7 transition-all duration-400 hover:border-primary/40 hover:bg-card hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.25)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                          {item.type}
                        </span>
                        <span className="text-[11px] tracking-tight text-foreground/80 font-medium">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug mb-5 max-w-md">
                    {item.title}
                  </h4>

                  <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                    <span className="border-b border-primary/40 group-hover:border-primary pb-0.5 transition-colors">
                      Read
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
        >
          <a href="#investor">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-8 py-6 rounded-full btn-glow group"
            >
              Latest Presentation
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
          </a>
          <a href="#investor">
            <Button
              size="lg"
              variant="outline"
              className="border-foreground/20 hover:bg-foreground/5 hover:border-foreground/40 font-medium px-8 py-6 rounded-full"
            >
              All Announcements
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCards;
