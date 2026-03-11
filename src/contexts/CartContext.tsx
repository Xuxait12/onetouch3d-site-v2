import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShippingOption } from '@/types/shipping';

export interface CartItem {
  id: string;
  nome: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagem?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  cupom: string;
  cupomDesconto: number;
  cupomCode: string;
  cupomPage: string;
  cep: string;
  frete: number;
  shippingOptions: ShippingOption[] | null;
  selectedShippingOption: ShippingOption | null;
  isCalculatingShipping: boolean;
  shippingError: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id' | 'subtotal'> }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantidade: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; payload: { cupom: string; desconto: number; cupomCode: string; cupomPage: string } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CALCULATE_SHIPPING'; payload: { cep: string; frete: number } }
  | { type: 'SET_SHIPPING_OPTIONS'; payload: ShippingOption[] }
  | { type: 'SELECT_SHIPPING_OPTION'; payload: ShippingOption }
  | { type: 'SET_SHIPPING_LOADING'; payload: boolean }
  | { type: 'SET_SHIPPING_ERROR'; payload: string | null }
  | { type: 'CLEAR_SHIPPING' };

const INITIAL_CART_STATE: CartState = {
  items: [],
  total: 0,
  cupom: '',
  cupomDesconto: 0,
  cupomCode: '',
  cupomPage: '',
  cep: '',
  frete: 0,
  shippingOptions: null,
  selectedShippingOption: null,
  isCalculatingShipping: false,
  shippingError: null
};

/**
 * Synchronous lazy initializer for useReducer.
 * Reads localStorage on first render to avoid the race condition
 * where an async useEffect hydration allows the save effect to
 * overwrite localStorage with an empty cart.
 */
function getInitialCartState(_initial: CartState): CartState {
  try {
    let raw = localStorage.getItem('cart');

    // Fallback: if 'cart' is missing/invalid, try 'cart_backup' (saved before OAuth redirect)
    if (!raw) {
      raw = localStorage.getItem('cart_backup');
      if (raw) {
        // Promote backup to primary
        localStorage.setItem('cart', raw);
        localStorage.removeItem('cart_backup');
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return {
          ...INITIAL_CART_STATE,
          ...parsed,
          // Reset transient state that shouldn't persist across reloads
          isCalculatingShipping: false,
          shippingError: null,
        };
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    localStorage.removeItem('cart');
  }

  return INITIAL_CART_STATE;
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: CartItem = {
        ...action.payload,
        id: Date.now().toString(),
        subtotal: action.payload.precoUnitario * action.payload.quantidade,
      };
      const updatedItems = [...state.items, newItem];
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      return { ...state, items: updatedItems, total };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              quantidade: action.payload.quantidade,
              subtotal: item.precoUnitario * action.payload.quantidade,
            }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      return { ...state, items: updatedItems, total };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      const total = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      return { ...state, items: updatedItems, total };
    }

    case 'CLEAR_CART':
      return { ...INITIAL_CART_STATE };

    case 'APPLY_COUPON':
      return {
        ...state,
        cupom: action.payload.cupom,
        cupomDesconto: action.payload.desconto,
        cupomCode: action.payload.cupomCode,
        cupomPage: action.payload.cupomPage
      };

    case 'REMOVE_COUPON':
      return { ...state, cupom: '', cupomDesconto: 0, cupomCode: '', cupomPage: '' };

    case 'CALCULATE_SHIPPING':
      return { ...state, cep: action.payload.cep, frete: action.payload.frete };

    case 'SET_SHIPPING_OPTIONS':
      return { ...state, shippingOptions: action.payload, shippingError: null };

    case 'SELECT_SHIPPING_OPTION':
      return {
        ...state,
        selectedShippingOption: action.payload,
        frete: Number(action.payload.custom_price),
        cep: state.cep || ''
      };

    case 'SET_SHIPPING_LOADING':
      return { ...state, isCalculatingShipping: action.payload };

    case 'SET_SHIPPING_ERROR':
      return { ...state, shippingError: action.payload, isCalculatingShipping: false };

    case 'CLEAR_SHIPPING':
      return {
        ...state,
        shippingOptions: null,
        selectedShippingOption: null,
        frete: 0,
        shippingError: null
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  cartLoaded: boolean;
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (cupom: string, desconto: number, cupomCode: string, cupomPage: string) => void;
  removeCoupon: () => void;
  calculateShipping: (cep: string) => Promise<void>;
  selectShippingOption: (option: ShippingOption) => void;
  clearShipping: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous hydration: cart is loaded from localStorage during first render
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART_STATE, getInitialCartState);

  // Skip saving on the very first render (state already matches localStorage)
  const isFirstRender = useRef(true);

  // Save cart to localStorage whenever it changes (skip first render to avoid overwrite)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, 'id' | 'subtotal'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (id: string, quantidade: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantidade } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyCoupon = (cupom: string, desconto: number, cupomCode: string, cupomPage: string) => {
    dispatch({ type: 'APPLY_COUPON', payload: { cupom, desconto, cupomCode, cupomPage } });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const calculateShipping = async (cep: string) => {
    dispatch({ type: 'SET_SHIPPING_LOADING', payload: true });
    dispatch({ type: 'SET_SHIPPING_ERROR', payload: null });

    try {
      const cepLimpo = cep.replace(/\D/g, '');
      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: { cep_destino: cepLimpo, items: state.items }
      });

      if (error) throw error;

      if (data.success) {
        dispatch({ type: 'SET_SHIPPING_OPTIONS', payload: data.options });
        dispatch({ type: 'CALCULATE_SHIPPING', payload: { cep: cepLimpo, frete: 0 } });
      } else {
        throw new Error(data.error || 'Erro ao calcular frete');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Não foi possível calcular o frete. Tente novamente.';
      dispatch({ type: 'SET_SHIPPING_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_SHIPPING_LOADING', payload: false });
    }
  };

  const selectShippingOption = (option: ShippingOption) => {
    dispatch({ type: 'SELECT_SHIPPING_OPTION', payload: option });
  };

  const clearShipping = () => {
    dispatch({ type: 'CLEAR_SHIPPING' });
  };

  return (
    <CartContext.Provider value={{
      state,
      cartLoaded: true, // Always true — hydration is synchronous
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      calculateShipping,
      selectShippingOption,
      clearShipping,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
