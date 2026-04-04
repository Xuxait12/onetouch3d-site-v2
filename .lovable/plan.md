

## Plano: Adicionar `loading` e `fetchpriority` em todas as tags `<img>`

### Classificacao

**Imagens above-the-fold (eager + high priority):**
- `GlobalHeader.tsx` — logo do site (sticky header, sempre visivel)
- `Header.tsx` — logo alternativo
- `Home.tsx` — cards de modalidade (hero da home)
- `Auth.tsx` — logo OneTouch3D + logo Google
- `ConfirmacaoWhatsapp.tsx` — logo OneTouch3D + logo Google (topo do formulario)

**Imagens below-the-fold (lazy):**
Todas as demais (38 arquivos), incluindo:
- `FeatureSection.tsx` (3 imgs)
- `FeatureSectionCiclismo.tsx`
- `ProblemSection.tsx`, `SolutionSection.tsx`
- `EmotionalImageSection.tsx` (ja tem lazy)
- `EmotionalSectionCorrida/Ciclismo/Viagem/Triathlon` (ja tem lazy)
- `EmotionalImageSectionTriathlon.tsx` (ja tem lazy)
- `EmotionalSectionTriathlon.tsx` (ja tem lazy)
- `GalleryCarousel*.tsx` (5 arquivos, ja tem lazy nos thumbs, adicionar nos popups)
- `TestimonialsSectionCorrida/Triathlon/Ciclismo.tsx`
- `WhyChooseUsTabs.tsx`, `WhyChooseUsTabsBase.tsx`
- `MaratonasSection.tsx` (ja tem lazy)
- `ProductSection*Local.tsx` (4 arquivos — produto + shipping logos)
- `CartPanel.tsx`, `Carrinho.tsx`
- `Footer.tsx`, `GlobalFooter.tsx` (icones de pagamento)
- `ui/logos3.tsx`, `ui/image-auto-slider.tsx` (ja tem lazy)
- `ui/testimonial.tsx`
- `ConfirmacaoWhatsapp.tsx` — QR code PIX (abaixo da dobra)

### Alteracoes por arquivo

Cada alteracao consiste apenas em adicionar/ajustar atributos `loading` e `fetchpriority` nas tags `<img>` existentes, sem alterar nada mais.

| Arquivo | Acao |
|---|---|
| `GlobalHeader.tsx` | +`loading="eager" fetchPriority="high"` |
| `Header.tsx` | +`loading="eager" fetchPriority="high"` |
| `Home.tsx` | +`loading="eager" fetchPriority="high"` |
| `Auth.tsx` (2 imgs) | +`loading="eager" fetchPriority="high"` |
| `ConfirmacaoWhatsapp.tsx` (logo+google) | +`loading="eager" fetchPriority="high"`, QR code: +`loading="lazy"` |
| `FeatureSection.tsx` (3 imgs) | +`loading="lazy"` |
| `FeatureSectionCiclismo.tsx` | ja tem lazy, ok |
| `ProblemSection.tsx` | +`loading="lazy"` |
| `SolutionSection.tsx` | +`loading="lazy"` |
| `TestimonialsSectionCorrida.tsx` | +`loading="lazy"` |
| `TestimonialsSectionTriathlon.tsx` | +`loading="lazy"` |
| `TestimonialsSectionCiclismo.tsx` | +`loading="lazy"` |
| `WhyChooseUsTabs.tsx` | +`loading="lazy"` |
| `WhyChooseUsTabsBase.tsx` (2 imgs) | +`loading="lazy"` |
| `GalleryCarousel.tsx` (popup) | +`loading="lazy"` |
| `GalleryCarouselCiclismo.tsx` (popup) | +`loading="lazy"` |
| `GalleryCarouselCorrida.tsx` (popup) | +`loading="lazy"` |
| `GalleryCarouselTriathlon.tsx` (popup) | +`loading="lazy"` |
| `GalleryCarouselViagem.tsx` (popup) | +`loading="lazy"` |
| `ProductSectionCorridaLocal.tsx` (2 imgs) | +`loading="lazy"` |
| `ProductSectionCiclismoLocal.tsx` (2 imgs) | +`loading="lazy"` |
| `ProductSectionTriathlonLocal.tsx` (2 imgs) | +`loading="lazy"` |
| `ProductSectionViagemLocal.tsx` (2 imgs) | +`loading="lazy"` |
| `CartPanel.tsx` | +`loading="lazy"` |
| `Carrinho.tsx` | +`loading="lazy"` |
| `Footer.tsx` (7 imgs) | +`loading="lazy"` |
| `GlobalFooter.tsx` (7 imgs) | +`loading="lazy"` |
| `ui/logos3.tsx` | +`loading="lazy"` |
| `ui/testimonial.tsx` | +`loading="lazy"` |

Arquivos que ja possuem `loading="lazy"` correto e nao precisam de alteracao: `EmotionalImageSection.tsx`, `EmotionalImageSectionTriathlon.tsx`, `EmotionalSectionCorrida/Ciclismo/Viagem/Triathlon.tsx`, `MaratonasSection.tsx`, `image-auto-slider.tsx`, thumbs dos GalleryCarousel*.

**Nota**: No JSX do React, o atributo HTML `fetchpriority` e escrito como `fetchPriority` (camelCase).

