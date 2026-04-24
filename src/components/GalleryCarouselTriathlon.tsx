import GalleryCarousel3D from "@/components/GalleryCarousel3D";

const images = [
  { gallery: "/images/galeria-triathlon-foto1-thumb.webp", popup: "/images/galeria-triathlon-foto1-thumb.webp", alt: "Triathlon - Galeria 1", description: "Caixa Baixa - 33x43cm" },
  { gallery: "/images/galeria-triathlon-foto2-thumb.webp", popup: "/images/galeria-triathlon-foto2-thumb.webp", alt: "Triathlon - Galeria 2", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-triathlon-foto3-thumb.webp", popup: "/images/galeria-triathlon-foto3-thumb.webp", alt: "Triathlon - Galeria 3", description: "Caixa Alta - 53x43cm" },
  { gallery: "/images/galeria-triathlon-foto4-thumb.webp", popup: "/images/galeria-triathlon-foto4-thumb.webp", alt: "Triathlon - Galeria 4", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto5-thumb.webp", popup: "/images/galeria-triathlon-foto5-thumb.webp", alt: "Triathlon - Galeria 5", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto6-thumb.webp", popup: "/images/galeria-triathlon-foto6-thumb.webp", alt: "Triathlon - Galeria 6", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-triathlon-foto7-thumb.webp", popup: "/images/galeria-triathlon-foto7-thumb.webp", alt: "Triathlon - Galeria 7", description: "Caixa Alta - 53x73cm" },
  { gallery: "/images/galeria-triathlon-foto8-thumb.webp", popup: "/images/galeria-triathlon-foto8-thumb.webp", alt: "Triathlon - Galeria 8", description: "Caixa Alta - 43x53cm" },
];

const GalleryCarouselTriathlon = () => <GalleryCarousel3D images={images} />;

export default GalleryCarouselTriathlon;
