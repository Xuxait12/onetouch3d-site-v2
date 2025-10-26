import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

const Viagem = () => {
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="flex-1">
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Viagem
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Lembranças únicas das suas viagens
            </p>
            <div className="bg-card p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
              <h2 className="text-2xl font-semibold mb-4">Em Breve</h2>
              <p className="text-muted-foreground">
                Estamos desenvolvendo produtos especiais para guardar as memórias das suas viagens. 
                Em breve você poderá criar lembranças únicas de cada destino!
              </p>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
};

export default Viagem;