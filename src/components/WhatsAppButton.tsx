import { useEffect, useState } from "react";

const WhatsAppButton = () => {
  const [buttonId, setButtonId] = useState("btn-whatsapp-geral");

  useEffect(() => {
    const path = window.location.pathname;

    if (path.includes("/corrida")) setButtonId("btn-whatsapp-corrida");
    else if (path.includes("/ciclismo")) setButtonId("btn-whatsapp-ciclismo");
    else if (path.includes("/triathlon")) setButtonId("btn-whatsapp-triathlon");
    else if (path.includes("/viagem")) setButtonId("btn-whatsapp-viagem");
  }, []);

  const handleClick = () => {
    window.open("https://wa.me/5554999921515", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      id={buttonId}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Entrar em contato via WhatsApp"
    >
      {/* SVG permanece igual */}
    </button>
  );
};

export default WhatsAppButton;
