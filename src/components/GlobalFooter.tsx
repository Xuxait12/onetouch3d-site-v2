import { Phone, MessageCircle, Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

const GlobalFooter = () => {
  const paymentIcons = [
    { icon: <img src="/lovable-uploads/3464ebac-aac6-4717-9a02-b115a8101572.png" alt="Visa" className="h-8 w-auto" />, name: "Visa" },
    { icon: <img src="/lovable-uploads/6a270166-64e8-4b35-8d09-f4de936afa13.png" alt="Elo" className="h-8 w-auto" />, name: "Elo" },
    { icon: <img src="/lovable-uploads/c72f4dfc-d485-4fbc-bd01-ed2197e708a5.png" alt="Hipercard" className="h-8 w-auto" />, name: "Hipercard" },
    { icon: <img src="/lovable-uploads/16b71467-5b29-4af9-88c3-cae66d330127.png" alt="MasterCard" className="h-8 w-auto" />, name: "MasterCard" },
    { icon: <img src="/lovable-uploads/beed93f3-6221-4bf1-a938-8005c4378e0a.png" alt="Pix" className="h-8 w-auto" />, name: "Pix" },
    { icon: <img src="/lovable-uploads/223d12ae-cb67-454f-b598-4d5618f8c3e1.png" alt="Boleto" className="h-8 w-auto" />, name: "Boleto" },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: "https://facebook.com", name: "Facebook" },
    { icon: <Instagram className="h-6 w-6" />, href: "https://instagram.com", name: "Instagram" },
    { icon: <FaTiktok className="h-6 w-6" />, href: "https://tiktok.com", name: "TikTok" },
  ];

  return (
    <footer className="bg-muted/30 py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Coluna 1 - Atendimento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Atendimento</h3>
            <p className="text-sm text-muted-foreground">Segunda a sexta 08:00 às 18:00hrs</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">(54) 9992-1515</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">(54) 9992-1515</span>
              </div>
            </div>
          </div>

          {/* Coluna 2 - Ajuda */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Ajuda</h3>
            <div className="space-y-2">
              <Link to="/politica-devolucao" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Devolução e Trocas
              </Link>
              <Link to="/politica-privacidade" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/entregas-prazos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Entregas e Prazos
              </Link>
            </div>
          </div>

          {/* Coluna 3 - Formas de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Formas de Pagamento</h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentIcons.map((payment, index) => (
                <div key={index} className="flex items-center justify-center p-1 border rounded">
                  {payment.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 4 - Site Seguro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Site Seguro</h3>
            <div className="flex items-center justify-center">
              <img src="/lovable-uploads/81170d74-5013-4a0c-a94e-4c6dd8a97815.png" alt="Site Seguro" className="h-12 w-auto" />
            </div>
          </div>

          {/* Coluna 5 - Onde nos encontrar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Onde nos encontrar</h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-gray-500 text-white rounded-full hover:bg-gray-400 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Onetouch3d. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;