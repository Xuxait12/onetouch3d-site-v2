const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/lovable-uploads/05bc6baf-a9d1-469e-9a70-12b8e0bbf3e2.png)`
        }}
      >
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Content positioned to not cover the artwork */}
      <div className="relative z-10 h-full flex items-end justify-start px-6 sm:px-12 pb-16">
        <div className="max-w-2xl">
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 leading-relaxed">
            O quadro não é só sobre a corrida que você fez.{" "}
            <span className="font-semibold text-gray-900">
              É sobre quem você se tornou.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LifestyleHeroSection;