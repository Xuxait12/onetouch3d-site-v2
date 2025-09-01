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
      
      {/* Content positioned to the right, beyond the wall */}
      <div className="relative z-10 h-full flex items-center justify-end px-6 sm:px-12">
        <div className="max-w-lg text-right">
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