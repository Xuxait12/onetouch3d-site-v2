import { useState, useRef, useEffect } from "react";

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeContent = tabs.find((tab) => tab.id === activeTab);

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
  }, [activeTab]);

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
        <div className="flex justify-center mb-12 animate-fade-up">
          <div className="tabs relative inline-flex rounded-full bg-secondary/50 p-1.5 overflow-x-auto max-w-full shadow-inner">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`
                  font-medium transition-colors duration-300 relative z-10 text-sm md:text-base
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
          <p className="text-2xl md:text-4xl font-bold text-foreground leading-relaxed transition-all duration-300">
            {activeContent?.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsTabs;
