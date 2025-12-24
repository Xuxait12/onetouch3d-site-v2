import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionCiclismo from "@/components/HeroSectionCiclismo";
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
import ShareSection from "@/components/ShareSection";

// Import images
import premiumFrame from "@/assets/premium-frame.jpg";

const Ciclismo = () => {
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
        <HeroSectionCiclismo />
        
        {/* Seção 1 (antiga 5) - imagem à esquerda */}
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description="Um layout pensado para destacar seu pedal com estilo. Seu quadro combina com qualquer ambiente, do quarto à sala de estar."
          imageSrc="/images/quadro-moderno.webp"
          imageAlt="Layout moderno e exclusivo"
          imageOnLeft={true}
        />
        
        {/* Wrapper for multiple sections with BIKE background text */}
        <div className="relative overflow-hidden">
          {/* Giant BIKE text in background - spans multiple sections */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block sm:right-[-10vw] md:right-[-8vw]"
            style={{ zIndex: -1 }}
          >
            <h2 className="text-[28vw] sm:text-[24vw] md:text-[20vw] lg:text-[16vw] font-black tracking-wider select-none whitespace-nowrap" style={{
              color: '#000000',
              opacity: 0.08,
              filter: 'blur(2.5px)',
              transform: 'rotate(90deg) scaleY(1.4)',
              transformOrigin: 'center center'
            }}>
              BIKE
            </h2>
          </div>
          
          <div className="relative" style={{ zIndex: 5 }}>
            {/* Seção 2 (antiga 2) - imagem à direita */}
            <FeatureSection
              title="Percurso 3D Exclusivo"
              description="Recriamos o trajeto do seu pedal em 3D com precisão, tornando cada quadro único e totalmente personalizado com a sua conquista."
              imageSrc="/images/percurso-3d.webp"
              imageAlt="Percurso 3D da prova"
              imageOnLeft={false}
            />
            
            {/* Seção 3 (antiga 7) - imagem à esquerda */}
            <FeatureSection
              title="Sua Conquista em Destaque"
              description="Existem conquistas que merecem um destaque especial. Dê vida as suas conquistas emoldurando seu momento mais inesquecível."
              imageSrc="/images/medalhas.gif"
              imageAlt="Medalhas emolduradas"
              imageOnLeft={true}
            />
            
            {/* Seção 4 (antiga 4) - imagem à direita */}
            <FeatureSection
              title="Seus Dados de Prova Personalizados"
              description="Incluímos informações como seu nome, distância, tempo oficial e velocidade média – para eternizar cada detalhe da sua conquista."
              imageSrc="/images/dados-prova.webp"
              imageAlt="Dados da prova"
              imageOnLeft={false}
            />
            
            {/* Seção 5 (antiga 1) - imagem à esquerda */}
            <FeatureSection
              title="Moldura Premium e Durável"
              description="Nossas molduras são produzidas com materiais de alta resistência e acabamento sofisticado. Seu quadro não apenas valoriza sua medalha, mas também se torna parte da decoração."
              imageSrc="/images/quadro-moderno.gif"
              imageAlt="Moldura premium personalizada"
              imageOnLeft={true}
            />
          </div>
        </div>
        
        {/* Seção 6 (antiga 6) - imagem à direita */}
        <FeatureSection
          title="Entrega Segura em Todo Brasil"
          description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil."
          imageSrc="/images/embalagem-segura.webp"
          imageAlt="Embalagem segura"
          imageOnLeft={false}
        />
        
        {/* Seção 7 (antiga 3) - imagem à esquerda */}
        <FeatureSection
          title="Suas Fotos em Destaque"
          description={<>
            <p className="mb-4">Escolha as melhores fotos do seu pedal e veja sua história ganhar vida.</p>
            <p>Um quadro que une emoção, lembrança e design moderno.</p>
          </>}
          imageSrc="/images/fotos-scrapbook.webp"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={true}
        />
        
        <HowItWorksTabs />
        <WhyChooseUsTabs />
        
        {/* CONQUISTA background text positioned between sections */}
        <div className="relative h-32 md:h-40 lg:h-48 flex items-center justify-center overflow-hidden px-4">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h2 className="text-[12vw] sm:text-[11vw] md:text-[10vw] lg:text-[9vw] xl:text-[8vw] font-black tracking-wider select-none whitespace-nowrap" style={{
              background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 20%, #4a4a4a 35%, #e5e5e5 55%, #ffffff 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: '0.55',
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
        <ShareSection />
        
        {/* ETERNIZE background text positioned above Nossa loja section */}
        <div className="relative h-48 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden px-4 mb-4 md:mb-6 lg:mb-8">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h2 className="text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12vw] xl:text-[10vw] font-black tracking-wider select-none whitespace-nowrap" style={{
              background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 20%, #4a4a4a 35%, #e5e5e5 55%, #ffffff 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: '0.55',
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

export default Ciclismo;