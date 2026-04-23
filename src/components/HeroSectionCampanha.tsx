import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Campanha } from "@/hooks/useCampanhaAtiva";

const LETTER_VARIANTS = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const WORD_VARIANTS = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

interface Props {
  campanha: Campanha;
}

const HeroSectionCampanha: React.FC<Props> = ({ campanha }) => {
  const shouldReduceMotion = useReducedMotion();
  const title = campanha.frase_personalizada;
  const words = title.split(" ");
  const firstWord = words[0] ?? "";
  const restText = words.slice(1).join(" ");

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
  };
  const letterContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04, duration: 0.48 } },
  };
  const wordContainerVariants = {
    hidden: {},
    visible: { transition: { delayChildren: 0.15, staggerChildren: 0.04, duration: 0.42 } },
  };

  const handleCta = () => {
    if (campanha.mensagem_whatsapp) {
      const url = `https://wa.me/5551997199201?text=${encodeURIComponent(campanha.mensagem_whatsapp)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      document.getElementById("nossa-loja")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-gray-900">
      {/* Background image */}
      <img
        src={campanha.foto_background}
        alt={`Fundo ${campanha.nome_prova}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 h-full min-h-[100svh] flex items-end sm:items-center justify-center px-4 sm:px-6 pb-16 sm:pb-0 my-[53px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Coluna texto */}
          <div className="text-center lg:text-left text-white">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-2xl"
              initial="hidden"
              animate="visible"
              variants={shouldReduceMotion ? {} : containerVariants}
            >
              <span className="inline-block mr-3 align-middle">
                <motion.span
                  aria-hidden
                  className="inline-flex"
                  variants={shouldReduceMotion ? {} : letterContainerVariants}
                >
                  {firstWord.split("").map((char, i) => (
                    <motion.span
                      key={`letter-${i}`}
                      className="inline-block text-blue-400"
                      variants={shouldReduceMotion ? {} : LETTER_VARIANTS}
                      style={{ display: "inline-block" }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </span>

              {restText && (
                <motion.span
                  className="inline-block align-middle text-white"
                  variants={shouldReduceMotion ? {} : wordContainerVariants}
                >
                  {restText.split(" ").map((word, wi, arr) => (
                    <motion.span
                      key={`word-${wi}`}
                      className="inline-block ml-1"
                      variants={shouldReduceMotion ? {} : WORD_VARIANTS}
                      style={{ display: "inline-block" }}
                    >
                      {word}
                      {wi < arr.length - 1 ? "\u00A0" : ""}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl mb-6 opacity-90 max-w-2xl mx-auto lg:mx-0 text-white/95 drop-shadow-lg"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              {campanha.frase_secundaria}
            </motion.p>

            <motion.p
              className="text-lg font-bold text-white/90 mt-4 mb-2 drop-shadow-lg"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.85, duration: 0.5, ease: "easeOut" }}
            >
              🏷️ A partir de R$ 291,90 · Parcele em até 12x
            </motion.p>

            <motion.div
              className="mt-6"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 10, scale: 0.98 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              transition={shouldReduceMotion ? {} : { delay: 1.05, duration: 0.5, ease: "easeOut" }}
            >
              <motion.button
                onClick={handleCta}
                aria-label="Personalize seu quadro agora"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                className="neu-button inline-flex items-center justify-center"
              >
                {campanha.mensagem_whatsapp ? "Falar no WhatsApp" : "Personalize seu quadro agora"}
              </motion.button>
            </motion.div>
          </div>

          {/* Coluna quadros */}
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] hidden sm:block">
            <motion.img
              src={campanha.imagem_quadro_1}
              alt={`Quadro ${campanha.nome_prova}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-full max-w-[85%] object-contain drop-shadow-2xl"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { delay: 0.4, duration: 0.7, ease: "easeOut" }}
              loading="eager"
            />
            {campanha.imagem_quadro_2 && (
              <motion.img
                src={campanha.imagem_quadro_2}
                alt={`Quadro ${campanha.nome_prova} 2`}
                className="absolute bottom-4 right-4 max-h-[55%] max-w-[55%] object-contain drop-shadow-2xl rotate-6"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { delay: 0.7, duration: 0.7, ease: "easeOut" }}
                loading="eager"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionCampanha;
