const ProblemSection = () => {
  return (
    <section className="section-spacing max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 animate-fade-up">
          <img 
            src="/lovable-uploads/1cbe1cfd-188e-490d-9190-2e7fd5e160cd.png" 
            alt="Quadro personalizado com moldura premium" 
            className="w-full h-auto rounded-2xl shadow-soft"
          />
        </div>
        
        <div className="order-1 lg:order-2 text-center lg:text-left animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-text mb-6">
            Moldura premium
          </h2>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;