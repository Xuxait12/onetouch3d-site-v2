import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSection from "@/components/ProductSection";
import HowItWorksTabs from "@/components/HowItWorksTabs";
import WhyChooseUsTabs from "@/components/WhyChooseUsTabs";
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
    <div className="min-h-screen bg-transparent">
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
        
        {/* Section with RUN background text */}
        <div className="relative">
          {/* Giant RUN text in background - rotated vertically on the right edge */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0">
            <h2 className="text-[28vw] sm:text-[24vw] md:text-[20vw] lg:text-[16vw] font-black tracking-tighter select-none whitespace-nowrap" style={{
              background: 'linear-gradient(to bottom, #b8b8b8, #d3d3d3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: '0.40',
              filter: 'none',
              transform: 'rotate(90deg) scaleY(1.4)',
              transformOrigin: 'center center',
              position: 'relative',
              zIndex: '1'
            }}>
              RUN
            </h2>
          </div>
          
          <FeatureSection
            title="Suas Fotos em Destaque"
            description="Escolha as melhores fotos da sua corrida e veja sua história ganhar vida em um quadro que une emoção, lembrança e design moderno."
            imageSrc="/images/fotos-scrapbook.webp"
            imageAlt="Fotos em destaque estilo scrapbook"
            imageOnLeft={true}
          />
        </div>
        
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
        
        <HowItWorksTabs />
        <WhyChooseUsTabs />
        
        {/* CONQUISTA background text positioned between sections */}
        <div className="relative h-32 md:h-40 lg:h-48 flex items-center justify-center overflow-hidden px-4">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h2 className="text-[12vw] sm:text-[11vw] md:text-[10vw] lg:text-[9vw] xl:text-[8vw] font-black tracking-tighter select-none whitespace-nowrap" style={{
              background: 'linear-gradient(to bottom, #8a8a8a 0%, #b8b8b8 50%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: '0.40',
              filter: 'none',
              transform: 'scaleY(1.4)',
              position: 'relative',
              zIndex: '1'
            }}>
              CONQUISTA
            </h2>
          </div>
        </div>
        
        <InfiniteLogoCarousel />
        <LifestyleHeroSection />
        <GallerySection />
        <TestimonialsSection />
        
        {/* ETERNIZE background text positioned above Nossa loja section */}
        <div className="relative h-48 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden px-4 mb-4 md:mb-6 lg:mb-8">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h2 className="text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw] xl:text-[10vw] font-black tracking-wide select-none whitespace-nowrap" style={{
              background: 'linear-gradient(to bottom, #b8b8b8, #d3d3d3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: '0.40',
              filter: 'none',
              transform: 'scaleY(1.4)',
              position: 'relative',
              zIndex: '1'
            }}>
              ETERNIZE
            </h2>
          </div>
        </div>
        
        <ProductSection />
        <FAQSection />
        
        
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Corrida;