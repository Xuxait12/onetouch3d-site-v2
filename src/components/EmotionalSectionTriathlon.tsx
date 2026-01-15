const EmotionalSectionTriathlon = () => {
  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content - Left */}
        <div className="order-2 lg:order-1 text-center lg:text-left flex flex-col justify-center">
          <h2 className="section-text mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold">
            Suas Fotos contam Sua História
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto lg:mx-0 text-base sm:text-lg">
            A emoção da prova em um lugar especial. Suas fotos representam momentos de tamanho dedicação.
          </p>
        </div>

        {/* Image - Right */}
        <div className="order-1 lg:order-2">
          <div className="w-full aspect-[4/3] sm:aspect-[592/394] overflow-hidden rounded-xl sm:rounded-2xl shadow-soft">
            <img 
              src="/images/triathlon-fotos-historia-new.webp" 
              alt="Atleta de triathlon cruzando a linha de chegada"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalSectionTriathlon;
