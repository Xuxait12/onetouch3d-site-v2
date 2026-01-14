const EmotionalSectionTriathlon = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Suas Fotos contam Sua História
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A emoção da prova em um lugar especial.
              <br /><br />
              Aquele registro na transição, o sorriso na corrida, o esforço na bike, o mergulho inicial.
              <br /><br />
              Suas fotos ganham um espaço pensado para transmitir a intensidade e o orgulho desse dia inesquecível.
            </p>
          </div>
          
          {/* Image */}
          <div className="order-1 lg:order-2">
            <img
              src="/images/triathlon-fotos-historia.webp"
              alt="Fotos de triathlon contando sua história"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionTriathlon;
