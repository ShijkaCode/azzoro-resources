import { motion } from 'framer-motion';

const partners = [
  { name: 'Partner 1', logo: 'P1' },
  { name: 'Partner 2', logo: 'P2' },
  { name: 'Partner 3', logo: 'P3' },
  { name: 'Partner 4', logo: 'P4' },
  { name: 'Partner 5', logo: 'P5' },
  { name: 'Partner 6', logo: 'P6' },
  { name: 'Partner 7', logo: 'P7' },
  { name: 'Partner 8', logo: 'P8' },
];

const PartnerLogos = () => {
  // Double the array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container-wide mb-8">
        <p className="text-center text-muted-foreground text-sm font-medium uppercase tracking-wider">
          Trusted by Industry Leaders
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden">
        {/* Gradient Fade - Left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        
        {/* Gradient Fade - Right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling Logos */}
        <motion.div
          className="flex items-center gap-12 py-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 partner-logo cursor-pointer"
            >
              <div className="w-32 h-16 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                <span className="text-2xl font-bold text-muted-foreground">
                  {partner.logo}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerLogos;
