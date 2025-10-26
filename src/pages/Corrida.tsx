import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSection from "@/components/ProductSection";
import HowItWorksTabs from "@/components/HowItWorksTabs";
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
          imageSrc="/images/quadro-moderno.gif"
          imageAlt="Moldura premium personalizada"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Percurso 3D Exclusivo"
          description="Recriamos o trajeto da sua corrida em 3D com precisão, tornando cada quadro único e totalmente personalizado com a sua conquista."
          imageSrc="/images/percurso-3d.webp"
          imageAlt="Percurso 3D da prova"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Suas Fotos em Destaque"
          description="Escolha as melhores fotos da sua corrida e veja sua história ganhar vida em um quadro que une emoção, lembrança e design moderno."
          imageSrc="/images/fotos-scrapbook.webp"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Seus Dados de Prova Personalizados"
          description="Incluímos informações como seu nome, distância, tempo oficial e pace – para eternizar cada detalhe da sua conquista."
          imageSrc="/images/dados-prova.webp"
          imageAlt="Dados da prova"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description="Um layout pensado para destacar sua corrida com estilo. Seu quadro combina com qualquer ambiente, do quarto à sala de estar."
          imageSrc="/images/quadro-moderno.webp"
          imageAlt="Layout moderno e exclusivo"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Entrega Segura em Todo Brasil"
          description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil."
          imageSrc="/images/embalagem-segura.webp"
          imageAlt="Embalagem segura"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Sua Conquista em Destaque"
          description="Existem conquistas que merecem um destaque especial. Dê vida as suas conquistas emoldurando seu momento mais inesquecível."
          imageSrc="/images/medalhas.gif"
          imageAlt="Medalhas emolduradas"
          imageOnLeft={true}
        />
        
        <BenefitsSection />
        <InfiniteLogoCarousel />
        <HowItWorksTabs />
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