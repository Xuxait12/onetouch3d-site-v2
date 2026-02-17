import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { PayerCost, InstallmentsOption } from '@/types/mercadopago';

interface InstallmentsPreviewProps {
  amount: number;
}

export const InstallmentsPreview: React.FC<InstallmentsPreviewProps> = ({ amount }) => {
  const [installments, setInstallments] = useState<PayerCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchInstallments = async () => {
      const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

      if (!publicKey || amount <= 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const paymentMethods = ['visa', 'master'];
        const promises = paymentMethods.map(async (method) => {
          const url = `https://api.mercadopago.com/v1/payment_methods/installments?public_key=${publicKey}&amount=${amount}&payment_method_id=${method}`;

          try {
            const response = await fetch(url);
            if (!response.ok) return null;
            const data: InstallmentsOption[] = await response.json();
            return data;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((r): r is InstallmentsOption[] => r !== null);

        if (validResults.length === 0) {
          setLoading(false);
          return;
        }

        const installmentsMap = new Map<number, PayerCost>();

        validResults.forEach((result) => {
          result.forEach((option) => {
            option.payer_costs.forEach((cost) => {
              if (!installmentsMap.has(cost.installments)) {
                installmentsMap.set(cost.installments, cost);
              }
            });
          });
        });

        const allPayerCosts = Array.from(installmentsMap.values());
        allPayerCosts.sort((a, b) => a.installments - b.installments);
        setInstallments(allPayerCosts);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchInstallments();
  }, [amount]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
        <CreditCard className="w-4 h-4" />
        <span>Carregando parcelas...</span>
      </div>
    );
  }

  if (installments.length === 0) {
    return (
      <div className="text-xs sm:text-sm text-muted-foreground">
        5% de desconto no PIX ou parcele em ate 12 vezes
      </div>
    );
  }

  const withoutInterest = installments.filter((i) => i.installment_rate === 0);
  const withInterest = installments.filter((i) => i.installment_rate > 0);
  const maxWithoutInterest = withoutInterest.length > 0 ? withoutInterest[withoutInterest.length - 1] : null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-2">
      <div className="text-xs sm:text-sm text-muted-foreground">
        5% de desconto no PIX ou parcele em ate 12x no cartao
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {maxWithoutInterest
              ? `Ate ${maxWithoutInterest.installments}x de R$ ${formatCurrency(maxWithoutInterest.installment_amount)} sem juros`
              : `Ate 12x no cartao`}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </button>

      {expanded && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="max-h-64 overflow-y-auto">
            {withoutInterest.length > 0 && (
              <div className="divide-y divide-gray-100">
                {withoutInterest.map((inst) => (
                  <div
                    key={inst.installments}
                    className="flex items-center justify-between px-3 py-2 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                        {inst.installments}x
                      </span>
                      <span className="text-sm text-gray-800">
                        R$ {formatCurrency(inst.installment_amount)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-green-600">sem juros</span>
                  </div>
                ))}
              </div>
            )}

            {withInterest.length > 0 && (
              <>
                <div className="px-3 py-1.5 bg-gray-100 text-xs text-gray-500 font-medium">
                  Com juros
                </div>
                <div className="divide-y divide-gray-100">
                  {withInterest.map((inst) => {
                    const juros = inst.total_amount - amount;
                    return (
                      <div
                        key={inst.installments}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {inst.installments}x
                          </span>
                          <span className="text-sm text-gray-800">
                            R$ {formatCurrency(inst.installment_amount)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">
                            +R$ {formatCurrency(juros)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Valores conforme taxas do Mercado Pago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
