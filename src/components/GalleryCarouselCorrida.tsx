import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GalleryCarouselCorrida = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const galleryImages = [
    {
      gallery: "/images/galeria-foto7-thumb.webp",
      popup: "/images/galeria-foto7-popup.webp",
      alt: "Caixa Baixa - Galeria 1",
      description: "Caixa Baixa - 33x33cm"
    },
    {
      gallery: "/images/galeria-foto4-thumb.webp",
      popup: "/images/galeria-foto4-popup.webp",
      alt: "Caixa baixa - Galeria 2",
      description: "Caixa baixa - 33x43cm"
    },
    {
      gallery: "/images/galeria-foto9-thumb.webp",
      popup: "/images/galeria-foto9-popup.webp",
      alt: "Caixa Baixa - Galeria 9",
      description: "Caixa Baixa - 43x33cm"
    },
    {
      gallery: "/images/galeria-foto8-thumb.webp",
      popup: "/images/galeria-foto8-popup.webp",
      alt: "Caixa baixa - Galeria 4",
      description: "Caixa baixa - 33x43cm"
    },
    {
      gallery: "/images/galeria-berlim-thumb.webp",
      popup: "/images/galeria-berlim-popup.webp",
      alt: "Caixa Alta - Galeria 9",
      description: "Caixa Alta - 33x43cm"
    },
    {
      gallery: "/images/galeria-foto6-thumb.webp",
      popup: "/images/galeria-foto6-popup.webp",
      alt: "Caixa Alta - Galeria 6",
      description: "Caixa Alta - 43x43cm"
    },
    {
      gallery: "/images/galeria-foto5-thumb.webp",
      popup: "/images/galeria-foto5-popup.webp",
      alt: "Caixa Alta - Galeria 5",
      description: "Caixa Alta - 43x53cm"
    },
    {
      gallery: "/images/galeria-uphill-thumb.webp",
      popup: "/images/galeria-uphill-popup.webp",
      alt: "Caixa Alta - Galeria 6",
      description: "Caixa Alta - 53x73cm"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const galleryElement = document.getElementById('gallery-section-corrida');
    if (galleryElement) {
      observer.observe(galleryElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      const prevIndex = selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      const nextIndex = selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    }
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageIndex]);

  return (
    <>
      <div 
        id="gallery-section-corrida" 
        className={`w-full max-w-7xl mx-auto px-6 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-300 ease-out"
              onClick={() => handleImageClick(index)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={image.gallery}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay com escurecimento */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                
                {/* Descrição no rodapé */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <p className="text-sm font-medium">{image.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Lightbox Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-none w-full h-full p-0 border-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
          {/* Close button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm"
          >
            <X size={28} />
          </button>
          
          {/* Navigation arrows */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 text-white backdrop-blur-sm"
          >
            <ChevronRight size={32} />
          </button>
          
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
              {/* Main image container */}
              <div className="relative w-full max-w-[95vw] md:max-w-[80vw] h-full max-h-[85vh] flex items-center justify-center">
                <img
                  src={galleryImages[selectedImageIndex].popup}
                  alt={galleryImages[selectedImageIndex].alt}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain animate-zoom-in-smooth"
                />
              </div>
              
              {/* Caption */}
              <div className="mt-4 md:mt-6 text-center animate-fade-in-up">
                <p className="text-white/90 text-sm md:text-base font-medium tracking-wide">
                  {galleryImages[selectedImageIndex].description}
                </p>
                <p className="text-white/60 text-xs md:text-sm mt-1">
                  {selectedImageIndex + 1} de {galleryImages.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarouselCorrida;