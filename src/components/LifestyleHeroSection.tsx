const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image - Desktop */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-cover md:bg-contain lg:bg-cover"
        style={{ 
          backgroundImage: `url(/lovable-uploads/ae4adce5-f1e3-44f9-9c1b-624586d89aab.png)`
        }}
      >
      </div>
      
      {/* Background Image - Mobile */}
      <div 
        className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/images/lifestyle-mobile.gif)`
        }}
      >
      </div>
    </section>
  );
};

export default LifestyleHeroSection;