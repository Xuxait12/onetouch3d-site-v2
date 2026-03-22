import {
  MessageSquare,
  Brush,
  ThumbsUp,
  Truck
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Envie suas informações",
    description:
      "Envie suas fotos, tempo oficial, nome e uma imagem da medalha (se houver) pelo WhatsApp. Nossa equipe cuida do resto!",
    icon: <MessageSquare size={28} />
  },
  {
    id: 2,
    title: "Produção personalizada",
    description:
      "Criamos sua arte com cuidado absoluto, destacando seu percurso, sua medalha e cada detalhe da sua conquista.",
    icon: <Brush size={28} />
  },
  {
    id: 3,
    title: "Aprovar sua arte",
    description:
      "Você recebe uma prévia da arte para ajustar e aprovar tudo com tranquilidade. Só produzimos quando estiver perfeito!",
    icon: <ThumbsUp size={28} />
  },
  {
    id: 4,
    title: "Receba em casa",
    description:
      "Após a aprovação, seu quadro é enviado em 5 a 7 dias úteis com total segurança para todo o Brasil.",
    icon: <Truck size={28} />
  }
];

export default function HowItWorksTabsCiclismo() {
  return (
    <section className="w-full flex flex-col items-center gap-10 py-14 md:py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">Como Funciona</h2>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block w-full max-w-7xl">
        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-1/2 h-0.5 bg-border -translate-y-1/2" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex items-center justify-center w-1/4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-md">
                {step.id}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center gap-3">
              <div className="text-accent">{step.icon}</div>
              <h3 className="text-base font-bold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden w-full max-w-md">
        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-start gap-4 pl-0">
                <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-md shrink-0">
                  {step.id}
                </span>
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-accent">{step.icon}</span>
                    <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
