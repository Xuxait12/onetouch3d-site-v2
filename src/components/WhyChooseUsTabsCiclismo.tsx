import WhyChooseUsTabsBase, { type TabItem } from "./WhyChooseUsTabsBase";

const tabs: TabItem[] = [
  {
    id: 1,
    label: "Qualidade premium",
    title: "Qualidade premium",
    description: "Molduras de alta qualidade",
    image: "/images/qualidade-premium-ciclismo.webp",
  },
  {
    id: 2,
    label: "Destaque suas conquistas",
    title: "Destaque para sua medalha",
    description: "Sua conquista e dedicação em evidência.",
    image: "/images/destaque-ciclismo.webp",
    imageMobile: "/images/destaque-ciclismo-mobile.jpg",
  },
  {
    id: 3,
    label: "Personalização completa",
    title: "Personalização completa",
    description: "A personalização é feita junto com você.",
    image: "/images/personalizacao-completa-ciclismo.webp",
  },
];

const WhyChooseUsTabsCiclismo = () => <WhyChooseUsTabsBase tabs={tabs} />;

export default WhyChooseUsTabsCiclismo;
