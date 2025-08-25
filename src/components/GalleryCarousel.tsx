import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const GalleryCarousel = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mapping between gallery images (for carousel) and popup images (for dialog)
  const galleryImages = [
    {
      gallery: "/lovable-uploads/bbf261b6-ad4d-41f6-a971-c8ea629ef76d.png",
      popup: "/lovable-uploads/bbf261b6-ad4d-41f6-a971-c8ea629ef76d.png",
      alt: "Moldura Caixa Baixa - Galeria 1"
    },
    {
      gallery: "/lovable-uploads/e9162ee9-87c9-4072-afeb-1de7423ffb9f.png",
      popup: "/lovable-uploads/e9162ee9-87c9-4072-afeb-1de7423ffb9f.png",
      alt: "Moldura Caixa Alta - Galeria 2"
    },
    {
      gallery: "/lovable-uploads/88578ea2-c2e0-4357-8952-44ff4a4f749c.png",
      popup: "/lovable-uploads/88578ea2-c2e0-4357-8952-44ff4a4f749c.png",
      alt: "Moldura Caixa Alta - Galeria 3"
    },
    {
      gallery: "/lovable-uploads/1fcf6d0a-d71f-4fdc-8b49-7627ae928de0.png",
      popup: "/lovable-uploads/1fcf6d0a-d71f-4fdc-8b49-7627ae928de0.png",
      alt: "Moldura Caixa Alta - Galeria 4"
    },
    {
      gallery: "/lovable-uploads/a518bfaa-f6b6-40bc-8793-bc08b65a7bf1.png",
      popup: "/lovable-uploads/a518bfaa-f6b6-40bc-8793-bc08b65a7bf1.png",
      alt: "Moldura Caixa Alta - Galeria 5"
    },
    {
      gallery: "/lovable-uploads/c313acd8-b46f-496c-b294-8863680892b2.png",
      popup: "/lovable-uploads/c313acd8-b46f-496c-b294-8863680892b2.png",
      alt: "Moldura Caixa Alta - Galeria 6"
    },
    {
      gallery: "/lovable-uploads/25680a65-988b-462e-80d6-175971903021.png",
      popup: "/lovable-uploads/25680a65-988b-462e-80d6-175971903021.png",
      alt: "Moldura Caixa Alta - Galeria 7"
    },
    {
      gallery: "/lovable-uploads/fd7af026-40a0-4160-bd66-cea2f8269693.png",
      popup: "/lovable-uploads/fd7af026-40a0-4160-bd66-cea2f8269693.png",
      alt: "Moldura Caixa Baixa - Galeria 8"
    }
  ];

  const handleImageDoubleClick = (popupImageSrc: string) => {
    setSelectedImage(popupImageSrc);
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <div
                    className="aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                    onDoubleClick={() => handleImageDoubleClick(image.popup)}
                  >
                    <img
                      src={image.gallery}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Modal for enlarged image */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent 
          className="p-0 bg-background/95 backdrop-blur-sm border-0" 
          style={{ width: '894px', height: '894px', maxWidth: '894px', maxHeight: '894px' }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagem ampliada da galeria"
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarousel;