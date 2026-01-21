import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

const WhatWeDo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 md:py-32 bg-background"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative w-[90%] mx-auto rounded-3xl overflow-hidden bg-navy-dark shadow-2xl"
        >
          {/* Chevron Pattern Overlay */}
          <div className="absolute inset-0 chevron-pattern opacity-30" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light opacity-80" />

          {/* Content */}
          <div className="relative z-10 py-16 md:py-20 px-6 sm:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  What we do
                </h2>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-lg text-white/80 leading-relaxed">
                  Asian Battery Metals PLC is focused on the exploration and development of graphite, nickel, copper and lithium projects in Mongolia.
                </p>

                <p className="text-lg text-white/80 leading-relaxed">
                  Sustainable sourcing is at the core of our business. We deliver ethically sourced raw materials with a net-zero carbon footprint throughout the entire lifecycle, from exploration to production.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-10"
              >
                <a href="#about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 font-medium px-8 py-6 rounded-full text-base"
                  >
                    About us
                  </Button>
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
