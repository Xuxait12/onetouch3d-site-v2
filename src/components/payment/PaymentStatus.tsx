import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface PaymentStatusProps {
  status: 'processing' | 'approved' | 'rejected' | 'pending';
  paymentMethod?: string;
  message?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  paymentMethod,
  message,
}) => {
  const statusConfig = {
    processing: {
      icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
      title: 'Processando pagamento...',
      description: message || 'Aguarde enquanto confirmamos seu pagamento.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    approved: {
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      title: 'Pagamento aprovado!',
      description: message || 'Seu pedido foi confirmado com sucesso.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    rejected: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Pagamento rejeitado',
      description: message || 'Não foi possível processar seu pagamento. Tente novamente.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-yellow-500" />,
      title: 'Aguardando pagamento',
      description: message || (
        paymentMethod === 'pix'
          ? 'Escaneie o QR code ou copie o código PIX para concluir o pagamento.'
          : 'Seu pagamento está em análise.'
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 ${config.borderColor} ${config.bgColor}`}>
      <div className="mb-4 animate-in fade-in zoom-in duration-300">
        {config.icon}
      </div>
      <h3 className={`text-2xl font-semibold mb-3 ${config.color} text-center`}>
        {config.title}
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {config.description}
      </p>

      {status === 'processing' && (
        <div className="mt-6 flex flex-col items-center">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Isso pode levar alguns segundos...</p>
        </div>
      )}
    </div>
  );
};
