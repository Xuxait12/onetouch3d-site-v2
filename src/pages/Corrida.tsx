import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import FAQSection from "@/components/FAQSection";
import CtaSection from "@/components/CtaSection";
import GallerySection from "@/components/GallerySection";
import WhatsAppButton from "@/components/WhatsAppButton";

// Import images
import premiumFrame from "@/assets/premium-frame.jpg";
import routeMap from "@/assets/3d-route-map.jpg";
import raceDetails from "@/assets/race-details.jpg";
import modernDisplay from "@/assets/modern-display.jpg";
import securePackaging from "@/assets/secure-packaging.jpg";

const Corrida = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <GlobalHeader />
      
      <main>
        <HeroSection />
        
        <FeatureSection
          title="Moldura Premium Personalizada"
          description="Cada medalha recebe uma moldura única, projetada especialmente para destacar sua conquista com elegância e sofisticação."
          imageSrc={premiumFrame}
          imageAlt="Moldura premium personalizada"
        />
        
        <FeatureSection
          title="Mapa 3D da Sua Rota"
          description="Reviva cada quilômetro da sua corrida com um mapa tridimensional detalhado do percurso que você conquistou."
          imageSrc={routeMap}
          imageAlt="Mapa 3D da rota"
        />
        
        <FeatureSection
          title="Detalhes da Sua Prova"
          description="Todos os dados importantes da sua corrida gravados permanentemente: tempo, distância, pace e posição final."
          imageSrc={raceDetails}
          imageAlt="Detalhes da prova"
        />
        
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description="Um produto único que combina tecnologia de ponta com design sofisticado para eternizar suas conquistas."
          imageSrc={modernDisplay}
          imageAlt="Design moderno e exclusivo"
        />
        
        <TestimonialsSection />
        <HowItWorksSection />
        <BenefitsSection />
        <GallerySection />
        <FAQSection />
        
        <FeatureSection
          title="Embalagem Segura e Cuidadosa"
          description="Seu produto chega protegido em embalagem especial, garantindo que sua lembrança chegue perfeita até você."
          imageSrc={securePackaging}
          imageAlt="Embalagem segura"
        />
        
        <CtaSection />
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Corrida;