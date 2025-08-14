import { MousePointer2, Upload, CheckCircle, Package } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    title: "Escolha o modelo",
    description: "Selecione o design que mais combina com você"
  },
  {
    icon: Upload,
    title: "Envie seus dados",
    description: "Compartilhe os detalhes da sua corrida"
  },
  {
    icon: CheckCircle,
    title: "Aprove a arte",
    description: "Revise e aprove o design personalizado"
  },
  {
    icon: Package,
    title: "Receba seu quadro",
    description: "Receba pronto para pendurar na parede"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="section-spacing max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 animate-fade-up">
        <h2 className="section-text mb-4">Como funciona</h2>
        <p className="body-large text-muted-foreground">
          Simples, rápido e personalizado
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div 
            key={step.title}
            className="text-center animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto shadow-soft">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;