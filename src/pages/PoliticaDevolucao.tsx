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
            <h2 className="text-2xl font-semibold text-foreground mt-8">Troca por Defeito</h2>
            <p>
              Em caso de problema com o produto, o cliente terá até 7 dias úteis após o recebimento, 
              para avaliar o produto e solicitar a troca junto à empresa. Para isso, primeiramente o 
              cliente deverá enviar um e-mail, informando o defeito encontrado. Esse e-mail será 
              respondido em até 2 dias úteis e, se necessário, será enviado por e-mail a liberação 
              para envio gratuito pelos Correios. A One Touch 3D avaliará o defeito e providenciará 
              a troca do produto.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Troca ou devolução por desistência/arrependimento</h2>
            <p>
              Em caso de troca por desistência/arrependimento, o cliente terá até 7 dias úteis após 
              o recebimento, para avaliar o produto e solicitar a troca ou devolução junto à One Touch 3D.
            </p>
            <p>
              Para isso, primeiramente o cliente deverá enviar um e-mail, informando o motivo da devolução.
            </p>
            <p>
              O cliente deverá enviar o produto e arcando com as custas envio para o nosso endereço.
            </p>
            <p>
              O produto será avaliado pela equipe da One Touch 3D. Ele deverá estar em perfeitas 
              condições e sem avarias. Caso esteja dentro das normas, será disponibilizado o valor 
              da compra para um novo pedido ou ressarcido o valor do produto ao cliente.
            </p>
            <p>
              Em qualquer um dos casos acima, a One Touch 3D se compromete a resolver o problema em 
              até 30 dias, conforme previsto no Código de Defesa do Consumidor (CDC), Lei 8.078/1990.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaDevolucao;