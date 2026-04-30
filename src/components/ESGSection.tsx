import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Users, Scale, Sparkles } from 'lucide-react';

const pillars = [
  {
    letter: 'E',
    kicker: 'Pillar 01',
    icon: Leaf,
    title: 'Environmental',
    description:
      'Sustainable sourcing sits at the core of our business. Net-zero carbon footprint across the lifecycle — from exploration to production.',
  },
  {
    letter: 'S',
    kicker: 'Pillar 02',
    icon: Users,
    title: 'Social',
    description:
      'We conduct exploration with the utmost respect for Mongolian communities, building long-term partnerships rooted in trust and local benefit.',
  },
  {
    letter: 'G',
    kicker: 'Pillar 03',
    icon: Scale,
    title: 'Governance',
    description:
      'Transparent governance, ethical decision-making, and disciplined oversight — upholding the highest ESG standards across every operation.',
  },
];

const ESGSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="esg" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative w-[95%] max-w-[1600px] mx-auto rounded-[2rem] overflow-hidden bg-navy-dark shadow-2xl"
        >
          {/* Forest background (CSS bg → silent fallback to navy if missing) */}
          <div
            className="absolute inset-0 bg-navy-dark"
            style={{
              backgroundImage: 'url(/forest.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Layered atmosphere over forest for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 via-navy-dark/55 to-navy-dark/85" />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[hsl(125_33%_18%/0.25)] mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 chevron-pattern opacity-15 mix-blend-overlay pointer-events-none" />

          {/* Lime atmospheric halos */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-16 md:py-24">
            {/* Header */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20 items-end">
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-3 mb-5"
                >
                  <span className="h-px w-10 bg-primary" />
                  <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
                    Sustainability
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-[-0.03em] leading-[1] mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
                >
                  Commitment to{' '}
                  <span className="font-display italic font-normal text-primary">
                    ESG
                  </span>{' '}
                  principles.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl drop-shadow-[0_1px_10px_rgba(0,0,0,0.35)]"
                >
                  We conduct our exploration activities with the utmost respect for
                  Mongolian communities, the environment, and the highest standards
                  of governance.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="lg:col-span-4 flex lg:justify-end"
              >
                <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl backdrop-saturate-150">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-[0.28em] uppercase text-white/65">
                      Carbon Footprint
                    </span>
                    <span className="text-white text-sm font-semibold tracking-tight">
                      Net-zero across lifecycle
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pillar cards — true glassmorphism over forest */}
            <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
              {pillars.map((p, index) => {
                const Icon = p.icon;
                return (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.7,
                      delay: 0.6 + index * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 p-7 lg:p-8 min-h-[340px] flex flex-col transition-all duration-500 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45)] hover:border-primary/50 hover:bg-white/[0.12] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.5)]"
                  >
                    {/* Inner glass highlights */}
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

                    {/* Oversized italic letter (background) */}
                    <span
                      aria-hidden
                      className="font-display italic absolute -top-6 -right-2 text-[14rem] leading-none text-white/[0.08] select-none pointer-events-none transition-all duration-700 group-hover:text-primary/30 group-hover:scale-105"
                    >
                      {p.letter}
                    </span>

                    {/* Top kicker row */}
                    <div className="relative flex items-center justify-between mb-8">
                      <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-white/65">
                        {p.kicker}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 backdrop-blur-md flex items-center justify-center transition-colors group-hover:bg-primary/25">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="relative mt-auto">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                        {p.title}
                      </h3>
                      <p className="text-sm text-white/75 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Bottom hairline that grows on hover */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ESGSection;
