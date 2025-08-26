import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="pt-8 pb-12 bg-gradient-cta">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <div className="animate-fade-up">
          <h2 className="section-text mb-6">
            Sua história merece ser lembrada todos os dias
          </h2>
          <p className="body-large mb-8 opacity-90">
            Transforme sua conquista em uma obra de arte única e pessoal
          </p>
          <Button 
            variant="hero" 
            size="xl" 
            className="bg-white text-accent hover:bg-white/90"
          >
            Criar Meu Quadro Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;