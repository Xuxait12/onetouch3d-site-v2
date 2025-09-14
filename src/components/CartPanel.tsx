import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartPanelProps {
  isOpen: boolean;
  isAnimating: boolean;
  onClose: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ isOpen, isAnimating, onClose }) => {
  const navigate = useNavigate();
  const { state: cart, updateQuantity, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && isAnimating) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAnimating]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleContinueShopping = () => {
    onClose();
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const subtotal = cart.total || 0;
  const shipping = cart.frete || 0;
  const discount = cart.cupomDesconto || 0;
  const total = subtotal + shipping - discount;
  const itemsCount = cart.items?.length || 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Tarja (Side Strip) */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-white/10 backdrop-blur-sm z-45 transition-all duration-300 ease-in-out",
          isAnimating 
            ? "w-16 md:w-20 lg:w-24 translate-x-0" 
            : "w-0 translate-x-full"
        )}
        aria-hidden="true"
      />

      {/* Cart Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-description"
        className={cn(
          "fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] md:w-96 lg:w-[420px] bg-white rounded-xl shadow-2xl z-50 flex flex-col",
          "transition-all duration-300 ease-in-out transform",
          isAnimating 
            ? "translate-x-0 scale-100 opacity-100" 
            : "translate-x-full scale-95 opacity-0"
        )}
        style={{
          maxWidth: 'calc(100vw - 2rem)',
          right: isAnimating ? '1.5rem' : '0',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="cart-title" className="text-xl font-semibold text-foreground">
              Seu carrinho
            </h2>
            <p id="cart-description" className="text-sm text-muted-foreground">
              {itemsCount} {itemsCount === 1 ? 'item' : 'itens'} no carrinho
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {itemsCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-muted-foreground mb-6">
                Adicione produtos incríveis para começar suas compras
              </p>
              <Button onClick={handleContinueShopping} variant="outline">
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {item.nome}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      <span>Cor: {item.cor}</span>
                      <span className="mx-2">•</span>
                      <span>Tamanho: {item.tamanho}</span>
                    </div>
                    <div className="text-sm font-medium text-foreground mt-1">
                      {formatPrice(item.precoUnitario)}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-red-600 hover:text-red-700"
                        aria-label="Remover item"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {itemsCount > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-foreground">{formatPrice(shipping)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="text-green-600">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleCheckout} 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Finalizar compra
              </Button>
              <Button 
                onClick={handleContinueShopping} 
                variant="outline" 
                className="w-full"
              >
                Continuar comprando
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};