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
      image: "/lovable-uploads/hero-runner-new.jpg",
      path: "/corrida"
    },
    {
      title: "Ciclismo", 
      subtitle: "Produtos especiais para ciclistas",
      image: "/lovable-uploads/hero-runner-new.jpg", // Placeholder - user can update later
      path: "/ciclismo"
    },
    {
      title: "Viagem",
      subtitle: "Lembranças únicas das suas viagens",
      image: "/lovable-uploads/hero-runner-new.jpg", // Placeholder - user can update later
      path: "/viagem"
    },
    {
      title: "Triathlon",
      subtitle: "Produtos exclusivos para triatletas",
      image: "/lovable-uploads/hero-runner-new.jpg", // Placeholder - user can update later
      path: "/triathlon"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              OneTouch3D
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Transforme suas conquistas em lembranças únicas e personalizadas
            </p>
            
            {/* Login Button */}
            {!user && (
              <div className="mb-16">
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

        {/* Landing Pages Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Escolha sua modalidade
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">{page.title}</h3>
                        <p className="text-sm opacity-90">{page.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Home;