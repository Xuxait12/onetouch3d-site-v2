import GalleryCarousel3D from "@/components/GalleryCarousel3D";

const images = [
  { gallery: "/images/galeria-ciclismo-foto1-thumb.webp", popup: "/images/galeria-ciclismo-foto1-thumb.webp", alt: "Ciclismo - Galeria 1", description: "Caixa Baixa - 43x33cm" },
  { gallery: "/images/galeria-ciclismo-foto2-thumb.webp", popup: "/images/galeria-ciclismo-foto2-thumb.webp", alt: "Ciclismo - Galeria 2", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto3-thumb.webp", popup: "/images/galeria-ciclismo-foto3-thumb.webp", alt: "Ciclismo - Galeria 3", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-ciclismo-foto4-thumb.webp", popup: "/images/galeria-ciclismo-foto4-thumb.webp", alt: "Ciclismo - Galeria 4", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto5-thumb.webp", popup: "/images/galeria-ciclismo-foto5-thumb.webp", alt: "Ciclismo - Galeria 5", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-ciclismo-foto6-thumb.webp", popup: "/images/galeria-ciclismo-foto6-thumb.webp", alt: "Ciclismo - Galeria 6", description: "Caixa Alta - 37x48cm" },
  { gallery: "/images/galeria-ciclismo-foto7-thumb.webp", popup: "/images/galeria-ciclismo-foto7-thumb.webp", alt: "Ciclismo - Galeria 7", description: "Caixa Alta - 48x37cm" },
  { gallery: "/images/galeria-ciclismo-foto8-thumb.webp", popup: "/images/galeria-ciclismo-foto8-thumb.webp", alt: "Ciclismo - Galeria 8", description: "Caixa Alta - 53x73cm" },
];

const GalleryCarouselCiclismo = () => <GalleryCarousel3D images={images} initialIndex={5} />;

export default GalleryCarouselCiclismo;
