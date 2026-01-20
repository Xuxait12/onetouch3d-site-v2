export interface ShippingCompany {
  id: number;
  name: string;
  picture: string;
}

export interface DeliveryRange {
  min: number;
  max: number;
}

export interface PackageDimensions {
  height: number;
  width: number;
  length: number;
}

export interface PackageInfo {
  price: number;
  dimensions: PackageDimensions;
  weight: number;
  format?: string;
}

export interface ShippingOption {
  id: number;
  name: string;
  price: number;
  custom_price: number;
  discount?: string;
  currency: string;
  delivery_time: number;
  custom_delivery_time: number;
  delivery_range: DeliveryRange;
  company: ShippingCompany;
  packages: PackageInfo[];
  error?: string;
}

export interface CalculateShippingProduct {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
}

export interface CalculateShippingRequest {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  products: CalculateShippingProduct[];
  options?: {
    receipt?: boolean;
    own_hand?: boolean;
    insurance_value?: number;
  };
}

export interface CalculateShippingResponse {
  success: boolean;
  options?: ShippingOption[];
  error?: string;
  fallback?: boolean;
  message?: string;
}
