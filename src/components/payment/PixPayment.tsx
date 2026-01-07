import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'react-qr-code';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, ExternalLink, Loader2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from './PaymentStatus';

interface PixPaymentProps {
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

interface PixData {
  payment_id: string;
  qr_code: string;
  qr_code_base64: string;
  ticket_url: string;
}

export const PixPayment: React.FC<PixPaymentProps> = ({
  pedidoId,
  amount,
  payer,
  onSuccess,
  onError,
}) => {
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const { toast } = useToast();

  // Calculate amount with 5% discount
  const discountedAmount = Math.round(amount * 0.95 * 100) / 100;

  useEffect(() => {
    createPixPayment();
  }, []);

  const createPixPayment = async () => {
    try {
      setLoading(true);
      console.log('Creating PIX payment with data:', {
        pedido_id: pedidoId,
        amount: discountedAmount,
        payer: {
          email: payer.email,
          first_name: payer.first_name,
          last_name: payer.last_name,
          identification: payer.identification,
        },
      });

      const response = await supabase.functions.invoke('create-payment', {
        body: {
          pedido_id: pedidoId,
          payment_method_id: 'pix',
          amount: discountedAmount,
          payer: {
            email: payer.email,
            first_name: payer.first_name || 'Cliente',
            last_name: payer.last_name || 'OneTouch3D',
            identification: payer.identification || {
              type: 'CPF',
              number: '12345678909',
            },
          },
        },
      });

      // Check for HTTP error
      if (response.error) {
        console.error('HTTP Error:', response.error);

        // Try to get error details from response data
        let errorMessage = 'Erro ao criar pagamento PIX';
        if (response.data && typeof response.data === 'object') {
          errorMessage = response.data.error || errorMessage;
          console.error('Error from Edge Function:', response.data);
        }

        throw new Error(errorMessage);
      }

      const { data } = response;

      if (!data || !data.success) {
        const errorMsg = data?.error || 'Erro ao criar pagamento PIX';
        console.error('Edge Function returned error:', errorMsg);
        console.error('Full response:', JSON.stringify(data, null, 2));
        throw new Error(errorMsg);
      }

      console.log('PIX payment created:', data);

      setPixData({
        payment_id: data.payment_id,
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64,
        ticket_url: data.ticket_url,
      });

      // Start polling for payment status
      startPolling(data.payment_id);

      toast({
        title: 'QR Code PIX gerado!',
        description: 'Escaneie o QR Code ou copie o código para pagar.',
      });
    } catch (err: any) {
      console.error('Error in createPixPayment:', err);
      onError(err);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar PIX',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (paymentId: string) => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutos (5s interval)

    const interval = setInterval(async () => {
      attempts++;
      setChecking(true);

      try {
        console.log(`Checking payment status (attempt ${attempts}/${maxAttempts})...`);

        const { data, error } = await supabase.functions.invoke('get-payment-status', {
          body: { payment_id: paymentId },
        });

        if (error) {
          console.error('Error checking payment status:', error);
          setChecking(false);
          return;
        }

        console.log('Payment status:', data.status);

        if (data.status === 'approved') {
          clearInterval(interval);
          setChecking(false);
          toast({
            title: 'Pagamento aprovado!',
            description: 'Seu pagamento PIX foi confirmado.',
          });
          onSuccess(paymentId);
        } else if (data.status === 'cancelled' || data.status === 'rejected') {
          clearInterval(interval);
          setChecking(false);
          onError(new Error('Pagamento cancelado ou rejeitado'));
        }
      } catch (err: any) {
        console.error('Error in polling:', err);
        setChecking(false);
      }

      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setChecking(false);
        toast({
          variant: 'destructive',
          title: 'Tempo esgotado',
          description: 'O tempo para pagamento expirou. Tente novamente.',
        });
        onError(new Error('Timeout: PIX payment expired'));
      }
    }, 5000); // Check every 5 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  const copyToClipboard = async () => {
    if (!pixData) return;

    try {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast({
        title: 'Código copiado!',
        description: 'Cole no seu app de pagamento.',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast({
        variant: 'destructive',
        title: 'Erro ao copiar',
        description: 'Tente selecionar e copiar manualmente.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <PaymentStatus status="processing" paymentMethod="pix" message="Gerando código PIX..." />
      </div>
    );
  }

  if (!pixData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <PaymentStatus status="rejected" paymentMethod="pix" message="Erro ao gerar PIX. Tente novamente." />
        <Button onClick={createPixPayment} className="mt-6">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Pague com PIX</h3>
        <div className="flex flex-col gap-1">
          <p className="text-gray-600">
            Valor original: <span className="line-through">R$ {amount.toFixed(2)}</span>
          </p>
          <p className="text-green-600 font-semibold text-xl">
            Total com 5% de desconto: R$ {discountedAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <QRCodeSVG value={pixData.qr_code} size={256} level="H" />
        </div>
      </div>

      {/* Copy and Paste Code */}
      <div className="space-y-2">
        <Label htmlFor="pix-code" className="text-base font-medium">
          Ou copie o código PIX:
        </Label>
        <div className="flex gap-2">
          <Input
            id="pix-code"
            value={pixData.qr_code}
            readOnly
            className="font-mono text-xs bg-gray-50"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Open in App */}
      <Button
        onClick={() => window.open(pixData.ticket_url, '_blank')}
        className="w-full"
        variant="default"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Abrir no app do banco
      </Button>

      {/* Status Indicator */}
      <div className="text-center pt-4 border-t border-gray-200">
        {checking ? (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Verificando pagamento...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Aguardando pagamento...</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          A página será atualizada automaticamente após a confirmação
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Como pagar:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar com PIX</li>
          <li>Escaneie o QR Code ou cole o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>
    </div>
  );
};
