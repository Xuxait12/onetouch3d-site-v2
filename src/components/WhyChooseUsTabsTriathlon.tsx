import WhyChooseUsTabsBase, { type TabItem } from "./WhyChooseUsTabsBase";

const tabs: TabItem[] = [
  {
    id: 1,
    label: "Qualidade premium",
    title: "Qualidade premium",
    description: "Impressão 3D e molduras de alta qualidade",
    image: "/images/ambiente-triathlon-premium.webp",
    mobileImage: "/images/triathlon-qualidade-premium-mobile.webp",
  },
  {
    id: 2,
    label: "Destaque para sua medalha",
    title: "Destaque para sua medalha",
    description: "Sua conquista e dedicação em evidência.",
    image: "/images/triathlon-harmonioso.webp",
    mobileImage: "/images/triathlon-destaque-medalha-mobile.webp",
  },
  {
    id: 3,
    label: "Personalização completa",
    title: "Personalização completa",
    description: "A personalização é feita junto com você.",
    image: "/images/personalizacao-completa-triathlon.webp",
  },
];

const WhyChooseUsTabsTriathlon = () => <WhyChooseUsTabsBase tabs={tabs} />;

export default WhyChooseUsTabsTriathlon;
