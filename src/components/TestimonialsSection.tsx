const testimonials = [
  {
    name: "Ana Silva",
    race: "Maratona de São Paulo 2023",
    text: "Meu quadro ficou lindo! Agora toda visita vê minha conquista.",
    avatar: "AS"
  },
  {
    name: "Carlos Mendes",
    race: "Meia Maratona do Rio 2023",
    text: "Qualidade excepcional. Superou minhas expectativas!",
    avatar: "CM"
  },
  {
    name: "Marina Costa",
    race: "5K Corrida Feminina 2023",
    text: "Perfeito para eternizar minha primeira corrida. Recomendo!",
    avatar: "MC"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="section-spacing bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="section-text mb-4">O que nossos clientes dizem</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up hover:shadow-elegant transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.race}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;