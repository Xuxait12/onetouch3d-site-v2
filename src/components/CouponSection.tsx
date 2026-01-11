import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { Tag, X, CheckCircle2, AlertCircle } from "lucide-react";

interface CouponSectionProps {
  currentPage: string;
  subtotal: number;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  page: string;
}

const CouponSection = ({ currentPage, subtotal }: CouponSectionProps) => {
  const { state: cart, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setFeedback({ type: 'error', message: 'Digite um código de cupom.' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: null, message: '' });

    try {
      // Query the coupons table
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching coupon:', error);
        setFeedback({ type: 'error', message: 'Erro ao validar cupom. Tente novamente.' });
        return;
      }

      if (!data) {
        setFeedback({ type: 'error', message: 'Cupom inválido ou expirado.' });
        return;
      }

      // Check page validity
      if (data.page !== 'all' && data.page !== currentPage) {
        setFeedback({ type: 'error', message: `Este cupom não é válido para esta loja.` });
        return;
      }

      // Check date validity
      const now = new Date();
      if (data.valid_from && new Date(data.valid_from) > now) {
        setFeedback({ type: 'error', message: 'Este cupom ainda não está válido.' });
        return;
      }
      if (data.valid_until && new Date(data.valid_until) < now) {
        setFeedback({ type: 'error', message: 'Este cupom expirou.' });
        return;
      }

      // Calculate discount
      let discount = 0;
      if (data.discount_type === 'percentual') {
        discount = subtotal * (data.discount_value / 100);
      } else if (data.discount_type === 'fixo') {
        discount = data.discount_value;
      }

      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);

      // Apply coupon
      applyCoupon(data.code, discount, data.code, data.page);

      // Show success message
      const discountText = data.discount_type === 'percentual' 
        ? `${data.discount_value}% OFF`
        : `R$ ${data.discount_value.toFixed(2).replace('.', ',')} OFF`;
      
      setFeedback({ 
        type: 'success', 
        message: `Cupom ${data.code} aplicado com sucesso: ${discountText}.`
      });

      toast({
        title: "Cupom aplicado!",
        description: `Desconto de R$ ${discount.toFixed(2).replace('.', ',')} aplicado.`,
      });

    } catch (err) {
      console.error('Error applying coupon:', err);
      setFeedback({ type: 'error', message: 'Erro ao aplicar cupom. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setFeedback({ type: null, message: '' });
    
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do seu pedido.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Coupon Input Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-5 h-5 text-muted-foreground" />
          <Label className="font-semibold text-foreground">Cupom de Desconto</Label>
        </div>

        {cart.cupomCode ? (
          // Coupon Applied State
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <span className="font-semibold text-green-800">{cart.cupomCode}</span>
                  <p className="text-sm text-green-600">
                    Desconto: -R$ {cart.cupomDesconto.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          // Coupon Input State
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Insira seu cupom"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleApplyCoupon}
                disabled={isLoading || !couponCode.trim()}
                className="bg-black hover:bg-black/90 text-white"
              >
                {isLoading ? "Validando..." : "Aplicar"}
              </Button>
            </div>

            {/* Feedback Message */}
            {feedback.type && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                feedback.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">{feedback.message}</span>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CouponSection;
