"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
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
  logos = [{
    id: "logo-1",
    image: "/lovable-uploads/55384af6-f74b-4f22-a6e9-bbe2e65dc526.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-2",
    image: "/lovable-uploads/3ae15162-cde4-4abb-9f06-08b7dac7c00c.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-3",
    image: "/lovable-uploads/e1042b3e-604b-41bf-b9c5-687ade9efe1d.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-4",
    image: "/lovable-uploads/e8e41613-7cf8-4473-ad6e-4d1228ed4a6d.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "paraty",
    image: "/lovable-uploads/b6ced35d-8230-4d4b-9cc5-adc7e83eea44.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-5",
    image: "/lovable-uploads/d55d8ea9-accd-4cf7-b18a-3ee10d894610.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-6",
    image: "/lovable-uploads/f2097e19-9020-45e8-b409-cbe0df9e7f6f.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-7",
    image: "/lovable-uploads/b7f40157-cc57-48c0-9075-c22060083f48.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "logo-8",
    image: "/lovable-uploads/1e90facf-c2ee-43d6-9fd6-35f1aff72989.png",
    className: "h-12 md:h-16 w-auto"
  }, {
    id: "la-mission",
    image: "/lovable-uploads/841eb927-fe0e-4a98-8b32-8a9b15683046.png",
    className: "h-12 md:h-16 w-auto"
  }]
}: Logos3Props) => {
  return <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="section-text mb-16">{heading}</h2>
      </div>
      <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
        <Carousel opts={{
        loop: true
      }} plugins={[AutoScroll({
        playOnInit: true
      })]}>
          <CarouselContent className="ml-0">
            {logos.map(logo => <CarouselItem key={logo.id} className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                <div className="mx-10 flex shrink-0 items-center justify-center">
                  <div>
                    <img src={logo.image} alt={logo.description || `Logo ${logo.id}`} className={logo.className} />
                  </div>
                </div>
              </CarouselItem>)}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 mt-12 mb-5 md:mb-6 flex justify-center">
        <AnimatedText 
          text="Cada conquista é única!" 
          textClassName="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-brand-red"
          underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
          underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
          underlineDuration={1.5}
          underlineClassName="text-brand-red"
        />
      </div>
      
      {/* Blue rectangle with call-to-action text */}
      <div className="pt-6 pb-12 flex justify-center px-6">
        <div className="inline-block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 bg-[length:200%_100%] animate-gradient-x rounded-2xl px-8 py-6 shadow-lg">
          <p className="text-white font-bold text-center uppercase text-lg md:text-xl leading-tight">
            SE A SUA PROVA NÃO ESTÁ AQUI,<br />
            NOS ENVIE DADOS DA SUA PROVA QUE NÓS A ETERNIZAMOS PARA VOCÊ.
          </p>
        </div>
      </div>
    </section>;
};
export { Logos3 };