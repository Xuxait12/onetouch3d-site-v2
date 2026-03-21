import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from './PaymentStatus';
import { InstallmentsDisplay } from './InstallmentsDisplay';
import { config } from '@/config';

interface PaymentBrickProps {
  pedidoId: string;
  amount: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export const PaymentBrick: React.FC<PaymentBrickProps> = ({
  pedidoId,
  amount,
  payer,
  onSuccess,
  onError,
}) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected'>('idle');
  const { toast } = useToast();

  // Create refs for callbacks to ensure stable function references
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const initialization = useMemo(() => ({
    amount: amount,
    payer: {
      email: payer.email,
      firstName: payer.first_name || 'Cliente',
      lastName: payer.last_name || '',
      identification: {
        type: payer.identification?.type || 'CPF',
        number: payer.identification?.number || '',
      },
      entityType: 'individual' as const,
    },
  }), [amount, payer.email, payer.first_name, payer.last_name, payer.identification?.type, payer.identification?.number]);

  const customization = useMemo(() => ({
    visual: {
      style: {
        theme: 'default' as const,
      },
    },
  }), []);

  const onSubmit = useCallback(async (formData: any) => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const response = await fetch(
        'https://azaqhsxlsqrvltcsmgve.supabase.co/functions/v1/create-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YXFoc3hsc3Fydmx0Y3NtZ3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjcwODgsImV4cCI6MjA4ODYwMzA4OH0.KmiAg0gisYq6nVnJgFMNqv1SHcsOQf04OaOY_HQJR4w',
          },
          body: JSON.stringify({
            pedido_id: pedidoId,
            payment_method_id: formData.payment_method_id,
            token: formData.token,
            installments: formData.installments || 1,
            amount: amount,
            payer: {
              email: formData.payer?.email || payer.email,
              identification: formData.payer?.identification || payer.identification,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || errorBody?.message || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || data.error || 'Erro ao processar pagamento');
      }

      if (data.status === 'approved') {
        setPaymentStatus('approved');
        toast({
          title: 'Pagamento aprovado!',
          description: 'Seu pedido foi confirmado.',
        });
        onSuccessRef.current(data.payment_id);
      } else if (data.status === 'rejected') {
        setPaymentStatus('rejected');

        const errorMessages: Record<string, string> = {
          'cc_rejected_other_reason': 'Cartão rejeitado. Tente outro cartão.',
          'cc_rejected_bad_filled_card_number': 'Número do cartão inválido.',
          'cc_rejected_bad_filled_date': 'Data de validade inválida.',
          'cc_rejected_bad_filled_security_code': 'Código de segurança inválido.',
          'cc_rejected_insufficient_amount': 'Saldo insuficiente.',
          'cc_rejected_call_for_authorize': 'Contate a operadora do cartão.',
          'cc_rejected_blacklist': 'Cartão bloqueado.',
        };

        const errorMessage = errorMessages[data.status_detail] || 'Tente novamente com outro cartão.';

        toast({
          variant: 'destructive',
          title: 'Pagamento rejeitado',
          description: errorMessage,
          duration: 8000,
        });
        onErrorRef.current(new Error(errorMessage));
      } else if (data.status === 'in_process' || data.status === 'pending') {
        setPaymentStatus('processing');
        toast({
          title: 'Pagamento em análise',
          description: 'Aguarde a confirmação do pagamento.',
        });
      }
    } catch (err: any) {
      console.error('[PaymentBrick] catch error:', err);

      // FALLBACK igual ao PixPayment.tsx:
      // A Edge Function pode demorar mais de 30s (cold start + API do MP)
      // e o browser fecha a conexão antes de receber a resposta (ERR_CONNECTION_CLOSED).
      // Aguarda 5s e verifica no banco se o pagamento foi processado.
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        console.log('[PaymentBrick] Failed to fetch — tentando fallback no banco...');
        try {
          await new Promise(r => setTimeout(r, 5000));

          const { data: pedidoAtualizado } = await supabase
            .from('pedidos')
            .select('payment_id, payment_status, status_pagamento')
            .eq('id', pedidoId)
            .single();

          console.log('[PaymentBrick] fallback pedido:', pedidoAtualizado);

          if (pedidoAtualizado?.payment_id && pedidoAtualizado?.status_pagamento === 'approved') {
            setPaymentStatus('approved');
            toast({ title: 'Pagamento aprovado!', description: 'Seu pedido foi confirmado.' });
            onSuccessRef.current(pedidoAtualizado.payment_id);
            return;
          } else if (pedidoAtualizado?.payment_id && pedidoAtualizado?.status_pagamento === 'rejected') {
            setPaymentStatus('rejected');
            toast({ variant: 'destructive', title: 'Pagamento rejeitado', description: 'Tente novamente com outro cartão.', duration: 8000 });
            onErrorRef.current(new Error('Pagamento rejeitado'));
            return;
          }
        } catch (fallbackErr) {
          console.error('[PaymentBrick] fallback erro:', fallbackErr);
        }
      }

      setPaymentStatus('rejected');
      toast({ variant: 'destructive', title: 'Erro no pagamento', description: err.message || 'Tente novamente.' });
      onErrorRef.current(err);
    } finally {
      setProcessing(false);
    }
  }, [pedidoId, amount, toast]);

  const onErrorBrick = useCallback((error: any) => {
    toast({
      variant: 'destructive',
      title: 'Erro no formulário',
      description: error.message || 'Verifique os dados do cartão.',
    });
  }, [toast]);

  const onReady = useCallback(() => {}, []);

  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || config.mercadoPagoPublicKey;
  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">
          Erro: Chave pública do Mercado Pago não configurada
        </p>
      </div>
    );
  }

  if (paymentStatus === 'approved') {
    return (
      <div className="py-8">
        <PaymentStatus
          status="approved"
          message="Pagamento confirmado! Redirecionando..."
        />
      </div>
    );
  }

  if (paymentStatus === 'processing' && processing) {
    return (
      <div className="py-8">
        <PaymentStatus
          status="processing"
          message="Processando seu pagamento. Aguarde..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Pagamento com Cartão</h3>
        <p className="text-gray-600">
          Total: <span className="font-semibold text-xl">R$ {amount.toFixed(2)}</span>
        </p>
      </div>

      <InstallmentsDisplay amount={amount} />

      <div className="bg-white rounded-lg">
        <CardPayment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onErrorBrick}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>
            <strong>Pagamento 100% seguro.</strong> Seus dados são protegidos pelo Mercado Pago.
          </span>
        </p>
      </div>
    </div>
  );
};
