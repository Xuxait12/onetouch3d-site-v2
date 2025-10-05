import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  imageAnimation = "animate-fade-up",
  textAnimation = "animate-fade-up"
}: FeatureSectionProps) => {
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();

  return (
    <section className="py-8 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Mobile: H1 first, Desktop: respect imageOnLeft */}
        <div 
          ref={textRef as any}
          className={`order-1 lg:order-${imageOnLeft ? '2' : '1'} text-center md:text-center lg:text-left ${
            textVisible ? textAnimation : 'opacity-0'
          }`}
        >
          <h2 className="section-text mb-6">
            {title}
          </h2>
        </div>

        {/* Mobile: Image second, Desktop: respect imageOnLeft */}
        <div 
          ref={imageRef as any}
          className={`order-2 lg:order-${imageOnLeft ? '1' : '2'} ${
            imageVisible ? imageAnimation : 'opacity-0'
          }`}
        >
          <div className="w-full aspect-[592/394] overflow-hidden rounded-2xl shadow-soft">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Mobile: H2/description third, Desktop: respect imageOnLeft */}
        <div 
          ref={textRef as any}
          className={`order-3 lg:order-${imageOnLeft ? '2' : '1'} text-center md:text-center lg:text-left ${
            textVisible ? textAnimation : 'opacity-0'
          }`}
        >
          <p className="body-large text-muted-foreground max-w-xl mx-auto md:mx-auto lg:mx-0">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;