import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PayerCost, InstallmentsOption } from '@/types/mercadopago';

interface InstallmentsDisplayProps {
  amount: number;
}

export const InstallmentsDisplay: React.FC<InstallmentsDisplayProps> = ({ amount }) => {
  const [installments, setInstallments] = useState<PayerCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstallments = async () => {
      const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

      if (!publicKey) {
        setError('Configuração do Mercado Pago não encontrada');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const paymentMethods = ['visa', 'master', 'elo'];
        const promises = paymentMethods.map(async (method) => {
          const url = `https://api.mercadopago.com/v1/payment_methods/installments?public_key=${publicKey}&amount=${amount}&payment_method_id=${method}`;

          try {
            const response = await fetch(url);
            if (!response.ok) {
              return null;
            }
            const data: InstallmentsOption[] = await response.json();
            return data;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validResults = results.filter((r): r is InstallmentsOption[] => r !== null);

        if (validResults.length === 0) {
          setError('Não foi possível carregar as opções de parcelamento');
          setLoading(false);
          return;
        }

        const allPayerCosts: PayerCost[] = [];
        const installmentsMap = new Map<number, PayerCost>();

        validResults.forEach((result) => {
          result.forEach((option) => {
            option.payer_costs.forEach((cost) => {
              if (!installmentsMap.has(cost.installments)) {
                installmentsMap.set(cost.installments, cost);
                allPayerCosts.push(cost);
              }
            });
          });
        });

        allPayerCosts.sort((a, b) => a.installments - b.installments);
        setInstallments(allPayerCosts);
      } catch (err) {
        setError('Erro ao carregar opções de parcelamento');
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      fetchInstallments();
    }
  }, [amount]);

  if (loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-gray-600">Carregando opções de parcelamento...</span>
        </div>
      </div>
    );
  }

  if (error || installments.length === 0) {
    return null;
  }

  const installmentsWithoutInterest = installments.filter(
    (inst) => inst.installment_rate === 0
  );
  const installmentsWithInterest = installments.filter(
    (inst) => inst.installment_rate > 0
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Escolha suas parcelas
        </h3>
        <div className="text-sm text-gray-600">
          Valor total: <span className="font-bold text-gray-800">R$ {amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {installmentsWithoutInterest.length > 0 && (
          <div className="space-y-2">
            {installmentsWithoutInterest.map((inst) => {
              const isOneInstallment = inst.installments === 1;
              return (
                <div
                  key={inst.installments}
                  className="bg-white border-2 border-green-300 rounded-lg p-4 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-base font-bold min-w-[60px] text-center">
                        {inst.installments}x
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800">
                          {isOneInstallment ? 'À vista' : `${inst.installments}x de`} R$ {inst.installment_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: R$ {inst.total_amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                        Sem Juros
                      </div>
                      <div className="text-xs text-green-700 font-semibold">
                        Economia garantida
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {installmentsWithInterest.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-xs text-gray-500 font-medium uppercase">Parcelas com juros</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>
            {installmentsWithInterest.map((inst) => {
              const interestAmount = inst.total_amount - amount;
              return (
                <div
                  key={inst.installments}
                  className="bg-white border-2 border-orange-200 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-base font-bold min-w-[60px] text-center">
                        {inst.installments}x
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800">
                          {inst.installments}x de R$ {inst.installment_amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: R$ {inst.total_amount.toFixed(2)}
                          <span className="text-orange-600 font-semibold ml-1">
                            (+R$ {interestAmount.toFixed(2)} juros)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                        {inst.installment_rate.toFixed(2)}% a.m.
                      </div>
                      <div className="text-xs text-orange-700 font-semibold">
                        Taxa aplicada
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          As parcelas são confirmadas conforme as configurações da sua conta Mercado Pago
        </p>
      </div>
    </div>
  );
};
