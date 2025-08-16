import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroRunnerWide from "@/assets/hero-runner-wide.jpg";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const orderData = {
        user_id: user.id,
        product_name: "Quadro Personalizado de Corrida",
        product_description: "Quadro personalizado que conta a história da sua conquista, quilômetro por quilômetro.",
        total_amount: 149.90,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar o pedido. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Pedido criado!",
          description: "Seu pedido foi criado com sucesso.",
        });
        navigate(`/meus-pedidos/${data.id}`);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative w-full h-[100vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroRunnerWide})` }}
      >
        {/* Overlay para melhorar legibilidade */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center text-white max-w-4xl animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-primary">Transforme</span> Sua Corrida em Uma Lembrança Eterna
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Quadros personalizados que contam a história da sua conquista, quilômetro por quilômetro.
          </p>
          <Button 
            variant="hero" 
            size="xl" 
            className="animate-fade-up bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4" 
            style={{ animationDelay: "0.2s" }}
            onClick={handleCreateOrder}
          >
            Criar Meu Quadro Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;