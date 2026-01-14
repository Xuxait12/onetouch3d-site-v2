import GalleryCarouselViagem from "@/components/GalleryCarouselViagem";

const GallerySectionViagem = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">
          Histórias reais, viagens inesquecíveis e quadros cheios de significado. 
          Explore as criações de quem já eternizou suas aventuras.
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">
          clique sobre a imagem para ampliar
        </p>
      </div>
      
      <GalleryCarouselViagem />
    </section>
  );
};

export default GallerySectionViagem;