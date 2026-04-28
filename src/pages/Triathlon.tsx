import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionTriathlon from "@/components/HeroSectionTriathlon";
import HeroSectionCampanha from "@/components/HeroSectionCampanha";
import { useCampanhaAtiva } from "@/hooks/useCampanhaAtiva";
import FeatureSection from "@/components/FeatureSection";
import EmotionalSectionTriathlon from "@/components/EmotionalSectionTriathlon";
import TestimonialsSectionTriathlon from "@/components/TestimonialsSectionTriathlon";
import ProductSectionTriathlonLocal from "@/pages/stores/ProductSectionTriathlonLocal";
import HowItWorksTabs from "@/components/HowItWorksTabs";
import WhyChooseUsTabsTriathlon from "@/components/WhyChooseUsTabsTriathlon";
import FAQSectionTriathlon from "@/components/FAQSectionTriathlon";
import GallerySectionTriathlon from "@/components/GallerySectionTriathlon";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareSection from "@/components/ShareSection";
import EmotionalImageSectionTriathlon from "@/components/EmotionalImageSectionTriathlon";

const Triathlon = () => {
  const location = useLocation();
  const { campanha, isLoading: isLoadingCampanha } = useCampanhaAtiva('triathlon');
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
        {isLoadingCampanha ? (
          <div className="w-full min-h-[100svh] bg-gray-900" aria-hidden />
        ) : campanha ? (
          <HeroSectionCampanha campanha={campanha} />
        ) : (
          <HeroSectionTriathlon />
        )}
        
        <GallerySectionTriathlon />
        
        <div className="relative overflow-hidden">
          <div className="relative" style={{
          zIndex: 5
        }}>
            <FeatureSection title="Sua Prova Reconstruída em Detalhes" description={<>Reconstruímos seus percursos com precisão em 3D(miniatura) — natação, ciclismo e corrida — criando um registro único da sua prova.<br /><br />Um quadro que vai muito além de decoração: é a representação visual da sua superação.</>} imageSrc="/images/percurso-3d.webp" imageAlt="Percurso 3D da prova" imageOnLeft={true} />
            
            <EmotionalSectionTriathlon />
            
            <FeatureSection title="Números Que Contam Sua História" description={<>Cada detalhe importa. E aqui, todos ganham vida.<br /><br />Seu nome, tempo oficial, tempo por modalidade e transição — tudo apresentado com clareza e elegância.<br /><br />Porque o triathlon é feito de números que contam histórias.</>} imageSrc="/images/dados-triathlon.webp" mobileImageSrc="/images/dados-triathlon-mobile.webp" imageAlt="Tempos do triathlon - Swim, Bike, Run" imageOnLeft={true} />
          </div>
        </div>
        
        <FeatureSection title="Elegância e Durabilidade" description={<>Acabamento à altura da sua conquista.<br /><br />Molduras resistentes, sofisticadas e com padrão profissional.<br /><br />Seu quadro não apenas valoriza sua medalha, mas se torna uma peça de destaque na decoração, com durabilidade e presença.</>} imageSrc="/images/quadro-moderno.gif" imageAlt="Moldura premium personalizada" imageOnLeft={false} mobileImageSrc="/images/moldura-premium-triathlon-mobile.webp" />
        
        <HowItWorksTabs />
        <TestimonialsSectionTriathlon />
        <WhyChooseUsTabsTriathlon />
        
        <FeatureSection title="Beleza e Força em um Só Quadro" description={<>Criado para destacar a sua dedicação.<br />Cada quadro nasce para valorizar sua trajetória no esporte mais desafiador do mundo.<br />Um layout elegante, equilibrado e impactante — perfeito para qualquer ambiente, do escritório ao espaço de casa.</>} imageSrc="/images/ambiente-moderno-triathlon.webp" imageAlt="Layout moderno e exclusivo" imageOnLeft={false} />
        
        <FeatureSection title="A Sua Vitória Merece Destaque" description={<>Triathlon não é só uma prova. É uma jornada. Existem conquistas que mudam quem você é.<br /><br />A sua medalha coloca esse momento em evidência, eternizando a linha de chegada que você conquistou com foco, disciplina e coragem.</>} imageSrc="/images/triathlon-medalhas.webp" imageAlt="Medalhas emolduradas" imageOnLeft={true} />
        
        <FeatureSection title="Entrega Segura em Todo Brasil" description={<>Da Onetouch3D até você — com cuidado absoluto.<br /><br />Cada quadro é embalado com proteção reforçada para chegar perfeito, independentemente do estado onde você mora.<br />Segurança e qualidade da produção até a sua porta.</>} imageSrc="/images/embalagem-segura.webp" imageAlt="Embalagem segura" imageOnLeft={false} />
        
        <EmotionalImageSectionTriathlon />
        
        <ProductSectionTriathlonLocal />
        <ShareSection />
        <FAQSectionTriathlon className="py-0" />
        
        
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>;
};
export default Triathlon;
