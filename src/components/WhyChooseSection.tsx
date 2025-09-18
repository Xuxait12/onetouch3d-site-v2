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
      description: "Impressão 3D e molduras premium de alta qualidade"
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
            Por que Escolher os Quadros OneTouch Frames?
          </h2>
          <div className="max-w-2xl mx-auto space-y-2 text-left">
            <p className="flex items-center text-muted-foreground">
              <span className="text-green-600 mr-2">✅</span>
              Produzidos com materiais premium e duráveis
            </p>
            <p className="flex items-center text-muted-foreground">
              <span className="text-green-600 mr-2">✅</span>
              Totalmente personalizados com fotos, percurso 3D e dados da sua corrida
            </p>
            <p className="flex items-center text-muted-foreground">
              <span className="text-green-600 mr-2">✅</span>
              Design exclusivo, ideal para decoração e lembrança
            </p>
            <p className="flex items-center text-muted-foreground">
              <span className="text-green-600 mr-2">✅</span>
              Embalagem segura e entrega para todo o Brasil
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8 animate-fade-up">
          <p className="text-lg text-muted-foreground">
            👉 Já eternizamos conquistas de grandes provas pelo Brasil e pelo mundo.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;