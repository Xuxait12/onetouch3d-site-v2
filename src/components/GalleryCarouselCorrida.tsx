import GalleryCarousel3D from "@/components/GalleryCarousel3D";

const images = [
  { gallery: "/images/galeria-foto7-thumb.webp", popup: "/images/galeria-foto7-popup.webp", alt: "Maratona Unimed", description: "Caixa Baixa - 33x33cm" },
  { gallery: "/images/galeria-foto4-thumb.webp", popup: "/images/galeria-foto4-popup.webp", alt: "Chicago Marathon", description: "Caixa Baixa - 33x43cm" },
  { gallery: "/images/galeria-foto9-thumb.webp", popup: "/images/galeria-foto9-popup.webp", alt: "Cassino Ultra Race", description: "Caixa Baixa - 43x33cm" },
  { gallery: "/images/galeria-foto8-thumb.webp", popup: "/images/galeria-foto8-popup.webp", alt: "Maratona Rio", description: "Caixa Baixa - 33x43cm" },
  { gallery: "/images/galeria-berlim-thumb.webp", popup: "/images/galeria-berlim-popup.webp", alt: "BMW Berlin Marathon", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-foto6-thumb.webp", popup: "/images/galeria-foto6-popup.webp", alt: "SP City Marathon", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-foto5-thumb.webp", popup: "/images/galeria-foto5-popup.webp", alt: "Cruz e Meia Marathon", description: "Caixa Alta - 43x53cm" },
  { gallery: "/images/galeria-uphill-thumb.webp", popup: "/images/galeria-uphill-popup.webp", alt: "RUN Uphill", description: "Caixa Alta - 53x73cm" },
  { gallery: "/images/galeria-corrida-poa2-thumb.webp", popup: "/images/galeria-corrida-poa2-thumb.webp", alt: "POA 2", description: "Caixa Baixa - 33x43cm" },
  { gallery: "/images/galeria-corrida-boston-thumb.webp", popup: "/images/galeria-corrida-boston-thumb.webp", alt: "Boston Marathon", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-corrida-chicago-thumb.webp", popup: "/images/galeria-corrida-chicago-thumb.webp", alt: "Chicago Marathon", description: "Caixa Alta - 33x33cm" },
  { gallery: "/images/galeria-corrida-disney-thumb.webp", popup: "/images/galeria-corrida-disney-thumb.webp", alt: "Disney Marathon", description: "Caixa Baixa - 63x83cm" },
  { gallery: "/images/galeria-corrida-lamision-thumb.webp", popup: "/images/galeria-corrida-lamision-thumb.webp", alt: "La Mision", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-corrida-rrm-thumb.webp", popup: "/images/galeria-corrida-rrm-thumb.webp", alt: "RRM", description: "Caixa Alta - 43x43cm" },
  { gallery: "/images/galeria-corrida-poa-thumb.webp", popup: "/images/galeria-corrida-poa-thumb.webp", alt: "POA Marathon", description: "Caixa Alta - 33x43cm" },
  { gallery: "/images/galeria-corrida-berlin-thumb.webp", popup: "/images/galeria-corrida-berlin-thumb.webp", alt: "Berlin Marathon", description: "Caixa Alta - 43x43cm" },
];

const GalleryCarouselCorrida = () => <GalleryCarousel3D images={images} initialIndex={9} />;

export default GalleryCarouselCorrida;
