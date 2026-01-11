import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface OrderStatus {
  status: string;
  payment_status: string | null;
  payment_approved_at: string | null;
  payment_method_type: string | null;
  loading: boolean;
  error: string | null;
}

export const useOrderStatus = (pedidoId: string | null): OrderStatus => {
  const [status, setStatus] = useState<string>('aguardando_pagamento');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentApprovedAt, setPaymentApprovedAt] = useState<string | null>(null);
  const [paymentMethodType, setPaymentMethodType] = useState<string | null>(null);
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
          .select('status, payment_status, payment_approved_at, payment_method_type')
          .eq('id', pedidoId)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          setLoading(false);
          return;
        }

        if (data) {
          setStatus(data.status);
          setPaymentStatus(data.payment_status);
          setPaymentApprovedAt(data.payment_approved_at);
          setPaymentMethodType(data.payment_method_type);
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
                setStatus(newData.status || status);
                setPaymentStatus(newData.payment_status || null);
                setPaymentApprovedAt(newData.payment_approved_at || null);
                setPaymentMethodType(newData.payment_method_type || null);
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
    status,
    payment_status: paymentStatus,
    payment_approved_at: paymentApprovedAt,
    payment_method_type: paymentMethodType,
    loading,
    error,
  };
};
