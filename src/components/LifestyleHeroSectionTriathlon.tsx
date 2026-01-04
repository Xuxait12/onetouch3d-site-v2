const LifestyleHeroSectionTriathlon = () => {
  return (
    <section className="relative w-full h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[95vh] overflow-hidden bg-gray-900">
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
