import { Award, Palette, Star, Truck } from "lucide-react";

const benefits = [
  {
    icon: Award,
    title: "Destaque para sua medalha",
    description: "Sua conquista em evidência"
  },
  {
    icon: Palette,
    title: "Personalização completa",
    description: "Cada detalhe do seu jeito"
  },
  {
    icon: Star,
    title: "Qualidade premium",
    description: "Impressão 3D de alta qualidade"
  },
  {
    icon: Truck,
    title: "Entrega segura",
    description: "Em todo o Brasil"
  }
];

const BenefitsSection = () => {
  return (
    <section className="section-spacing bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-text mb-4">Por que escolher nossos quadros?</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;