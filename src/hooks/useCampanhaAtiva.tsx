import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Campanha {
  id: string;
  nome_prova: string;
  foto_background: string;
  imagem_quadro_1: string;
  imagem_quadro_2: string | null;
  frase_personalizada: string;
  frase_secundaria: string;
  mensagem_whatsapp: string | null;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
}

export function useCampanhaAtiva(pagina: string) {
  const { data: campanha, isLoading } = useQuery({
    queryKey: ["campanha-ativa", pagina],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await (supabase as any)
        .from("campanhas")
        .select("*")
        .eq("pagina", pagina)
        .eq("ativo", true)
        .lte("data_inicio", nowIso)
        .gte("data_fim", nowIso)
        .order("data_inicio", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("[useCampanhaAtiva] erro:", error);
        return null;
      }
      return (data as Campanha) ?? null;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { campanha: campanha ?? null, isLoading };
}
