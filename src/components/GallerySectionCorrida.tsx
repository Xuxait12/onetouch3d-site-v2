import GalleryCarouselCorrida from "@/components/GalleryCarouselCorrida";
const GallerySectionCorrida = () => {
  return <section className="py-8 md:py-12 pt-24 md:pt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-text mb-4">Galeria de Inspiração</h2>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            Inspire-se e transforme sua corrida em arte também. Deixe suas próprias vitórias ganharem vida em um quadro feito só para você.
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80 italic mt-4">
            clique sobre a imagem para ampliar
          </p>
        </div>
      </div>
      
      <GalleryCarouselCorrida />
    </section>;
};
export default GallerySectionCorrida;