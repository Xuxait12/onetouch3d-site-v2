const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden bg-gray-900">
      {/* Background Image - Desktop */}
      <img 
        src="/images/lifestyle-desktop.gif"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Background Image - Mobile */}
      <img 
        src="/images/lifestyle-mobile.gif"
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
      />
    </section>
  );
};

export default LifestyleHeroSection;
