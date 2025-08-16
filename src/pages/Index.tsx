import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import BenefitsSection from "@/components/BenefitsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Background gradient similar to OneTouch3D home */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10"></div>
      
      <Header />
      <HeroSection />
      
      {/* Content sections with background */}
      <div className="bg-background">
        <ProblemSection />
        <SolutionSection />
        <BenefitsSection />
        <GallerySection />
        <TestimonialsSection />
        <HowItWorksSection />
        <CtaSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
