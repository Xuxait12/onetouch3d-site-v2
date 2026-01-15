const EmotionalSectionCorrida = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Left on desktop */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Não é sobre o quadro.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              É sobre quem você se tornou.
              <br /><br />
              Cada quilômetro corrido, cada obstáculo superado, cada linha de chegada cruzada.
              <br /><br />
              Suas fotos ganham um espaço pensado para transmitir a intensidade e o orgulho dessa conquista.
            </p>
          </div>
          
          {/* Image - Right on desktop */}
          <div className="order-1 lg:order-2">
            <img
              src="/images/emotional-corrida.webp"
              alt="Corredor ultrapassando seus limites em uma maratona"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionCorrida;
