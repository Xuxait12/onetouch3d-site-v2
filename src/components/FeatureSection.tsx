interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageOnLeft?: boolean;
  imageAnimation?: string;
  textAnimation?: string;
}

const FeatureSection = ({ 
  title, 
  description, 
  imageSrc, 
  imageAlt, 
  imageOnLeft = false,
}: FeatureSectionProps) => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-[40fr_60fr] lg:grid-cols-[45fr_55fr] gap-8 md:gap-12 items-center">
        {/* Text Content - Title and Description together */}
        <div 
          className={`${imageOnLeft ? 'order-2 md:order-2' : 'order-2 md:order-1'} text-center md:text-left flex flex-col justify-center space-y-6`}
        >
          <h2 className="section-text">
            {title}
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto md:mx-0">
            {description}
          </p>
        </div>

        {/* Image */}
        <div 
          className={`${imageOnLeft ? 'order-1 md:order-1' : 'order-1 md:order-2'} flex items-center`}
        >
          <div className="w-full aspect-[592/394] overflow-hidden rounded-2xl shadow-soft">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-auto max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;