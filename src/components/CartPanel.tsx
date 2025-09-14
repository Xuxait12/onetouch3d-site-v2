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
      {/* Background overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Cart Window - White DIV */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-description"
        className={`fixed z-50 bg-white rounded-lg shadow-2xl transition-all duration-400 ease-in-out transform origin-center
          /* Desktop: 4cm from top, bottom, right (approx 6rem = 4cm) */
          right-24 top-24 bottom-24 w-96
          /* Tablet */
          md:right-16 md:top-16 md:bottom-16 md:w-80
          /* Mobile */
          sm:right-4 sm:top-16 sm:bottom-16 sm:w-[calc(100vw-2rem)]
          ${
            isOpen 
              ? 'opacity-100 visible animate-[cart-expand_0.4s_ease-in-out] scale-y-100' 
              : 'opacity-0 invisible animate-[cart-collapse_0.4s_ease-in-out] scale-y-0'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 id="cart-title" className="text-xl font-semibold text-gray-900">
              Meu Carrinho
            </h2>
            <p id="cart-description" className="text-sm text-gray-500">
              {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <Button
            ref={firstFocusableRef}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Explore nossos produtos e adicione itens ao seu carrinho
              </p>
              <Button 
                onClick={handleContinueShopping} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
              >
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                  {/* Product image placeholder */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      {item.nome}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.cor && (
                        <span className="text-xs text-gray-500">
                          Cor: {item.cor}
                        </span>
                      )}
                      {item.tamanho && (
                        <span className="text-xs text-gray-500">
                          Tamanho: {item.tamanho}
                        </span>
                      )}
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 border-gray-300"
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
                        className="h-7 w-7 p-0 border-gray-300"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </div>
                    <div className="text-xs text-gray-500">
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
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
            {/* Totals */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">{formatPrice(cart.total)}</span>
              </div>
              {cart.frete > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(cart.frete)}</span>
                </div>
              )}
              {cart.cupomDesconto > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="text-green-600 font-medium">-{formatPrice(cart.cupomDesconto)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-bold text-gray-900 text-lg">Total:</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 text-base"
            >
              Finalizar compra
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;