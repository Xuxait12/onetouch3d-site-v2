const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/lovable-uploads/f0263eb6-27d1-4073-bbfa-72183aa4c215.png)`
        }}
      >
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Content positioned in the red marked area */}
      <div className="relative z-10 h-full flex items-start justify-center pt-8 sm:pt-12">
        <div className="max-w-2xl text-center px-4">
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 leading-relaxed">
            O quadro não é só sobre a corrida que você fez.{" "}
            <span className="font-semibold text-gray-800">
              É sobre quem você se tornou.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LifestyleHeroSection;