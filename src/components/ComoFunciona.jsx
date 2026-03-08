import { useState } from "react";

const steps = [
  {
    icon: "🏅",
    label: "Modalidade",
    num: "01",
    badge: "4 opções disponíveis",
    title: "Escolha sua modalidade",
    desc: "Selecione entre Corrida, Ciclismo, Viagem ou Triathlon. Cada modalidade tem layouts e elementos únicos criados especialmente para o seu esporte.",
  },
  {
    icon: "📐",
    label: "Tamanho",
    num: "02",
    badge: "10 tamanhos disponíveis",
    title: "Escolha o tamanho e a moldura",
    desc: "Do 33x33cm ao 83x103cm. Moldura Caixa Alta com acabamento premium em MDF e percurso em alto relevo 3D incluso.",
  },
  {
    icon: "📸",
    label: "Envio",
    num: "03",
    badge: "Processo 100% guiado",
    title: "Envie suas fotos e dados",
    desc: "Compartilhe via WhatsApp ou e-mail: fotos da prova, sua medalha, o percurso GPS e os dados que quer destacar. Quanto mais detalhes, mais especial fica.",
  },
  {
    icon: "🎨",
    label: "Aprovação",
    num: "04",
    badge: "Preview digital garantido",
    title: "Aprovamos o layout juntos",
    desc: "Nossa equipe cria o design e envia para você aprovar antes de produzir. Ajustes à vontade até ficar exatamente como imaginou.",
  },
  {
    icon: "📦",
    label: "Entrega",
    num: "05",
    badge: "Prazo médio: 10–15 dias",
    title: "Produzimos e entregamos",
    desc: "Após aprovação, seu quadro é produzido artesanalmente e enviado com embalagem reforçada para todo o Brasil.",
  },
];

export default function ComoFunciona() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);

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
    <section
      style={{
        background: "#fff",
        padding: "28px 24px 64px",
        fontFamily: '-apple-system, "system-ui", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>

        {/* Título e subtítulo */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: "0 0 12px",
              background: "linear-gradient(to right, #2563eb, #3b82f6, #1d4ed8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Eternize sua conquista em 5 passos
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "clamp(15px, 2vw, 20px)",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Do pedido ao quadro na sua parede, simples assim
          </p>
        </div>

        {/* Tracker de steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            marginBottom: 28,
            flexWrap: "nowrap",
          }}
        >
          {steps.map((st, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => goTo(i)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 6px",
                }}
              >
                {/* Círculo */}
                <div
                  style={{
                    width: i === active ? 52 : 40,
                    height: i === active ? 52 : 40,
                    borderRadius: "50%",
                    background: "#fff",
                    border: i === active
                      ? "2.5px solid #2563eb"
                      : i < active
                      ? "2px solid #2563eb"
                      : "2px solid #d1d5db",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: i === active ? 18 : 15,
                    fontWeight: i === active ? 800 : 700,
                    color: i <= active ? "#2563eb" : "#9ca3af",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: i === active
                      ? "0 0 0 4px rgba(37,99,235,0.10)"
                      : "none",
                    flexShrink: 0,
                  }}
                >
                  {i < active ? "✓" : i + 1}
                </div>
                {/* Label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: i === active ? 700 : 600,
                    color: i === active ? "#2563eb" : "#94a3b8",
                    transition: "color 0.3s",
                    // Esconde no mobile via CSS inline não é possível — usar className se usar Tailwind
                    whiteSpace: "nowrap",
                  }}
                >
                  {st.label}
                </span>
              </button>

              {/* Linha conectora */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 48,
                    height: 2,
                    background: i < active
                      ? "linear-gradient(to right, #2563eb, #3b82f6)"
                      : "#e2e8f0",
                    borderRadius: 2,
                    marginBottom: 15,
                    transition: "background 0.4s",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card principal */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow:
              "rgba(0,0,0,0.08) 0px 1px 3px, rgba(0,0,0,0.06) 0px 4px 16px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(5px)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          {/* Barra de progresso */}
          <div style={{ height: 3, background: "#f1f5f9" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(to right, #2563eb, #3b82f6)",
                borderRadius: "0 4px 4px 0",
                transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          {/* Conteúdo do card */}
          <div
            style={{
              padding: "36px 48px 44px",
              display: "flex",
              gap: 28,
              alignItems: "flex-start",
            }}
          >
            {/* Ícone + número */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  borderRadius: 14,
                  border: "1px solid rgba(37,99,235,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#cbd5e1",
                  letterSpacing: "1.5px",
                  marginTop: 6,
                }}
              >
                {step.num}
              </span>
            </div>

            {/* Texto */}
            <div style={{ flex: 1 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(37,99,235,0.07)",
                  color: "#2563eb",
                  borderRadius: 100,
                  padding: "3px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {step.badge}
              </span>

              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1f2937",
                  margin: "0 0 10px",
                  lineHeight: "32px",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  color: "#4b5563",
                  fontSize: 18,
                  lineHeight: "28px",
                  margin: "0 0 24px",
                }}
              >
                {step.desc}
              </p>

              {/* Botões de navegação */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {active > 0 && (
                  <button
                    onClick={() => goTo(active - 1)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#374151",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    ← Anterior
                  </button>
                )}
                <button
                  onClick={() =>
                    active === steps.length - 1
                      ? (window.location.href = "/corrida")
                      : goTo(active + 1)
                  }
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(to right, #2563eb, #1d4ed8)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                  }}
                >
                  {active === steps.length - 1 ? "🎉 Começar agora" : "Próximo →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pills de navegação rápida */}
        <div
          style={{
            display: "flex",
            gap: 7,
            marginTop: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                padding: "6px 15px",
                borderRadius: 100,
                border: `1.5px solid ${i === active ? "#2563eb" : "#e2e8f0"}`,
                background: i === active ? "#eff6ff" : "#fff",
                color: i === active ? "#2563eb" : "#9ca3af",
                fontSize: 12,
                fontWeight: i === active ? 600 : 400,
                cursor: "pointer",
                boxShadow: i === active
                  ? "0 1px 5px rgba(37,99,235,0.10)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              {st.icon} {st.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
