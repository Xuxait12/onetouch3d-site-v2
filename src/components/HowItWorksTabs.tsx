import {
  MessageSquare,
  Brush,
  ThumbsUp,
  Truck,
  ArrowRight,
  ArrowDown
} from "lucide-react";

const steps = [
  {
    id: 1,
    label: "Informações",
    title: "Envie suas informações",
    description:
      "Envie suas fotos, tempo oficial, nome e uma imagem da medalha pelo WhatsApp. Nossa equipe cuida do resto! Quanto mais detalhes você enviar, mais completa fica sua conquista.",
    icon: <MessageSquare size={32} />
  },
  {
    id: 2,
    label: "Personalização",
    title: "Produção personalizada",
    description:
      "Criamos sua arte com cuidado absoluto, destacando seu percurso, sua medalha e cada detalhe que fez você chegar até aqui. Personalizamos tudo para que seu quadro seja tão único quanto sua conquista.",
    icon: <Brush size={32} />
  },
  {
    id: 3,
    label: "Aprovar",
    title: "Aprovar sua arte",
    description:
      "Antes de produzir, você recebe uma prévia da arte para ajustar e aprovar tudo com tranquilidade. Só seguimos quando estiver perfeito! Você revisa, aprova e só então produzimos.",
    icon: <ThumbsUp size={32} />
  },
  {
    id: 4,
    label: "Envio",
    title: "Receba em casa",
    description:
      "Após a aprovação, seu quadro é enviado em 5 a 7 dias úteis. Frete com total segurança para todo o Brasil! O próximo passo é recebê-lo em casa e reviver sua conquista todos os dias.",
    icon: <Truck size={32} />
  }
];

export default function HowItWorksTabs() {
  return (
    <section className="w-full flex flex-col items-center gap-10 py-14 md:py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">Como Funciona</h2>

      {/* Desktop: 4 cards in a row with arrows */}
      {/* Desktop: 4 cards in a row with arrows */}
      <div className="hidden lg:grid grid-cols-7 gap-4 max-w-6xl w-full items-stretch">
        {steps.map((step, index) => (
          <>
            <div
              key={step.id}
              className="col-span-1 flex flex-row items-start gap-4 bg-secondary/30 rounded-2xl p-4 border border-border/50"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {step.id}
                </span>
                <div className="text-accent">{step.icon}</div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div key={`arrow-${index}`} className="col-span-1 flex items-center justify-center">
                <ArrowRight size={28} className="text-accent" />
              </div>
            )}
          </>
        ))}
      </div>

      {/* Tablet: 2x2 grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 max-w-2xl w-full">
        {steps.map((step, index) => (
          <>
            <div
              key={step.id}
              className="flex flex-row items-start gap-4 bg-secondary/30 rounded-2xl p-4 border border-border/50"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {step.id}
                </span>
                <div className="text-accent">{step.icon}</div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
            {index === 1 && (
              <div key="arrow-row" className="col-span-2 flex justify-center py-2">
                <ArrowDown size={28} className="text-accent" />
              </div>
            )}
          </>
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="flex flex-col items-center gap-4 md:hidden w-full max-w-md">
        {steps.map((step, index) => (
          <>
            <div
              key={step.id}
              className="flex flex-row items-start gap-4 bg-secondary/30 rounded-2xl p-4 border border-border/50 w-full"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {step.id}
                </span>
                <div className="text-accent">{step.icon}</div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowDown key={`arrow-${index}`} size={24} className="text-accent" />
            )}
          </>
        ))}
      </div>
    </section>
  );
}
