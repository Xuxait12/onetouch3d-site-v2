const LifestyleHeroSectionCiclismo = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image - Mobile */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ 
          backgroundImage: `url(/images/ciclismo-lifestyle-mobile.webp)`
        }}
      />
      {/* Background Image - Desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{ 
          backgroundImage: `url(/images/bikepacking-ciclismo.webp)`
        }}
      />
    </section>
  );
};

export default LifestyleHeroSectionCiclismo;
