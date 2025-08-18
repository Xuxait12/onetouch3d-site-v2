import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "O que precisa para personalizar um quadro?",
    answer: "Para personalizar um quadro é necessário que o cliente nos envie algumas informações da sua corrida. Informações como tempo oficial da prova, foto(s) da sua prova, foto da sua medalha e o percurso da prova são necessários para elaboração do layout do seu quadro. Todas as informações deverão ser enviadas pelo cliente através do nosso WhatsApp."
  },
  {
    question: "Preciso enviar a medalha pelo correio para adicionar ela no meu quadro?",
    answer: "Não, basta o cliente enviar uma foto da medalha frontal com as medidas reais da sua medalha. Com isso iremos recortar a imagem que você nos enviou e iremos simular a medalha no tamanho real na arte do seu quadro. Depois do cliente aprovar a arte, iremos retirar a imagem da sua medalha."
  },
  {
    question: "Como é elaborada a arte do quadro?",
    answer: "Neste caso existem duas opções. Provas mais conhecidas ou mais requisitadas em sua grande maioria já temos a arte elaborada, sendo assim basta o cliente apenas nos enviar o tempo oficial e a(s) foto(s) da sua prova. Já quando a sua prova for de uma cidade menos requisitada iremos lhe oferecer algumas opções de artes criadas. É importante mencionar que o quadro só é produzido após a APROVAÇÃO da arte pelo cliente."
  },
  {
    question: "Quantas fotos e qual resolução das fotos para fazer a arte do quadro?",
    answer: "A quantidade de fotos fica a critério do cliente. Porém quanto mais imagens forem adicionadas maior poderá ser o tamanho do quadro. A resolução das fotos precisa ser entre média e alta resolução."
  },
  {
    question: "Como é feito o percurso da prova em 3D?",
    answer: "Para produzirmos o percurso em 3D, precisamos que o cliente nos envie o percurso da prova em GPX ou o link da atividade que normalmente o cliente registra em aplicativos de práticas esportivas. Esses aplicativos são conhecidos como Strava, Garmin entre outros."
  },
  {
    question: "Como é a embalagem do quadro para envio?",
    answer: "A embalagem do produto é feita especialmente para envio de quadros. Trata-se de uma caixa de papelão reforçada e revestida internamente por isopor em todos os lados."
  }
];

const FAQSection = () => {
  return (
    <section className="section-spacing bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-text animate-fade-up">
            Perguntas Frequentes
          </h2>
        </div>
        
        <div className="animate-fade-up">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/20 rounded-lg px-6 bg-card/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
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

export default FAQSection;