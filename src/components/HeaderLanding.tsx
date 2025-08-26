const HeaderLanding = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo à esquerda */}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f0e453eb-2729-482a-b652-2b1b7ac3b81c.png" 
            alt="OneTouch3D Logo" 
            className="h-8 w-auto"
          />
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
        
        {/* Espaço vazio à direita para manter o layout balanceado */}
        <div className="flex items-center w-20">
          {/* Espaço reservado para manter o layout centrado */}
        </div>
      </div>
    </header>
  );
};

export default HeaderLanding;