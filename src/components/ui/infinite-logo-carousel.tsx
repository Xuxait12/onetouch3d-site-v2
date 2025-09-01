import berlimLogo from "@/assets/berlim.png";
import bostonLogo from "@/assets/boston.png";
import chicagoLogo from "@/assets/chicago.png";
import floripaLogo from "@/assets/floripa.png";
import paratyLogo from "@/assets/paraty.png";

interface Logo {
  id: string;
  image: string;
  alt: string;
}

interface InfiniteLogoCarouselProps {
  className?: string;
}

const InfiniteLogoCarousel = ({ className = "" }: InfiniteLogoCarouselProps) => {
  // Group 1: uploaded logos
  const group1: Logo[] = [
    { id: "berlim", image: "/lovable-uploads/d71f7332-6004-4090-8e9e-e2e0a19713a2.png", alt: "BMW Berlin Marathon" },
    { id: "boston", image: "/lovable-uploads/a0094dd2-299d-4b7f-b118-421e88e1cc8b.png", alt: "Boston Marathon" },
    { id: "chicago", image: "/lovable-uploads/3d11d14f-c982-4537-b510-549cabfe135c.png", alt: "Chicago Marathon" },
    { id: "paraty", image: "/lovable-uploads/94f49477-8894-4272-9b97-80ac6d06129a.png", alt: "Paraty Brazil" },
    { id: "floripa", image: "/lovable-uploads/cd67de84-b9ab-4538-9d58-ca0e843aa5a2.png", alt: "Floripa International" }
  ];

  // Group 2: existing logos from project
  const group2: Logo[] = [
    { id: "ny", image: "/lovable-uploads/55384af6-f74b-4f22-a6e9-bbe2e65dc526.png", alt: "New York Marathon" },
    { id: "poa", image: "/lovable-uploads/3ae15162-cde4-4abb-9f06-08b7dac7c00c.png", alt: "Porto Alegre Marathon" },
    { id: "la-mission", image: "/lovable-uploads/e1042b3e-604b-41bf-b9c5-687ade9efe1d.png", alt: "LA Mission Marathon" },
    { id: "rio", image: "/lovable-uploads/e8e41613-7cf8-4473-ad6e-4d1228ed4a6d.png", alt: "Rio Marathon" },
    { id: "sp-city", image: "/lovable-uploads/d55d8ea9-accd-4cf7-b18a-3ee10d894610.png", alt: "São Paulo City Marathon" }
  ];

  // Combine both groups
  const allLogos = [...group1, ...group2];
  
  // Duplicate for seamless loop
  const duplicatedLogos = [...allLogos, ...allLogos];

  return (
    <section className={`py-16 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Maratonas e Provas Parceiras
          </h2>
          <p className="text-lg text-muted-foreground">
            Celebramos conquistas de corredores ao redor do mundo
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for seamless effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
          
          {/* Scrolling container */}
          <div className="flex animate-infinite-scroll">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
                style={{ width: '200px' }} // Fixed width for consistent spacing
              >
                <img
                  src={logo.image}
                  alt={logo.alt}
                  className="h-16 w-auto object-contain filter hover:grayscale-0 grayscale transition-all duration-300 hover:scale-110"
                  style={{ maxWidth: '180px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfiniteLogoCarousel;