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
              Este site é mantido e operado por One Touch 3D.
            </p>
            <p>
              Nós coletamos e utilizamos alguns dados pessoais que pertencem àqueles que utilizam nosso site. 
              Ao fazê-lo, agimos na qualidade de controlador desses dados e estamos sujeitos às disposições 
              da Lei Federal n. 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD).
            </p>
            <p>
              Nós cuidamos da proteção de seus dados pessoais e, por isso, disponibilizamos esta política 
              de privacidade, que contém informações importantes sobre:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quem deve utilizar nosso site</li>
              <li>Quais dados coletamos e o que fazemos com eles;</li>
              <li>Seus direitos em relação aos seus dados pessoais, e</li>
              <li>Como entrar em contato conosco.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Quem deve utilizar nosso site</h2>
            <p>
              Nosso site só deve ser utilizado por pessoas com mais de dezoito anos de idade. 
              Sendo assim, crianças e adolescentes não devem utilizá-lo.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Dados que coletamos e motivos da coleta</h2>
            <p>
              Nosso site coleta e utiliza alguns dados pessoais de nossos usuários, de acordo com o 
              disposto nesta seção.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">Dados pessoais fornecidos expressamente pelo usuário</h3>
            <p>
              Nós coletamos os seguintes dados pessoais que nossos usuários nos fornecem expressamente 
              ao utilizar nosso site:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo;</li>
              <li>CPF;</li>
              <li>Endereço de e-mail;</li>
              <li>Número de telefone;</li>
              <li>Mensagens de contato;</li>
              <li>Data de nascimento.</li>
            </ul>
            <p>A coleta destes dados ocorre nos seguintes momentos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>quando o usuário utiliza o formulário de contato;</li>
              <li>quando o usuário faz seu cadastro no site;</li>
              <li>quando o usuário faz uma compra.</li>
            </ul>
            <p>Os dados fornecidos por nossos usuários são coletados com as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>para que o usuário possa adquirir nossos produtos e serviços;</li>
              <li>para que o usuário possa entrar em contato com nosso SAC;</li>
              <li>para que possamos enviar nossos produtos aos usuários cadastrados;</li>
              <li>para que possamos enviar ofertas a nossos usuários.</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">Dados sensíveis</h3>
            <p>
              Não serão coletados dados sensíveis de nossos usuários, assim entendidos aqueles definidos 
              nos arts.11 e seguintes da Lei de Proteção de Dados Pessoais. Assim, não haverá coleta de 
              dados sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a 
              sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à 
              saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6">Coleta de dados não previstos expressamente</h3>
            <p>
              Eventualmente, outros tipos de dados não previstos expressamente nesta Política de 
              Privacidade poderão ser coletados, desde que sejam fornecidos com o consentimento do 
              usuário, ou, ainda, que a coleta seja permitida com fundamento em outra base legal 
              prevista em lei.
            </p>
            <p>
              Em qualquer caso, a coleta de dados e as atividades de tratamento dela decorrentes serão 
              informadas aos usuários do site.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Compartilhamento de dados pessoais com terceiros</h2>
            <p>
              Nós não compartilhamos seus dados pessoais com terceiros. Apesar disso, é possível que o 
              façamos para cumprir alguma determinação legal ou regulatória, ou, ainda, para cumprir 
              alguma ordem expedida por autoridade pública.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Por quanto tempo seus dados pessoais serão armazenados</h2>
            <p>
              Os dados pessoais coletados pelo site são armazenados e utilizados por período de tempo 
              que corresponda ao necessário para atingir as finalidades elencadas neste documento e que 
              considere os direitos de seus titulares, os direitos do controlador do site e as 
              disposições legais ou regulatórias aplicáveis.
            </p>
            <p>
              Uma vez expirados os períodos de armazenamento dos dados pessoais, eles são removidos de 
              nossas bases de dados ou anonimizados, salvo nos casos em que houver a possibilidade ou a 
              necessidade de armazenamento em virtude de disposição legal ou regulatória.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Bases legais para o tratamento de dados pessoais</h2>
            <p>
              Cada operação de tratamento de dados pessoais precisa ter um fundamento jurídico, ou seja, 
              uma base legal, que nada mais é que uma justificativa que a autorize, prevista na Lei Geral 
              de Proteção de Dados Pessoais.
            </p>
            <p>
              Todas as Nossas atividades de tratamento de dados pessoais possuem uma base legal que as 
              fundamenta, dentre as permitidas pela legislação. Mais informações sobre as bases legais 
              que utilizamos para operações de tratamento de dados pessoais especificas podem ser obtidas 
              a partir de nossos canais de contato, informados ao final desta Política.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Como o titular pode exercer seus direitos</h2>
            <p>
              Para garantir que o usuário que pretende exercer seus direitos é, de fato, o titular dos 
              dados pessoais objeto da requisição, poderemos solicitar documentos ou outras informações 
              que possam auxiliar em sua correta identificação, a fim de resguardar nossos direitos e os 
              direitos de terceiros. Isto somente será feito, porém, se for absolutamente necessário, e 
              o requerente receberá todas as informações relacionadas.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Medidas de segurança no tratamento de dados pessoais</h2>
            <p>
              Empregamos medidas técnicas e organizativas aptas a proteger os dados pessoais de acessos 
              não autorizados e de situações de destruição, perda, extravio ou alteração desses dados.
            </p>
            <p>
              As medidas que utilizamos levam em consideração a natureza dos dados, o contexto e a 
              finalidade do tratamento, os riscos que uma eventual violação geraria para os direitos e 
              liberdades do usuário, e os padrões atualmente empregados no mercado por empresas 
              semelhantes à nossa.
            </p>
            <p>Entre as medidas de segurança adotadas por nós, destacamos as seguintes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>armazenamento de senhas utilizando hashes criptográficos;</li>
              <li>restrições de acessos a banco de dados;</li>
              <li>monitoramento de acesso físico a servidores.</li>
            </ul>
            <p>
              Ainda que adote tudo o que está ao seu alcance para evitar incidentes de segurança, é 
              possível que ocorra algum problema motivado exclusivamente por um terceiro – como em caso 
              de ataques de hackers ou crackers ou, ainda, em caso de culpa exclusiva do usuário, que 
              ocorre, por exemplo, quando ele mesmo transfere seus dados a terceiro. Assim, embora 
              sejamos, em geral, responsáveis pelos dados pessoais que tratamos, nos eximimos de 
              responsabilidade caso ocorra uma situação excepcional como essas, sobre as quais não temos 
              nenhum tipo de controle.
            </p>
            <p>
              De qualquer forma, caso ocorra qualquer tipo de incidente de segurança que possa gerar 
              risco ou dano relevante para qualquer de nossos usuários, comunicaremos os afetados e a 
              Autoridade Nacional de Proteção de Dados acerca do ocorrido, em conformidade com o disposto 
              na Lei Geral de Proteção de Dados.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Alterações nesta política</h2>
            <p>
              A presente versão desta Política de Privacidade foi atualizada pela última vez em: 
              08/06/2021. Reservamo-nos o direito de modificar, a qualquer momento, as presentes normas, 
              especialmente para adaptá-las às eventuais alterações feitas em nosso site, seja pela 
              disponibilização de novas funcionalidades, seja pela supressão ou modificação daquelas já 
              existentes. Sempre que houver uma modificação, nossos usuários serão notificados acerca 
              da mudança.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8">Como entrar em contato conosco</h2>
            <p>
              Para esclarecer quaisquer dúvidas sobre esta Política de Privacidade ou sobre os dados 
              pessoais que tratamos, entre em contato com nosso Encarregado de Proteção de Dados 
              Pessoais, por algum dos canais mencionados abaixo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>E-mail: contato@onetouch3d.com.br</li>
              <li>Telefone: 54-99992-1515</li>
              <li>Endereço postal: Rua Antônio Beltrame,132</li>
              <li>Bairro Jardim Glória – CEP: 95701-224</li>
              <li>Bento Gonçalves – RS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;