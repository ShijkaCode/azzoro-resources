import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const stats = [
  { num: '04', label: 'Active Projects' },
  { num: '07', label: 'Critical Commodities' },
  { num: 'AZ9', label: 'ASX Listed' },
];

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const scrollToContent = () => {
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-background pt-28 pb-8"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[1600px] mx-auto rounded-[2rem] bg-navy-dark shadow-2xl overflow-hidden min-h-[86vh]"
        >
          {/* Background Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero-720.webm" type="video/webm" />
            <source src="/videos/hero-720.mp4" type="video/mp4" />
          </video>

          {/* Cinematic overlays for legibility */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-navy-dark via-navy-dark/55 to-navy-dark/20" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-navy-dark/75 via-navy-dark/15 to-transparent" />
          <div className="absolute inset-0 z-[1] chevron-pattern opacity-30 pointer-events-none mix-blend-overlay" />

          {/* TOP UTILITY BAR */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-white/85 text-[11px] font-medium tracking-[0.22em] uppercase">
                Live · ASX: AZ9
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/55 text-[10px] tracking-[0.28em] uppercase">
              <span>Est. 2010</span>
              <span className="w-px h-3 bg-white/25" />
              <span>Ulaanbaatar — Mongolia</span>
            </div>
          </motion.div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 px-6 sm:px-10 lg:px-14 pt-32 sm:pt-40 lg:pt-48 pb-32">
            {/* Left: Headline column */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="h-px w-10 bg-primary" />
                <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                  Asian Battery Metals
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-balance text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold text-white leading-[0.95] tracking-[-0.035em]"
              >
                Powering Asia's{' '}
                <span className="font-display italic font-normal text-primary">
                  energy
                </span>{' '}
                transition.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75 }}
                className="text-base sm:text-lg text-white/65 max-w-md mt-6 leading-relaxed"
              >
                Discovering and developing the critical minerals that move
                the continent forward — across Mongolia's mineral provinces.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10"
              >
                <a href="#investor">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-7 py-6 rounded-full text-sm btn-glow group"
                  >
                    Latest Presentation
                    <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </a>
                <a
                  href="#investor"
                  className="group flex items-center gap-2 text-white/85 hover:text-white text-sm font-medium tracking-wide"
                >
                  <span className="border-b border-white/40 group-hover:border-white pb-0.5 transition-colors">
                    Latest Announcement
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>
            </div>

            {/* Right: Stats meta column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="lg:col-span-4 flex flex-row lg:flex-col justify-between gap-8 lg:gap-10 lg:pl-8 lg:border-l lg:border-white/12 lg:mt-2"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tabular-nums tracking-tight">
                    {stat.num}
                  </span>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/50 mt-2">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* BOTTOM UTILITY BAR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-14 py-5 border-t border-white/10 bg-navy-dark/40 backdrop-blur-md flex items-center justify-between"
          >
            <button
              onClick={() => setMuted((m) => !m)}
              className="flex items-center gap-2 text-white/65 hover:text-white text-[11px] uppercase tracking-[0.24em] transition-colors"
              aria-label="Toggle background video sound"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{muted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            <div className="hidden sm:block text-white/40 text-[10px] tracking-[0.3em] uppercase">
              Reel · 2026
            </div>

            <button
              onClick={scrollToContent}
              className="group flex items-center gap-3 text-white/75 hover:text-white text-[11px] uppercase tracking-[0.24em] transition-colors"
            >
              <span>Scroll to Explore</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="flex"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
