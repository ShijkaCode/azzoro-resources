import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

type QuoteItem = {
  body: string;
  name: string;
  role: string;
};

const quotes: QuoteItem[] = [
  {
    body:
      'The minerals beneath Mongolia’s steppe are not just resources — they are the raw material of the world’s transition to a cleaner future. Our responsibility is to develop them with the patience this land deserves.',
    name: 'Gantulga Dorjsuren',
    role: 'Chief Executive Officer, Asian Battery Metals PLC',
  },
  {
    body:
      'We are not in the business of extraction. We are in the business of stewardship — for the communities who call this land home, and for the generations who will inherit what we leave behind.',
    name: 'Gantulga Dorjsuren',
    role: 'Chief Executive Officer, Asian Battery Metals PLC',
  },
  {
    body:
      'Every gram of nickel, every flake of graphite carries with it a choice: to mine for short‑term yield, or to build infrastructure that outlasts us. We’ve chosen the latter — and the discipline shows in every drill core.',
    name: 'Gantulga Dorjsuren',
    role: 'Chief Executive Officer, Asian Battery Metals PLC',
  },
];

const LeadershipQuote = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = quotes.length;
  const current = quotes[index];

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + total) % total);
  };

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px w-10 bg-primary" />
          <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
            Leadership
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
          {/* LEFT — CEO portrait card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-navy-dark shadow-2xl">
              {/* Radial spot light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(220,55%,18%)_0%,hsl(220,65%,6%)_70%)]" />
              <div className="absolute inset-0 chevron-pattern opacity-15 mix-blend-overlay pointer-events-none" />

              {/* Portrait */}
              <img
                src="/ceo.png"
                alt="CEO portrait"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />

              {/* Subtle bottom vignette to ground the image */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-dark/60 to-transparent pointer-events-none" />

              {/* Floating credential chip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/85 text-[10px] tracking-[0.24em] uppercase"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Office of the CEO
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — Quote */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[420px] lg:min-h-0 lg:py-4">
            {/* Quote glyph */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Quote
                className="w-12 h-12 text-primary/30 fill-primary/15"
                strokeWidth={1.5}
                aria-hidden
              />
            </motion.div>

            {/* Animated quote body */}
            <div className="relative flex-1 min-h-[220px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.blockquote
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <p className="text-xl sm:text-2xl lg:text-[1.7rem] xl:text-[1.85rem] text-foreground leading-[1.45] tracking-[-0.01em] font-medium max-w-[58ch]">
                    <span className="font-display italic text-primary text-[1.1em]">&ldquo;</span>
                    {current.body}
                    <span className="font-display italic text-primary text-[1.1em]">&rdquo;</span>
                  </p>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Footer: name + counter + arrows */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex items-end justify-between gap-6 pt-8 border-t border-border"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`meta-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {current.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {current.role}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block text-[11px] tabular-nums uppercase tracking-[0.28em] text-muted-foreground">
                  <span className="text-foreground font-semibold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mx-2">/</span>
                  <span>{String(total).padStart(2, '0')}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous quote"
                    className="group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border bg-card hover:border-primary hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next quote"
                    className="group w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border bg-card hover:border-primary hover:bg-primary text-muted-foreground hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipQuote;
