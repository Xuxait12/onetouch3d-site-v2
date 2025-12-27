import GalleryCarousel from "@/components/GalleryCarousel";
const GallerySection = () => {
  return <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">Inspire-se e transforme sua jornada em arte também!
        <br /><br />Deixe suas próprias vitórias ganharem vida em um quadro feito só para você.</p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">clique sobre a imagem para ampliar</p>
      </div>
      
      <GalleryCarousel />
    </section>;
};
export default GallerySection;