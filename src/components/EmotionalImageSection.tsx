interface EmotionalImageSectionProps {
  imageSrc: string;
  imageAlt: string;
  emotionalText: string;
  mobileImageSrc?: string;
}

const EmotionalImageSection = ({
  imageSrc,
  imageAlt,
  emotionalText,
  mobileImageSrc,
}: EmotionalImageSectionProps) => {
  return (
    <section className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9]">
      {/* Mobile Image (if provided) */}
      {mobileImageSrc && (
        <img
          src={mobileImageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      
      {/* Main Image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover object-center ${
          mobileImageSrc ? 'hidden sm:block' : ''
        }`}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Emotional Text */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:pb-12 lg:pb-16">
        <p className="text-white text-center text-xl sm:text-2xl lg:text-4xl font-medium leading-tight drop-shadow-lg max-w-4xl mx-auto">
          {emotionalText}
        </p>
      </div>
    </section>
  );
};

export default EmotionalImageSection;
