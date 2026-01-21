import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Users, Scale } from 'lucide-react';

const ESGSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const esgCommitments = [
    {
      icon: Leaf,
      title: 'Environmental',
      description: 'Sustainable sourcing is at the core of our business. We deliver ethically sourced raw materials with a net-zero carbon footprint throughout the entire lifecycle, from exploration to production.'
    },
    {
      icon: Users,
      title: 'Social',
      description: 'We are committed to conducting our exploration activities with the utmost respect for Mongolian communities, the environment, and upholding the highest ESG (Environmental, Social, and Governance) principles.'
    },
    {
      icon: Scale,
      title: 'Governance',
      description: 'We are committed to conducting our exploration activities with the utmost respect for Mongolian communities, the environment, and upholding the highest ESG (Environmental, Social, and Governance) principles.'
    }
  ];

  return (
    <section id="esg" ref={ref} className="py-24 md:py-32 bg-background">
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
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Commitment to <span className="text-primary">ESG Principles</span>
              </h2>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                We are committed to conducting our exploration activities with the utmost respect for Mongolian communities, the environment, and upholding the highest ESG (Environmental, Social, and Governance) principles.
              </p>
            </motion.div>

            {/* ESG Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {esgCommitments.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                    className="glass-card p-8 rounded-2xl group hover:border-primary/50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-16 text-center"
            >
              <p className="text-white/80 text-lg max-w-3xl mx-auto">
                Sustainable sourcing is at the core of our business. We deliver ethically sourced raw materials with a net-zero carbon footprint throughout the entire lifecycle, from exploration to production.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ESGSection;
