import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSectionCiclismo from "@/components/HeroSectionCiclismo";
import FeatureSection from "@/components/FeatureSection";
import FeatureSectionCiclismo from "@/components/FeatureSectionCiclismo";
import TestimonialsSectionCiclismo from "@/components/TestimonialsSectionCiclismo";
import ProductSectionCiclismoLocal from "@/pages/stores/ProductSectionCiclismoLocal";
import HowItWorksTabsCiclismo from "@/components/HowItWorksTabsCiclismo";
import WhyChooseUsTabsCiclismo from "@/components/WhyChooseUsTabsCiclismo";
import FAQSectionCiclismo from "@/components/FAQSectionCiclismo";
import GallerySectionCiclismo from "@/components/GallerySectionCiclismo";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareSectionCiclismo from "@/components/ShareSectionCiclismo";
import EmotionalSectionCiclismo from "@/components/EmotionalSectionCiclismo";
const Ciclismo = () => {
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
        <HeroSectionCiclismo />
        
        {/* Seção 1 (antiga 5) - imagem à esquerda */}
        <FeatureSectionCiclismo title="Sua História Eternizada" description={<>O resultado é uma peça elegante, versátil e marcante.<br /><br />Integrando perfeitamente a qualquer ambiente — do escritório ao espaço esportivo da casa — transformando sua dedicação em arte e sua prova em decoração com propósito.</>} imageSrc="/images/quadro-moderno.webp" imageAlt="Layout moderno e exclusivo" imageOnLeft={true} />
        
        {/* Wrapper for multiple sections */}
        <div className="relative overflow-hidden">
          <div className="relative" style={{
          zIndex: 5
        }}>
            {/* Seção 2 (antiga 2) - imagem à direita */}
            <FeatureSection title="A Jornada Completa Ganha Vida" description={<>Transformamos o trajeto completo da sua prova em um percurso 3D preciso e cheio de presença, recriando cada curva, cada subida e cada quilômetro que você venceu.<br /><br />É a sua jornada ganhando forma, textura e profundidade, eternizada em um quadro que destaca visualmente tudo o que você conquistou com esforço, disciplina e paixão pela bike.</>} imageSrc="/images/percurso-3d.webp" imageAlt="Percurso 3D da prova" imageOnLeft={false} />
            
            {/* Seção 3 (antiga 7) - imagem à esquerda */}
            <FeatureSection title="Sua Conquista em Destaque" description={<>O dia da sua conquista não termina na linha de chegada. Ele continua em cada lembrança, em cada detalhe do percurso.<br /><br />Transformar esse momento em algo visível é dar valor à sua história. É permitir que sua conquista siga inspirando todos os dias.</>} imageSrc="/images/conquista-destaque-ciclismo.webp" imageAlt="Medalhas emolduradas" imageOnLeft={true} />
            
            {/* Seção 4 (antiga 4) - imagem à direita */}
            <FeatureSection title="Dados do Seu Pedal/Prova Personalizados" description={<>Personalizamos seu quadro com todas as informações que tornam sua conquista única — seu nome, sua prova, seu tempo oficial, sua velocidade média, e cada dado que representa o seu esforço real.<br /><br />O resultado é um registro autêntico, completo e emocionante da sua performance, transformando números em memória, esforço em arte e a sua conquista em algo digno de ser celebrado todos os dias.</>} imageSrc="/images/dados-pedal-ciclismo.webp" mobileImageSrc="/images/dados-pedal-ciclismo-mobile.webp" imageAlt="Dados da prova" imageOnLeft={false} />
            
            {/* Seção 5 (antiga 1) - imagem à esquerda */}
            <FeatureSection title="Moldura Premium" description={<>
                <p className="mb-4">Nossas molduras são produzidas com materiais de alta resistência e acabamento sofisticado.</p>
                <p>Seu quadro não apenas valoriza sua medalha, mas também se torna parte da decoração.</p>
              </>} imageSrc="/images/moldura-premium-ciclismo.webp" mobileImageSrc="/images/moldura-premium-mobile.webp" imageAlt="Moldura premium personalizada" imageOnLeft={true} />
          </div>
        </div>
        
        {/* Seção 6 - Suas Fotos em Destaque - imagem à direita */}
        <FeatureSection title="Suas Fotos em Destaque" description={<>
            <p className="mb-4">Cada foto do seu pedal carrega um sentimento — e agora pode ganhar um lugar especial.</p>
            <p>Componha seu quadro e veja sua jornada se transformar em uma peça marcante e cheia de identidade.</p>
          </>} imageSrc="/images/fotos-scrapbook-ciclismo.webp" imageAlt="Fotos em destaque estilo scrapbook" imageOnLeft={false} objectFit="contain" />
        
        {/* Seção 7 - Entrega Segura em Todo Brasil - imagem à esquerda */}
        <FeatureSection title="Entrega Segura em Todo Brasil" description="Seus quadros são embalados com proteção reforçada, garantindo que cheguem em perfeito estado até a sua casa, em qualquer lugar do Brasil." imageSrc="/images/embalagem-segura.webp" imageAlt="Embalagem segura" imageOnLeft={true} />
        
        <HowItWorksTabsCiclismo />
        <WhyChooseUsTabsCiclismo />
        
        <EmotionalSectionCiclismo />
        
        <GallerySectionCiclismo />
        <TestimonialsSectionCiclismo />
        
        {/* ETERNIZE background text positioned above Nossa loja section */}
        
        
        <ProductSectionCiclismoLocal />
        <ShareSectionCiclismo />
        <FAQSectionCiclismo />
        

      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>;
};
export default Ciclismo;