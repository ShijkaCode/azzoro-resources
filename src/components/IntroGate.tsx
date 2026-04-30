import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const imagesToPreload = [
  '/what_we_do.jpg',
  '/maikhan_uul.jpg',
  '/khukh_tag.jpg',
  '/oval-ni-cu-pge.webp',
  '/tsagaan_ders_litium.webp',
  '/ceo.png',
  '/forest.jpg',
  '/partner_logos/bodi_logo.png',
  '/partner_logos/brand.gif',
  '/partner_logos/izmone_logo_2000x2000.jpg',
  '/partner_logos/miat_mongolian_airlines.png',
  '/partner_logos/mtct_logo_mono_v1_1.jpg',
  '/partner_logos/smam-logo.ai_.png',
  '/partner_logos/tumb_1.jpg',
  '/partner_logos/untitled-2_3.png',
];

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const IntroGate = ({ onEnter }: { onEnter: () => void }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = imagesToPreload.length;

    imagesToPreload.forEach((src) => {
      preloadImage(src).then(() => {
        loaded += 1;
        if (loaded === total) setReady(true);
      });
    });

    const timeout = window.setTimeout(() => setReady(true), 6000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      aria-modal
      role="dialog"
    >
      {/* Translucent navy scrim with strong blur — page behind shows through, blurred */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 bg-navy-dark/45 backdrop-blur-2xl backdrop-saturate-150"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[480px] rounded-[1.5rem] border border-white/15 bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        {/* Inner glass tells */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />

        <div className="relative px-8 sm:px-10 pt-10 pb-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-primary" />
            <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
              Before you enter
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-[2.4rem] font-bold text-white tracking-[-0.025em] leading-[1.05]"
          >
            This isn’t a real{' '}
            <span className="font-display italic font-normal text-primary">
              product
            </span>
            .
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="text-sm sm:text-base text-white/70 leading-relaxed mt-4"
          >
            A proof-of-concept built purely for design exploration. Take a look —
            nothing here is official.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-9 flex justify-end"
          >
            <button
              type="button"
              onClick={onEnter}
              disabled={!ready}
              className="group inline-flex items-center gap-2 pl-5 pr-2 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-lime-dark btn-glow disabled:opacity-60 disabled:cursor-wait disabled:shadow-none"
            >
              <span>{ready ? 'Enter site' : 'Loading'}</span>
              <span className="w-8 h-8 rounded-full bg-primary-foreground/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                {ready ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <span className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-primary-foreground animate-pulse [animation-delay:0ms]" />
                    <span className="w-1 h-1 rounded-full bg-primary-foreground animate-pulse [animation-delay:150ms]" />
                    <span className="w-1 h-1 rounded-full bg-primary-foreground animate-pulse [animation-delay:300ms]" />
                  </span>
                )}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Footer signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="relative px-8 sm:px-10 py-3.5 border-t border-white/10 text-[10px] tracking-[0.28em] uppercase text-white/45"
        >
          Developed by Shijka
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default IntroGate;
