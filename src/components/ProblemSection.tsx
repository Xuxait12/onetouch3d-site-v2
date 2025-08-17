import medalDrawer from "@/assets/medal-drawer.jpg";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const ProblemSection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div className="text-center">
          <h2 className="section-text mb-6">
            Sua medalha merece mais do que uma gaveta
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto">
            Meses de treino, suor e superação não podem ficar esquecidos. Sua corrida merece um lugar especial.
          </p>
        </div>
      }
    >
      <img 
        src={medalDrawer} 
        alt="Medalha de corrida guardada em gaveta" 
        className="w-full h-full object-cover rounded-2xl"
      />
    </ContainerScroll>
  );
};

export default ProblemSection;