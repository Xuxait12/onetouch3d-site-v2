import { ReactNode } from "react";
interface FeatureSectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
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
  imageOnLeft = false
}: FeatureSectionProps) => {
  return <section className="py-8 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content - Title and Description together */}
        <div className={`${imageOnLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'} text-center lg:text-left flex flex-col justify-center`}>
          <h2 className="section-text mb-6 text-4xl font-bold">
            {title}
          </h2>
          <div className="body-large text-muted-foreground max-w-xl mx-auto lg:mx-0">
            {description}
          </div>
        </div>

        {/* Image */}
        <div className={`${imageOnLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}>
          <div className="w-full aspect-[592/394] overflow-hidden rounded-2xl shadow-soft">
            <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>;
};
export default FeatureSection;