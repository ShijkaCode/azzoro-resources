import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pillars = [
  { num: '01', label: 'Exploration' },
  { num: '02', label: 'Development' },
  { num: '03', label: 'Sustainability' },
];

const WhatWeDo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative w-[95%] max-w-[1600px] mx-auto rounded-[2rem] overflow-hidden bg-navy-dark shadow-2xl"
        >
          {/* Texture */}
          <div className="absolute inset-0 chevron-pattern opacity-20 pointer-events-none mix-blend-overlay" />

          <div className="relative grid lg:grid-cols-12 gap-0">
            {/* LEFT — Image panel */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:col-span-6 min-h-[360px] lg:min-h-[640px]"
            >
              <img
                src="/what_we_do.jpg"
                alt="Asian Battery Metals exploration site in Mongolia"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Edge gradients to blend into the navy panel */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-navy-dark/60 lg:to-navy-dark" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 via-transparent to-navy-dark/20" />

              {/* Floating credential chip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 flex items-center gap-3 px-4 py-3 rounded-2xl bg-navy-dark/70 border border-white/15 backdrop-blur-md"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-[0.28em] uppercase text-white/55">
                    On the Ground
                  </span>
                  <span className="text-white text-sm font-semibold tracking-tight">
                    Mongolia · Field Operations
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — Content panel */}
            <div className="relative lg:col-span-6 px-6 sm:px-10 lg:px-14 py-14 lg:py-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-10 bg-primary" />
                <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                  Our Mandate
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-[1] mb-8"
              >
                What we{' '}
                <span className="font-display italic font-normal text-primary">do</span>.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="space-y-5 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl"
              >
                <p>
                  Asian Battery Metals PLC is focused on the exploration and development
                  of <span className="text-white">graphite, nickel, copper and lithium</span> projects
                  in Mongolia.
                </p>
                <p>
                  Sustainable sourcing sits at the core of our business. We deliver ethically
                  sourced raw materials with a net-zero carbon footprint across the entire
                  lifecycle — from exploration to production.
                </p>
              </motion.div>

              {/* Pillars row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 mb-10 pt-8 border-t border-white/10"
              >
                {pillars.map((p) => (
                  <div key={p.num} className="flex flex-col">
                    <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                      {p.num}
                    </span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-white/55 mt-2">
                      {p.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.85 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <a href="#about">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-7 py-6 rounded-full text-sm btn-glow group"
                  >
                    About us
                    <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </a>
                <a
                  href="#projects"
                  className="group flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium tracking-wide"
                >
                  <span className="border-b border-white/40 group-hover:border-white pb-0.5 transition-colors">
                    Explore projects
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDo;
