import { useState } from "react";

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
  const activeContent = tabs.find((tab) => tab.id === activeTab);

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
          <div className="relative inline-flex items-center rounded-full bg-secondary/50 p-1.5 overflow-x-auto max-w-full shadow-inner">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 font-medium transition-all duration-300 relative z-10 rounded-full whitespace-nowrap text-sm md:text-base
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
              className="absolute top-1.5 bottom-1.5 bg-accent rounded-full transition-all duration-300 ease-in-out z-0 shadow-lg"
              style={{
                width: `calc((100% - 12px) / ${tabs.length})`,
                left: `calc(((100% - 12px) / ${tabs.length}) * ${activeTab - 1} + 6px)`
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-card-foreground transition-all duration-300">
            {activeContent?.title}
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed transition-all duration-300">
            {activeContent?.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsTabs;
