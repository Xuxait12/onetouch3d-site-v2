const LifestyleHeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(/lovable-uploads/ae4adce5-f1e3-44f9-9c1b-624586d89aab.png)`
        }}
      >
      </div>
    </section>
  );
};

export default LifestyleHeroSection;