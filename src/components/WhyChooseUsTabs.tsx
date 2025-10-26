import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tabs = [
  {
    id: 1,
    label: "Qualidade premium",
    title: "Qualidade premium",
    description: "Impressão 3D e molduras de alta qualidade",
    image: "/placeholder-quality.jpg"
  },
  {
    id: 2,
    label: "Destaque para sua medalha",
    title: "Destaque para sua medalha",
    description: "Sua conquista e dedicação em evidência.",
    image: "/placeholder-medal.jpg"
  },
  {
    id: 3,
    label: "Personalização completa",
    title: "Personalização completa",
    description: "A personalização é feita junto com você.",
    image: "/placeholder-custom.jpg"
  }
];

const WhyChooseUsTabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  const checkOverflow = () => {
    const container = containerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const atStart = container.scrollLeft <= 5;
      const atEnd = container.scrollLeft >= maxScroll - 5;
      
      setShowLeftArrow(!atStart && maxScroll > 0);
      setShowRightArrow(!atEnd && maxScroll > 0);
    }
  };

  const scrollToActiveTab = () => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeButton = tabRefs.current[activeIndex];
    const container = containerRef.current;
    
    if (activeButton && container) {
      const offset = 10;
      container.scrollTo({ left: Math.max(0, activeButton.offsetLeft - offset), behavior: 'smooth' });
      setTimeout(checkOverflow, 300);
    }
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeButton = tabRefs.current[activeIndex];
    
    if (activeButton) {
      const { offsetWidth, offsetLeft } = activeButton;
      setSliderStyle({
        width: offsetWidth,
        left: offsetLeft
      });
    }
    
    // Scroll to active tab on mobile
    scrollToActiveTab();
  }, [activeTab]);

  useEffect(() => {
    checkOverflow();
    scrollToActiveTab();
    
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (container) {
      const step = Math.floor(container.clientWidth * 0.6);
      const scrollAmount = direction === "left" ? -step : step;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkOverflow, 300);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/40 via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Por que escolher nossos quadros?
          </h2>
        </div>

        {/* Image */}
        <div className="mb-8 animate-fade-up">
          <img
            src={activeContent?.image}
            alt={activeContent?.title}
            className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] object-cover rounded-3xl shadow-elegant transition-all duration-500"
            key={activeTab}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 animate-fade-up">
          {/* Seta esquerda */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all md:hidden"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
          )}

          {/* Seta direita */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all md:hidden"
              aria-label="Rolar para direita"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          )}

          {/* Container de tabs */}
          <div
            ref={containerRef}
            onScroll={checkOverflow}
            className="tabs relative inline-flex rounded-full bg-secondary/50 p-1.5 overflow-x-auto max-w-full shadow-inner scrollbar-hide w-full md:justify-center scroll-smooth snap-x snap-mandatory"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`
                  flex-shrink-0 flex-grow-0 snap-start px-5 md:px-6 py-2 md:py-2.5 font-medium transition-colors duration-300 relative z-10 whitespace-nowrap text-sm md:text-base leading-relaxed tracking-wide
                  ${
                    activeTab === tab.id
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}

            {/* Animated Slider */}
            <div
              className="absolute bg-accent rounded-full transition-all duration-300 ease-in-out z-0 shadow-lg"
              style={{
                width: `${sliderStyle.width}px`,
                left: `${sliderStyle.left}px`,
                top: '6px',
                bottom: '6px'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <p className="text-xl md:text-2xl font-bold text-foreground leading-relaxed transition-all duration-300">
            {activeContent?.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsTabs;
