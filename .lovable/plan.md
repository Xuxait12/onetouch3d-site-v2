

## Plano: Adicionar 8 novas thumbnails à Galeria de Inspiração da página /corrida

### O que sera feito
Adicionar as 8 imagens enviadas como **thumbnails** ao array `galleryImages` em `GalleryCarouselCorrida.tsx`. Os campos `popup` ficarao temporariamente apontando para o mesmo arquivo da thumb — serao atualizados quando voce enviar as versoes popup em seguida.

### Etapas

**1. Copiar as 8 imagens para `public/images/` como thumbs**

| Arquivo origem | Destino |
|---|---|
| `user-uploads://berlin.webp` | `public/images/galeria-corrida-berlin-thumb.webp` |
| `user-uploads://boston.webp` | `public/images/galeria-corrida-boston-thumb.webp` |
| `user-uploads://chicago.webp` | `public/images/galeria-corrida-chicago-thumb.webp` |
| `user-uploads://disney.webp` | `public/images/galeria-corrida-disney-thumb.webp` |
| `user-uploads://lamision.webp` | `public/images/galeria-corrida-lamision-thumb.webp` |
| `user-uploads://paris.webp` | `public/images/galeria-corrida-paris-thumb.webp` |
| `user-uploads://poa.webp` | `public/images/galeria-corrida-poa-thumb.webp` |
| `user-uploads://poa2.webp` | `public/images/galeria-corrida-poa2-thumb.webp` |

**2. Atualizar `src/components/GalleryCarouselCorrida.tsx`**

Adicionar 8 novos objetos ao final do array `galleryImages`. Para cada um:
- `gallery`: caminho da nova thumb (ex: `/images/galeria-corrida-berlin-thumb.webp`)
- `popup`: **mesmo caminho da thumb por enquanto** (sera trocado quando voce enviar as popups)
- `alt` e `description` conforme tabela abaixo

| # | Nome | Descricao |
|---|---|---|
| 9 | berlin | Maratona de Berlim |
| 10 | boston | Maratona de Boston |
| 11 | chicago | Maratona de Chicago |
| 12 | disney | Disney Marathon |
| 13 | lamision | La Mision |
| 14 | paris | Maratona de Paris |
| 15 | poa | Maratona de Porto Alegre |
| 16 | poa2 | Maratona de Porto Alegre |

### Resultado visual
Grid passa de 8 para 16 imagens — no desktop (lg, ≥1024px) forma 4 linhas × 4 colunas. As 2 novas linhas aparecem abaixo das existentes.

### O que NAO sera alterado
- Layout do grid, lightbox, animacoes, hover effects
- Componente `GallerySectionCorrida.tsx`
- Imagens existentes
- Qualquer outro arquivo

### Proximo passo (apos sua aprovacao e envio das popups)
Quando voce enviar as 8 versoes popup, faremos um segundo ajuste apenas trocando o campo `popup` de cada uma das 8 novas entradas para apontar para o arquivo `-popup.webp` correspondente.

