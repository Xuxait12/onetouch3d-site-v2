const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/lovable-uploads/58e078e4-5384-4798-a40d-66837fbcad03.png)`
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