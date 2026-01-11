import { useEffect, useState } from 'react';

/**
 * Componente de diagnóstico para testar credenciais do Mercado Pago
 */
export const TestMercadoPago = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCredentials = async () => {
    setLoading(true);
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

    try {
      // Testar se a public key está configurada
      if (!publicKey) {
        setTestResult({
          success: false,
          error: 'VITE_MERCADO_PAGO_PUBLIC_KEY não configurada',
        });
        return;
      }

      // Fazer uma chamada de teste à API do MP (usando endpoint público)
      const response = await fetch(
        `https://api.mercadopago.com/checkout/preferences/test?public_key=${publicKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setTestResult({
        success: response.ok,
        status: response.status,
        publicKey: publicKey,
        message: response.ok
          ? 'Credenciais válidas!'
          : 'Erro ao validar credenciais',
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testCredentials();
  }, []);

  return (
    <div className="p-6 bg-gray-50 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Diagnóstico Mercado Pago</h3>

      {loading && <p className="text-blue-600">Testando credenciais...</p>}

      {testResult && (
        <div className="space-y-2">
          <div
            className={`p-4 rounded ${
              testResult.success ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <p className="font-semibold">
              {testResult.success ? '✅ Sucesso' : '❌ Erro'}
            </p>
            {testResult.publicKey && (
              <p className="text-sm mt-2">
                <strong>Public Key:</strong>{' '}
                {testResult.publicKey.substring(0, 20)}...
              </p>
            )}
            {testResult.status && (
              <p className="text-sm">
                <strong>Status HTTP:</strong> {testResult.status}
              </p>
            )}
            {testResult.message && (
              <p className="text-sm">{testResult.message}</p>
            )}
            {testResult.error && (
              <p className="text-sm text-red-700">
                <strong>Erro:</strong> {testResult.error}
              </p>
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Passos para configurar sua conta de teste:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>
                Acesse:{' '}
                <a
                  href="https://www.mercadopago.com.br/developers/panel/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Painel do Desenvolvedor
                </a>
              </li>
              <li>Vá em "Suas aplicações" → Selecione sua aplicação</li>
              <li>
                Vá em "Credenciais de teste" (não "Credenciais de produção")
              </li>
              <li>Copie a Public Key que começa com "TEST-"</li>
              <li>
                IMPORTANTE: Vá em "Checkout Transparente" e habilite os métodos
                de pagamento (Cartão de Crédito, Débito, PIX)
              </li>
            </ol>
          </div>
        </div>
      )}

      <button
        onClick={testCredentials}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testando...' : 'Testar Novamente'}
      </button>
    </div>
  );
};
