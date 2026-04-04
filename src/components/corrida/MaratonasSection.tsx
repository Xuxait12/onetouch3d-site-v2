const maratonas = [
  { image: "/logos-maratonas/berlin-marathon.png", name: "Berlin Marathon" },
  { image: "/logos-maratonas/boston-marathon.png", name: "Boston Marathon" },
  { image: "/logos-maratonas/chicago-marathon.png", name: "Chicago Marathon" },
  { image: "/logos-maratonas/maratona-floripa.png", name: "Maratona de Floripa" },
  { image: "/logos-maratonas/la-mision.png", name: "La Mision Serra Fina" },
  { image: "/logos-maratonas/new-york-marathon.png", name: "New York City Marathon" },
  { image: "/logos-maratonas/paraty-brazil.png", name: "Paraty Brazil by UTMB" },
  { image: "/logos-maratonas/maratona-porto-alegre.png", name: "Maratona de Porto Alegre" },
  { image: "/logos-maratonas/maratona-rio.png", name: "Maratona do Rio 42k" },
  { image: "/logos-maratonas/sp-city-marathon.png", name: "SP City Marathon" },
];

const MaratonasSection = () => {
  const duplicated = [...maratonas, ...maratonas];

  return (
    <section className="py-16 md:py-24">
      {/* Title block */}
      <div className="container mx-auto px-4 text-center mb-12">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Provas que já eternizamos
        </p>
        <h2 className="section-text mb-4">Sua corrida, seu quadro</h2>
        <p className="body-large text-muted-foreground max-w-3xl mx-auto">
          Personalizamos quadros para as maiores maratonas e corridas de rua do Brasil e do mundo. Se você correu, a gente eterniza.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden bg-muted/40 py-8 mb-12 group">
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-scroll 30s linear infinite;
          }
          .marquee-track:hover,
          .group:hover .marquee-track {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-track">
          {duplicated.map((m, i) => (
            <div key={i} className="flex flex-col items-center justify-center mx-8 md:mx-12 min-w-[120px]">
              <img
                src={m.image}
                alt={m.name}
                className="h-14 md:h-16 w-auto object-contain mb-2"
                loading="lazy"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 2×5 / 5×2 */}
      <div className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {maratonas.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border border-border/50 bg-card hover:shadow-md hover:border-border transition-all duration-300"
            >
              <img
                src={m.image}
                alt={m.name}
                className="h-12 md:h-14 w-auto object-contain mb-3"
                loading="lazy"
              />
              <span className="text-xs md:text-sm text-muted-foreground text-center leading-tight">
                {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota final */}
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center border-2 border-dashed border-border/60 rounded-xl p-6 md:p-8">
          <p className="font-semibold text-foreground mb-1">Correu em outra prova?</p>
          <p className="text-sm text-muted-foreground">
            Personalizamos quadros para qualquer maratona, meia-maratona ou corrida de rua — basta nos enviar os dados da sua prova.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MaratonasSection;
