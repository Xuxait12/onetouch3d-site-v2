import GalleryCarousel from "@/components/GalleryCarousel";
const GallerySection = () => {
  return <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">Veja como outras conquistas ganharam vida.</p>
      </div>
      
      <GalleryCarousel />
    </section>;
};
export default GallerySection;