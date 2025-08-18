import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PoliticaDevolucao = () => {
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
            Política de Devolução e Trocas
          </h1>
          
          <div className="space-y-6 text-muted-foreground">
            <p>
              Na OneTouch Frames, queremos que você fique completamente satisfeito com sua compra. 
              Por isso, oferecemos uma política de devolução e troca clara e transparente.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Prazo para Devolução</h2>
            <p>
              Você tem até 7 (sete) dias corridos, contados a partir do recebimento do produto, 
              para solicitar a devolução ou troca, conforme previsto no Código de Defesa do Consumidor.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Condições para Devolução</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>O produto deve estar em perfeitas condições, sem sinais de uso</li>
              <li>Embalagem original preservada</li>
              <li>Acompanhado de todos os acessórios e documentos</li>
              <li>Nota fiscal ou comprovante de compra</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Como Solicitar</h2>
            <p>
              Para solicitar uma devolução ou troca, entre em contato conosco através do WhatsApp 
              (54) 9992-1515 ou através da área "Meus Pedidos" em nossa plataforma.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Reembolso</h2>
            <p>
              O reembolso será processado em até 10 (dez) dias úteis após a confirmação da devolução, 
              no mesmo meio de pagamento utilizado na compra original.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaDevolucao;