import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Como envio minhas fotos e dados da minha prova?",
    answer: "Você pode enviar tudo de forma rápida e prática pelo WhatsApp. Basta clicar no ícone disponível em nossa página e compartilhar as fotos e informações diretamente com nossa equipe."
  },
  {
    question: "Quantas fotos posso colocar na arte do quadro?",
    answer: "São no mínimo 3 fotos (uma de cada modalidade), porém você pode escolher conforme as opções de layout que oferecemos."
  },
  {
    question: "Quais provas vocês fazem?",
    answer: "Todas: Ironman, 70.3, SPRINT e provas independentes. Caso não tenhamos arte pronta da sua prova, faremos ela para você."
  },
  {
    question: "Qual o prazo de produção e entrega?",
    answer: "Após a sua aprovação da arte, iniciamos a produção, que leva de 5 a 10 dias úteis. Em seguida, o quadro é enviado de acordo com a modalidade de frete escolhida. O prazo de entrega pode variar conforme a sua região e a forma de envio selecionada."
  },
  {
    question: "Vocês adicionam a medalha?",
    answer: "Sim, criamos um espaço exclusivo para ela no quadro. Você não precisa enviar a medalha, faremos uma simulação dela na arte com uma imagem."
  },
  {
    question: "E se meu quadro chegar danificado?",
    answer: "Fique tranquilo! Caso seu quadro chegue com qualquer dano, nós produziremos um novo e enviaremos novamente sem custo adicional, conforme nossa política de trocas e devoluções."
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Trabalhamos com diversas opções de pagamento para facilitar sua compra: cartão de crédito (com parcelamento), cartão de débito e PIX."
  }
];

interface FAQSectionTriathlonProps {
  className?: string;
}

const FAQSectionTriathlon = ({ className = "" }: FAQSectionTriathlonProps) => {
  return (
    <section className={`section-spacing bg-background ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-text animate-fade-up text-2xl sm:text-3xl lg:text-4xl">
            Perguntas Frequentes
          </h2>
        </div>
        
        <div className="animate-fade-up">
          <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-triathlon-${index}`}
                className="border border-border/20 rounded-lg px-4 sm:px-6 bg-card/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4 sm:py-6 text-base sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-6 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSectionTriathlon;
