import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
        
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              A OneTouch Frames respeita sua privacidade e está comprometida em proteger suas informações pessoais. 
              Esta política descreve como coletamos, usamos e protegemos seus dados.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Informações que Coletamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dados pessoais fornecidos no cadastro (nome, e-mail, telefone)</li>
              <li>Endereço de entrega e cobrança</li>
              <li>Informações de pagamento (processadas com segurança)</li>
              <li>Dados de navegação e cookies</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Como Usamos suas Informações</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processar e entregar seus pedidos</li>
              <li>Comunicar sobre o status do pedido</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Enviar ofertas e novidades (com seu consentimento)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Proteção de Dados</h2>
            <p>
              Utilizamos medidas de segurança técnicas e organizacionais adequadas para proteger 
              suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Seus Direitos</h2>
            <p>
              Você tem direito a acessar, corrigir, excluir ou solicitar a portabilidade de seus dados. 
              Para exercer esses direitos, entre em contato conosco através dos canais disponíveis.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Contato</h2>
            <p>
              Para dúvidas sobre esta política, entre em contato pelo WhatsApp (54) 9992-1515 
              ou através dos nossos canais de atendimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;