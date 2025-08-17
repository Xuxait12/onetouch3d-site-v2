import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Produto",
    links: [
      { name: "Visão Geral", href: "#" },
      { name: "Preços", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Recursos", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { name: "Sobre", href: "#" },
      { name: "Equipe", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { name: "Ajuda", href: "#" },
      { name: "Vendas", href: "#" },
      { name: "Anunciar", href: "#" },
      { name: "Privacidade", href: "#" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaTiktok className="size-5" />, href: "https://tiktok.com", label: "TikTok" },
  { icon: <FaWhatsapp className="size-5" />, href: "https://whatsapp.com", label: "WhatsApp" },
];

const defaultLegalLinks = [
  { name: "Termos e Condições", href: "#" },
  { name: "Política de Privacidade", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "OneTouch Frames",
  },
  sections = defaultSections,
  description = "Transforme suas medalhas em peças únicas de decoração com molduras personalizadas e emolduramento profissional.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 OneTouch Frames. Todos os direitos reservados.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8"
                />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};