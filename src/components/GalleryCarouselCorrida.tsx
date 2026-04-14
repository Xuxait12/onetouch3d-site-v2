import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GalleryCarouselCorrida = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const galleryImages = [
    {
      gallery: "/images/galeria-foto5-thumb.webp",
      popup: "/images/galeria-foto5-popup.webp",
      alt: "Cruz e Meia Marathon",
      description: "Caixa Alta - 43x53cm",
      destaque: true,
    },
    {
      gallery: "/images/galeria-foto9-thumb.webp",
      popup: "/images/galeria-foto9-popup.webp",
      alt: "Cassino Ultra Race",
      description: "Caixa Baixa - 43x33cm",
    },
    {
      gallery: "/images/galeria-berlim-thumb.webp",
      popup: "/images/galeria-berlim-popup.webp",
      alt: "BMW Berlin Marathon",
      description: "Caixa Alta - 33x43cm",
    },
    {
      gallery: "/images/galeria-foto4-thumb.webp",
      popup: "/images/galeria-foto4-popup.webp",
      alt: "Chicago Marathon",
      description: "Caixa Baixa - 33x43cm",
    },
    {
      gallery: "/images/galeria-foto7-thumb.webp",
      popup: "/images/galeria-foto7-popup.webp",
      alt: "Maratona Unimed",
      description: "Caixa Baixa - 33x33cm",
    },
    {
      gallery: "/images/galeria-foto8-thumb.webp",
      popup: "/images/galeria-foto8-popup.webp",
      alt: "Maratona Rio de Janeiro",
      description: "Caixa Baixa - 33x43cm",
    },
    {
      gallery: "/images/galeria-foto6-thumb.webp",
      popup: "/images/galeria-foto6-popup.webp",
      alt: "SP City Marathon",
      description: "Caixa Alta - 43x43cm",
    },
    {
      gallery: "/images/galeria-uphill-thumb.webp",
      popup: "/images/galeria-uphill-popup.webp",
      alt: "RUN Uphill",
      description: "Caixa Alta - 53x73cm",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.getAttribute("data-delay") || "0");
            setTimeout(() => {
              el.classList.add("gallery-visible");
            }, delay * 150);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") handlePrevImage();
        if (e.key === "ArrowRight") handleNextImage();
        if (e.key === "Escape") setSelectedImageIndex(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  const cardClass = "gallery-card rounded-2xl overflow-hidden cursor-pointer relative";

  const Overlay = ({ description }: { description: string }) => (
    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex items-end rounded-2xl">
      <p className="p-4 text-white text-sm font-semibold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        {description}
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        .gallery-card {
          opacity: 0;
          transform: scale(0.93);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .gallery-card.gallery-visible {
          opacity: 1;
          transform: scale(1);
        }
        .gallery-card:hover .gallery-overlay {
          background: rgba(0,0,0,0.38);
        }
        .gallery-card:hover .gallery-overlay-text {
          opacity: 1;
          transform: translateY(0);
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s;
          display: flex;
          align-items: flex-end;
          border-radius: 16px;
        }
        .gallery-overlay-text {
          padding: 12px 16px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.3s;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-3">

          <div
            ref={(el) => (cardRefs.current[0] = el)}
            data-delay="0"
            className={cardClass}
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={galleryImages[0].gallery}
              alt={galleryImages[0].alt}
              className="w-full object-cover"
              style={{ maxHeight: "420px" }}
              loading="lazy"
            />
            <div className="gallery-overlay">
              <span className="gallery-overlay-text">{galleryImages[0].description}</span>
            </div>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 2fr" }}>
            <div
              ref={(el) => (cardRefs.current[1] = el)}
              data-delay="1"
              className={cardClass}
              onClick={() => setSelectedImageIndex(1)}
            >
              <img
                src={galleryImages[1].gallery}
                alt={galleryImages[1].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-overlay-text">{galleryImages[1].description}</span>
              </div>
            </div>

            <div className="grid gap-3" style={{ gridTemplateRows: "1fr 1fr" }}>
              {[2, 3].map((i) => (
                <div
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  data-delay={i}
                  className={cardClass}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <img
                    src={galleryImages[i].gallery}
                    alt={galleryImages[i].alt}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-text">{galleryImages[i].description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[4, 5, 6, 7].map((i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                data-delay={i}
                className={cardClass}
                onClick={() => setSelectedImageIndex(i)}
              >
                <img
                  src={galleryImages[i].gallery}
                  alt={galleryImages[i].alt}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-overlay-text">{galleryImages[i].description}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-none w-full h-full p-0 border-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}>
          <button onClick={() => setSelectedImageIndex(null)} className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <X size={28} />
          </button>
          <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronLeft size={32} />
          </button>
          <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronRight size={32} />
          </button>
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
              <div className="relative w-full max-w-[95vw] md:max-w-[80vw] h-full max-h-[85vh] flex items-center justify-center">
                <img
                  src={galleryImages[selectedImageIndex].popup}
                  alt={galleryImages[selectedImageIndex].alt}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/90 text-sm font-medium">{galleryImages[selectedImageIndex].description}</p>
                <p className="text-white/60 text-xs mt-1">{selectedImageIndex + 1} de {galleryImages.length}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarouselCorrida;
