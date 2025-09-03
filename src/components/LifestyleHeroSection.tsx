const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-cover md:bg-contain lg:bg-cover"
        style={{ 
          backgroundImage: `url(/lovable-uploads/96ab3042-c438-48e2-ac54-354d15b2a052.png)`
        }}
      >
      </div>
    </section>
  );
};

export default LifestyleHeroSection;