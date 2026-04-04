import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Testimonial Quote Component with expandable text
const TestimonialQuote = ({ quote }: { quote: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 180;
  const shouldTruncate = quote.length > maxLength;
  
  const displayText = shouldTruncate && !isExpanded 
    ? quote.substring(0, maxLength) + '...' 
    : quote;
  
  return (
    <div className="mt-4 sm:mt-6 md:mt-8">
      <motion.p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
        "{displayText}"
      </motion.p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
};

// Testimonials data for Corrida page
const testimonials = [
  {
    quote:
      "Uma experiência maravilhosa porque foi um complemento de uma grande conquista pessoal. A Onetouch3D fez parte desse sonho!",
    name: "Verinaldo Chicuta",
    designation: "Maratona Chicago",
    src: "/lovable-uploads/verinaldo-chicuta-maratona-chicago.webp",
  },
  {
    quote:
      "Ter minhas medalhas expostas na parede não representa apenas a alegria da conquista, mas revive toda a memória do caminho percorrido até cada chegada. A Onetouch consegue transformar essa história em emoção, presente em cada quadro produzido.",
    name: "Everaldo Bonani",
    designation: "Boston Marathon",
    src: "/lovable-uploads/everaldo-bonani-boston-marathon.webp",
  },
  {
    quote:
      "Sou atleta a 30 anos e para mim que corro a muito tempo ter o meu primeiro quadro em especial da Onetouch3D foi uma tremenda satisfação, pela qualidade e os mínimos detalhes que foram colocados neste quadro onde demonstra a minha maior conquista dentro da corrida que foram os 82KM Shogun da Serra do Rio do rastro em Santa Catarina.",
    name: "Rodrigo Nicoloso",
    designation: "Uphill Desafio Shogun",
    src: "/lovable-uploads/rodrigo-nicoloso-uphill-desafio-shogun.webp",
  },
];

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(2);

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  const randomRotate = () => `${Math.floor(Math.random() * 16) - 8}deg`;

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-2 md:py-6 font-sans antialiased sm:max-w-md md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-4 sm:gap-y-6 md:gap-y-10 md:grid-cols-2 md:gap-x-20">
        {/* Image Section */}
        <div className="flex items-center justify-center">
            <div className="relative h-56 sm:h-64 md:h-80 w-full max-w-[280px] sm:max-w-xs">
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.5,
                      scale: isActive(index) ? 1 : 0.9,
                      y: isActive(index) ? 0 : 20,
                      zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                      rotate: isActive(index) ? '0deg' : randomRotate(),
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                    style={{ perspective: '1000px' }}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      loading="lazy"
                      className="h-full w-full rounded-3xl object-cover object-center md:object-[center_20%] shadow-2xl"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/500x500/e2e8f0/64748b?text=${testimonial.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>

        {/* Text and Controls Section */}
        <div className="flex flex-col justify-center py-2 md:py-4 h-auto md:h-[400px] text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col justify-between h-full"
            >
                <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {testimonials[active].name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonials[active].designation}
                    </p>
                    <TestimonialQuote quote={testimonials[active].quote} />
                </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4 pt-4 md:pt-8 justify-center md:justify-start">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-500"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:-translate-x-1 dark:text-slate-300" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:ring-slate-500"
            >
              <ArrowRight className="h-5 w-5 text-slate-800 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function AnimatedTestimonialsDemo() {
  return <AnimatedTestimonials testimonials={testimonials} />;
}

const TestimonialsSectionCorrida = () => {
  return (
    <section className="py-4 md:py-6 lg:py-4 mb-0 pb-0 md:mb-0 md:pb-6">
      <div className="text-center mb-4">
        <h2 className="section-text py-0 px-0 mx-0 my-0">O que Nossos Clientes Dizem</h2>
      </div>
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-4 md:py-8">
        <style>
          {`
            @keyframes animate-grid {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
            .animated-grid-corrida {
              width: 200%;
              height: 200%;
              background-image: 
                linear-gradient(to right, #e2e8f0 1px, transparent 1px), 
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
              background-size: 3rem 3rem;
              animation: animate-grid 40s linear infinite alternate;
            }
            .dark .animated-grid-corrida {
              background-image: 
                linear-gradient(to right, #1e293b 1px, transparent 1px), 
                linear-gradient(to bottom, #1e293b 1px, transparent 1px);
            }
          `}
        </style>
        <div className="animated-grid-corrida absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        
        <div className="z-10">
          <AnimatedTestimonialsDemo />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionCorrida;
