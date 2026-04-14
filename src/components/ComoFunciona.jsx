import { useState, useEffect } from "react";

const IconModalidade = () => (
  <svg width="56" height="56" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="10" r="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8"/>
    <path d="M13 15c-2 1-4 3-3 7h16c1-4-1-6-3-7" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M15 22l-2 6h10l-2-6" fill="#2563eb" stroke="#2563eb" strokeWidth="1.2" strokeLinejoin="round"/>
    <path d="M14 10l-3-3M22 10l3-3" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="11" cy="6" r="2" fill="#2563eb"/>
    <circle cx="25" cy="6" r="2" fill="#2563eb"/>
  </svg>
);

const IconTamanho = () => (
  <svg width="56" height="56" viewBox="0 0 36 36" fill="none">
    <rect x="7" y="7" width="22" height="22" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8"/>
    <rect x="11" y="11" width="14" height="14" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1.4"/>
    <path d="M18 11v14M11 18h14" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="5" y="5" width="4" height="4" rx="1" fill="#2563eb"/>
    <rect x="27" y="5" width="4" height="4" rx="1" fill="#2563eb"/>
    <rect x="5" y="27" width="4" height="4" rx="1" fill="#2563eb"/>
    <rect x="27" y="27" width="4" height="4" rx="1" fill="#2563eb"/>
  </svg>
);

const IconEnvio = () => (
  <svg width="56" height="56" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="12" width="26" height="18" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8"/>
    <circle cx="18" cy="21" r="5" fill="#fff" stroke="#2563eb" strokeWidth="1.6"/>
    <circle cx="18" cy="21" r="2.5" fill="#2563eb"/>
    <rect x="13" y="8" width="10" height="6" rx="2" fill="#2563eb"/>
    <circle cx="27" cy="15" r="2" fill="#2563eb"/>
  </svg>
);

const IconAprovacao = () => (
  <svg width="56" height="56" viewBox="0 0 36 36" fill="none">
    <rect x="5" y="7" width="26" height="22" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8"/>
    <path d="M11 18l5 5 9-9" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="5" y="7" width="26" height="6" rx="3" fill="#2563eb"/>
    <circle cx="10" cy="10" r="1.5" fill="#fff"/>
    <circle cx="15" cy="10" r="1.5" fill="#fff"/>
    <circle cx="20" cy="10" r="1.5" fill="#fff"/>
  </svg>
);

