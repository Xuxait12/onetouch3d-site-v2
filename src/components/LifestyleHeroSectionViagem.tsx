const LifestyleHeroSectionViagem = () => {
  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden">
      {/* Imagem para Mobile/Tablet (até 1023px) */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat lg:hidden"
        style={{ 
          backgroundImage: `url(/images/hero-viagem-moto-tablet.webp)`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Imagem para Desktop (1024px+) */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat hidden lg:block"
        style={{ 
          backgroundImage: `url(/images/hero-viagem-moto.webp)`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
    </section>
  );
};

export default LifestyleHeroSectionViagem;
