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
        <section className="hero-section relative min-h-screen flex items-center justify-center bg-background">
          <div className="container mx-auto px-6 md:px-12 text-center max-w-7xl">
            <h1 className="hero-text text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold accent-blue mb-8 animate-fade-up">
              TRANSFORMAMOS SUA CONQUISTA EM ARTE
            </h1>
            <p className="body-large text-lg sm:text-xl md:text-2xl text-foreground mb-16 max-w-4xl mx-auto animate-fade-up">
              Quadros personalizados para eternizar sua história
            </p>
            
            {/* Modalidades Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 animate-fade-up">
              {landingPages.map((page, index) => (
                <div
                  key={index}
                  onClick={() => navigate(page.path)}
                  className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-border/50"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
                    {/* Modalidade no canto inferior esquerdo */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-accent/95 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                        {page.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão decorativo com gradiente animado */}
            <div className="inline-block animate-fade-up">
              <div className="relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-blue-light to-accent animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
                <div className="relative bg-gradient-to-r from-accent to-blue-light text-accent-foreground px-8 py-4 rounded-full font-semibold text-lg">
                  Escolha sua modalidade preferida
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Home;