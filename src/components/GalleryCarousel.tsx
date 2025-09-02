import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const GalleryCarousel = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const galleryImages = [
    {
      gallery: "/lovable-uploads/bbf261b6-ad4d-41f6-a971-c8ea629ef76d.png",
      popup: "/lovable-uploads/7c09a0d0-d367-4316-a691-53b47fdaae2e.png",
      alt: "Moldura Caixa Baixa - Galeria 1",
      description: "Moldura caixa baixa > tamanho 33x33cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/e9162ee9-87c9-4072-afeb-1de7423ffb9f.png",
      popup: "/lovable-uploads/91af6451-0cf5-4f69-9008-2584611dafa2.png",
      alt: "Moldura Caixa Alta - Galeria 2",
      description: "Moldura caixa alta > tamanho 40x30cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/88578ea2-c2e0-4357-8952-44ff4a4f749c.png",
      popup: "/lovable-uploads/31dcb058-af24-4025-b0ff-23aadbdc4b2e.png",
      alt: "Moldura Caixa Alta - Galeria 3",
      description: "Moldura caixa alta > tamanho 35x25cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/1fcf6d0a-d71f-4fdc-8b49-7627ae928de0.png",
      popup: "/lovable-uploads/712dbb01-624d-4e7a-b20d-65ce28eedba9.png",
      alt: "Moldura Caixa Alta - Galeria 4",
      description: "Moldura caixa alta > tamanho 40x30cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/a518bfaa-f6b6-40bc-8793-bc08b65a7bf1.png",
      popup: "/lovable-uploads/7c8d5c4c-a799-439e-aaf9-8f79bafe351a.png",
      alt: "Moldura Caixa Alta - Galeria 5",
      description: "Moldura caixa alta > tamanho 33x33cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/c313acd8-b46f-496c-b294-8863680892b2.png",
      popup: "/lovable-uploads/130c5e63-61d1-4d26-a820-9d24bd55abc5.png",
      alt: "Moldura Caixa Alta - Galeria 6",
      description: "Moldura caixa alta > tamanho 35x25cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/25680a65-988b-462e-80d6-175971903021.png",
      popup: "/lovable-uploads/ee44b493-c143-4327-ab94-dcfa0c5f6622.png",
      alt: "Moldura Caixa Alta - Galeria 7",
      description: "Moldura caixa alta > tamanho 40x30cm > COM IMPRESSÃO 3D"
    },
    {
      gallery: "/lovable-uploads/fd7af026-40a0-4160-bd66-cea2f8269693.png",
      popup: "/lovable-uploads/e13877bb-10e1-487c-a167-f3298ef7cd71.png",
      alt: "Moldura Caixa Baixa - Galeria 8",
      description: "Moldura caixa baixa > tamanho 33x33cm > COM IMPRESSÃO 3D"
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

    const galleryElement = document.getElementById('gallery-section');
    if (galleryElement) {
      observer.observe(galleryElement);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageClick = (popupImageSrc: string) => {
    setSelectedImage(popupImageSrc);
  };

  return (
    <>
      <div 
        id="gallery-section" 
        className={`w-full max-w-7xl mx-auto px-6 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-300 ease-out"
              onClick={() => handleImageClick(image.popup)}
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

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[95vh] p-0 bg-black/95 border-0 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
          >
            <X size={24} />
          </button>
          
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <img
                src={selectedImage}
                alt="Imagem ampliada da galeria"
                className="max-w-full max-h-full object-contain animate-scale-in"
                style={{
                  animation: 'scale-in 0.3s ease-out'
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarousel;