import { motion } from 'framer-motion';

const partners = [
  { name: 'Bodi', logo: '/partner_logos/bodi_logo.png' },
  { name: 'Brand', logo: '/partner_logos/brand.gif' },
  { name: 'Izmone', logo: '/partner_logos/izmone_logo_2000x2000.jpg' },
  { name: 'MIAT Mongolian Airlines', logo: '/partner_logos/miat_mongolian_airlines.png' },
  { name: 'MTCT', logo: '/partner_logos/mtct_logo_mono_v1_1.jpg' },
  { name: 'SMAM', logo: '/partner_logos/smam-logo.ai_.png' },
  { name: 'Tumb', logo: '/partner_logos/tumb_1.jpg' },
  { name: 'Partner', logo: '/partner_logos/untitled-2_3.png' },
];

const PartnerLogos = () => {
  const lane = [...partners, ...partners];

  return (
    <section className="py-20 bg-background border-t border-border/60">
      <div className="container-wide mb-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-10 bg-primary" />
              <span className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold">
                Trusted Network
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Trusted by{' '}
              <span className="font-display italic font-normal text-primary">
                industry leaders
              </span>
            </h3>
          </div>

          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground tabular-nums">
            <span className="text-foreground font-semibold">{partners.length}</span>
            <span className="mx-2">·</span>
            <span>Partners</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-8 sm:gap-10 py-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {lane.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="group relative flex-shrink-0"
              title={partner.name}
            >
              <div className="w-44 h-24 sm:w-52 sm:h-28 px-6 rounded-2xl border border-border/70 bg-card flex items-center justify-center transition-all duration-300 group-hover:border-primary/40 group-hover:bg-card group-hover:shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.25)]">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  className="max-h-12 sm:max-h-14 max-w-full object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerLogos;
