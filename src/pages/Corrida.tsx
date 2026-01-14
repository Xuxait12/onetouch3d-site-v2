import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSectionCorrida from "@/components/TestimonialsSectionCorrida";
import ProductSectionCorridaLocal from "@/pages/stores/ProductSectionCorridaLocal";
import HowItWorksTabs from "@/components/HowItWorksTabs";
import WhyChooseUsTabsCorrida from "@/components/WhyChooseUsTabsCorrida";
import FAQSectionCorrida from "@/components/FAQSectionCorrida";
import CtaSection from "@/components/CtaSection";
import GallerySectionCorrida from "@/components/GallerySectionCorrida";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhyChooseSection from "@/components/WhyChooseSection";
import InfiniteLogoCarousel from "@/components/ui/infinite-logo-carousel";
import ShareSectionCorrida from "@/components/ShareSectionCorrida";

// Import images
import premiumFrame from "@/assets/premium-frame.jpg";
const Corrida = () => {
  const location = useLocation();
  useEffect(() => {
    const stateAny = window.history.state && window.history.state.usr || {};
    const anchor = stateAny.anchor || (window.location.hash ? window.location.hash.replace('#', '') : '');
    if (anchor) {
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  }, [location]);
  return <div className="min-h-screen bg-transparent">
      <GlobalHeader />
      
      <main>
        <HeroSection />
        
        <FeatureSection title="Moldura Premium para Quadros de Corrida" description={<>Nossas molduras são produzidas com materiais de alta resistência e acabamento sofisticado.<br /><br />Seu quadro não apenas valoriza sua medalha, mas também se torna parte da decoração.</>} imageSrc="/images/quadro-moderno.gif" imageAlt="Moldura premium personalizada" imageOnLeft={true} />
        
        {/* Feature sections wrapper */}
        <div className="relative overflow-hidden">
          <div className="relative" style={{
          zIndex: 5
        }}>
            <FeatureSection title="Percurso 3D da Sua Corrida" description={<>Recriamos o trajeto da sua maratona ou meia maratona em 3D com precisão.<br /><br />Tornando cada quadro único e totalmente personalizado com o percurso da sua conquista.</>} imageSrc="/images/percurso-3d.webp" imageAlt="Percurso 3D da prova" imageOnLeft={false} />
            
            <FeatureSection title="Suas Fotos em Destaque" description={<>Selecione os momentos mais marcantes da sua prova.<br /><br />Veja sua história ganhar vida em um quadro moderno, emocionante e totalmente personalizado.</>} imageSrc="/images/fotos-scrapbook.webp" imageAlt="Fotos em destaque estilo scrapbook" imageOnLeft={true} />
            
            <FeatureSection title="Dados da Prova Integrados ao Design" description={<>Transformamos seus dados — nome, distância, tempo oficial e pace — em uma composição visual que celebra cada detalhe da sua jornada.<br /><br />Cada número representa esforço, estratégia e superação.</>} imageSrc="/images/dados-prova.webp" imageAlt="Dados da prova" imageOnLeft={false} />
            
            <FeatureSection title="Quadros para Medalha" description={<>Um layout pensado para destacar sua corrida com estilo.<br /><br />Seu quadro combina com qualquer ambiente, do quarto à sala de estar.</>} imageSrc="/images/quadro-moderno-corrida.webp" imageAlt="Layout moderno e exclusivo" imageOnLeft={true} />
          </div>
        </div>
        
        <FeatureSection title="Sua Conquista em Destaque" description={<>Existem conquistas que merecem um destaque especial.<br /><br />Dê vida as suas medalhas emoldurando em um quadro exclusivo seu momento mais inesquecível.</>} imageSrc="/images/medalhas.gif" imageAlt="Medalhas emolduradas" imageOnLeft={false} />
        
        <FeatureSection title="Entrega Segura em Todo Brasil" description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil." imageSrc="/images/embalagem-segura.webp" imageAlt="Embalagem segura" imageOnLeft={true} />
        
        <HowItWorksTabs />
        <WhyChooseUsTabsCorrida />
        
        
        
        <GallerySectionCorrida />
        <TestimonialsSectionCorrida />
        <ShareSectionCorrida />
        
        
        <ProductSectionCorridaLocal />
        <FAQSectionCorrida />
        
        
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>;
};
export default Corrida;