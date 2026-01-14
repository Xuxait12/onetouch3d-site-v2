import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const faqData = [{
  question: "Como envio minhas fotos e dados da minha viagem?",
  answer: <>
        <p className="mb-3">Você pode enviar tudo de forma rápida e prática pelo WhatsApp. Basta clicar no ícone disponível em nossa página e compartilhar as fotos e informações diretamente com nossa equipe.</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Fotos</strong>Fotos = envie a quantidade de fotos que deseja, quanto mais fotos maior terá que ser o seu quadro.</li>
          <li><strong>Dados</strong> = envie seu nome completo, duração da viagem, quilometragem e nome/modelo do seu veículo.</li>
        </ul>
      </>
}, {
  question: "Como envio informações do PERCURSO da minha viagem?",
  answer: <>
        <p className="mb-3">Para enviar as informações do percurso da sua viagem, você tem três maneiras:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Lista das cidades que fez sua aventura (arquivo word com as principais cidades).</li>
          <li>Uma imagem do desenho (Google Maps) com o percurso percorrido.</li>
          <li>GPS/GPX do percurso da sua viagem.</li>
        </ul>
      </>
}, {
  question: "É possível editar a arte antes da produção?",
  answer: "Sim. Antes de iniciarmos a produção, enviamos a arte digital para a sua aprovação. Só depois da sua APROVAÇÃO o quadro segue para fabricação. Assim, garantimos que o resultado final fique exatamente como você deseja."
}, {
  question: "Qual o prazo de produção e entrega?",
  answer: "Após a sua aprovação da arte, iniciamos a produção, que leva de 5 a 7 dias úteis. Em seguida, o quadro é enviado de acordo com a modalidade de frete escolhida. O prazo de entrega pode variar conforme a sua região e a forma de envio selecionada."
}, {
  question: "Vocês entregam em todo o Brasil?",
  answer: "Sim, realizamos entregas para todo o território nacional. Depois da aprovação da arte, apresentamos as opções de frete disponíveis para que você escolha a que melhor se adapta às suas necessidades."
}, {
  question: "E se meu quadro chegar danificado?",
  answer: "Fique tranquilo! Caso seu quadro chegue com qualquer dano, nós produziremos um novo e enviaremos novamente sem custo adicional, conforme nossa política de trocas e devoluções."
}, {
  question: "Quais formas de pagamento vocês aceitam?",
  answer: "Trabalhamos com diversas opções de pagamento para facilitar sua compra: cartão de crédito (com parcelamento), cartão de débito e PIX."
}];
const FAQSectionViagem = () => {
  return <section className="section-spacing" style={{
    background: 'transparent !important'
  }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-text animate-fade-up">
            Perguntas Frequentes
          </h2>
        </div>
        
        <div className="animate-fade-up">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border/20 rounded-lg px-6 bg-card/50 backdrop-blur-sm">
                <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};
export default FAQSectionViagem;