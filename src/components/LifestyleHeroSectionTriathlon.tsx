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
      
      {/* Tablet Image - 600x500px, centralizada, object-contain */}
      <div className="hidden sm:flex lg:hidden absolute inset-0 items-center justify-center">
        <img 
          src="/images/lifestyle-triathlon-tablet.webp"
          alt="Quadro de triathlon em ambiente moderno"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={600}
          height={500}
          className="max-w-[600px] w-full h-auto object-contain"
        />
      </div>
      
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
