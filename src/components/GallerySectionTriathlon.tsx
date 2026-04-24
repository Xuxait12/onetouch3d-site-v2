import GalleryCarouselTriathlon from "./GalleryCarouselTriathlon";
import GalleryCarouselMobile from "@/components/GalleryCarouselMobile";

const triathlonImages = [
  { gallery: "/images/galeria-triathlon-foto1-thumb.webp", popup: "/images/galeria-triathlon-foto1-thumb.webp", alt: "Triathlon - Galeria 1", description: "Caixa Baixa - 33x43cm" },
  { gallery: "/images/galeria-triathlon-foto2-thumb.webp", popup: "/images/galeria-triathlon-foto2-thumb.webp", alt: "Triathlon - Galeria 2", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-triathlon-foto3-thumb.webp", popup: "/images/galeria-triathlon-foto3-thumb.webp", alt: "Triathlon - Galeria 3", description: "Caixa Alta - 53x43cm" },
  { gallery: "/images/galeria-triathlon-foto4-thumb.webp", popup: "/images/galeria-triathlon-foto4-thumb.webp", alt: "Triathlon - Galeria 4", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto5-thumb.webp", popup: "/images/galeria-triathlon-foto5-thumb.webp", alt: "Triathlon - Galeria 5", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto6-thumb.webp", popup: "/images/galeria-triathlon-foto6-thumb.webp", alt: "Triathlon - Galeria 6", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto7-thumb.webp", popup: "/images/galeria-triathlon-foto7-thumb.webp", alt: "Triathlon - Galeria 7", description: "Caixa Alta - 53x73cm" },
  { gallery: "/images/galeria-triathlon-foto8-thumb.webp", popup: "/images/galeria-triathlon-foto8-thumb.webp", alt: "Triathlon - Galeria 8", description: "Caixa Alta - 43x53cm" },
];

const GallerySectionTriathlon = () => {
  return (
    <section id="galeria" className="section-spacing py-16 md:py-24">
      <div className="text-center mb-32">
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
      <div className="block md:hidden">
        <GalleryCarouselMobile images={triathlonImages} initialIndex={6} />
      </div>
      <div className="hidden md:block">
        <GalleryCarouselTriathlon />
      </div>
    </section>
  );
};

export default GallerySectionTriathlon;