const IconEntrega = () => (
  <svg width="56" height="56" viewBox="0 0 36 36" fill="none">
    <rect x="3" y="14" width="20" height="14" rx="2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8"/>
    <path d="M23 19h5l4 4v5h-9V19z" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="9" cy="29" r="3" fill="#2563eb" stroke="#fff" strokeWidth="1.5"/>
    <circle cx="27" cy="29" r="3" fill="#2563eb" stroke="#fff" strokeWidth="1.5"/>
    <path d="M7 14V10a2 2 0 012-2h8a2 2 0 012 2v4" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const steps = [
  {
    icon: <IconModalidade />,
    label: "Modalidade",
    num: "01",
    badge: "4 opções disponíveis",
    title: "Escolha sua modalidade",
    desc: "Selecione entre Corrida, Ciclismo, Viagem ou Triathlon. Cada modalidade tem layouts e elementos únicos criados especialmente para o seu esporte.",
  },
  {
    icon: <IconTamanho />,
    label: "Tamanho",
    num: "02",
    badge: "10 tamanhos disponíveis",
    title: "Escolha o tamanho e a moldura",
    desc: "Do 33x33cm ao 83x103cm. Moldura Caixa Alta com acabamento premium em MDF e percurso em alto relevo 3D incluso.",
  },
  {
    icon: <IconEnvio />,
    label: "Envio",
    num: "03",
    badge: "Processo 100% guiado",
    title: "Envie suas fotos e dados",
    desc: "Compartilhe via WhatsApp ou e-mail: fotos da prova, sua medalha, o percurso GPS e os dados que quer destacar. Quanto mais detalhes, mais especial fica.",
  },
  {
    icon: <IconAprovacao />,
    label: "Aprovação",
    num: "04",
    badge: "Preview digital garantido",
    title: "Aprovamos o layout juntos",
    desc: "Nossa equipe cria o design e envia para você aprovar antes de produzir. Ajustes à vontade até ficar exatamente como imaginou.",
  },
  {
    icon: <IconEntrega />,
    label: "Entrega",
    num: "05",
    badge: "Prazo médio: 10–15 dias",
    title: "Produzimos e entregamos",
    desc: "Após aprovação, seu quadro é produzido artesanalmente e enviado com embalagem reforçada para todo o Brasil.",
  },
];

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ComoFunciona() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const mobile = useIsMobile();

  const goTo = (idx) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setVisible(false);
    setTimeout(() => {
      setActive(idx);
      setVisible(true);
      setAnimating(false);
    }, 220);
  };

  const step = steps[active];
  const progress = ((active + 1) / steps.length) * 100;

  return (
    <section style={{ background: "#fff", padding: mobile ? "20px 0 40px" : "28px 24px 64px", fontFamily: '-apple-system, "system-ui", "Helvetica Neue", Arial, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: mobile ? "0 16px" : "0 48px" }}>

        <div style={{ textAlign: "center", marginBottom: mobile ? 28 : 44 }}>
          <span style={{ display: "inline-block", fontSize: mobile ? 13 : 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#2563eb", marginBottom: 8 }}>
            Como Funciona
          </span>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 52px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 10px", background: "linear-gradient(to right, #2563eb, #3b82f6, #1d4ed8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Eternize sua conquista em 5 passos
          </h2>
          <p style={{ color: "#6b7280", fontSize: "clamp(14px, 2vw, 20px)", lineHeight: "1.6", margin: 0 }}>
            Do pedido ao quadro na sua parede, simples assim.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: mobile ? 20 : 28, flexWrap: "nowrap", overflowX: mobile ? "auto" : "visible", WebkitOverflowScrolling: "touch", padding: mobile ? "0 4px" : 0 }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button onClick={() => goTo(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: mobile ? 3 : 5, background: "none", border: "none", cursor: "pointer", padding: mobile ? "3px 2px" : "3px 6px" }}>
                <div style={{ width: mobile ? (i === active ? 38 : 30) : (i === active ? 52 : 40), height: mobile ? (i === active ? 38 : 30) : (i === active ? 52 : 40), borderRadius: "50%", background: "#fff", border: i === active ? "2.5px solid #2563eb" : i < active ? "2px solid #2563eb" : "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: mobile ? (i === active ? 14 : 12) : (i === active ? 18 : 15), fontWeight: i === active ? 800 : 700, color: i <= active ? "#2563eb" : "#9ca3af", transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: i === active ? "0 0 0 4px rgba(37,99,235,0.10)" : "none", flexShrink: 0 }}>
                  {i < active ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: mobile ? 10 : 13, fontWeight: i === active ? 700 : 600, color: i === active ? "#2563eb" : "#94a3b8", transition: "color 0.3s", whiteSpace: "nowrap" }}>
                  {st.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ width: mobile ? 20 : 48, height: 2, background: i < active ? "linear-gradient(to right, #2563eb, #3b82f6)" : "#e2e8f0", borderRadius: 2, marginBottom: mobile ? 12 : 15, transition: "background 0.4s", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: mobile ? 12 : 16, boxShadow: "rgba(0,0,0,0.08) 0px 1px 3px, rgba(0,0,0,0.06) 0px 4px 16px", border: "1px solid #e5e7eb", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(5px)", transition: "opacity 0.22s ease, transform 0.22s ease" }}>
          <div style={{ height: 3, background: "#f1f5f9" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(to right, #2563eb, #3b82f6)", borderRadius: "0 4px 4px 0", transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          </div>

          <div style={{ padding: mobile ? "24px 18px 28px" : "36px 48px 44px", display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 18 : 28, alignItems: mobile ? "center" : "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              {step.icon}
              <span style={{ fontSize: 10, fontWeight: 700, color: "#cbd5e1", letterSpacing: "1.5px", marginTop: 6 }}>
                {step.num}
              </span>
            </div>

            <div style={{ flex: 1, textAlign: mobile ? "center" : "left" }}>
              <span style={{ display: "inline-block", background: "rgba(37,99,235,0.07)", color: "#2563eb", borderRadius: 100, padding: "3px 12px", fontSize: mobile ? 12 : 13, fontWeight: 600, marginBottom: 10 }}>
                {step.badge}
              </span>
              <h3 style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: "#1f2937", margin: "0 0 8px", lineHeight: mobile ? "26px" : "32px" }}>
                {step.title}
              </h3>
              <p style={{ color: "#4b5563", fontSize: mobile ? 15 : 18, lineHeight: mobile ? "24px" : "28px", margin: "0 0 20px" }}>
                {step.desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: mobile ? "center" : "flex-start" }}>
                {active > 0 && (
                  <button onClick={() => goTo(active - 1)} style={{ padding: mobile ? "9px 16px" : "10px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: mobile ? 13 : 14, fontWeight: 500, cursor: "pointer" }}>
                    ← Anterior
                  </button>
                )}
                <button onClick={() => active === steps.length - 1 ? (window.location.href = "/corrida") : goTo(active + 1)} style={{ padding: mobile ? "9px 18px" : "10px 22px", borderRadius: 8, border: "none", background: "linear-gradient(to right, #2563eb, #1d4ed8)", color: "#fff", fontSize: mobile ? 13 : 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>
                  {active === steps.length - 1 ? "Começar agora →" : "Próximo →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
