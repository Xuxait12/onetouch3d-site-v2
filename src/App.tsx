import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PoliticaDevolucao from "./pages/PoliticaDevolucao";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import EntregasPrazos from "./pages/EntregasPrazos";
import Produtos from "./pages/Produtos";
import Checkout from "./pages/Checkout";
import FinalizarPedido from "./pages/FinalizarPedido";
import PedidoConfirmado from "./pages/PedidoConfirmado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
            <Route path="/meus-pedidos/:id" element={<OrderDetails />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/politica-devolucao" element={<PoliticaDevolucao />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/entregas-prazos" element={<EntregasPrazos />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/finalizar-pedido" element={<FinalizarPedido />} />
            <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
