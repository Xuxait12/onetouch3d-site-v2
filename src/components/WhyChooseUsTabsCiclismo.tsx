import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tabs = [
  {
    id: 1,
    label: "Qualidade premium",
    title: "Qualidade premium",
    description: "Molduras de alta qualidade",
    image: "/images/qualidade-premium-ciclismo.webp"
  },
  {
    id: 2,
    label: "Destaque suas conquistas",
    title: "Destaque para sua medalha",
    description: "Sua conquista e dedicação em evidência.",
    image: "/images/destaque-ciclismo.webp"
  },
  {
    id: 3,
    label: "Personalização completa",
    title: "Personalização completa",
    description: "A personalização é feita junto com você.",
    image: "/images/personalizacao-completa-ciclismo.webp"
  }
];

const WhyChooseUsTabsCiclismo = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeContent = tabs.find((tab) => tab.id === activeTab);

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    
    const maxScroll = track.scrollWidth - track.clientWidth;
    setShowLeftArrow(track.scrollLeft > 6 && maxScroll > 0);
    setShowRightArrow(track.scrollLeft + track.clientWidth + 6 < track.scrollWidth && maxScroll > 0);
  };

  const updatePillToTab = (tabId: number, smooth = true) => {
    const activeIndex = tabs.findIndex((tab) => tab.id === tabId);
    const tab = tabRefs.current[activeIndex];
    const track = trackRef.current;
    
    if (!tab || !track) return;

    const width = tab.offsetWidth;
    const left = tab.offsetLeft - track.scrollLeft;

    setPillStyle({
      width,
      left,
      opacity: 1
    });

    const visibleLeft = tab.offsetLeft - track.scrollLeft;
    const visibleRight = visibleLeft + tab.offsetWidth;
    const viewportWidth = track.clientWidth;

    if (visibleLeft < 8) {
      track.scrollTo({ 
        left: Math.max(0, tab.offsetLeft - 12), 
        behavior: smooth ? 'smooth' : 'auto'
      });
    } else if (visibleRight > viewportWidth - 8) {
      const target = tab.offsetLeft - (viewportWidth / 2) + (tab.offsetWidth / 2);
      track.scrollTo({ 
        left: Math.max(0, target), 
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    updateArrows();
  };

  const handleScroll = () => {
    updatePillToTab(activeTab, false);
  };

  const scroll = (direction: "left" | "right") => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    
    if (direction === "left" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    } else if (direction === "right" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    updatePillToTab(activeTab, true);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => updatePillToTab(activeTab, false);
    
    window.addEventListener("resize", handleResize);
    
    const initPill = () => {
      setTimeout(() => updatePillToTab(activeTab, false), 120);
    };
    
    if (document.fonts) {
      document.fonts.ready.then(initPill);
    } else {
      initPill();
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            className="w-full max-w-4xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-elegant transition-all duration-500"
            key={activeTab}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 animate-fade-up">
          <div className="flex items-center gap-2 md:gap-3 justify-center px-4 md:px-0">
            {/* Seta esquerda */}
            <button
              onClick={() => scroll("left")}
              className={`md:hidden flex-shrink-0 bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all ${
                showLeftArrow ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              aria-label="Rolar para esquerda"
              style={{ width: '32px', height: '32px' }}
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>

            {/* Container de tabs */}
            <div className="relative rounded-full bg-secondary/50 p-1.5 shadow-inner overflow-hidden flex-1 md:flex-initial md:inline-flex">
              <div
                ref={trackRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto scrollbar-hide scroll-smooth px-1.5"
                style={{ scrollbarWidth: 'none' }}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(el) => (tabRefs.current[index] = el)}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`
                      flex-shrink-0 py-2.5 font-medium transition-colors duration-300 relative z-10 text-sm md:text-base w-[220px] md:w-[240px] text-center
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

                {/* Animated Pill */}
                <div
                  className="absolute bg-accent rounded-full transition-all duration-300 ease-in-out z-0 shadow-lg pointer-events-none"
                  style={{
                    width: `${pillStyle.width}px`,
                    left: `${pillStyle.left}px`,
                    top: '6px',
                    bottom: '6px',
                    opacity: pillStyle.opacity
                  }}
                />
              </div>
            </div>

            {/* Seta direita */}
            <button
              onClick={() => scroll("right")}
              className={`md:hidden flex-shrink-0 bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-background transition-all ${
                showRightArrow ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              aria-label="Rolar para direita"
              style={{ width: '32px', height: '32px' }}
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
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

export default WhyChooseUsTabsCiclismo;
