import { Award, Palette, Star, Truck } from "lucide-react";

const WhyChooseSection = () => {
  const benefits = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Destaque para sua medalha",
      description: "Sua conquista em evidência"
    },
    {
      icon: <Palette className="h-8 w-8 text-primary" />,
      title: "Personalização completa",
      description: "Cada detalhe do seu jeito"
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Qualidade premium",
      description: "Impressão 3D de alta qualidade"
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Entrega segura",
      description: "Em todo o Brasil"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="section-text mb-4">
            Por que escolher nossos quadros?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;