import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const announcements = [
  {
    title: 'Maikhan Uul Assays Confirm Thick & High-Grade Copper & Gold',
    date: 'Recent',
    type: 'Announcement'
  },
  {
    title: 'Oval Assays Confirm Further Mineralisation',
    date: 'Recent',
    type: 'Announcement'
  },
  {
    title: 'Quarterly Activities / Appendix 5B Cash Flow Report',
    date: 'Recent',
    type: 'Report'
  }
];

const FooterCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="investor" ref={ref} className="py-24 md:py-32 bg-secondary/30">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Investor Updates</h2>
          <p className="text-muted-foreground mt-2">Latest announcements and reports</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {announcements.map((announcement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="relative bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {announcement.type === 'Report' ? (
                    <FileText className="w-6 h-6 text-primary" />
                  ) : (
                    <TrendingUp className="w-6 h-6 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{announcement.date}</span>
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-3">
                {announcement.type}
              </span>

              <h3 className="text-base font-semibold text-foreground mb-4 leading-tight">
                {announcement.title}
              </h3>

              <a
                href="#investor"
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
              >
                Read more
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <a href="#investor">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-lime-dark font-semibold px-8 py-6 rounded-full btn-glow"
            >
              Latest Presentation
            </Button>
          </a>

          <a href="#investor">
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary font-medium px-8 py-6 rounded-full"
            >
              All Announcements
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCards;
