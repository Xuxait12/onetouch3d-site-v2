const LifestyleHeroSectionViagem = () => {
  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
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
