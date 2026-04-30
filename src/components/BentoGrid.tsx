import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  commodity: string;
  region: string;
  description: string;
  image: string;
};

const projects: Project[] = [
  {
    id: 'oval',
    title: 'OVAL',
    commodity: 'Ni · Cu · PGE',
    region: 'Western Mongolia',
    description:
      'A distinct geochemical signature characterized by high values in nickel, copper, gold and platinum-group elements in both gossan and weathered mafic rock.',
    image: '/oval-ni-cu-pge.webp',
  },
  {
    id: 'khukh-tag',
    title: 'KHUKH TAG',
    commodity: 'Graphite',
    region: 'Northern Mongolia',
    description:
      'A significant competitive advantage in operation and logistics — one of the highest-grade graphite deposits in Mongolia.',
    image: '/khukh_tag.jpg',
  },
  {
    id: 'tsagaan-ders',
    title: 'TSAGAAN DERS',
    commodity: 'Lithium',
    region: 'Southern Mongolia',
    description:
      'Localized exposures of Proterozoic metasedimentary sequences cut by Devonian felsic intrusions and large Permian volcanic and intrusive complexes.',
    image: '/tsagaan_ders_litium.webp',
  },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeId, setActiveId] = useState(projects[0].id);

  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const activeIndex = projects.findIndex((p) => p.id === activeId);
  const indexLabel = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(projects.length).padStart(2, '0');

  return (
    <section id="projects" ref={ref} className="py-24 md:py-32 bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 gap-6 flex-wrap"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                Project Portfolio
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Our <span className="font-display italic font-normal text-primary">projects</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Economically and environmentally competitive locations across Mongolia's mineral provinces.
            </p>
          </div>

          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground tabular-nums">
            <span className="text-foreground font-semibold">{indexLabel}</span>
            <span className="mx-2">/</span>
            <span>{totalLabel}</span>
          </div>
        </motion.div>

        {/* Interactive Project Showcase */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Featured Display - Spans 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 relative group"
          >
            <div className="relative h-full min-h-[440px] lg:min-h-[560px] rounded-3xl overflow-hidden bg-navy-dark">
              {/* Crossfading background images */}
              <AnimatePresence mode="sync">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={active.image}
                    alt={active.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/70 to-navy-dark/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/60 via-transparent to-transparent" />
              <div className="absolute inset-0 chevron-pattern opacity-25 mix-blend-overlay pointer-events-none" />

              {/* Top Badge + Region */}
              <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-8 sm:right-8 z-10 flex items-start justify-between gap-4">
                <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">
                  Featured Project
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/85 text-[11px] tracking-[0.2em] uppercase">
                  <MapPin className="w-3 h-3" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active.id + '-region'}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      {active.region}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id + '-content'}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                      {active.commodity}
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-[1]">
                      {active.title}
                    </h3>
                    <p className="text-white/75 max-w-xl leading-relaxed text-sm sm:text-base">
                      {active.description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <button className="group/btn mt-6 inline-flex items-center gap-2 self-start text-white text-sm font-medium tracking-wide">
                  <span className="border-b border-white/40 group-hover/btn:border-white pb-0.5 transition-colors">
                    View project details
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Project Selectors - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="h-full flex flex-col gap-4">
              {projects.map((project, index) => {
                const isActive = project.id === activeId;
                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    onClick={() => setActiveId(project.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    aria-pressed={isActive}
                    className={`group relative flex-1 text-left rounded-2xl border p-5 sm:p-6 transition-all duration-500 overflow-hidden ${
                      isActive
                        ? 'bg-navy-dark border-primary/60 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.5)]'
                        : 'bg-card border-border hover:border-primary/40 hover:bg-card/80'
                    }`}
                  >
                    {/* Active state background image accent */}
                    {isActive && (
                      <>
                        <div
                          className="absolute inset-0 opacity-25"
                          style={{
                            backgroundImage: `url(${project.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/85 to-navy-dark/40" />
                      </>
                    )}

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] tabular-nums tracking-[0.2em] uppercase font-semibold ${
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`h-px w-6 transition-colors ${
                              isActive ? 'bg-primary' : 'bg-border'
                            }`}
                          />
                          <span
                            className={`text-[10px] tracking-[0.22em] uppercase font-medium ${
                              isActive ? 'text-white/70' : 'text-muted-foreground'
                            }`}
                          >
                            {project.commodity}
                          </span>
                        </div>
                        <h3
                          className={`font-bold tracking-tight text-lg sm:text-xl mb-2 transition-colors ${
                            isActive ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          {project.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm leading-relaxed line-clamp-2 transition-colors ${
                            isActive ? 'text-white/65' : 'text-muted-foreground'
                          }`}
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* Indicator */}
                      <div
                        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
