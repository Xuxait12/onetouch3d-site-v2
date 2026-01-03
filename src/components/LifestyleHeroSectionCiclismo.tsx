const LifestyleHeroSectionCiclismo = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden bg-gray-900">
      {/* Background Image - Mobile */}
      <img 
        src="/images/ciclismo-lifestyle-mobile.webp"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="sm:hidden absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Background Image - Desktop */}
      <img 
        src="/images/bikepacking-ciclismo.webp"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center"
      />
    </section>
  );
};

export default LifestyleHeroSectionCiclismo;
