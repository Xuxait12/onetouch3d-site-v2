import GalleryCarouselTriathlon from "./GalleryCarouselTriathlon";

const GallerySectionTriathlon = () => {
  return (
    <section id="galeria" className="section-spacing py-16 md:py-24">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Galeria de Quadros
        </h2>
        <p className="text-muted-foreground max-w-2xl md:max-w-3xl mx-auto px-6 text-pretty">
          Momentos que marcaram provas inesquecíveis, transformados em quadros{" "}
          <span className="whitespace-nowrap">cheios de significado.</span>
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto px-6 mt-1">
          Veja alguns exemplos e eternize o seu.
        </p>
      </div>
      
      <GalleryCarouselTriathlon />
    </section>
  );
};

export default GallerySectionTriathlon;
