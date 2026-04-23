import React from "react";
import { MessageCircle } from "lucide-react";
import type { Campanha } from "@/hooks/useCampanhaAtiva";

interface Props {
  campanha: Campanha;
}

const HeroSectionCampanha: React.FC<Props> = ({ campanha }) => {
  const baseUrl = "https://wa.me/5551997199201";
  const whatsappUrl = campanha.mensagem_whatsapp
    ? `${baseUrl}?text=${encodeURIComponent(campanha.mensagem_whatsapp)}`
    : baseUrl;

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-gray-900">
      <img
        src={campanha.foto_background}
        alt={`Fundo ${campanha.nome_prova}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="absolute top-[52%] left-[28%] inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full shadow-lg font-semibold transition-colors z-10"
      >
        <MessageCircle className="w-5 h-5" />
        Falar no WhatsApp
      </a>
    </section>
  );
};

export default HeroSectionCampanha;
