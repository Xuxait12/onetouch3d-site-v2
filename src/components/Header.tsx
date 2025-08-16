import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo à esquerda */}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-foreground">
            ONE<span className="text-primary">TOUCH</span>
          </div>
        </div>
        
        {/* Link para Home no centro */}
        <div className="flex-1 flex justify-center">
          <a 
            href="https://preview--home-onetouch.lovable.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
          >
            ← Voltar para Home
          </a>
        </div>
        
        {/* Botão Login à direita */}
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="bg-background text-foreground border-border hover:bg-muted"
            onClick={() => window.open('https://preview--home-onetouch.lovable.app/', '_blank')}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;