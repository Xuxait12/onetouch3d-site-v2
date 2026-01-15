const EmotionalSectionViagem = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Sua rota. Seu momento.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A viagem acaba. A memória vira arte.
              <br /><br />
              Cada quilômetro percorrido, cada paisagem vista, cada parada inesquecível.
              <br /><br />
              Suas fotos ganham um espaço pensado para transmitir a intensidade e o orgulho dessa jornada única.
            </p>
          </div>
          
          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg shadow-lg overflow-hidden">
              <img
                src="/images/emotional-viagem.webp"
                alt="Motociclistas em viagem com vista para lago e montanhas"
                className="absolute inset-0 w-full h-full object-cover object-bottom"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionViagem;
