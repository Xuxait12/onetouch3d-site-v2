import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import FAQSection from "@/components/FAQSection";
import CtaSection from "@/components/CtaSection";
import GallerySection from "@/components/GallerySection";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhyChooseSection from "@/components/WhyChooseSection";

// Import images
import premiumFrame from "@/assets/premium-frame.jpg";

const Corrida = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <GlobalHeader />
      
      <main>
        <HeroSection />
        
        <FeatureSection
          title="Moldura premium"
          description="Transforme sua conquista em arte: uma moldura exclusiva que valoriza cada detalhe com elegância e sofisticação."
          imageSrc={premiumFrame}
          imageAlt="Moldura premium personalizada"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Percurso 3D da sua prova"
          description="Reviva cada emoção da sua corrida com o percurso em 3D ou opte pela versão SEM ALTO RELEVO. Cada quilômetro da sua conquista ganha destaque em um quadro exclusivo, feito para eternizar sua vitória."
          imageSrc="/lovable-uploads/9d29309d-d713-40d4-910c-40e574c7147e.png"
          imageAlt="Percurso 3D da prova"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Suas fotos em destaque"
          description="Envie as fotos mais marcantes da sua prova e nós transformaremos sua conquista em uma lembrança exclusiva. Cada detalhe será personalizado em estilo scrapbook, criando uma arte única que eterniza esse seu momento especial."
          imageSrc="/lovable-uploads/cffe1512-5aa2-4772-a8ca-769908354178.png"
          imageAlt="Fotos em destaque estilo scrapbook"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Dados pessoais da sua prova"
          description="Todos os dados importantes da sua corrida gravados permanentemente: tempo, distância, pace. Personalizamos do seu jeito."
          imageSrc="/lovable-uploads/da6090ca-3f85-42bd-a91c-b5c8cf836006.png"
          imageAlt="Dados da prova"
          imageOnLeft={false}
        />
        
        <FeatureSection
          title="Layout moderno e exclusivo"
          description="Um produto único que combina tecnologia 3D de ponta com design sofisticado para eternizar suas conquistas."
          imageSrc="/lovable-uploads/08725db7-f098-448e-b49b-34385f462460.png"
          imageAlt="Layout moderno e exclusivo"
          imageOnLeft={true}
        />
        
        <FeatureSection
          title="Embalagem segura"
          description="Seu produto chega protegido em uma embalagem especial, garantindo que sua lembrança chegue em perfeita condições até você."
          imageSrc="/lovable-uploads/925aca7c-d20c-45bc-8fb7-463c5ba8e600.png"
          imageAlt="Embalagem segura"
          imageOnLeft={false}
        />
        
        <HowItWorksSection />
        <BenefitsSection />
        <GallerySection />
        <TestimonialsSection />
        <FAQSection />
        
        <CtaSection />
      </main>

      <GlobalFooter />
      <WhatsAppButton />
    </div>
  );
};

export default Corrida;