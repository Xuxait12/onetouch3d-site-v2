interface EmotionalImageSectionProps {
  imageSrc: string;
  imageAlt: string;
  line1?: string;
  line2?: string;
  mobileImageSrc?: string;
  textAlign?: 'left' | 'right';
  mobileObjectPosition?: string;
}

const EmotionalImageSection = ({
  imageSrc,
  imageAlt,
  line1 = "Não é apenas um quadro.",
  line2 = "É a prova de que você foi até o limite.",
  mobileImageSrc,
  textAlign = 'left',
  mobileObjectPosition,
}: EmotionalImageSectionProps) => {
  const isRight = textAlign === 'right';
  return (
    <section className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[640px] xl:h-[720px] overflow-hidden">
      {/* Mobile Image (if provided) */}
      {mobileImageSrc && (
        <img
          src={mobileImageSrc}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-top"
        />
      )}
      
      {/* Main Image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        width={1600}
        height={900}
        className={`absolute inset-0 w-full h-full object-cover ${mobileObjectPosition || 'object-top'} sm:object-top ${
          mobileImageSrc ? 'hidden sm:block' : ''
        }`}
      />
      
      {/* Gradient Overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Text Overlay - positioned at bottom left or right */}
      <div className={`absolute inset-0 flex items-end ${isRight ? 'justify-end' : 'justify-start'}`}>
        <div className={`px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-8 sm:pb-10 md:pb-12 lg:pb-14 xl:pb-16 max-w-4xl ${isRight ? 'text-right' : 'text-left'}`}>
          {/* Line 1 - Regular */}
          <p 
            className={`text-white/85 font-normal leading-tight mb-1 sm:mb-2 ${isRight ? 'text-right' : 'text-left'}`}
            style={{ 
              fontFamily: "'Linik Sans', sans-serif",
              fontSize: 'clamp(1.125rem, 2.5vw + 0.5rem, 2rem)'
            }}
          >
            {line1}
          </p>
          
          {/* Line 2 - Bold */}
          <p 
            className={`text-white font-bold leading-tight ${isRight ? 'text-right' : 'text-left'}`}
            style={{ 
              fontFamily: "'Linik Sans', sans-serif",
              fontSize: 'clamp(1.375rem, 3vw + 0.5rem, 2.5rem)'
            }}
          >
            {line2}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmotionalImageSection;
