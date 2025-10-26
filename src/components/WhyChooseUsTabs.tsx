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
      
      // Only show left arrow if not at start AND there's overflow
      setShowLeftArrow(!atStart && maxScroll > 0);
      // Only show right arrow if not at end AND there's overflow
      setShowRightArrow(!atEnd && maxScroll > 0);
    }
  };

  const scrollToActiveTab = () => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeButton = tabRefs.current[activeIndex];
    const container = containerRef.current;
    
    if (activeButton && container) {
      // Center the active tab with proper spacing
      const containerWidth = container.clientWidth;
      const tabCenter = activeButton.offsetLeft + (activeButton.offsetWidth / 2);
      const scrollPosition = tabCenter - (containerWidth / 2);
      
      container.scrollTo({ 
        left: Math.max(0, Math.min(scrollPosition, container.scrollWidth - containerWidth)), 
        behavior: 'smooth' 
      });
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
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const newIndex = direction === "left" ? Math.max(0, currentIndex - 1) : Math.min(tabs.length - 1, currentIndex + 1);
    
    if (newIndex !== currentIndex) {
      setActiveTab(tabs[newIndex].id);
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
          <div className="flex items-center gap-2">
            {/* Seta esquerda */}
            <div className="flex-shrink-0 md:hidden" style={{ width: showLeftArrow ? '32px' : '0px', transition: 'width 0.2s ease' }}>
              {showLeftArrow && (
                <button
                  onClick={() => scroll("left")}
                  className="bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all"
                  aria-label="Aba anterior"
                >
                  <ChevronLeft size={18} className="text-foreground" />
                </button>
              )}
            </div>

            {/* Container de tabs */}
            <div
              ref={containerRef}
              onScroll={checkOverflow}
              className="tabs relative inline-flex rounded-full bg-secondary/50 p-1.5 overflow-x-auto max-w-full shadow-inner scrollbar-hide w-full md:justify-center scroll-smooth snap-x snap-mandatory flex-1"
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

            {/* Seta direita */}
            <div className="flex-shrink-0 md:hidden" style={{ width: showRightArrow ? '32px' : '0px', transition: 'width 0.2s ease' }}>
              {showRightArrow && (
                <button
                  onClick={() => scroll("right")}
                  className="bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all"
                  aria-label="Próxima aba"
                >
                  <ChevronRight size={18} className="text-foreground" />
                </button>
              )}
            </div>
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
