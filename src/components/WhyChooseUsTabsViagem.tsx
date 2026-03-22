import WhyChooseUsTabsBase, { type TabItem } from "./WhyChooseUsTabsBase";

const tabs: TabItem[] = [
  {
    id: 1,
    label: "Qualidade premium",
    title: "Qualidade premium",
    description: "Impressão 3D e molduras de alta qualidade",
    image: "/images/qualidade-premium-viagem.webp",
  },
  {
    id: 2,
    label: "Destaque sua viagem",
    title: "Destaque sua viagem",
    description: "Sua aventura e viagem em evidência.",
    image: "/images/destaque-viagem.webp",
  },
  {
    id: 3,
    label: "Personalização completa",
    title: "Personalização completa",
    description: "A personalização é feita junto com você.",
    image: "/images/personalizacao-completa-viagem.webp",
  },
];

const WhyChooseUsTabsViagem = () => <WhyChooseUsTabsBase tabs={tabs} />;

export default WhyChooseUsTabsViagem;
