import { useState, useCallback } from "react";

export interface TabItem {
  id: number;
  label: string;
  labelShort?: string;
  title: string;
  description: string;
  image: string;
  imageMobile?: string;
  mobileImage?: string;
}

interface WhyChooseUsTabsBaseProps {
  tabs: TabItem[];
}

const WhyChooseUsTabsBase = ({ tabs }: WhyChooseUsTabsBaseProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 1);

  const activeContent = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const handleTabChange = useCallback((tabId: number) => {
    setActiveTab(tabId);
  }, []);

  const mobileImg = activeContent?.imageMobile || activeContent?.mobileImage;

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/40 via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Por que escolher nossos quadros?
          </h2>
        </div>

        {/* Image — keyed by activeTab to force re-render */}
        <div className="mb-8 animate-fade-up">
          {mobileImg ? (
            <picture>
              <source media="(min-width: 768px)" srcSet={activeContent.image} />
              <img
                key={`img-${activeTab}`}
                src={mobileImg}
                alt={activeContent.title}
                className="w-full max-w-4xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-elegant transition-all duration-500"
              />
            </picture>
          ) : (
            <img
              key={`img-${activeTab}`}
              src={activeContent.image}
              alt={activeContent.title}
              className="w-full max-w-4xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-elegant transition-all duration-500"
            />
          )}
        </div>

        {/* Tabs Navigation — simple inline-flex, no complex scroll logic */}
        <div className="relative w-full max-w-4xl mx-auto mb-12 animate-fade-up">
          <div className="flex justify-center px-4 md:px-0">
            <div
              className="flex flex-wrap justify-center gap-2 bg-secondary/50 p-1.5 rounded-2xl md:rounded-full shadow-inner"
              role="tablist"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative z-10 rounded-full py-2.5 px-4 md:px-6 font-medium transition-all duration-300 text-sm md:text-base whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {tab.labelShort ? (
                    <>
                      <span className="md:hidden">{tab.labelShort}</span>
                      <span className="hidden md:inline">{tab.label}</span>
                    </>
                  ) : (
                    tab.label
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <p
            key={`desc-${activeTab}`}
            className="text-xl md:text-2xl font-bold text-foreground leading-relaxed transition-all duration-300"
          >
            {activeContent.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsTabsBase;
