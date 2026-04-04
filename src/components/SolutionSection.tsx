import framedMedal from "@/assets/framed-medal.jpg";

const SolutionSection = () => {
  return (
    <section className="section-spacing max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-center lg:text-left animate-fade-up">
          <h2 className="section-text mb-6">
            Eternize sua corrida com arte
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto md:mx-auto lg:mx-0">
            Personalizamos quadros 3D que exibem sua medalha, mapa do percurso e detalhes da conquista, com a sofisticação que você merece.
          </p>
        </div>
        
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <img 
            src={framedMedal} 
            alt="Quadro 3D elegante com medalha e mapa do percurso na parede" 
            className="w-full h-auto rounded-2xl shadow-elegant"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;