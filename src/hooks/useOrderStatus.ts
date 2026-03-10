import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface OrderStatus {
  status_pagamento: string;
  status_producao: string;
  metodo_pagamento: string | null;
  loading: boolean;
  error: string | null;
}

export const useOrderStatus = (pedidoId: string | null): OrderStatus => {
  const [statusPagamento, setStatusPagamento] = useState<string>('pendente');
  const [statusProducao, setStatusProducao] = useState<string>('aguardando');
  const [metodoPagamento, setMetodoPagamento] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pedidoId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel | null = null;

    const setupSubscription = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('pedidos')
          .select('status_pagamento, status_producao, metodo_pagamento')
          .eq('id', pedidoId)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (data) {
          setStatusPagamento(data.status_pagamento);
          setStatusProducao(data.status_producao);
          setMetodoPagamento(data.metodo_pagamento);
        }

        setLoading(false);

        channel = supabase
          .channel(`order-${pedidoId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'pedidos',
              filter: `id=eq.${pedidoId}`,
            },
            (payload) => {
              if (payload.new) {
                const newData = payload.new as any;
                setStatusPagamento(newData.status_pagamento || statusPagamento);
                setStatusProducao(newData.status_producao || statusProducao);
                setMetodoPagamento(newData.metodo_pagamento || null);
              }
            }
          )
          .subscribe();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [pedidoId]);

  return {
    status_pagamento: statusPagamento,
    status_producao: statusProducao,
    metodo_pagamento: metodoPagamento,
    loading,
    error,
  };
};
