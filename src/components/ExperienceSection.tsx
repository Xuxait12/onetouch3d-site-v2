import galleryMarathon from "@/assets/gallery-marathon.jpg";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const ExperienceSection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div className="text-center">
          <h2 className="section-text mb-6">
            Reviva cada momento
          </h2>
          <p className="body-large text-muted-foreground max-w-xl mx-auto">
            Transforme suas memórias de corrida em uma obra de arte que conta sua história de superação e conquista.
          </p>
        </div>
      }
    >
      <img 
        src={galleryMarathon} 
        alt="Momento de vitória na linha de chegada" 
        className="w-full h-full object-cover rounded-2xl"
      />
    </ContainerScroll>
  );
};

export default ExperienceSection;