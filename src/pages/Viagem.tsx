import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionViagem from "@/components/HeroSectionViagem";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSection from "@/components/ProductSection";
import HowItWorksTabsViagem from "@/components/HowItWorksTabsViagem";
import WhyChooseUsTabsViagem from "@/components/WhyChooseUsTabsViagem";
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
    <div className="min-h-screen bg-transparent">
      <GlobalHeader />
      
      <main>
        <HeroSectionViagem />
        
        <FeatureSection
          title="Moldura Premium e Durável"
          description={
            <>
              <p className="mb-2">Nossa moldura é produzida com material de alta resistência e acabamento refinado, perfeitas para valorizar fotos, rotas e memórias de viagem.</p>
              <p>Um quadro que não só decora — mas preserva emoções.</p>
            </>
          }
          imageSrc="/images/quadro-moderno.gif"
          imageAlt="Moldura premium personalizada"
          imageOnLeft={true}
        />
        
        {/* Wrapper for multiple sections with TRIP background text */}
        <div className="relative overflow-hidden">
          {/* Giant TRIP text in background - spans multiple sections */}
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
              TRIP
            </h2>
          </div>
          
          <div className="relative" style={{ zIndex: 5 }}>
            <FeatureSection
              title="Percurso 3D Exclusivo"
              description={
                <>
                  <p className="mb-2">Recriamos sua rota em alto relevo 3D, transformando cada quilômetro da sua jornada em uma experiência visual única.</p>
                  <p className="mb-2">Um mapa que ganha forma, relembra histórias e eterniza tudo o que você viveu.</p>
                  <p>Sua jornada merece ser vista todos os dias.</p>
                </>
              }
              imageSrc="/images/percurso-3d.webp"
              imageAlt="Percurso 3D da viagem"
              imageOnLeft={false}
            />
            
            <FeatureSection
              title="Suas Fotos em Destaque"
              description={
                <>
                  <p className="mb-2">Selecione as melhores imagens da sua expedição: paisagens, trechos, marcos históricos ou momentos especiais.</p>
                  <p>Nós transformamos tudo em um design moderno, estilo scrapbook, que representa cada etapa vivida.</p>
                </>
              }
              imageSrc="/images/fotos-scrapbook.webp"
              imageAlt="Fotos em destaque estilo scrapbook"
              imageOnLeft={true}
            />
            
            <FeatureSection
              title="Detalhes da Sua Viagem"
              description={
                <>
                  <p className="mb-3">Incluímos as principais informações da sua viagem, como:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Países ou cidades percorridas</li>
                    <li>Datas</li>
                    <li>Kilometragem total</li>
                    <li>Título da sua viagem</li>
                    <li>Estilo da aventura (carro, moto ou motorhome)</li>
                  </ul>
                </>
              }
              imageSrc="/images/dados-prova.webp"
              imageAlt="Dados da viagem"
              imageOnLeft={false}
            />
            
            <FeatureSection
              title="Design Moderno e Exclusivo"
              description={
                <>
                  <p className="mb-3">Mais do que um quadro, uma representação fiel da sua jornada. Cada elemento é personalizado para destacar:</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>O caminho percorrido</li>
                    <li>As paisagens que ficaram na memória</li>
                    <li>As emoções vividas ao longo da viagem</li>
                    <li>A identidade de quem escolheu explorar</li>
                  </ul>
                </>
              }
              imageSrc="/images/quadro-moderno.webp"
              imageAlt="Layout moderno e exclusivo"
              imageOnLeft={true}
            />
          </div>
        </div>
        
        <FeatureSection
          title="Entrega Segura em Todo Brasil"
          description="Seu quadro é embalado com proteção reforçada, garantindo que chegue impecável até você, independente da cidade."
          imageSrc="/images/embalagem-segura.webp"
          imageAlt="Embalagem segura"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Sua Aventura em Destaque"
          description={
            <>
              <p className="mb-2">Existem viagens que mudam quem você é.</p>
              <p className="mb-2">Essas viagens merecem ser eternizadas.</p>
              <p>Transformamos sua rota, fotos e história em um quadro</p>
              <p>único — feito especialmente para você.</p>
            </>
          }
          imageSrc="/images/medalhas.gif"
          imageAlt="Lembranças emolduradas"
          imageOnLeft={true}
        />
        
        <HowItWorksTabsViagem />
        <WhyChooseUsTabsViagem />
        
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

export default Viagem;