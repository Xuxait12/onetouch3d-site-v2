import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const Triathlon = () => {
  return (
    <div className="min-h-screen" style={{ background: 'transparent !important' }}>
      <GlobalHeader />
      
      <main className="flex-1">
        <section className="relative min-h-[80vh] flex items-center justify-center" style={{ background: 'transparent !important' }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Triathlon
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Produtos exclusivos para triatletas
            </p>
            <div className="bg-card p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
              <h2 className="text-2xl font-semibold mb-4">Em Breve</h2>
              <p className="text-muted-foreground">
                Estamos criando produtos únicos para celebrar suas conquistas no triathlon. 
                Natação, ciclismo e corrida em uma lembrança especial!
              </p>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Triathlon;