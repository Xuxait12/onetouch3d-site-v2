import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const scrollingUp = currentY < lastScrollY.current;

    if (scrollingUp && currentY > 300) {
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 1500);
    }

    if (currentY <= 50) setVisible(false);

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setVisible(false);
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-opacity duration-[400ms] ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: "rgba(255,255,255,0.20)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.30)",
      }}
    >
      <ChevronUp className="w-5 h-5 text-white" style={{ opacity: 0.85 }} />
    </button>
  );
};

export default ScrollToTop;
