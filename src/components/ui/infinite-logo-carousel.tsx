import { Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
interface Logo {
  id: string;
  image: string;
  alt: string;
}
interface InfiniteLogoCarouselProps {
  className?: string;
}
const InfiniteLogoCarousel = ({
  className = ""
}: InfiniteLogoCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Logos array
  const logos: Logo[] = [{
    id: "berlim",
    image: "/lovable-uploads/d71f7332-6004-4090-8e9e-e2e0a19713a2.png",
    alt: "BMW Berlin Marathon"
  }, {
    id: "boston",
    image: "/lovable-uploads/a0094dd2-299d-4b7f-b118-421e88e1cc8b.png",
    alt: "Boston Marathon"
  }, {
    id: "chicago",
    image: "/lovable-uploads/3d11d14f-c982-4537-b510-549cabfe135c.png",
    alt: "Chicago Marathon"
  }, {
    id: "paraty",
    image: "/lovable-uploads/94f49477-8894-4272-9b97-80ac6d06129a.png",
    alt: "Paraty Brazil"
  }, {
    id: "floripa",
    image: "/lovable-uploads/cd67de84-b9ab-4538-9d58-ca0e843aa5a2.png",
    alt: "Floripa International"
  }, {
    id: "ny",
    image: "/lovable-uploads/4b4b4c3c-9e98-4de6-8bce-b664ee11e844.png",
    alt: "New York City Marathon"
  }, {
    id: "poa",
    image: "/lovable-uploads/d1c593ef-e7b5-4ab1-a9bf-e0c0f317bea9.png",
    alt: "Maratona de Porto Alegre"
  }, {
    id: "la-mission",
    image: "/lovable-uploads/a0585803-792c-4caf-9717-e78b986ab368.png",
    alt: "LA Mission Serra Fina Brasil"
  }, {
    id: "rio",
    image: "/lovable-uploads/24f358e6-7bae-49d4-882d-89882262e764.png",
    alt: "Maratona do Rio"
  }, {
    id: "sp-city",
    image: "/lovable-uploads/0cbdf698-7f6b-48ee-9b64-829f0c110046.png",
    alt: "SP City Marathon"
  }];

  // Infinite scroll animation using requestAnimationFrame
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollPosition = 0;
    let animationFrame: number;
    const animate = () => {
      // Velocidade: 0.5px por frame (ajuste conforme necessário)
      scrollPosition += 0.5;

      // Quando chegar na metade (onde as logos duplicadas começam), reseta para 0
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];
  return <section className={`py-16 ${className}`}>
      
    </section>;
};
export default InfiniteLogoCarousel;