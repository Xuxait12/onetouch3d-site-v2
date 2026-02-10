export interface PayerCost {
  installments: number;
  installment_rate: number;
  installment_amount: number;
  total_amount: number;
  recommended_message: string;
  labels?: string[];
}

export interface InstallmentsOption {
  payment_method_id: string;
  payment_type_id: string;
  issuer: {
    id: string;
    name: string;
  };
  payer_costs: PayerCost[];
}
