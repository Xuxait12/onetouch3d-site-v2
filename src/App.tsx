import { useEffect, useState, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { initMercadoPago } from "@mercadopago/sdk-react";
import Home from "./pages/Home";
import Corrida from "./pages/Corrida";
import Ciclismo from "./pages/Ciclismo";
import Viagem from "./pages/Viagem";
import Triathlon from "./pages/Triathlon";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PoliticaDevolucao from "./pages/PoliticaDevolucao";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import EntregasPrazos from "./pages/EntregasPrazos";
import Carrinho from "./pages/Carrinho";
import Confirmacao from "./pages/Confirmacao";
import AuthRedirect from "./components/AuthRedirect";
import AdminPanel from "./pages/AdminPanel";
import ConfirmacaoWhatsapp from "./pages/ConfirmacaoWhatsapp";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/corrida" element={<Corrida />} />
                  <Route path="/ciclismo" element={<Ciclismo />} />
                  <Route path="/viagem" element={<Viagem />} />
                  <Route path="/triathlon" element={<Triathlon />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/meus-pedidos" element={<MyOrders />} />
                  <Route path="/meus-pedidos/:id" element={<OrderDetails />} />
                  <Route path="/recuperar-senha" element={<ForgotPassword />} />
                  <Route path="/redefinir-senha" element={<ResetPassword />} />
                  <Route path="/politica-devolucao" element={<PoliticaDevolucao />} />
                  <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                  <Route path="/entregas-prazos" element={<EntregasPrazos />} />
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/confirmacao" element={<Confirmacao />} />
                  <Route path="/auth-redirect" element={<AuthRedirect />} />
                  <Route path="/painel" element={<AdminPanel />} />
                  <Route path="/order-details/:id" element={<OrderDetails />} />
                  <Route path="/confirmacao-whatsapp" element={<ConfirmacaoWhatsapp />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </OAuthHashHandler>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
