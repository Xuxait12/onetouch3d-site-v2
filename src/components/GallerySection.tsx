import { Component as ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { InfiniteTextMarquee } from "@/components/ui/infinite-text-marquee";

const GallerySection = () => {
  return (
    <section className="section-spacing">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">
          Veja como outras conquistas ganharam vida
        </p>
      </div>
      
      <ImageAutoSlider />
      
      {/* Interactive marquee text */}
      <div className="mt-3 animate-fade-up overflow-hidden">
        <InfiniteTextMarquee
          text="Duplo clique amplia"
          link="/"
          speed={20}
          tooltipText="Clique para ampliar! 🔍"
          fontSize="2rem"
          showTooltip={true}
        />
      </div>
    </section>
  );
};

export default GallerySection;