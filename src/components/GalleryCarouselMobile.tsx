import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  gallery: string;
  popup: string;
  alt: string;
  description: string;
}

interface Props {
  images: GalleryImage[];
  initialIndex?: number;
}

const GalleryCarouselMobile = ({ images, initialIndex = 0 }: Props) => {
  const [current, setCurrent] = useState(initialIndex);
  const [selected, setSelected] = useState<number | null>(null);
  const n = images.length;

  const move = (dir: number) => setCurrent((prev) => ((prev + dir) % n + n) % n);
  const goTo = (i: number) => setCurrent(i);

  return (
    <>
      <div style={{ width: "100%", padding: "0 16px", boxSizing: "border-box" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <img
            src={images[current].gallery}
            alt={images[current].alt}
            loading="lazy"
            onClick={() => setSelected(current)}
            style={{ width: "100%", borderRadius: "12px", display: "block", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.08)" }}
          />
          <button onClick={() => move(-1)} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => move(1)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#4b5563", marginTop: 10, fontWeight: 500 }}>
          {images[current].description}
        </p>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 8 }}>
          {images.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? "#2563eb" : "#d1d5db", transition: "all 0.3s", cursor: "pointer" }} />
          ))}
        </div>
      </div>
      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-none w-full h-full p-0 border-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><X size={28} /></button>
          <button onClick={() => setSelected((p) => p !== null ? ((p - 1 + n) % n) : null)} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><ChevronLeft size={32} /></button>
          <button onClick={() => setSelected((p) => p !== null ? ((p + 1) % n) : null)} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><ChevronRight size={32} /></button>
          {selected !== null && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-[95vw] h-full max-h-[85vh] flex items-center justify-center">
                <img src={images[selected].popup} alt={images[selected].alt} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-white/90 text-sm font-medium">{images[selected].description}</p>
                <p className="text-white/60 text-xs mt-1">{selected + 1} de {n}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarouselMobile;
