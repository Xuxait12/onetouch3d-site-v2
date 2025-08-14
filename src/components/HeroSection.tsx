import { Button } from "@/components/ui/button";
import heroRunner from "@/assets/hero-runner.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left animate-fade-up">
          <h1 className="hero-text mb-6">
            <span className="accent-blue">Transforme</span> Sua Corrida em Uma Lembrança Eterna
          </h1>
          <p className="body-large text-muted-foreground mb-8 max-w-xl">
            Quadros personalizados que contam a história da sua conquista, quilômetro por quilômetro.
          </p>
          <Button variant="hero" size="xl" className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Criar Meu Quadro Agora
          </Button>
        </div>
        
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <img 
            src={heroRunner} 
            alt="Corredor cruzando linha de chegada com braços erguidos em vitória" 
            className="w-full h-auto rounded-2xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;