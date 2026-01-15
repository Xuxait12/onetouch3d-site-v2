const EmotionalSectionViagem = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/emotional-viagem.webp"
          alt="Motociclistas em viagem com vista para lago e montanhas"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Text Content - Bottom Left */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start text-left">
            <p 
              className="text-white font-bold leading-tight text-left"
              style={{ 
                fontFamily: "'Linik Sans', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw + 0.5rem, 3.5rem)'
              }}
            >
              Sua rota. Seu momento.
            </p>
            <p 
              className="text-white font-bold leading-tight text-left"
              style={{ 
                fontFamily: "'Linik Sans', sans-serif",
                fontSize: 'clamp(1rem, 2.5vw + 0.5rem, 2.5rem)'
              }}
            >
              A viagem acaba. A memória vira arte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionViagem;
