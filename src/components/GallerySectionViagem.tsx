import GalleryCarouselViagem from "@/components/GalleryCarouselViagem";
import GalleryCarouselMobile from "@/components/GalleryCarouselMobile";

const viagemImages = [
  { gallery: "/images/galeria-viagem-foto1-thumb.webp", popup: "/images/galeria-viagem-foto1-thumb.webp", alt: "Viagem - Galeria 1", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-viagem-foto11-thumb.webp", popup: "/images/galeria-viagem-foto11-thumb.webp", alt: "Viagem - Galeria 11", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-viagem-foto2-thumb.webp", popup: "/images/galeria-viagem-foto2-thumb.webp", alt: "Viagem - Galeria 2", description: "Caixa Alta - 43x33cm" },
  { gallery: "/images/galeria-viagem-foto3-thumb.webp", popup: "/images/galeria-viagem-foto3-thumb.webp", alt: "Viagem - Galeria 3", description: "Caixa Alta - 37x48cm" },
  { gallery: "/images/galeria-viagem-foto5-thumb.webp", popup: "/images/galeria-viagem-foto5-thumb.webp", alt: "Viagem - Galeria 5", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-viagem-foto4-thumb.webp", popup: "/images/galeria-viagem-foto4-thumb.webp", alt: "Viagem - Galeria 4", description: "Caixa Alta - 53x43cm" },
  { gallery: "/images/galeria-viagem-foto6-thumb.webp", popup: "/images/galeria-viagem-foto6-thumb.webp", alt: "Viagem - Galeria 6", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-viagem-foto7-thumb.webp", popup: "/images/galeria-viagem-foto7-thumb.webp", alt: "Viagem - Galeria 7", description: "Caixa Alta - 53x73cm" },
  { gallery: "/images/galeria-viagem-foto9-thumb.webp", popup: "/images/galeria-viagem-foto9-thumb.webp", alt: "Viagem - Galeria 9", description: "Caixa Alta - 43x63cm" },
  { gallery: "/images/galeria-viagem-foto12-thumb.webp", popup: "/images/galeria-viagem-foto12-thumb.webp", alt: "Viagem - Galeria 12", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-viagem-foto10-thumb.webp", popup: "/images/galeria-viagem-foto10-thumb.webp", alt: "Viagem - Galeria 10", description: "Caixa Alta - 53x73cm" },
  { gallery: "/images/galeria-viagem-foto8-thumb.webp", popup: "/images/galeria-viagem-foto8-thumb.webp", alt: "Viagem - Galeria 8", description: "Caixa Alta - 103x83cm" },
];

const GallerySectionViagem = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">
          Histórias reais, viagens inesquecíveis e quadros cheios de significado.
          <br />
          Explore as criações de quem já eternizou suas aventuras.
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">
          clique sobre a imagem para ampliar
        </p>
      </div>
      <div className="block md:hidden">
        <GalleryCarouselMobile images={viagemImages} initialIndex={0} />
      </div>
      <div className="hidden md:block">
        <GalleryCarouselViagem />
      </div>
    </section>
  );
};

export default GallerySectionViagem;
