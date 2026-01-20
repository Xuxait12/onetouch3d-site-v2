export interface ProductDimensions {
  width: number;
  height: number;
  length: number;
  weight: number;
}

export const FRAME_DIMENSIONS: Record<string, ProductDimensions> = {
  "33x33cm": { width: 38, height: 10, length: 38, weight: 1.90 },
  "33x43cm": { width: 38, height: 10, length: 48, weight: 2.30 },
  "37x48cm": { width: 45, height: 10, length: 55, weight: 3.10 },
  "43x43cm": { width: 48, height: 10, length: 48, weight: 3.00 },
  "43x53cm": { width: 48, height: 10, length: 58, weight: 3.50 },
  "43x63cm": { width: 58, height: 10, length: 78, weight: 3.90 },
  "53x53cm": { width: 58, height: 10, length: 78, weight: 4.40 },
  "53x73cm": { width: 58, height: 10, length: 78, weight: 5.40 },
  "63x83cm": { width: 68, height: 10, length: 88, weight: 6.80 },
  "83x103cm": { width: 88, height: 10, length: 108, weight: 9.10 }
};

export function getProductDimensions(tamanho: string): ProductDimensions {
  const dimensions = FRAME_DIMENSIONS[tamanho];
  if (!dimensions) {
    console.warn(`Dimensões não encontradas para tamanho: ${tamanho}. Usando dimensões padrão.`);
    return { width: 38, height: 10, length: 38, weight: 1.90 };
  }
  return dimensions;
}

export function calculateTotalWeight(items: Array<{ tamanho: string; quantidade: number }>): number {
  return items.reduce((total, item) => {
    const dimensions = getProductDimensions(item.tamanho);
    return total + (dimensions.weight * item.quantidade);
  }, 0);
}

export function calculateInsuranceValue(items: Array<{ subtotal: number }>): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}
