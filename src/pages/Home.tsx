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
      subtitle: "Transforme sua medalha de corrida em uma lembrança eterna.",
      image: "/images/corrida-hero.webp",
      path: "/corrida"
    },
    {
      title: "Ciclismo", 
      subtitle: "Personalize seu quadro com o percurso e a emoção da sua prova de bike.",
      image: "/images/ciclismo-hero.webp",
      path: "/ciclismo"
    },
    {
      title: "Viagem",
      subtitle: "Guarde para sempre suas viagens em quadros premium com fotos e recordações.",
      image: "/images/viagem-hero.webp",
      path: "/viagem"
    },
    {
      title: "Triathlon",
      subtitle: "Celebre sua superação com quadros que unem medalha, percurso e tempo da prova.",
      image: "/images/triathlon-hero.webp",
      path: "/triathlon"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        {/* Animated Gradient Background - only covers main content */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-blue-100/30 bg-[length:400%_400%] animate-gradient-shift"></div>
        
        <GlobalHeader />
        
        <main className="relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
            {/* Main Title Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent leading-tight px-2"
            >
              <span className="block">Quadros Personalizados</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-2 lg:mt-4">
                para Corrida, Ciclismo,<br className="hidden sm:block" /> Viagem e Triathlon
              </span>
            </motion.h1>
            
            {/* Subtitle Animation */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 sm:mb-16 lg:mb-20 max-w-4xl mx-auto font-light tracking-wide px-2"
            >
              Transforme suas conquistas em arte. Eternize medalhas, percursos e fotos em quadros exclusivos criados especialmente para você.
            </motion.p>
            
            {/* Cards Grid - Sequential Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20">
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
                  className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] border border-white/50"
                >
                  {/* Image Section */}
                  <div className="aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4] relative overflow-hidden">
                    <img
                      src={page.image}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/10 transition-all duration-700" />
                  </div>
                  
                  {/* Text Section */}
                  <div className="p-4 sm:p-5 lg:p-6 text-center">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors duration-500">
                      {page.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-500">
                      {page.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Refined CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
              className="flex justify-center px-4"
            >
              <div className="text-center space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium max-w-4xl mx-auto leading-relaxed">
                  Escolha sua modalidade e crie um quadro exclusivo que conta a sua história.
                </p>
                <Button 
                  variant="outline"
                  className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg font-medium bg-white/70 backdrop-blur-md border-2 border-blue-200/50 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-500 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg hover:scale-105"
                >
                  Personalize seu quadro agora
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <GlobalFooter />
    </div>
  );
};

export default Home;