

## Plano: Adicionar imagem 11 na galeria de Viagem

### O que será feito

Adicionar uma nova imagem (a 9a) na galeria de inspiração da página `/viagem`, inserida na posição 2 do array (entre a foto 1 e a foto 2 atuais).

### Passos

1. **Copiar os arquivos de imagem para o projeto**
   - `foto_11_11.webp` → `public/images/galeria-viagem-foto11-thumb.webp` (grid/thumbnail)
   - `foto_11.webp` → `public/images/galeria-viagem-foto11-popup.webp` (popup/lightbox)

2. **Editar `src/components/GalleryCarouselViagem.tsx`**
   - Inserir um novo objeto na posição 2 do array `galleryImages` (entre foto1 e foto2):
     ```ts
     {
       gallery: "/images/galeria-viagem-foto11-thumb.webp",
       popup: "/images/galeria-viagem-foto11-popup.webp",
       alt: "Viagem - Galeria 11",
       description: "Caixa Alta - 33x43cm"
     }
     ```
   - Nenhuma outra alteração no componente -- a lógica de grid responsivo (1→2→3→4 colunas) e lightbox já funciona automaticamente com 9 imagens.

### Resultado

- 9 imagens no total
- Grid desktop (lg): 4+4+1 (3 linhas, última com 1 imagem)
- Grid tablet (md): 3+3+3
- Grid mobile (sm): 2 colunas / (default): 1 coluna
- Lightbox, navegação por setas/teclado e contador continuam funcionando sem alteração.

