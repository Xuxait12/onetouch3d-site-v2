import { useState } from 'react';
import { CardPayment } from '@mercadopago/sdk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from './PaymentStatus';

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

  // Payment Brick initialization config
  const initialization = {
    amount: amount,
    payer: {
      email: payer.email,
      firstName: payer.first_name || 'Cliente',
      lastName: payer.last_name || 'OneTouch3D',
      identification: {
        type: payer.identification?.type || 'CPF',
        number: payer.identification?.number || '',
      },
      entityType: 'individual', // individual ou association
    },
  };

  // Payment Brick customization
  const customization = {
    visual: {
      style: {
        theme: 'default', // 'default' | 'dark' | 'bootstrap' | 'flat'
      },
    },
  };

  // Handle payment submission
  const onSubmit = async (formData: any) => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      console.log('Payment form submitted:', {
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,
      });

      // Call Edge Function to create payment in Mercado Pago
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          pedido_id: pedidoId,
          payment_method_id: formData.payment_method_id,
          token: formData.token, // Tokenized card data
          installments: formData.installments || 1,
          amount: amount,
          payer: {
            email: formData.payer.email,
            identification: formData.payer.identification,
          },
        },
      });

      if (error) {
        console.error('Error creating payment:', error);
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      console.log('Payment created:', data);

      // Check payment status
      if (data.status === 'approved') {
        setPaymentStatus('approved');
        toast({
          title: 'Pagamento aprovado!',
          description: 'Seu pedido foi confirmado.',
        });
        onSuccess(data.payment_id);
      } else if (data.status === 'rejected') {
        setPaymentStatus('rejected');

        // Traduzir códigos de erro do MP
        const errorMessages: Record<string, string> = {
          'cc_rejected_other_reason': '❌ Cartão rejeitado. Para TESTES, use: Número: 5031 4332 1540 6351, CVV: 123, Titular: APRO',
          'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
          'cc_rejected_bad_filled_date': 'Data de validade inválida',
          'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
          'cc_rejected_insufficient_amount': 'Saldo insuficiente',
          'cc_rejected_call_for_authorize': 'Contate a operadora do cartão',
          'cc_rejected_blacklist': 'Cartão bloqueado',
        };

        const errorMessage = errorMessages[data.status_detail] || data.status_detail || 'Tente novamente com outro cartão.';

        toast({
          variant: 'destructive',
          title: 'Pagamento rejeitado',
          description: errorMessage,
          duration: 8000,
        });
        onError(new Error('Payment rejected: ' + data.status_detail));
      } else if (data.status === 'in_process' || data.status === 'pending') {
        setPaymentStatus('processing');
        toast({
          title: 'Pagamento em análise',
          description: 'Aguarde a confirmação do pagamento.',
        });
        // Keep processing state, webhook will update later
      }
    } catch (err: any) {
      console.error('Error in payment submission:', err);
      setPaymentStatus('rejected');
      toast({
        variant: 'destructive',
        title: 'Erro no pagamento',
        description: err.message || 'Tente novamente.',
      });
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Payment Brick errors
  const onErrorBrick = (error: any) => {
    console.error('Payment Brick error:', error);
    toast({
      variant: 'destructive',
      title: 'Erro no formulário',
      description: error.message || 'Verifique os dados do cartão.',
    });
  };

  // Handle Payment Brick ready state
  const onReady = () => {
    console.log('Payment Brick ready');
  };

  // Check if SDK is configured
  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-semibold">
          Erro: Chave pública do Mercado Pago não configurada
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Configure VITE_MERCADO_PAGO_PUBLIC_KEY no arquivo .env
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
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Pagamento com Cartão</h3>
        <p className="text-gray-600">
          Total: <span className="font-semibold text-xl">R$ {amount.toFixed(2)}</span>
        </p>
      </div>

      {/* Card Payment Brick */}
      <div className="bg-white rounded-lg">
        <CardPayment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onErrorBrick}
        />
      </div>

      {/* Security Info */}
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

      {/* Installments Info */}
      <div className="text-center text-sm text-gray-600">
        <p>Parcelamento em até <strong>12x sem juros</strong> no cartão de crédito</p>
      </div>

      {/* Test Cards Info (SANDBOX ONLY) */}
      {publicKey.startsWith('TEST-') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            🧪 Ambiente de Teste - Use estes cartões:
          </p>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>✅ APROVADO (Master):</strong> 5031 4332 1540 6351 | CVV: 123 | Titular: APRO</p>
            <p><strong>✅ APROVADO (Visa):</strong> 4235 6477 2802 5682 | CVV: 123 | Titular: APRO</p>
            <p><strong>❌ REJEITADO:</strong> 4509 9535 6623 3704 | CVV: 123 | Titular: OTHE</p>
            <p className="text-xs mt-1">Validade: Qualquer data futura (ex: 11/25)</p>
          </div>
        </div>
      )}
    </div>
  );
};
