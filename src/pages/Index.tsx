import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import BentoGrid from '@/components/BentoGrid';
import StatisticsSection from '@/components/StatisticsSection';
import FooterCards from '@/components/FooterCards';
import PartnerLogos from '@/components/PartnerLogos';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <BentoGrid />
        <StatisticsSection />
        <FooterCards />
        <PartnerLogos />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
