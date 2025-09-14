import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { state: cart, updateQuantity, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleContinueShopping = () => {
    onClose();
    // Scroll to "Nossa Loja" section (ProductSection)
    setTimeout(() => {
      const productSection = document.querySelector('[data-section="nossa-loja"]') || 
                           document.querySelector('.product-section') ||
                           document.getElementById('nossa-loja');
      if (productSection) {
        productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const cartTotal = cart.total + cart.frete - cart.cupomDesconto;
  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantidade, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      {/* Overlay + Tarja Lateral */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        
        {/* Tarja lateral */}
        <div
          className={`absolute right-0 top-0 h-full bg-gradient-to-b from-blue-500 to-blue-600 shadow-2xl transition-all duration-300 ease-in-out ${
            isOpen ? 'w-16 md:w-20' : 'w-0'
          }`}
        />
      </div>

      {/* Cart Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-description"
        className={`fixed right-20 md:right-24 top-16 bottom-16 z-50 w-80 md:w-96 bg-white border border-border rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform origin-center ${
          isOpen 
            ? 'opacity-100 visible scale-100' 
            : 'opacity-0 invisible scale-50'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 id="cart-title" className="text-lg font-semibold text-foreground">
              Meu Carrinho
            </h2>
            <p id="cart-description" className="text-sm text-muted-foreground">
              {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <Button
            ref={firstFocusableRef}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore nossos produtos e adicione itens ao seu carrinho
              </p>
              <Button onClick={handleContinueShopping} variant="outline">
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-border bg-card">
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {item.nome}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.cor && (
                        <span className="text-xs text-muted-foreground">
                          Cor: {item.cor}
                        </span>
                      )}
                      {item.tamanho && (
                        <span className="text-xs text-muted-foreground">
                          Tamanho: {item.tamanho}
                        </span>
                      )}
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantidade}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {formatPrice(item.subtotal)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatPrice(item.precoUnitario)} cada
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-foreground">{formatPrice(cart.total)}</span>
              </div>
              {cart.frete > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete:</span>
                  <span className="text-foreground">{formatPrice(cart.frete)}</span>
                </div>
              )}
              {cart.cupomDesconto > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="text-green-600">-{formatPrice(cart.cupomDesconto)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="font-semibold text-lg text-foreground">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                className="w-full bg-black hover:bg-black/90 text-white font-medium"
              >
                Finalizar compra
              </Button>
              <Button
                onClick={handleContinueShopping}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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

export default CartPanel;