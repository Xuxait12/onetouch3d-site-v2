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
            <h2 className="text-2xl font-semibold text-foreground mt-8">ENTREGA</h2>
            <p>
              Entregamos em todo Brasil através dos Correios. O prazo de Produção do seu pedido é de 
              5 até 7 dias úteis após a confirmação do pagamento. Após isso terá mais o prazo de 
              entrega que será considerado o prazo dos Correios.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">FORMAS DE ENVIO</h2>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">PAC</h3>
            <p>
              A encomenda PAC é a entrega econômica disponibilizada pelos Correios para o envio de 
              produtos. Os prazos de entrega variam de acordo com as localidades de origem e destino. 
              Entregas feitas de segunda à sábado.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">SEDEX</h3>
            <p>
              A encomenda SEDEX é a entrega expressa disponibilizada pelos Correios para o envio de 
              produtos. Os prazos de entrega variam de acordo com as localidades de origem de destino 
              e normalmente são mais rápidas do que o PAC. Entregas feitas de segunda à sábado.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">*IMPORTANTE*</h2>
            <p>
              Caso não haja ninguém no endereço indicado para entrega, o entregador dos Correios 
              tentará realizar a entrega da mercadoria por mais 2 vezes, em dias diferentes. Caso a 
              mercadoria não seja recebida em nenhuma das tentativas, ela retornará ao endereço de 
              origem indicado na etiqueta de postagem ou ficará em uma agência dos Correios mais 
              próxima do destinatário, dependendo da situação.
            </p>
            <p>
              Caso a mercadoria volte ao destinatário, será cobrado um novo envio do clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntregasPrazos;