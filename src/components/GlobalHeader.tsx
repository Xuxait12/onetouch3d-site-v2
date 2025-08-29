import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, ShoppingBag, Menu, X } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f0e453eb-2729-482a-b652-2b1b7ac3b81c.png" 
              alt="OneTouch3D Logo" 
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate('/home')}
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {user.email?.split('@')[0] || 'Usuário'}
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  className={`text-left py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-border/40">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      {user.email?.split('@')[0] || 'Usuário'}
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
    </header>
  );
};

export default GlobalHeader;