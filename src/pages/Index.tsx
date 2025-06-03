
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import QuickCategories from '@/components/QuickCategories';
import SustainabilityHighlight from '@/components/SustainabilityHighlight';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedCarousel />
      <QuickCategories />
      <SustainabilityHighlight />
    </div>
  );
};

export default Index;
