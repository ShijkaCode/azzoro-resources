import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronRight, Zap, Mountain, Building2, HardHat } from 'lucide-react';

const projectCategories = [
  { icon: Zap, label: 'Renewable Energy', count: 24 },
  { icon: Mountain, label: 'Mining', count: 38 },
  { icon: Building2, label: 'Infrastructure', count: 52 },
  { icon: HardHat, label: 'Construction', count: 41 },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" ref={ref} className="py-24 md:py-32 bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Featured Projects</h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Featured Project Card - Spans 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 relative group cursor-pointer"
          >
            <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden bg-navy-dark">
              {/* Background Pattern */}
              <div className="absolute inset-0 chevron-pattern opacity-30" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/80 to-transparent" />
              
              {/* Glow Effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-primary/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    Latest Project
                  </span>
                  <span className="text-white/60 text-sm">2024</span>
                </div>
                
                {/* Bottom Content */}
                <div>
                  {/* Project Logo/Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Gobi Desert Solar Farm
                  </h3>
                  <p className="text-white/70 mb-6 max-w-md">
                    A 100MW solar photovoltaic power station bringing clean energy 
                    to over 50,000 households in southern Mongolia.
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">100MW</div>
                      <div className="text-sm text-white/60">Capacity</div>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div>
                      <div className="text-2xl font-bold text-white">$85M</div>
                      <div className="text-sm text-white/60">Investment</div>
                    </div>
                    <div className="w-px h-12 bg-white/20" />
                    <div>
                      <div className="text-2xl font-bold text-white">2023</div>
                      <div className="text-sm text-white/60">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Project Categories Menu - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="h-full bg-card rounded-3xl border border-border p-6 lg:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Project Categories</h3>
              
              <div className="space-y-2">
                {projectCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <motion.a
                      key={category.label}
                      href="#"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{category.label}</div>
                          <div className="text-sm text-muted-foreground">{category.count} projects</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.a>
                  );
                })}
              </div>
              
              {/* View All Link */}
              <motion.a
                href="#"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border text-primary font-semibold hover:gap-3 transition-all"
              >
                View all projects
                <ChevronRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
