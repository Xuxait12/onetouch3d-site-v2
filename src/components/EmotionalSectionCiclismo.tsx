const EmotionalSectionCiclismo = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image - Left on desktop */}
          <div className="order-1">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg shadow-lg overflow-hidden">
              <img
                src="/images/emotional-ciclismo.webp"
                alt="Ciclista em estrada de montanha ao pôr do sol"
                className="absolute inset-0 w-full h-full object-cover object-bottom"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Text Content - Right on desktop */}
          <div className="order-2 text-center lg:text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Há estradas que mudam a rota.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              E há viagens que mudam a gente.
              <br /><br />
              Cada subida vencida, cada descida sentida, cada quilômetro superado.
              <br /><br />
              Suas fotos ganham um espaço pensado para transmitir a intensidade e o orgulho de cada pedalada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionCiclismo;
