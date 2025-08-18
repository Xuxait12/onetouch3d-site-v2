import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EntregasPrazos = () => {
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
            Entregas e Prazos
          </h1>
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              Na OneTouch Frames, trabalhamos com prazos realistas para garantir a qualidade 
              e o cuidado que suas medalhas merecem durante o processo de emolduramento.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Prazos de Produção</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Moldura Simples:</strong> 5 a 7 dias úteis</li>
              <li><strong>Moldura Premium:</strong> 7 a 10 dias úteis</li>
              <li><strong>Moldura Personalizada:</strong> 10 a 15 dias úteis</li>
              <li><strong>Projetos Especiais:</strong> Prazo a combinar</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Entregas</h2>
            <p>
              Realizamos entregas em toda região de Caxias do Sul e região. 
              Para outras localidades, consulte disponibilidade e custos através do nosso atendimento.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">Modalidades de Entrega</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Entrega Standard:</strong> 2 a 3 dias úteis após produção</li>
              <li><strong>Entrega Expressa:</strong> 1 dia útil após produção</li>
              <li><strong>Retirada na Loja:</strong> Disponível após confirmação</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Acompanhamento</h2>
            <p>
              Você receberá atualizações em tempo real sobre o status do seu pedido através 
              de WhatsApp e pode acompanhar pela área "Meus Pedidos" em nossa plataforma.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Cuidados na Entrega</h2>
            <p>
              Todos os produtos são cuidadosamente embalados com proteção especial para 
              garantir que cheguen em perfeitas condições até você.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Dúvidas</h2>
            <p>
              Para informações específicas sobre seu pedido, entre em contato pelo 
              WhatsApp (54) 9992-1515 ou consulte a área "Meus Pedidos".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntregasPrazos;