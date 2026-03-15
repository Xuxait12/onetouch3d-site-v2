export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    // Valores do DB (constraint): pending | approved | rejected | cancelled
    pending: 'Aguardando Pagamento',
    approved: 'Pago',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado',
    // Legados / produção manual
    pendente: 'Pendente',
    aguardando_pagamento: 'Aguardando Pagamento',
    pago: 'Pago',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
    enviado: 'Enviado',
    entregue: 'Entregue',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    processando: 'Processando',
  };
  return statusMap[status.toLowerCase()] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    // Valores do DB (constraint): pending | approved | rejected | cancelled
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    // Legados
    pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    aguardando_pagamento: 'bg-orange-100 text-orange-800 border-orange-200',
    pago: 'bg-green-100 text-green-800 border-green-200',
    aprovado: 'bg-green-100 text-green-800 border-green-200',
    rejeitado: 'bg-red-100 text-red-800 border-red-200',
    enviado: 'bg-blue-100 text-blue-800 border-blue-200',
    entregue: 'bg-green-100 text-green-800 border-green-200',
    concluido: 'bg-green-100 text-green-800 border-green-200',
    cancelado: 'bg-red-100 text-red-800 border-red-200',
    processando: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPaymentMethodText = (method: string): string => {
  const methodMap: Record<string, string> = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    boleto: 'Boleto',
    cartao: 'Cartão',
  };
  return methodMap[method.toLowerCase()] || method;
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
