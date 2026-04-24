import GalleryCarouselCiclismo from "@/components/GalleryCarouselCiclismo";
import GalleryCarouselMobile from "@/components/GalleryCarouselMobile";

const ciclismoImages = [
  { gallery: "/images/galeria-ciclismo-foto1-thumb.webp", popup: "/images/galeria-ciclismo-foto1-thumb.webp", alt: "Ciclismo - Galeria 1", description: "Caixa Baixa - 43x33cm" },
  { gallery: "/images/galeria-ciclismo-foto2-thumb.webp", popup: "/images/galeria-ciclismo-foto2-thumb.webp", alt: "Ciclismo - Galeria 2", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto3-thumb.webp", popup: "/images/galeria-ciclismo-foto3-thumb.webp", alt: "Ciclismo - Galeria 3", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-ciclismo-foto4-thumb.webp", popup: "/images/galeria-ciclismo-foto4-thumb.webp", alt: "Ciclismo - Galeria 4", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto5-thumb.webp", popup: "/images/galeria-ciclismo-foto5-thumb.webp", alt: "Ciclismo - Galeria 5", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-ciclismo-foto6-thumb.webp", popup: "/images/galeria-ciclismo-foto6-thumb.webp", alt: "Ciclismo - Galeria 6", description: "Caixa Alta - 37x48cm" },
  { gallery: "/images/galeria-ciclismo-foto7-thumb.webp", popup: "/images/galeria-ciclismo-foto7-thumb.webp", alt: "Ciclismo - Galeria 7", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto8-thumb.webp", popup: "/images/galeria-ciclismo-foto8-thumb.webp", alt: "Ciclismo - Galeria 8", description: "Caixa Alta - 53x73cm" },
];

const GallerySectionCiclismo = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground text-center leading-relaxed">
          Veja como outros ciclistas transformaram suas conquistas em quadros únicos.<br />
          Inspire-se e personalize o seu também!
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">clique sobre a imagem para ampliar</p>
      </div>
      <div className="block md:hidden">
        <GalleryCarouselMobile images={ciclismoImages} initialIndex={5} />
      </div>
      <div className="hidden md:block">
        <GalleryCarouselCiclismo />
      </div>
    </section>
  );
};

export default GallerySectionCiclismo;
