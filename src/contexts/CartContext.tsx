import React, { createContext, useContext, useReducer, useEffect } from 'react';
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
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'APPLY_COUPON'; payload: { cupom: string; desconto: number; cupomCode: string; cupomPage: string } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CALCULATE_SHIPPING'; payload: { cep: string; frete: number } }
  | { type: 'SET_SHIPPING_OPTIONS'; payload: ShippingOption[] }
  | { type: 'SELECT_SHIPPING_OPTION'; payload: ShippingOption }
  | { type: 'SET_SHIPPING_LOADING'; payload: boolean }
  | { type: 'SET_SHIPPING_ERROR'; payload: string | null }
  | { type: 'CLEAR_SHIPPING' };

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
      return {
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

    case 'LOAD_CART': {
      return action.payload;
    }

    case 'APPLY_COUPON': {
      return {
        ...state,
        cupom: action.payload.cupom,
        cupomDesconto: action.payload.desconto,
        cupomCode: action.payload.cupomCode,
        cupomPage: action.payload.cupomPage
      };
    }

    case 'REMOVE_COUPON': {
      return { ...state, cupom: '', cupomDesconto: 0, cupomCode: '', cupomPage: '' };
    }

    case 'CALCULATE_SHIPPING': {
      return { ...state, cep: action.payload.cep, frete: action.payload.frete };
    }

    case 'SET_SHIPPING_OPTIONS': {
      return { ...state, shippingOptions: action.payload, shippingError: null };
    }

    case 'SELECT_SHIPPING_OPTION': {
      return {
        ...state,
        selectedShippingOption: action.payload,
        frete: Number(action.payload.custom_price),
        cep: state.cep || ''
      };
    }

    case 'SET_SHIPPING_LOADING': {
      return { ...state, isCalculatingShipping: action.payload };
    }

    case 'SET_SHIPPING_ERROR': {
      return {
        ...state,
        shippingError: action.payload,
        isCalculatingShipping: false
      };
    }

    case 'CLEAR_SHIPPING': {
      return {
        ...state,
        shippingOptions: null,
        selectedShippingOption: null,
        frete: 0,
        shippingError: null
      };
    }

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
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
  const [cartLoaded, setCartLoaded] = React.useState(false);
  const [state, dispatch] = useReducer(cartReducer, {
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
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart.items || !Array.isArray(parsedCart.items)) {
          localStorage.removeItem('cart');
          return;
        }
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
        setCartLoaded(true);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
        setCartLoaded(true);
      }
    } else {
      setCartLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes (only after initial load)
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state, cartLoaded]);

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
        body: {
          cep_destino: cepLimpo,
          items: state.items
        }
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
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      calculateShipping,
      selectShippingOption,
      clearShipping,
      cartLoaded
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