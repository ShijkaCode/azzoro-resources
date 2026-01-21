import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronRight, Mountain } from 'lucide-react';

const projects = [
  {
    title: 'OVAL Ni–Cu–PGE',
    description: 'A distinct geochemical signature characterized by high values in nickel, copper, gold and platinum-group elements in both gossan and weathered mafic rock.',
  },
  {
    title: 'KHUKH TAG GRAPHITE',
    description: 'The project has a significant competitive advantage in operation and logistics, being one of the highest-grade graphite deposits in Mongolia.',
  },
  {
    title: 'TSAGAAN DERS LITHIUM',
    description: 'The geology of the region consists of localized exposures of Proterozoic metasedimentary sequences cut by small Devonian felsic intrusions and large Permian volcanic and intrusive complexes.',
  },
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our projects</h2>
          <p className="text-muted-foreground mt-2">Economically and environmentally competitive location and infrastructure</p>
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
                    Featured Project
                  </span>
                </div>

                {/* Bottom Content */}
                <div>
                  {/* Project Logo/Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
                    <Mountain className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Copper Ridge Cu–Au
                  </h3>
                  <p className="text-white/70 mb-6">
                    Copper Ridge is situated within the Yambat project license area, approximately 7 kilometers north of the Oval Cu-Ni-PGE prospect, within the Darvi-Bayanulaan fault zone. The Cu–Au mineralization is hosted in magnetite and quartz–sericite altered meta-sediment.
                  </p>
                </div>
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Other Projects - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="h-full space-y-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Mountain className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  <button className="text-primary text-sm font-semibold mt-4 hover:underline">
                    Learn more
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
