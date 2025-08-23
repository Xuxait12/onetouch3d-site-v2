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
        <div className={`order-1 ${imageOnLeft ? 'lg:order-1' : 'lg:order-2'} animate-fade-up`}>
          <div className="w-full aspect-[592/394] overflow-hidden rounded-2xl shadow-soft">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className={`order-2 ${imageOnLeft ? 'lg:order-2' : 'lg:order-1'} text-center md:text-center lg:text-left animate-fade-up`} style={{ animationDelay: "0.2s" }}>
          <h2 className="section-text mb-6">
            {title}
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto md:mx-auto lg:mx-0">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;