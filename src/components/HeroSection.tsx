const heroRunnerFinish = "/images/corrida-hero.webp";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat opacity-0 animate-[fadeIn_1.5s_ease-out_0.1s_forwards]"
        style={{ 
          backgroundImage: `url(${heroRunnerFinish})`,
          backgroundPosition: 'center 30%'
        }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="text-center text-white max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight opacity-0 animate-[fade-in-down_1s_ease-out_0.5s_forwards] text-white drop-shadow-2xl">
            👉 <span className="text-blue-400">Eternize</span> Sua Prova com um Quadro Personalizado
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto opacity-0 animate-[fade-in-down_1s_ease-out_0.8s_forwards] text-white/95 drop-shadow-lg">
            👉 Deixe sua medalha em destaque! Personalize com percurso 3D, fotos e dados da prova para criar uma lembrança inesquecível.
          </p>
          <div className="opacity-0 animate-[fade-in-down_1s_ease-out_1.1s_forwards]">
            <a href="#nossa-loja" className="inline-block bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
              Personalize seu quadro agora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;