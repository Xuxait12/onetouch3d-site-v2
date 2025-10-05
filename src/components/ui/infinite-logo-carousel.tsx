import { Mail } from 'lucide-react';

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

  // Group 2: existing logos from project updated with new uploads
  const group2: Logo[] = [
    { id: "ny", image: "/lovable-uploads/4b4b4c3c-9e98-4de6-8bce-b664ee11e844.png", alt: "New York City Marathon" },
    { id: "poa", image: "/lovable-uploads/d1c593ef-e7b5-4ab1-a9bf-e0c0f317bea9.png", alt: "Maratona de Porto Alegre" },
    { id: "la-mission", image: "/lovable-uploads/a0585803-792c-4caf-9717-e78b986ab368.png", alt: "LA Mission Serra Fina Brasil" },
    { id: "rio", image: "/lovable-uploads/24f358e6-7bae-49d4-882d-89882262e764.png", alt: "Maratona do Rio" },
    { id: "sp-city", image: "/lovable-uploads/0cbdf698-7f6b-48ee-9b64-829f0c110046.png", alt: "SP City Marathon" }
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
            Maratonas e provas
          </h2>
          <p className="text-lg text-muted-foreground">
            Celebramos conquistas de corredores ao redor do mundo.
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Gradient overlays for seamless effect */}
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-background to-transparent z-10"></div>
          
          {/* Scrolling container - faster on mobile */}
          <div className="flex animate-[infiniteScroll_7s_linear_infinite] md:animate-infinite-scroll">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: '220px', padding: '0 20px' }} // Balanced spacing
              >
                <img
                  src={logo.image}
                  alt={logo.alt}
                  className="h-16 w-auto object-contain transition-all duration-300 hover:scale-110"
                  style={{ 
                    maxWidth: '180px',
                    backgroundColor: 'transparent',
                    filter: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        
        {/* Discrete horizontal banner */}
        <div className="mt-8">
          <div className="w-full bg-gray-100 rounded-lg py-3 px-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <Mail size={16} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm md:text-base">
                <span className="font-bold text-black">Cada conquista é única — </span>
                <span className="font-bold text-blue-600">se a sua prova não estiver aqui</span>
                <span className="font-bold text-black">, nos chame e nós a transformamos em um quadro exclusivo.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfiniteLogoCarousel;