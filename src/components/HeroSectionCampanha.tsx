import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, LayoutGrid } from "lucide-react";
import type { Campanha } from "@/hooks/useCampanhaAtiva";

interface Props {
  campanha: Campanha;
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
  const baseUrl = "https://wa.me/5554999924547";
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
      ? "top-[71%] left-1/2 -translate-x-1/2"
      : device === "tablet"
      ? "top-[68%] left-1/2 -translate-x-1/2"
      : "top-[58%] left-[18%]";

  // Botão "Ver Catálogo": só existe na campanha da página Corrida, no desktop e no mobile
  // por enquanto (posição de tablet fica pendente até termos a imagem de referência desse breakpoint)
  const showCatalogButton =
    (device === "desktop" || device === "mobile") && campanha.pagina === "corrida";

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden bg-gray-900">
      <img
        src={bgSrc}
        alt={`Fundo ${campanha.nome_prova}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      {device === "mobile" ? (
        // Mobile: ordem Ver Catálogo (no lugar onde era o WhatsApp) -> Como funciona? (mais acima) -> Falar no WhatsApp (abaixo, com espaço)
        <div className="absolute top-[71%] left-1/2 -translate-x-1/2 z-10 inline-flex flex-col items-center">
          {showCatalogButton && (
            <Link
              to="/catalogo/corrida"
              aria-label="Ver Catálogo"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#374151] px-4 py-2 text-sm rounded-full shadow-lg font-semibold transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              Ver Catálogo
            </Link>
          )}
          <button
            type="button"
            onClick={() =>
              document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-5 text-center text-white text-xl font-medium underline underline-offset-4 hover:text-white/80 transition-colors bg-transparent border-0 cursor-pointer"
          >
            Como funciona?
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-2 text-sm rounded-full shadow-lg font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </a>
        </div>
      ) : (
        <>
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
              className="mt-12 text-center text-white text-xl font-medium underline underline-offset-4 hover:text-white/80 transition-colors bg-transparent border-0 cursor-pointer"
            >
              Como funciona?
            </button>
          </div>

          {showCatalogButton && device === "desktop" && (
            <Link
              to="/catalogo/corrida"
              aria-label="Ver Catálogo"
              className="absolute top-[89%] left-[59%] z-10 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#374151] px-6 py-3 rounded-full shadow-lg font-semibold transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              Ver Catálogo
            </Link>
          )}
        </>
      )}
    </section>
  );
};

export default HeroSectionCampanha;
