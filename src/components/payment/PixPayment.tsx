import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
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

  // O valor 'amount' já vem com o desconto PIX aplicado do Checkout
  // Apenas garantir que tenha 2 casas decimais
  const finalAmount = Math.round(amount * 100) / 100;

  useEffect(() => {
    createPixPayment();
  }, []);

  const createPixPayment = async () => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session antes do pagamento:', session);

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
            payment_method_id: 'pix',
            amount: finalAmount,
            payer: {
              email: payer.email,
              first_name: payer.first_name || 'Cliente',
              last_name: payer.last_name || '',
              identification: payer.identification,
            },
          }),
        }
      );

      console.log('create-payment response status:', response.status);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error('Erro da Edge Function (status ' + response.status + '):', JSON.stringify(errorBody, null, 2));
        throw new Error(errorBody?.error || errorBody?.message || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('create-payment data:', data);

      if (!data || !data.success) {
        const errorMsg = data?.message || data?.error || 'Erro ao criar pagamento PIX';
        console.error('create-payment unsuccessful:', data);
        throw new Error(errorMsg);
      }

      setPixData({
        payment_id: data.payment_id,
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64,
        ticket_url: data.ticket_url,
      });

      startPolling(data.payment_id);

      toast({
        title: 'QR Code PIX gerado!',
        description: 'Escaneie o QR Code ou copie o código para pagar.',
      });
    } catch (err: any) {
      console.error('PIX payment error:', err, err?.stack);

      // Fallback: a Edge Function pode ter demorado mais de 30s (cold start + API do MP)
      // e o browser fecha a conexão antes de receber a resposta.
      // Verifica se o PIX já foi gerado no banco antes de exibir erro.
      try {
        await new Promise(r => setTimeout(r, 3000));

        const { data: pedidoAtualizado } = await supabase
          .from('pedidos')
          .select('pix_qr_code, pix_qr_code_text, payment_id, payment_status')
          .eq('id', pedidoId)
          .single();

        if (pedidoAtualizado?.pix_qr_code_text) {
          setPixData({
            payment_id: pedidoAtualizado.payment_id || '',
            qr_code: pedidoAtualizado.pix_qr_code_text,
            qr_code_base64: pedidoAtualizado.pix_qr_code || '',
            ticket_url: '' || '',
          });

          if (pedidoAtualizado.payment_id) {
            startPolling(pedidoAtualizado.payment_id);
          }

          toast({
            title: 'QR Code PIX gerado!',
            description: 'Escaneie o QR Code ou copie o código para pagar.',
          });
          return;
        }
      } catch {
        // fallback falhou — segue para o erro original
      }

      onError(err);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar PIX',
        description: err.message || 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (paymentId: string) => {
    let attempts = 0;
    const maxAttempts = 120;

    const interval = setInterval(async () => {
      attempts++;
      setChecking(true);

      try {
        const { data, error } = await supabase.functions.invoke('get-payment-status', {
          body: { payment_id: paymentId },
        });

        if (error) {
          setChecking(false);
          return;
        }

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
      } catch {
        setChecking(false);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setChecking(false);
        toast({
          variant: 'destructive',
          title: 'Tempo esgotado',
          description: 'O tempo para pagamento expirou. Tente novamente.',
        });
        onError(new Error('Tempo para pagamento expirou'));
      }
    }, 5000);

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
    } catch {
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
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Pague com PIX</h3>
        <p className="text-green-600 font-semibold text-xl">
          Total a pagar: R$ {finalAmount.toFixed(2)}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200">
          <QRCode value={pixData.qr_code} size={256} level="H" />
        </div>
      </div>

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

      <Button
        onClick={() => window.open(pixData.ticket_url, '_blank')}
        className="w-full"
        variant="default"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Abrir no app do banco
      </Button>

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
