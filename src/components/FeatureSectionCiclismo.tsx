import { ReactNode } from "react";

interface FeatureSectionCiclismoProps {
  title: string;
  description: ReactNode;
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt: string;
  imageOnLeft?: boolean;
  objectFit?: "cover" | "contain";
}

const FeatureSectionCiclismo = ({
  title,
  description,
  imageSrc,
  mobileImageSrc,
  imageAlt,
  imageOnLeft = true,
  objectFit = "cover",
}: FeatureSectionCiclismoProps) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col ${
            imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
          } items-center gap-8 lg:gap-16`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <picture>
              {mobileImageSrc && (
                <source media="(max-width: 768px)" srcSet={mobileImageSrc} />
              )}
              <img
                src={imageSrc}
                alt={imageAlt}
                className={`w-full h-auto rounded-2xl shadow-lg ${
                  objectFit === "contain" ? "object-contain" : "object-cover"
                }`}
                loading="lazy"
              />
            </picture>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              {title}
            </h2>
            <div className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSectionCiclismo;
