import HeaderLanding from "@/components/HeaderLanding";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeatureSection from "@/components/FeatureSection";
import { Logos3 } from "@/components/ui/logos3";
import BenefitsSection from "@/components/BenefitsSection";
import GallerySection from "@/components/GallerySection";
import ProductSection from "@/components/ProductSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BlurIn } from "@/components/ui/blur-in";

import premiumFrame from "@/assets/premium-frame.jpg";
const routeMap = "/lovable-uploads/68eacf6d-3bb9-4055-9393-0b6bb4e9f571.png";
const marathonPhotos = "/lovable-uploads/21b002b5-2f2c-4d1f-8328-552225739dc6.png";
const modernDisplay = "/lovable-uploads/5de0791a-3bf0-4f5d-b44a-3d290400fb08.png";
const raceDetails = "/lovable-uploads/c7196af7-624d-4380-aa89-2073d2ba2cb0.png";
const securePackaging = "/lovable-uploads/def7cbeb-e713-4419-95fc-602df501de68.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Background gradient similar to OneTouch3D home */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10"></div>
      
      <HeaderLanding />
      <HeroSection />
      
      {/* Content sections with background */}
      <div className="bg-background">
        {/* Highlighted phrase */}
        <section className="py-8 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-text animate-fade-up">
              Por que escolher nossos quadros?
            </h2>
          </div>
        </section>
        
        {/* Feature sections */}
        <FeatureSection
          title="Sua conquista merece ser eternizada com elegância"
          description="Molduras minimalistas em madeira de reflorestamento e acabamento premium, que unem sofisticação e respeito ao meio ambiente."
          imageSrc={premiumFrame}
          imageAlt="Moldura premium em madeira de reflorestamento com acabamento elegante"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Impressão 3D exclusiva do percurso"
          description="Tecnologia de impressão 3D cria o percurso da sua prova em alto relevo, tornando cada quadro único e diferenciado."
          imageSrc={routeMap}
          imageAlt="Mapa 3D impresso em relevo mostrando percurso de corrida"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Suas fotos em destaque"
          description="Criamos um layout personalizado em estilo scrapbook, que valoriza suas melhores fotos da prova de forma única e artística."
          imageSrc={marathonPhotos}
          imageAlt="Collage de fotos de maratonistas estilo scrapbook"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Design moderno e sofisticado"
          description="Cada quadro é pensado para se integrar perfeitamente ao seu ambiente, criando um ponto focal elegante na decoração."
          imageSrc={modernDisplay}
          imageAlt="Quadro personalizado exibido em parede moderna"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Informações detalhadas da prova"
          description="Incluímos dados precisos como tempo, pace, distância e outros detalhes importantes da sua conquista."
          imageSrc={raceDetails}
          imageAlt="Ícones representando tempo, pace e distância"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Envio seguro e protegido"
          description="Embalagem especial resistente garante que seu quadro chegue em perfeitas condições, com total segurança."
          imageSrc={securePackaging}
          imageAlt="Embalagem resistente para proteção do quadro"
          imageOnLeft={false}
        />
        
        <Logos3 />
        
        <HowItWorksSection />
        <TestimonialsSection />
        <GallerySection />
        <ProductSection />
        <CtaSection />
        <FAQSection />
        <Footer />
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;
