import { MousePointer2, Upload, CheckCircle, Package } from "lucide-react";

const steps = [{
  icon: MousePointer2,
  title: "Escolha seu modelo",
  description: "Selecione a moldura que mais combina com sua conquista."
}, {
  icon: Upload,
  title: "Envie suas informações",
  description: "Fotos, tempo, distância e medalha da prova tudo pelo Whatsapp."
}, {
  icon: CheckCircle,
  title: "Produção personalizada",
  description: "Nossa equipe monta seu quadro exclusivo."
}, {
  icon: Package,
  title: "Receba em casa",
  description: "Entrega rápida e segura em qualquer região do Brasil."
}];

const HowItWorksSectionCiclismo = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent relative">
            Como Funciona
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 mx-auto mt-3 rounded-full"></div>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="group relative bg-card rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-up border border-border/50"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Número estilizado */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {index + 1}
              </div>
              
              {/* Ícone principal */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="w-20 h-20 bg-gradient-to-br from-accent via-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-accent/25 group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-10 h-10 text-white group-hover:drop-shadow-glow transition-all duration-300" />
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-accent transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSectionCiclismo;
