const LifestyleHeroSectionCiclismo = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/images/bikepacking-ciclismo.webp)`
        }}
      >
      </div>
    </section>
  );
};

export default LifestyleHeroSectionCiclismo;
