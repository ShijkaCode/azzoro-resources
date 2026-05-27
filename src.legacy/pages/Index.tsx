import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import WhatWeDo from '@/components/WhatWeDo';
import BentoGrid from '@/components/BentoGrid';
import LeadershipQuote from '@/components/LeadershipQuote';
import ESGSection from '@/components/ESGSection';
import FooterCards from '@/components/FooterCards';
import PartnerLogos from '@/components/PartnerLogos';
import MailUs from '@/components/MailUs';
import Footer from '@/components/Footer';
import IntroGate from '@/components/IntroGate';

const Index = () => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [entered]);

  return (
    <>
      <motion.div
        animate={{ scale: entered ? 1 : 1.015 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen origin-center"
      >
        <Navbar />
        <main>
          <HeroSection />
          <IntroSection />
          <WhatWeDo />
          <BentoGrid />
          <LeadershipQuote />
          <ESGSection />
          <FooterCards />
          <PartnerLogos />
          <MailUs />
        </main>
        <Footer />
      </motion.div>

      <AnimatePresence>
        {!entered && <IntroGate key="gate" onEnter={() => setEntered(true)} />}
      </AnimatePresence>
    </>
  );
};

export default Index;
