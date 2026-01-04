const LifestyleHeroSectionTriathlon = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <img 
        src="/images/lifestyle-triathlon.webp"
        alt="Quadro de triathlon em ambiente moderno"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </section>
  );
};

export default LifestyleHeroSectionTriathlon;
