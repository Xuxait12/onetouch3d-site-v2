import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const landingPages = [
    {
      title: "Corrida",
      subtitle: "Produtos personalizados para corredores",
      image: "/lovable-uploads/4ccca2fb-f8e7-4b30-918c-e462157da6e0.png",
      path: "/corrida"
    },
    {
      title: "Ciclismo", 
      subtitle: "Produtos especiais para ciclistas",
      image: "/lovable-uploads/0ea2829a-ca41-4d4f-bdc1-c718b1d677a2.png",
      path: "/ciclismo"
    },
    {
      title: "Viagem",
      subtitle: "Lembranças únicas das suas viagens",
      image: "/lovable-uploads/c325fc9c-9a52-4194-bde8-733bb0f6fd58.png",
      path: "/viagem"
    },
    {
      title: "Triathlon",
      subtitle: "Produtos exclusivos para triatletas",
      image: "/lovable-uploads/adf274a7-fde7-46e0-bf2b-355c47a5a69a.png",
      path: "/triathlon"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              TRANSFORMAMOS SUA CONQUISTA EM ARTE
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-12 max-w-3xl mx-auto">
              Quadros personalizados para eternizar sua história
            </p>
            
            {/* Modalidades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {landingPages.map((page, index) => (
                <div
                  key={index}
                  onClick={() => navigate(page.path)}
                  className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    {/* Modalidade no canto inferior esquerdo */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {page.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão decorativo com gradiente animado */}
            <div className="inline-block">
              <div className="relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg">
                  Escolha sua modalidade preferida
                </div>
              </div>
            </div>
            
            {/* Login Button */}
            {!user && (
              <div className="mt-12">
                <Button 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Fazer Login
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Home;