import { z } from 'zod';

// Profile validation schema (using new DB column names)
export const profileSchema = z.object({
  nome_completo: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf_cnpj: z.string().min(11, 'Documento inválido').max(18, 'Documento inválido'),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  endereco: z.string().trim().min(3, 'Endereço deve ter pelo menos 3 caracteres').max(200, 'Endereço deve ter no máximo 200 caracteres'),
  numero: z.string().trim().min(1, 'Número é obrigatório').max(20, 'Número deve ter no máximo 20 caracteres'),
  complemento: z.string().max(100, 'Complemento deve ter no máximo 100 caracteres').optional().nullable(),
  bairro: z.string().trim().min(2, 'Bairro deve ter pelo menos 2 caracteres').max(100, 'Bairro deve ter no máximo 100 caracteres'),
  cidade: z.string().trim().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(100, 'Cidade deve ter no máximo 100 caracteres'),
  estado: z.string().min(2, 'Estado inválido').max(50, 'Estado deve ter no máximo 50 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido').max(20, 'Telefone inválido'),
  email: z.string().email('Email inválido').max(255, 'Email deve ter no máximo 255 caracteres'),
  tipo_pessoa: z.string().optional(),
  pais: z.string().max(100).optional(),
});

// Order validation schema (using new DB column names)
export const orderSchema = z.object({
  preco_total: z.number().positive('Subtotal deve ser positivo').max(1000000, 'Subtotal excede o limite'),
  shipping_cost: z.number().nonnegative('Frete não pode ser negativo').max(10000, 'Frete excede o limite'),
  desconto_cupom: z.number().nonnegative('Desconto não pode ser negativo').max(100000, 'Desconto excede o limite').optional(),
  desconto_pix: z.number().nonnegative('Desconto não pode ser negativo').max(100000, 'Desconto excede o limite').optional(),
  preco_final: z.number().positive('Total deve ser positivo').max(1000000, 'Total excede o limite'),
  metodo_pagamento: z.enum(['pix', 'credit_card', 'debit_card', 'credito', 'debito']),
  shipping_address: z.string().max(500, 'Endereço de entrega muito longo').optional(),
  cupom_id: z.string().max(50).optional().nullable(),
});

// Auth validation schema
export const authSchema = z.object({
  email: z.string().email('Email inválido').max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100, 'Senha deve ter no máximo 100 caracteres'),
});

export const signupSchema = authSchema.extend({
  fullName: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres').optional(),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// Validate and return parsed data or throw error with user-friendly message
export function validateProfileData(data: unknown) {
  return profileSchema.parse(data);
}

export function validateOrderData(data: unknown) {
  return orderSchema.parse(data);
}

// Helper to get validation error messages
export function getValidationErrors(error: z.ZodError): string[] {
  return error.errors.map(err => err.message);
}
