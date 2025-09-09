import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-100/40">
      <GlobalHeader />
      
      <main className="flex-1 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          {/* Title Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            TRANSFORMAMOS SUA CONQUISTA EM ARTE
          </motion.h1>
          
          {/* Subtitle Animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto font-light"
          >
            Quadros personalizados para eternizar sua história
          </motion.p>
          
          {/* Cards Grid - Sequential Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {landingPages.map((page, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.6 + (index * 0.15),
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                onClick={() => navigate(page.path)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={page.image}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Category Label */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white text-sm font-semibold drop-shadow-lg group-hover:text-blue-100 transition-colors duration-300">
                      {page.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="w-full max-w-md mx-auto"
          >
            <Button 
              variant="outline"
              className="w-full py-4 px-8 text-base font-medium bg-white/80 backdrop-blur-sm border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
            >
              Escolha sua modalidade preferida
            </Button>
          </motion.div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Home;