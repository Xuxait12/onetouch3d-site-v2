

## Plano: Trocar posições de imagens na Galeria /corrida

Trocar a **1ª imagem da linha 3** (índice 8 — `berlin`, "Caixa Alta - 43x43cm") com a **4ª imagem da linha 4** (índice 15 — `poa2`, "Caixa Baixa - 33x43cm") no array `galleryImages` em `src/components/GalleryCarouselCorrida.tsx`.

A troca move o objeto inteiro (gallery, popup, alt, description), preservando a relação imagem↔descrição.

### Resultado
- Índice 8 passa a ser: `poa2` / "Caixa Baixa - 33x43cm"
- Índice 15 passa a ser: `berlin` / "Caixa Alta - 43x43cm"

### O que NÃO será alterado
- Demais 14 imagens
- Layout, grid responsivo, lightbox, animações
- Qualquer outro arquivo

