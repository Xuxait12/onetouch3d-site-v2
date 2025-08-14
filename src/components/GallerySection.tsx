import gallery5k from "@/assets/gallery-5k.jpg";
import galleryHalfMarathon from "@/assets/gallery-half-marathon.jpg";
import galleryMarathon from "@/assets/gallery-marathon.jpg";

const galleryItems = [
  {
    image: gallery5k,
    title: "5K",
    description: "Sua primeira conquista merece destaque"
  },
  {
    image: galleryHalfMarathon,
    title: "Meia Maratona",
    description: "21K de determinação e superação"
  },
  {
    image: galleryMarathon,
    title: "Maratona",
    description: "42K de história para eternizar"
  }
];

const GallerySection = () => {
  return (
    <section className="section-spacing max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 animate-fade-up">
        <h2 className="section-text mb-4">Galeria de Inspiração</h2>
        <p className="body-large text-muted-foreground">
          Veja como outras conquistas ganharam vida
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {galleryItems.map((item, index) => (
          <div 
            key={item.title}
            className="group animate-fade-up hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-elegant transition-shadow duration-300">
              <img 
                src={item.image}
                alt={`Quadro personalizado para ${item.title}`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;