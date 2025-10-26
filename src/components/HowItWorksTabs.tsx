import { useState } from "react";
import {
  Layers,
  MessageSquare,
  Brush,
  ThumbsUp,
  Truck
} from "lucide-react";

const steps = [
  {
    id: 1,
    label: "Modelo",
    title: "Escolha seu modelo",
    description:
      "Escolha a moldura que representa a grandeza da sua conquista. Cada detalhe é pensado para dar o destaque que sua vitória merece. Sua conquista é única — e seu quadro também deve ser.",
    icon: <Layers size={38} />
  },
  {
    id: 2,
    label: "Informações",
    title: "Envie suas informações",
    description:
      "Envie suas fotos, tempo oficial, nome e uma imagem da medalha pelo WhatsApp. Nossa equipe cuida do resto! Quanto mais detalhes você enviar, mais completa fica sua conquista.",
    icon: <MessageSquare size={38} />
  },
  {
    id: 3,
    label: "Personalização",
    title: "Produção personalizada",
    description:
      "Criamos sua arte com cuidado absoluto, destacando seu percurso, sua medalha e cada detalhe que fez você chegar até aqui. Personalizamos tudo para que seu quadro seja tão único quanto sua conquista.",
    icon: <Brush size={38} />
  },
  {
    id: 4,
    label: "Aprovar",
    title: "Aprovar sua arte",
    description:
      "Antes de produzir, você recebe uma prévia da arte para ajustar e aprovar tudo com tranquilidade. Só seguimos quando estiver perfeito! Você revisa, aprova e só então produzimos.",
    icon: <ThumbsUp size={38} />
  },
  {
    id: 5,
    label: "Envio",
    title: "Receba em casa",
    description:
      "Após a aprovação, seu quadro é enviado em 5 a 7 dias úteis. Frete com total segurança para todo o Brasil! O próximo passo é recebê-lo em casa e reviver sua conquista todos os dias.",
    icon: <Truck size={38} />
  }
];

export default function HowItWorksTabs() {
  const [active, setActive] = useState(1);
  const activeContent = steps.find((step) => step.id === active);

  return (
    <section className="w-full flex flex-col items-center gap-10 py-14 md:py-20 px-4">
      <h2 className="section-text text-center">Como Funciona</h2>

      {/* Tabs Apple Style */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto px-2 py-2 rounded-full bg-secondary/50 w-full max-w-4xl scrollbar-hide">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActive(step.id)}
            className={`
              px-4 md:px-6 py-2 md:py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 text-sm md:text-base
              ${
                active === step.id
                  ? "bg-accent text-accent-foreground shadow-lg scale-105"
                  : "bg-card border border-border text-foreground hover:bg-secondary hover:scale-102"
              }
            `}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col items-center max-w-2xl text-center gap-6 px-4 animate-fade-in">
        <div className="text-accent">
          {activeContent?.icon}
        </div>
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
          {activeContent?.title}
        </h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {activeContent?.description}
        </p>
      </div>
    </section>
  );
}
