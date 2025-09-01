const heroRunnerFinish = "/lovable-uploads/a4c8b948-ed32-4e82-bca0-264945e1ab64.png";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat"
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight opacity-0 animate-[fadeUpSlide_1s_ease-out_0.3s_forwards] bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent animate-pulse">Transforme</span> Sua Corrida em Uma Lembrança Eterna
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto opacity-0 animate-[fadeUpSlide_1s_ease-out_0.6s_forwards] text-white/95 drop-shadow-lg">
            Quadros personalizados que contam a história da sua conquista, quilômetro por quilômetro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;