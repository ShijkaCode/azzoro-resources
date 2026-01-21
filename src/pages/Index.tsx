import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import WhatWeDo from '@/components/WhatWeDo';
import BentoGrid from '@/components/BentoGrid';
import ESGSection from '@/components/ESGSection';
import FooterCards from '@/components/FooterCards';
import PartnerLogos from '@/components/PartnerLogos';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <WhatWeDo />
        <BentoGrid />
        <ESGSection />
        <FooterCards />
        <PartnerLogos />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
