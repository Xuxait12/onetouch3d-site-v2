import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionTriathlon from "@/components/HeroSectionTriathlon";
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

const Triathlon = () => {
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
        <HeroSectionTriathlon />
        
        {/* Seção 1 (antiga 4) - imagem à esquerda */}
        <FeatureSection
          title="Seus Dados de Prova Personalizados"
          description={<>Cada detalhe importa. E aqui, todos ganham vida.<br /><br />Seu nome, tempo oficial, tempo por modalidade e transição — tudo apresentado com clareza e elegância. Porque o triathlon é feito de números que contam histórias.</>}
          imageSrc="/images/dados-prova.webp"
          imageAlt="Dados da prova"
          imageOnLeft={true}
        />
        
        {/* Wrapper for multiple sections with TRI background text */}
        <div className="relative overflow-hidden">
          {/* Giant TRI text in background - spans multiple sections */}
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
              TRI
            </h2>
          </div>
          
          <div className="relative" style={{ zIndex: 5 }}>
            {/* Seção 2 (antiga 6) - imagem à direita */}
            <FeatureSection
              title="Entrega Segura em Todo Brasil"
              description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil."
              imageSrc="/images/embalagem-segura.webp"
              imageAlt="Embalagem segura"
              imageOnLeft={false}
            />
            
            {/* Seção 3 (antiga 2) - imagem à esquerda */}
            <FeatureSection
              title="Percurso 3D Exclusivo"
              description={<>Reconstruímos seus percursos com precisão em 3D(miniatura) — natação, ciclismo e corrida — criando um registro único da sua prova.<br /><br />Um quadro que vai muito além de decoração: é a representação visual da sua superação.</>}
              imageSrc="/images/percurso-3d.webp"
              imageAlt="Percurso 3D da prova"
              imageOnLeft={true}
            />
            
            {/* Seção 4 (antiga 1) - imagem à direita */}
            <FeatureSection
              title="Moldura Premium e Durável"
              description={<>Acabamento à altura da sua conquista.<br /><br />Molduras resistentes, sofisticadas e com padrão profissional.<br /><br />Seu quadro não apenas valoriza sua medalha, mas se torna uma peça de destaque na decoração, com durabilidade e presença.</>}
              imageSrc="/images/quadro-moderno.gif"
              imageAlt="Moldura premium personalizada"
              imageOnLeft={false}
            />
            
            {/* Seção 5 (antiga 7) - imagem à esquerda */}
            <FeatureSection
              title="Sua Conquista em Destaque"
              description={<>Triathlon não é só uma prova. É uma jornada. Existem conquistas que mudam quem você é.<br /><br />O seu quadro coloca esse momento em evidência, eternizando a linha de chegada que você conquistou com foco, disciplina e coragem.</>}
              imageSrc="/images/medalhas.gif"
              imageAlt="Medalhas emolduradas"
              imageOnLeft={true}
            />
          </div>
        </div>
        
        {/* Seção 6 (antiga 3) - imagem à direita */}
        <FeatureSection
          title="Suas Fotos em Destaque"
          description={<>A emoção da prova em um lugar especial.<br /><br />Aquele registro na transição, o sorriso na corrida, o esforço na bike, o mergulho inicial… Suas fotos ganham um espaço pensado para transmitir a intensidade e o orgulho desse dia inesquecível.</>}
          imageSrc="/images/fotos-scrapbook.webp"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={false}
        />
        
        {/* Seção 7 (antiga 5) - imagem à esquerda */}
        <FeatureSection
          title="Design Moderno e Exclusivo"
          description={<>Criado para destacar a sua dedicação.<br />Cada quadro nasce para valorizar sua trajetória no esporte mais desafiador do mundo.<br />Um layout elegante, equilibrado e impactante — perfeito para qualquer ambiente, do escritório ao espaço de casa.</>}
          imageSrc="/images/quadro-moderno.webp"
          imageAlt="Layout moderno e exclusivo"
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

export default Triathlon;