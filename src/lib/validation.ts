import { z } from 'zod';

// Profile validation schema
export const profileSchema = z.object({
  full_name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf_cnpj: z.string().min(11, 'Documento inválido').max(18, 'Documento inválido'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  address: z.string().trim().min(3, 'Endereço deve ter pelo menos 3 caracteres').max(200, 'Endereço deve ter no máximo 200 caracteres'),
  number: z.string().trim().min(1, 'Número é obrigatório').max(20, 'Número deve ter no máximo 20 caracteres'),
  complement: z.string().max(100, 'Complemento deve ter no máximo 100 caracteres').optional().nullable(),
  neighborhood: z.string().trim().min(2, 'Bairro deve ter pelo menos 2 caracteres').max(100, 'Bairro deve ter no máximo 100 caracteres'),
  city: z.string().trim().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(100, 'Cidade deve ter no máximo 100 caracteres'),
  state: z.string().min(2, 'Estado inválido').max(50, 'Estado deve ter no máximo 50 caracteres'),
  phone: z.string().min(10, 'Telefone inválido').max(20, 'Telefone inválido'),
  email: z.string().email('Email inválido').max(255, 'Email deve ter no máximo 255 caracteres'),
  person_type: z.enum(['fisica', 'juridica']).optional(),
  country: z.string().max(100).optional(),
  ponto_referencia: z.string().max(200).optional().nullable(),
});

// Order validation schema
export const orderSchema = z.object({
  subtotal: z.number().positive('Subtotal deve ser positivo').max(1000000, 'Subtotal excede o limite'),
  frete: z.number().nonnegative('Frete não pode ser negativo').max(10000, 'Frete excede o limite'),
  desconto: z.number().nonnegative('Desconto não pode ser negativo').max(100000, 'Desconto excede o limite'),
  total: z.number().positive('Total deve ser positivo').max(1000000, 'Total excede o limite'),
  forma_pagamento: z.enum(['pix', 'credit_card', 'debit_card', 'credito', 'debito']),
  shipping_address: z.string().max(500, 'Endereço de entrega muito longo').optional(),
  cupom_aplicado: z.string().max(50).optional().nullable(),
});

// Order item validation schema
export const orderItemSchema = z.object({
  produto_nome: z.string().trim().min(1, 'Nome do produto é obrigatório').max(200, 'Nome do produto muito longo'),
  moldura_tipo: z.string().trim().min(1, 'Tipo de moldura é obrigatório').max(100, 'Tipo de moldura muito longo'),
  tamanho: z.string().trim().min(1, 'Tamanho é obrigatório').max(50, 'Tamanho muito longo'),
  quantidade: z.number().int().positive('Quantidade deve ser um número inteiro positivo').max(100, 'Quantidade excede o limite'),
  valor_unitario: z.number().positive('Valor unitário deve ser positivo').max(100000, 'Valor unitário excede o limite'),
  subtotal: z.number().positive('Subtotal deve ser positivo').max(1000000, 'Subtotal excede o limite'),
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

export function validateOrderItems(items: unknown[]) {
  return items.map(item => orderItemSchema.parse(item));
}

// Helper to get validation error messages
export function getValidationErrors(error: z.ZodError): string[] {
  return error.errors.map(err => err.message);
}
