import GalleryCarouselMobile from "@/components/GalleryCarouselMobile";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  gallery: string;
  popup: string;
  alt: string;
  description: string;
}

interface GalleryCarousel3DProps {
  images: GalleryImage[];
  initialIndex?: number;
}

const GalleryCarousel3D = ({ images, initialIndex = 0 }: GalleryCarousel3DProps) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (isMobile) {
    return <GalleryCarouselMobile images={images} initialIndex={initialIndex} />;
  }

  const [current, setCurrent] = useState(initialIndex);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const n = images.length;

  const move = (dir: number) => {
    setCurrent((prev) => ((prev + dir) % n + n) % n);
  };

  const goTo = (i: number) => setCurrent(i);

  const getPosition = (i: number) => {
    const diff = ((i - current) % n + n) % n;
    if (diff === 0) return "active";
    if (diff === 1) return "next1";
    if (diff === 2) return "next2";
    if (diff === n - 1) return "prev1";
    if (diff === n - 2) return "prev2";
    return "hidden";
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") setSelectedImageIndex((p) => p !== null ? ((p - 1 + n) % n) : null);
        if (e.key === "ArrowRight") setSelectedImageIndex((p) => p !== null ? ((p + 1) % n) : null);
        if (e.key === "Escape") setSelectedImageIndex(null);
      } else {
        if (e.key === "ArrowLeft") move(-1);
        if (e.key === "ArrowRight") move(1);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedImageIndex, current]);

  const styles: Record<string, React.CSSProperties> = {
    active: { transform: "translate(-50%, -50%) scale(1) rotateY(0deg)", zIndex: 5, opacity: 1 },
    next1: { transform: "translate(15%, -50%) scale(0.78) rotateY(-22deg)", zIndex: 4, opacity: 0.75 },
    next2: { transform: "translate(55%, -50%) scale(0.58) rotateY(-35deg)", zIndex: 3, opacity: 0.45 },
    prev1: { transform: "translate(-115%, -50%) scale(0.78) rotateY(22deg)", zIndex: 4, opacity: 0.75 },
    prev2: { transform: "translate(-155%, -50%) scale(0.58) rotateY(35deg)", zIndex: 3, opacity: 0.45 },
    hidden: { transform: "translate(-50%, -50%) scale(0.4)", zIndex: 1, opacity: 0 },
  };

  return (
    <>
      <style>{`
        .carousel-item-3d {
          position: absolute;
          width: 58%;
          top: 50%;
          left: 50%;
          border-radius: 20px;
          overflow: visible;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 12px 48px rgba(0,0,0,0.22); border: 1px solid rgba(0,0,0,0.08);
        }
        .carousel-item-3d.active {
          box-shadow: 0 16px 56px rgba(0,0,0,0.28);
          border: 2px solid rgba(37,99,235,0.35);
          outline: 4px solid rgba(37,99,235,0.10);
        }
        .carousel-item-3d img {
          width: 100%;
          display: block;
          object-fit: cover;
          border-radius: 16px;
        }
        .carousel-desc-3d {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px 16px;
          background: linear-gradient(transparent, rgba(255,255,255,0.92));
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 0 0 16px 16px;
        }
        .carousel-item-3d.active .carousel-desc-3d { opacity: 1; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6">
        <div style={{ position: "relative", width: "100%", height: "440px", perspective: "1000px", overflow: "visible" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
            {images.map((img, i) => {
              const pos = getPosition(i);
              return (
                <div
                  key={i}
                  className={`carousel-item-3d ${pos}`}
                  style={styles[pos]}
                  onClick={() => pos === "active" ? setSelectedImageIndex(i) : move(i > current ? 1 : -1)}
                >
                  <img src={img.gallery} alt={img.alt} loading="lazy" style={{ borderRadius: "16px", display: "block", width: "100%" }} />
                  <div className="carousel-desc-3d">{img.description}</div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => move(-1)}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.85, boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={() => move(1)}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0.85, boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? "var(--color-text-primary)" : "var(--color-border-secondary)", transition: "all 0.3s", cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-none w-full h-full p-0 border-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}>
          <button onClick={() => setSelectedImageIndex(null)} className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <X size={28} />
          </button>
          <button onClick={() => setSelectedImageIndex((p) => p !== null ? ((p - 1 + n) % n) : null)} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronLeft size={32} />
          </button>
          <button onClick={() => setSelectedImageIndex((p) => p !== null ? ((p + 1) % n) : null)} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronRight size={32} />
          </button>
          {selectedImageIndex !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8">
              <div className="relative w-full max-w-[95vw] md:max-w-[80vw] h-full max-h-[85vh] flex items-center justify-center">
                <img src={images[selectedImageIndex].popup} alt={images[selectedImageIndex].alt} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/90 text-sm font-medium">{images[selectedImageIndex].description}</p>
                <p className="text-white/60 text-xs mt-1">{selectedImageIndex + 1} de {n}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarousel3D;
