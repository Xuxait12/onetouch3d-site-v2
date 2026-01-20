export function formatCep(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

export function isValidCep(cep: string): boolean {
  const cleaned = cleanCep(cep);
  return /^\d{8}$/.test(cleaned);
}

export function getCepErrorMessage(cep: string): string | null {
  if (!cep) {
    return 'Digite um CEP';
  }

  const cleaned = cleanCep(cep);

  if (cleaned.length === 0) {
    return 'CEP inválido';
  }

  if (cleaned.length < 8) {
    return `CEP incompleto (${cleaned.length}/8 dígitos)`;
  }

  if (cleaned.length > 8) {
    return 'CEP muito longo';
  }

  if (!/^\d{8}$/.test(cleaned)) {
    return 'CEP deve conter apenas números';
  }

  return null;
}
