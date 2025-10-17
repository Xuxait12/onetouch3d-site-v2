// TODO: Duplicado de /corrida - revisar textos, imagens e preços para modalidade viagem
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionViagem from "@/components/HeroSectionViagem";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSectionViagem from "@/components/ProductSectionViagem";
import HowItWorksSectionViagem from "@/components/HowItWorksSectionViagem";
import BenefitsSectionViagem from "@/components/BenefitsSectionViagem";
import FAQSectionViagem from "@/components/FAQSectionViagem";
import CtaSection from "@/components/CtaSection";
import GallerySectionViagem from "@/components/GallerySectionViagem";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhyChooseSection from "@/components/WhyChooseSection";
import InfiniteLogoCarousel from "@/components/ui/infinite-logo-carousel";
import LifestyleHeroSectionViagem from "@/components/LifestyleHeroSectionViagem";

const Viagem = () => {
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
        <HeroSectionViagem />
        
        <FeatureSection
          title="Moldura Premium e Durável"
          description="Nossas molduras são produzidas com materiais de alta resistência e acabamento sofisticado. Seu quadro não apenas valoriza suas memórias, mas também se torna parte da decoração."
          imageSrc="/images/quadro-moderno.gif"
          imageAlt="Moldura premium personalizada"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Suas Fotos em Destaque"
          description="Escolha as melhores fotos das suas viagens e veja sua história ganhar vida em um quadro que une emoção, lembrança e design moderno."
          imageSrc="/images/fotos-scrapbook.webp"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description="Um layout pensado para destacar suas viagens com estilo. Seu quadro combina com qualquer ambiente, do quarto à sala de estar."
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
        
        <BenefitsSectionViagem />
        <InfiniteLogoCarousel />
        <HowItWorksSectionViagem />
        <LifestyleHeroSectionViagem />
        <GallerySectionViagem />
        <TestimonialsSection />
        <ProductSectionViagem />
        <FAQSectionViagem />
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Viagem;
