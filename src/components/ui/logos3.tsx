"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description?: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Provas do Brasil e do Mundo",
  logos = [
    { id: "logo-1", image: "/logos/berlim.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-2", image: "/logos/boston.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-3", image: "/logos/chicago.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-4", image: "/logos/floripa.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-5", image: "/logos/ny.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-6", image: "/logos/poa.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-7", image: "/logos/rio.png", className: "h-8 md:h-10 w-auto" },
    { id: "logo-8", image: "/logos/sp-city.png", className: "h-8 md:h-10 w-auto" },
  ],
}: Logos3Props) => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="section-text mb-16">{heading}</h2>
      </div>
      <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true })]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="mx-10 flex shrink-0 items-center justify-center">
                  <div>
                    <img
                      src={logo.image}
                      alt={logo.description || `Logo ${logo.id}`}
                      className={logo.className}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
      </div>
    </section>
  );
};

export { Logos3 };