import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const IntroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const valueProps = [
    {
      title: 'LOCATED NEXT TO THE WORLD LARGEST EV BATTERY MARKET',
      description: 'Our proximity to China, the world\'s largest electric vehicle battery market, offers significant logistical and economic benefits.'
    },
    {
      title: 'UNDER-EXPLORED JURISDICTION FOR BATTERY MINERALS',
      description: 'Our mineral project portfolio consists from highly prospective prospects and discoveries in Mongolia, a mature mining jurisdiction with vast untapped potential for battery minerals.'
    },
    {
      title: 'COMPETITIVE LEGAL AND FISCAL FRAMEWORK',
      description: 'Mongolia offers a competitive legal policy and fiscal regime specifically designed to support the development of critical battery minerals.'
    }
  ];

  return (
    <section
      id="intro"
      ref={ref}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why <span className="text-primary">Asian Battery Metals</span>
          </h2>
        </motion.div>

        {/* Value Propositions Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h3 className="text-sm font-bold text-primary mb-4 tracking-wide">
                {prop.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
