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

  // Não renderizar nada se o carrinho não estiver aberto
  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm opacity-100 visible transition-all duration-300 ease-in-out"
        onClick={onClose}
      />

      {/* Black Side Tab - Behind cart window */}
      <div 
        className="fixed right-0 top-0 w-80 h-screen z-30 bg-black opacity-100 animate-[expand-center_0.5s_ease-in-out] transition-all duration-500 ease-in-out"
        style={{
          clipPath: 'inset(0% 0% 0% 0%)'
        }}
      />

      {/* Cart Window - White DIV */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-description"
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-2xl transform origin-center
          right-16 top-4 w-96 h-[calc(100vh-4rem)]
          md:right-16 md:top-4 md:w-96 md:h-[calc(100vh-4rem)]
          max-[640px]:right-4 max-[640px]:top-4 max-[640px]:w-[calc(100vw-2rem)] max-[640px]:h-[70vh] max-[640px]:max-h-[600px]
          opacity-100 visible animate-[cart-expand_0.7s_ease-in-out]"
        style={{ 
          backgroundColor: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-white rounded-t-lg">
          <div>
            <h2 id="cart-title" className="text-xl font-bold text-gray-900">
              Meu Carrinho
            </h2>
            <p id="cart-description" className="text-sm text-gray-600">
              {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <Button
            ref={firstFocusableRef}
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar carrinho"
            className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content Area - Fixed scrolling */}
        <div className="flex-1 overflow-y-auto p-6 bg-white cart-scroll max-[640px]:max-h-[calc(70vh-280px)] md:max-h-[calc(100vh-320px)]" style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-white">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-gray-600 mb-6">
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
            <div className="space-y-3 bg-white">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border-2 border-gray-300 bg-white shadow-sm">
                  {/* Product image */}
                  <div className="w-12 h-12 rounded-md flex-shrink-0 border border-gray-200 overflow-hidden">
                    {item.imagem ? (
                      <img 
                        src={item.imagem} 
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      {item.nome}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-500">
                      {item.cor && <span>Cor: {item.cor}</span>}
                      {item.tamanho && <span>Tamanho: {item.tamanho}</span>}
                    </div>
                    
                    {/* Quantity controls and price inline */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 border-gray-300"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantidade - 1))}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[1.5rem] text-center">
                          {item.quantidade}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 border-gray-300"
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Price and remove button */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                          aria-label={`Remover ${item.nome} do carrinho`}
                          title="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t-2 border-gray-300 p-6 bg-white rounded-b-lg">
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