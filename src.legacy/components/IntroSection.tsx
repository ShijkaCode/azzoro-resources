import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin } from 'lucide-react';

const valueProps = [
  {
    title: 'Located next to the world’s largest EV battery market',
    description:
      'Proximity to China — the world’s largest electric vehicle battery market — offers significant logistical and economic leverage.',
  },
  {
    title: 'Under-explored jurisdiction for battery minerals',
    description:
      'A portfolio of highly prospective discoveries inside Mongolia, a mature mining jurisdiction with vast untapped potential for battery minerals.',
  },
  {
    title: 'Competitive legal & fiscal framework',
    description:
      'Mongolia offers a competitive legal and fiscal regime designed specifically to support the development of critical battery minerals.',
  },
];

const IntroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="intro" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT — Sticky intro + image */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-10 bg-primary" />
                <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                  The Advantage
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-[-0.03em] leading-[1.02]"
              >
                Why{' '}
                <span className="font-display italic font-normal text-primary">
                  Asian Battery Metals
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6 max-w-md"
              >
                Strategically positioned at the geographic and geological intersection
                of the world’s most important energy transition supply chain.
              </motion.p>

              {/* Image card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-10 rounded-3xl overflow-hidden bg-navy-dark aspect-[4/3] shadow-xl"
              >
                <img
                  src="/khukh_tag.jpg"
                  alt="Mongolian mineral terrain"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/30 to-transparent" />
                <div className="absolute inset-0 chevron-pattern opacity-20 mix-blend-overlay pointer-events-none" />

                <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/85 text-[10px] tracking-[0.24em] uppercase">
                  <MapPin className="w-3 h-3" />
                  <span>Mongolia</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="text-[10px] tracking-[0.28em] uppercase text-white/60 mb-1">
                    Mineral Provinces
                  </div>
                  <div className="text-lg sm:text-xl font-bold tracking-tight">
                    Jurisdiction with vast untapped potential
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RIGHT — Numbered editorial cards */}
          <div className="lg:col-span-7 lg:pl-4">
            <div className="flex flex-col">
              {valueProps.map((prop, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                  className="group relative py-8 sm:py-10 border-t border-border last:border-b first:border-t-0 sm:first:border-t"
                >
                  <div className="grid grid-cols-12 gap-4 sm:gap-6 items-start">
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-2xl sm:text-3xl font-bold text-foreground tabular-nums tracking-tight transition-colors group-hover:text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="col-span-10 sm:col-span-11">
                      <h3 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold text-foreground tracking-tight leading-snug mb-3">
                        {prop.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
                        {prop.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover accent rule */}
                  <span className="absolute left-0 top-0 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
