import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useCartPanel } from "@/hooks/useCartPanel";
import CartPanel from "@/components/CartPanel";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, ShoppingBag, Menu, X } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { state: cart } = useCart();
  const { isOpen: isCartOpen, openPanel: openCart, closePanel: closeCart } = useCartPanel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!user) {
        setDisplayName("");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("nome_completo")
        .eq("user_id", user.id)
        .single();

      if (profile?.nome_completo && profile.nome_completo.trim() !== "") {
        setDisplayName(profile.nome_completo.split(" ")[0]);
        return;
      }

      const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
      if (metadataName && metadataName.trim() !== "") {
        setDisplayName(metadataName.split(" ")[0]);
        return;
      }

      setDisplayName(user.email?.split("@")[0] || "Usuário");
    };

    fetchDisplayName();
  }, [user]);

  // Safe calculation of cart items count with proper fallbacks
  const cartItemsCount = cart?.items?.reduce((total, item) => total + (item?.quantidade || 0), 0) || 0;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { name: "Corrida", path: "/corrida" },
    { name: "Ciclismo", path: "/ciclismo" },
    { name: "Viagem", path: "/viagem" },
    { name: "Triathlon", path: "/triathlon" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f0e453eb-2729-482a-b652-2b1b7ac3b81c.png" 
              alt="OneTouch3D Logo" 
              className="h-8 w-auto cursor-pointer"
              loading="eager"
              fetchPriority="high"
              onClick={() => navigate('/')}
            />
          </div>
          
          {/* Desktop Navigation - Centered */}
          <nav className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 ease-in-out ${
                    isActive(item.path)
                      ? "bg-[#005BFF] text-white"
                      : "text-muted-foreground hover:text-[#005BFF]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Desktop Right Section */}
          <div className="flex items-center gap-4 md:gap-3">
            {/* Cart Icon - Always visible */}
            <Button 
              variant="outline" 
              size="sm"
              className="relative"
              onClick={openCart}
              aria-label={`Abrir carrinho com ${cartItemsCount} ${cartItemsCount === 1 ? 'item' : 'itens'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              {/* Cart Counter Badge */}
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* User Menu - Hidden on corrida page */}
            {location.pathname !== '/corrida' && (
              <div>
                {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {displayName || "Usuário"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/meus-pedidos')}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Meus Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/40">
            <nav className="flex flex-col space-y-4 mt-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-3 px-4 rounded-md text-base font-medium transition-all duration-200 ease-in-out min-h-[44px] ${
                    isActive(item.path)
                      ? "bg-[#005BFF] text-white"
                      : "text-muted-foreground hover:text-[#005BFF]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Cart Icon */}
              <button
                onClick={() => {
                  openCart();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center py-3 px-4 text-base text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Carrinho {cartItemsCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">({cartItemsCount})</span>}
              </button>

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-border/40">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      {displayName || "Usuário"}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/perfil');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={() => {
                        navigate('/meus-pedidos');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Meus Pedidos
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Panel */}
      <CartPanel isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
};

export default GlobalHeader;
