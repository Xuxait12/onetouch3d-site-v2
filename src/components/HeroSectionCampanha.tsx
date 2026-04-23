import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import type { Campanha } from "@/hooks/useCampanhaAtiva";

interface CampanhaResponsiva extends Campanha {
  foto_background_tablet?: string | null;
  foto_background_mobile?: string | null;
}

interface Props {
  campanha: CampanhaResponsiva;
}

type Device = "mobile" | "tablet" | "desktop";

const getDevice = (): Device => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

const HeroSectionCampanha: React.FC<Props> = ({ campanha }) => {
  const baseUrl = "https://wa.me/5554999921515";
  const whatsappUrl = campanha.mensagem_whatsapp
    ? `${baseUrl}?text=${encodeURIComponent(campanha.mensagem_whatsapp)}`
    : baseUrl;

  const [device, setDevice] = useState<Device>(getDevice);

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const bgSrc =
    device === "mobile"
      ? campanha.foto_background_mobile || campanha.foto_background
      : device === "tablet"
      ? campanha.foto_background_tablet || campanha.foto_background
      : campanha.foto_background;

  const buttonPositionClass =
    device === "mobile"
      ? "top-[60%] left-1/2 -translate-x-1/2"
      : device === "tablet"
      ? "top-[55%] left-[12%]"
      : "top-[58%] left-[18%]";

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-gray-900">
      <img
        src={bgSrc}
        alt={`Fundo ${campanha.nome_prova}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      <div className={`absolute ${buttonPositionClass} z-10 inline-flex flex-col items-stretch`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full shadow-lg font-semibold transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Falar no WhatsApp
        </a>
        <button
          type="button"
          onClick={() =>
            document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-12 text-right text-white text-lg font-medium underline underline-offset-4 hover:text-white/80 transition-colors bg-transparent border-0 cursor-pointer"
        >
          Como funciona?
        </button>
      </div>
    </section>
  );
};

export default HeroSectionCampanha;
