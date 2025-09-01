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
      
      {/* Content positioned in the red rectangle area - center left */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="absolute left-[15%] top-[20%] w-[35%] h-[40%] flex items-center justify-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 leading-relaxed text-center">
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