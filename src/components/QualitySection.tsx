import heroRunner from "@/assets/hero-runner.jpg";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const QualitySection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div className="text-center">
          <h2 className="section-text mb-6">
            Qualidade que impressiona
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto">
            Cada quadro é produzido com materiais premium e atenção aos mínimos detalhes para garantir durabilidade e beleza.
          </p>
        </div>
      }
    >
      <img 
        src={heroRunner} 
        alt="Corredor em ação durante competição" 
        className="w-full h-full object-cover rounded-2xl"
      />
    </ContainerScroll>
  );
};

export default QualitySection;