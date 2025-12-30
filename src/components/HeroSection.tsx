import React from "react";
import { motion, useReducedMotion } from "framer-motion";
const heroRunnerFinish = "/images/corrida-hero.webp";
const LETTER_VARIANTS = {
  hidden: {
    y: 24,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const WORD_VARIANTS = {
  hidden: {
    y: 12,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const title = "Eternize Sua Prova com um Quadro Personalizado";
  const [firstWord, ...restWords] = title.split(" ");
  const restText = restWords.join(" ");
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.05
      }
    }
  };
  const letterContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        duration: 0.48
      }
    }
  };
  const wordContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.04,
        duration: 0.42
      }
    }
  };
  return <section className="relative w-full min-h-[100svh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-no-repeat" style={{
      backgroundImage: `url(${heroRunnerFinish})`,
      backgroundPosition: 'center 30%'
    }}>
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full min-h-[100svh] flex items-end sm:items-center justify-center px-4 sm:px-6 pb-16 sm:pb-0 my-[53px]">
        <div className="text-center text-white max-w-5xl mx-auto">
          {/* H1 com animação letter-by-letter */}
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl" initial="hidden" animate="visible" variants={shouldReduceMotion ? {} : containerVariants}>
            {/* Eternize - letter by letter */}
            <span className="inline-block mr-3 align-middle">
              <motion.span aria-hidden className="inline-flex" variants={shouldReduceMotion ? {} : letterContainerVariants}>
                {firstWord.split("").map((char, i) => <motion.span key={`letter-${i}`} className="inline-block text-blue-400" variants={shouldReduceMotion ? {} : LETTER_VARIANTS} style={{
                display: "inline-block"
              }}>
                    {char}
                  </motion.span>)}
              </motion.span>
            </span>

            {/* Resto do H1 */}
            <motion.span className="inline-block align-middle text-white" variants={shouldReduceMotion ? {} : wordContainerVariants}>
              {restText.split(" ").map((word, wi) => <motion.span key={`word-${wi}`} className="inline-block ml-1" variants={shouldReduceMotion ? {} : WORD_VARIANTS} style={{
              display: "inline-block"
            }}>
                  {word}
                  {wi < restText.split(" ").length - 1 ? "\u00A0" : ""}
                </motion.span>)}
            </motion.span>
          </motion.h1>

          {/* P com fade-up */}
          <motion.p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto text-white/95 drop-shadow-lg" initial={shouldReduceMotion ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 12
        }} animate={shouldReduceMotion ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 1,
          y: 0
        }} transition={shouldReduceMotion ? {} : {
          delay: 0.6,
          duration: 0.6,
          ease: "easeOut"
        }}>
            Deixe sua medalha em destaque! Personalize com percurso 3D, fotos e dados da prova para criar uma lembrança inesquecível.
          </motion.p>

          {/* CTA com fade-up e zoom */}
          <motion.div className="mt-6" initial={shouldReduceMotion ? {} : {
          opacity: 0,
          y: 10,
          scale: 0.98
        }} animate={shouldReduceMotion ? {} : {
          opacity: 1,
          y: 0,
          scale: 1
        }} transition={shouldReduceMotion ? {} : {
          delay: 1.05,
          duration: 0.5,
          ease: "easeOut"
        }}>
            <motion.a href="#nossa-loja" aria-label="Personalize seu quadro agora" whileHover={shouldReduceMotion ? {} : {
            scale: 1.03
          }} className="neu-button inline-flex items-center justify-center">
              Personalize seu quadro agora
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HeroSection;