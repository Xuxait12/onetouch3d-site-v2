const LifestyleHeroSectionViagem = () => {
  return (
    <section className="relative w-full h-[75vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-gray-900">
      {/* Imagem para Mobile/Tablet (até 1023px) */}
      <img 
        src="/images/hero-viagem-moto-mobile.webp"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="lg:hidden absolute inset-0 w-full h-full object-cover object-bottom"
      />
      
      {/* Imagem para Desktop (1024px+) */}
      <img 
        src="/images/hero-viagem-moto.webp"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hidden lg:block absolute inset-0 w-full h-full object-cover object-bottom"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
    </section>
  );
};

export default LifestyleHeroSectionViagem;
