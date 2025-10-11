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
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
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
          className={`${imageOnLeft ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}
        >
          <div className="w-full aspect-[592/394] overflow-hidden rounded-2xl shadow-soft">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;