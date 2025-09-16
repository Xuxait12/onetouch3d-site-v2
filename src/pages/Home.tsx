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
    <div className="min-h-screen">
      <div className="relative">
        {/* Animated Gradient Background - only covers main content */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-blue-100/30 bg-[length:400%_400%] animate-gradient-shift"></div>
        
        <GlobalHeader />
        
        <main className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            {/* Main Title Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight"
            >
              TRANSFORMAMOS SUA CONQUISTA EM ARTE
            </motion.h1>
            
            {/* Subtitle Animation */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-20 max-w-2xl mx-auto font-light tracking-wide"
            >
              Quadros personalizados para eternizar sua história
            </motion.p>
            
            {/* Cards Grid - Sequential Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {landingPages.map((page, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.8 + (index * 0.2),
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 80
                  }}
                  onClick={() => navigate(page.path)}
                  className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] border border-white/50"
                >
                  <div className="aspect-[5/4] relative overflow-hidden">
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-700" />
                    
                    {/* Category Label with Enhanced Hover */}
                    <div className="absolute bottom-6 left-6">
                      <span className="text-white text-base font-semibold drop-shadow-2xl group-hover:text-blue-100 group-hover:scale-105 transition-all duration-500 inline-block">
                        {page.title}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Refined CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
              className="flex justify-center"
            >
              <Button 
                variant="outline"
                className="px-10 py-4 text-lg font-medium bg-white/70 backdrop-blur-md border-2 border-blue-200/50 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105"
              >
                Escolha sua modalidade preferida
              </Button>
            </motion.div>
          </div>
        </main>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default Home;