import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const IntroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="intro"
      ref={ref}
      className="py-24 md:py-32 bg-background"
    >
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Large Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              We implement{' '}
              <span className="text-primary">international standard</span>{' '}
              project management
            </h2>
          </motion.div>

          {/* Right - Description */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-8"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our team of experts brings decades of experience in infrastructure development, 
              mining operations, and renewable energy projects. We combine global best practices 
              with deep local knowledge to deliver exceptional results.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              From initial concept to final delivery, we ensure every project meets the highest 
              international standards while respecting local conditions and requirements.
            </p>
            
            {/* Key Points */}
            <div className="flex flex-wrap gap-3">
              {['ISO Certified', 'Global Standards', 'Local Expertise', 'Sustainable Solutions'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
