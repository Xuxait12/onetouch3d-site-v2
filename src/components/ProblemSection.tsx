import medalDrawer from "@/assets/medal-drawer.jpg";

const ProblemSection = () => {
  return (
    <section className="section-spacing max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 animate-fade-up">
          <img 
            src={medalDrawer} 
            alt="Medalha de corrida guardada em gaveta" 
            className="w-full h-auto rounded-2xl shadow-soft"
            loading="lazy"
          />
        </div>
        
        <div className="order-1 lg:order-2 text-center md:text-center lg:text-left animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-text mb-6">
            Sua medalha merece mais do que uma gaveta
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto md:mx-auto lg:mx-0">
            Meses de treino, suor e superação não podem ficar esquecidos. Sua corrida merece um lugar especial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;