import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSection from "@/components/ProductSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import FAQSection from "@/components/FAQSection";
import CtaSection from "@/components/CtaSection";
import GallerySection from "@/components/GallerySection";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhyChooseSection from "@/components/WhyChooseSection";
import InfiniteLogoCarousel from "@/components/ui/infinite-logo-carousel";
import LifestyleHeroSection from "@/components/LifestyleHeroSection";

// Import images
import premiumFrame from "@/assets/premium-frame.jpg";

const Corrida = () => {
  const location = useLocation();

  useEffect(() => {
    const stateAny = (window.history.state && window.history.state.usr) || {};
    const anchor = stateAny.anchor || (window.location.hash ? window.location.hash.replace('#','') : '');
    if (anchor) {
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <GlobalHeader />
      
      <main>
        <HeroSection />
        
        <FeatureSection
          title="Moldura Premium e Durável"
          description="Nossas molduras são produzidas com materiais de alta resistência e acabamento sofisticado. Seu quadro não apenas valoriza sua medalha, mas também se torna parte da decoração."
          imageSrc={premiumFrame}
          imageAlt="Moldura premium personalizada"
          imageOnLeft={true}
          imageAnimation="animate-slide-in-left"
          textAnimation="animate-fade-in-right"
        />
        
        <FeatureSection
          title="Percurso 3D Exclusivo"
          description="Recriamos o trajeto da sua corrida em 3D com precisão, tornando cada quadro único e totalmente personalizado com a sua conquista."
          imageSrc="/lovable-uploads/9d29309d-d713-40d4-910c-40e574c7147e.png"
          imageAlt="Percurso 3D da prova"
          imageOnLeft={false}
          imageAnimation="animate-slide-in-right"
          textAnimation="animate-fade-in-left"
        />
        
        <FeatureSection
          title="Suas Fotos em Destaque"
          description="Escolha as melhores fotos da sua corrida e veja sua história ganhar vida em um quadro que une emoção, lembrança e design moderno."
          imageSrc="/lovable-uploads/cffe1512-5aa2-4772-a8ca-769908354178.png"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={true}
          imageAnimation="animate-zoom-in"
          textAnimation="animate-fade-in-up"
        />
        
        <FeatureSection
          title="Seus Dados de Prova Personalizados"
          description="Incluímos informações como seu nome, distância, tempo oficial e data da corrida – para eternizar cada detalhe da sua conquista."
          imageSrc="/lovable-uploads/da6090ca-3f85-42bd-a91c-b5c8cf836006.png"
          imageAlt="Dados da prova"
          imageOnLeft={false}
          imageAnimation="animate-rotate-in-up-left"
          textAnimation="animate-fade-in"
        />
        
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description="Um layout pensado para destacar sua corrida com estilo. Seu quadro combina com qualquer ambiente, do quarto à sala de estar."
          imageSrc="/lovable-uploads/7ea271e8-64aa-4620-81c8-08fc1ac1a4f0.png"
          imageAlt="Layout moderno e exclusivo"
          imageOnLeft={true}
          imageAnimation="animate-slide-in-left"
          textAnimation="animate-fade-in-up"
        />
        
        <FeatureSection
          title="Entrega Segura em Todo Brasil"
          description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil."
          imageSrc="/lovable-uploads/925aca7c-d20c-45bc-8fb7-463c5ba8e600.png"
          imageAlt="Embalagem segura"
          imageOnLeft={false}
          imageAnimation="animate-zoom-in-up"
          textAnimation="animate-fade-in-left"
        />
        
        <BenefitsSection />
        <InfiniteLogoCarousel />
        <HowItWorksSection />
        <LifestyleHeroSection />
        <GallerySection />
        <TestimonialsSection />
        <ProductSection />
        <FAQSection />
        
        
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Corrida;