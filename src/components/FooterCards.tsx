import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FooterCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-secondary/30">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* About Us Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-navy-dark rounded-3xl p-8 lg:p-12 overflow-hidden group cursor-pointer"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 chevron-pattern opacity-20" />
            
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-500" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">About Us</h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                For over 25 years, we've been at the forefront of engineering excellence in Mongolia. 
                Our commitment to international standards and sustainable practices has made us a 
                trusted partner for major infrastructure and energy projects.
              </p>
              
              <a
                href="#about"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Learn more about us
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Career Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            id="careers"
            className="relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            {/* Background with texture effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy-light" />
            
            {/* Texture Pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
            
            {/* Lime Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            
            <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  We're Hiring
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                  Opportunity to keep pace with energetic and skillful staff
                </h3>
                <p className="text-white/70 mb-8">
                  Join our team of world-class engineers and be part of Mongolia's most 
                  impactful infrastructure projects.
                </p>
              </div>
              
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-8 py-6 rounded-full btn-glow group/btn"
              >
                Explore Careers
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FooterCards;
