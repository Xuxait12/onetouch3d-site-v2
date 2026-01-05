const LifestyleHeroSectionTriathlon = () => {
  return (
    <section className="relative w-full h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-gray-900">
      {/* Mobile Image */}
      <img 
        src="/images/lifestyle-triathlon-mobile.webp"
        alt="Quadro de triathlon em ambiente moderno"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center sm:hidden"
      />
      
      {/* Tablet Image */}
      <img 
        src="/images/lifestyle-triathlon-tablet.webp"
        alt="Quadro de triathlon em ambiente moderno"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block lg:hidden"
      />
      
      {/* Desktop Image */}
      <img 
        src="/images/lifestyle-triathlon.webp"
        alt="Quadro de triathlon em ambiente moderno"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center hidden lg:block"
      />
    </section>
  );
};

export default LifestyleHeroSectionTriathlon;
