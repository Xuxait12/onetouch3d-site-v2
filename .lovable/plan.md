

## Plano: Simplificar `HeroSectionCampanha`

Reduzir o componente `src/components/HeroSectionCampanha.tsx` para exibir **apenas a imagem de fundo + botão WhatsApp**, removendo overlay, textos e quadros sobrepostos.

### Mudanças

**1. Remover overlay escuro**
- Excluir a `<div className="absolute inset-0 bg-black/45">`.

**2. Remover textos e CTA antigo**
- Remover o `<motion.h1>` (frase_personalizada com animação letter-by-letter).
- Remover o `<motion.p>` da `frase_secundaria`.
- Remover a linha de âncora de preço ("🏷️ A partir de R$ 291,90 · Parcele em até 12x").
- Remover o botão "Personalize seu quadro agora".
- Remover toda a coluna de quadros (`imagem_quadro_1` e `imagem_quadro_2`).
- Remover o grid `lg:grid-cols-2` e a coluna de texto.

**3. Adicionar botão WhatsApp único**
- Posicionado **absoluto** no canto inferior esquerdo: `bottom-12 left-12` (48px).
- Estilo: verde WhatsApp (`bg-[#25D366]` hover `bg-[#1ebe57]`), texto branco, ícone WhatsApp (lucide `MessageCircle` ou SVG inline), `rounded-full`, padding generoso, `shadow-lg`.
- Texto: "Falar no WhatsApp".
- onClick:
  - Se `campanha.mensagem_whatsapp` → `https://wa.me/5551997199201?text=${encodeURIComponent(...)}`
  - Senão → `https://wa.me/5551997199201` (sem mensagem)
- `target="_blank"` + `rel="noopener noreferrer"`.

### Estrutura final do componente

```tsx
<section className="relative w-full min-h-[100svh] overflow-hidden bg-gray-900">
  <img src={campanha.foto_background} alt={...} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
     className="absolute bottom-12 left-12 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full shadow-lg font-semibold">
    <WhatsAppIcon /> Falar no WhatsApp
  </a>
</section>
```

### Limpeza
- Remover imports não usados: `motion`, `useReducedMotion`, variantes de animação (`LETTER_VARIANTS`, `WORD_VARIANTS`, containers).
- Manter import do tipo `Campanha`.

### O que NÃO será alterado
- `useCampanhaAtiva.tsx`
- `Corrida.tsx` (renderização condicional)
- Tabela `campanhas` no Supabase
- Qualquer outro componente ou página

### Arquivos afetados
- **Editado:** `src/components/HeroSectionCampanha.tsx`

