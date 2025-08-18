import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FeatureSection from "@/components/FeatureSection";
import { Logos3 } from "@/components/ui/logos3";
import BenefitsSection from "@/components/BenefitsSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import premiumFrame from "@/assets/premium-frame.jpg";
import routeMap from "@/assets/3d-route-map.jpg";
import marathonPhotos from "@/assets/marathon-photos.jpg";
import modernDisplay from "@/assets/modern-display.jpg";
import raceDetails from "@/assets/race-details.jpg";
import securePackaging from "@/assets/secure-packaging.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Background gradient similar to OneTouch3D home */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10"></div>
      
      <Header />
      <HeroSection />
      
      {/* Content sections with background */}
      <div className="bg-background">
        <ProblemSection />
        <SolutionSection />
        
        {/* Highlighted phrase */}
        <section className="py-8 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-text animate-fade-up">
              Porque escolher nossos quadros
            </h2>
          </div>
        </section>
        
        {/* Feature sections */}
        <FeatureSection
          title="Moldura premium de alta qualidade"
          description="Utilizamos molduras minimalistas pretas e brancas, com acabamento premium que valoriza sua conquista com sofisticação e elegância."
          imageSrc={premiumFrame}
          imageAlt="Moldura premium preta e branca minimalista"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Impressão 3D exclusiva do percurso"
          description="Tecnologia de impressão 3D cria um mapa em relevo do seu trajeto, tornando cada quadro único e diferenciado."
          imageSrc={routeMap}
          imageAlt="Mapa 3D impresso em relevo mostrando percurso de corrida"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Suas fotos em destaque"
          description="Criamos um layout personalizado estilo scrapbook que valoriza suas melhores fotos da maratona de forma artística."
          imageSrc={marathonPhotos}
          imageAlt="Collage de fotos de maratonistas estilo scrapbook"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Design moderno e sofisticado"
          description="Cada quadro é pensado para se integrar perfeitamente ao seu ambiente, criando um ponto focal elegante na decoração."
          imageSrc={modernDisplay}
          imageAlt="Quadro personalizado exibido em parede moderna"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Informações detalhadas da prova"
          description="Incluímos dados precisos como tempo, pace, distância e outros detalhes importantes da sua conquista."
          imageSrc={raceDetails}
          imageAlt="Ícones representando tempo, pace e distância"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Envio seguro e protegido"
          description="Embalagem especial resistente garante que seu quadro chegue em perfeitas condições, com total segurança."
          imageSrc={securePackaging}
          imageAlt="Embalagem resistente para proteção do quadro"
          imageOnLeft={true}
        />
        
        <Logos3 />
        <BenefitsSection />
        <GallerySection />
        <TestimonialsSection />
        <HowItWorksSection />
        <CtaSection />
        <Footer />
      </div>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;
