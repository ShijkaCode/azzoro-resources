import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToContent = () => {
    const introSection = document.getElementById('intro');
    if (introSection) {
      introSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-background py-24 pt-32"
    >
      {/* Hero Card Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-[90%] mx-auto rounded-3xl bg-navy-dark shadow-2xl"
        >
          {/* Unicorn Studio Animation Background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <div
              data-us-project="9CQJuXIZJYT2t5x2Dlaf"
              style={{ width: '1728px', height: '1117px' }}
            />
          </div>

          {/* Gradient Overlay (to darken animation slightly) */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/10 via-transparent to-navy-light/10 z-[1]" />

          {/* Content */}
          <div className="relative z-20 py-24 px-6 sm:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-white/80 text-sm font-medium">ASX: AZ9</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
              >
                Discovering and developing a{' '}
                <span className="text-primary">mineral resource</span>{' '}
                required for energy transition in Asia
              </motion.h1>

              {/* Company Name */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-semibold"
              >
                Asian Battery Metals PLC
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a href="#investor">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-8 py-6 rounded-full text-base btn-glow group"
                  >
                    Latest Presentation
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>

                <a href="#investor">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 font-medium px-8 py-6 rounded-full text-base"
                  >
                    Latest Announcement
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator - Inside Card */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors cursor-pointer z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
