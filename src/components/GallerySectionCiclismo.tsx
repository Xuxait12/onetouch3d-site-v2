// TODO: Atualizar imagens da galeria com fotos específicas de ciclismo
import GalleryCarouselCiclismo from "@/components/GalleryCarouselCiclismo";
const GallerySectionCiclismo = () => {
  return <section className="py-8 md:py-12">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto px-6">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground text-center">Veja como outros ciclistas transformaram suas conquistas em quadros únicos.

Inspire-se e personalize o seu também!<br />
          Suas conquistas em quadros únicos.<br /><br />
          Inspire-se e personalize o seu também!
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 italic mt-2">clique sobre a imagem para ampliar</p>
      </div>
      
      <GalleryCarouselCiclismo />
    </section>;
};
export default GallerySectionCiclismo;