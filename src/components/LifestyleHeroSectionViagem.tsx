const LifestyleHeroSectionViagem = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/images/hero-viagem-moto.webp)`
        }}
      >
        {/* Overlay para contraste do texto */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Texto sobreposto */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 max-w-xl">
        <p className="text-white/90 text-lg md:text-xl lg:text-2xl font-light mb-2 drop-shadow-lg">
          Sua rota. Seu momento. Para sempre.
        </p>
        <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-xl">
          A viagem acaba. A memória vira arte.
        </p>
      </div>
    </section>
  );
};

export default LifestyleHeroSectionViagem;
