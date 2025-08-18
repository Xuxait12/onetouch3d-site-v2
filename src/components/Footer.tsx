import { Phone, MessageCircle, Lock, Shield, Facebook, Instagram, Youtube } from "lucide-react";
import { FaTiktok, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDinersClub } from "react-icons/fa";
import { SiPix } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  const paymentIcons = [
    { icon: <FaCcVisa className="h-8 w-12" />, name: "Visa" },
    { icon: <div className="h-8 w-12 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">ELO</div>, name: "Elo" },
    { icon: <div className="h-8 w-12 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">AURA</div>, name: "Aura" },
    { icon: <div className="h-8 w-12 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">HIPER</div>, name: "Hipercard" },
    { icon: <FaCcMastercard className="h-8 w-12" />, name: "MasterCard" },
    { icon: <FaCcAmex className="h-8 w-12" />, name: "Amex" },
    { icon: <FaCcDinersClub className="h-8 w-12" />, name: "Diners Club" },
    { icon: <div className="h-8 w-12 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">CABAL</div>, name: "Cabal" },
    { icon: <div className="h-8 w-12 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">HIPER</div>, name: "Hiper" },
    { icon: <SiPix className="h-8 w-12" />, name: "Pix" },
    { icon: <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">BOLETO</div>, name: "Boleto" },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-6 w-6" />, href: "https://facebook.com", name: "Facebook" },
    { icon: <Instagram className="h-6 w-6" />, href: "https://instagram.com", name: "Instagram" },
    { icon: <Youtube className="h-6 w-6" />, href: "https://youtube.com", name: "YouTube" },
    { icon: <FaTiktok className="h-6 w-6" />, href: "https://tiktok.com", name: "TikTok" },
  ];

  return (
    <footer className="bg-muted/30 py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Coluna 1 - Atendimento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Atendimento</h3>
            <p className="text-sm text-muted-foreground">Segunda a sexta 09:00 às 20:00</p>
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

          {/* Coluna 3 - Meus Pedidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Meus Pedidos</h3>
            <div className="space-y-2">
              <Link to="/meus-pedidos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Acompanhe seus pedidos
              </Link>
              <Link to="/perfil" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Editar cadastro
              </Link>
            </div>
          </div>

          {/* Coluna 4 - Formas de Pagamento */}
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

          {/* Coluna 5 - Site Seguro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Site Seguro</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 border rounded">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">SITE SEGURO</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-100 border border-green-300 rounded">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">SSL CERTIFICADO</span>
              </div>
            </div>
          </div>

          {/* Coluna 6 - Onde nos encontrar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Onde nos encontrar</h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/80 transition-colors"
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
            © 2024 OneTouch Frames. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;