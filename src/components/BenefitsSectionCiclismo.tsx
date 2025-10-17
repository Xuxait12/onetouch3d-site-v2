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

const BenefitsSectionCiclismo = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary/40 via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Por que escolher nossos quadros?
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="group bg-card rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-up border border-border/50"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-accent transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSectionCiclismo;
