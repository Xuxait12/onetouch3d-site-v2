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
    icon: <Layers size={40} />
  },
  {
    id: 2,
    label: "Informações",
    title: "Envie suas informações",
    description:
      "Envie suas fotos, tempo oficial, nome e uma imagem da medalha pelo WhatsApp. Nossa equipe cuida do resto! Quanto mais detalhes você enviar, mais completa fica sua conquista.",
    icon: <MessageSquare size={40} />
  },
  {
    id: 3,
    label: "Personalização",
    title: "Produção personalizada",
    description:
      "Criamos sua arte com cuidado absoluto, destacando seu percurso, sua medalha e cada detalhe que fez você chegar até aqui. Personalizamos tudo para que seu quadro seja tão único quanto sua conquista.",
    icon: <Brush size={40} />
  },
  {
    id: 4,
    label: "Aprovar",
    title: "Aprovar sua arte",
    description:
      "Antes de produzir, você recebe uma prévia da arte para ajustar e aprovar tudo com tranquilidade. Só seguimos quando estiver perfeito! Você revisa, aprova e só então produzimos.",
    icon: <ThumbsUp size={40} />
  },
  {
    id: 5,
    label: "Envio",
    title: "Receba em casa",
    description:
      "Após a aprovação, seu quadro é enviado em 5 a 7 dias úteis. Frete com total segurança para todo o Brasil! O próximo passo é recebê-lo em casa e reviver sua conquista todos os dias.",
    icon: <Truck size={40} />
  }
];

export default function HowItWorksTabs() {
  const [active, setActive] = useState(1);

  return (
    <section className="w-full flex flex-col items-center gap-10 py-14 md:py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">Como Funciona</h2>

      {/* Tabs container com slider */}
      <div className="relative flex items-center rounded-full bg-secondary/50 px-2 py-2 gap-2 overflow-hidden shadow-inner max-w-4xl w-full">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActive(step.id)}
            className={`
              px-4 md:px-6 py-2 md:py-2.5 font-medium transition-all duration-300 relative z-10 whitespace-nowrap text-sm md:text-base flex-1
              ${
                active === step.id
                  ? "text-accent-foreground"
                  : "text-foreground hover:text-foreground/80"
              }
            `}
          >
            {step.label}
          </button>
        ))}

        {/* Slider animado */}
        <div
          className="absolute top-2 bottom-2 bg-accent rounded-full transition-all duration-300 ease-out z-0 shadow-lg"
          style={{
            width: `calc((100% - 16px) / ${steps.length})`,
            left: `calc((100% - 16px) / ${steps.length} * ${active - 1} + 8px)`
          }}
        />
      </div>

      {/* Conteúdo das abas */}
      {steps
        .filter((step) => step.id === active)
        .map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center max-w-2xl gap-6 px-4 animate-fade-in"
          >
            <div className="text-accent">{step.icon}</div>
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground">{step.title}</h3>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
    </section>
  );
}
