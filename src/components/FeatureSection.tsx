interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageOnLeft?: boolean;
}

const FeatureSection = ({ title, description, imageSrc, imageAlt, imageOnLeft = false }: FeatureSectionProps) => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className={`${imageOnLeft ? 'order-1 lg:order-1' : 'order-2 lg:order-2'} animate-fade-up`}>
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className="w-full h-auto rounded-2xl shadow-soft"
          />
        </div>
        
        <div className={`${imageOnLeft ? 'order-2 lg:order-2' : 'order-1 lg:order-1'} text-center lg:text-left animate-fade-up`} style={{ animationDelay: "0.2s" }}>
          <h2 className="section-text mb-6">
            {title}
          </h2>
          <p className="body-large text-muted-foreground max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;