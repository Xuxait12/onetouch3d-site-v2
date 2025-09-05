import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  nome: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  cupom: string;
  cupomDesconto: number;
  cep: string;
  frete: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id' | 'subtotal'> }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantidade: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'APPLY_COUPON'; payload: { cupom: string; desconto: number } }
  | { type: 'CALCULATE_SHIPPING'; payload: { cep: string; frete: number } };

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
      return { items: [], total: 0, cupom: '', cupomDesconto: 0, cep: '', frete: 0 };
    
    case 'LOAD_CART': {
      return action.payload;
    }
    
    case 'APPLY_COUPON': {
      return { ...state, cupom: action.payload.cupom, cupomDesconto: action.payload.desconto };
    }
    
    case 'CALCULATE_SHIPPING': {
      return { ...state, cep: action.payload.cep, frete: action.payload.frete };
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
  applyCoupon: (cupom: string, desconto: number) => void;
  calculateShipping: (cep: string, frete: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    cupom: '', 
    cupomDesconto: 0, 
    cep: '', 
    frete: 0 
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
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

  const applyCoupon = (cupom: string, desconto: number) => {
    dispatch({ type: 'APPLY_COUPON', payload: { cupom, desconto } });
  };

  const calculateShipping = (cep: string, frete: number) => {
    dispatch({ type: 'CALCULATE_SHIPPING', payload: { cep, frete } });
  };

  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart, 
      applyCoupon, 
      calculateShipping 
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