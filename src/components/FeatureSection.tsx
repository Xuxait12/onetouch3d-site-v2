import { ReactNode } from "react";
interface FeatureSectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageOnLeft?: boolean;
  imageAnimation?: string;
  textAnimation?: string;
  mobileImageSrc?: string;
  objectFit?: 'cover' | 'contain';
}
const FeatureSection = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imageOnLeft = false,
  mobileImageSrc,
  objectFit = 'cover'
}: FeatureSectionProps) => {
  return <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content - Title and Description together */}
        <div className={`${imageOnLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'} text-center lg:text-left flex flex-col justify-center`}>
          <h2 className="section-text mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold">
            {title}
          </h2>
          <div className="body-large text-muted-foreground max-w-xl mx-auto lg:mx-0 text-base sm:text-lg">
            {description}
          </div>
        </div>

        {/* Image */}
        <div className={`${imageOnLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}>
          <div className={`w-full aspect-[4/3] sm:aspect-[592/394] overflow-hidden rounded-xl sm:rounded-2xl shadow-soft ${objectFit === 'contain' ? 'bg-black' : ''}`}>
            {mobileImageSrc ? (
              <>
                <img src={mobileImageSrc} alt={imageAlt} loading="lazy" className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} sm:hidden`} />
                <img src={imageSrc} alt={imageAlt} loading="lazy" className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} hidden sm:block`} />
              </>
            ) : (
              <img src={imageSrc} alt={imageAlt} className={`w-full h-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            )}
          </div>
        </div>
      </div>
    </section>;
};
export default FeatureSection;