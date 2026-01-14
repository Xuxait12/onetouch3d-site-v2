import GalleryCarouselCorrida from "@/components/GalleryCarouselCorrida";
const GallerySectionCorrida = () => {
  return <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl py-0 mx-0 px-0 my-0">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground text-center my-0 mx-0 py-[3px] px-0">Inspire-se e transforme sua corrida em arte também.​
 Deixe suas próprias vitórias ganharem vida em um quadro feito só para você.

​<br /><br />
          ​
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">
          clique sobre a imagem para ampliar
        </p>
      </div>
      
      <GalleryCarouselCorrida />
    </section>;
};
export default GallerySectionCorrida;