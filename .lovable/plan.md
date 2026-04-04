

## Plano: Ajustar enquadramento da thumbnail da Foto 9

### Problema
A primeira imagem da linha 3 (Foto 9, index 8 no array) está com o quadro cortado no grid porque `object-cover` dentro de `aspect-square` corta centralmente uma imagem que é mais alta (vertical). O quadro horizontal não aparece inteiro.

### Solução
Adicionar um campo `objectPosition` ao objeto da imagem para controlar o posicionamento do crop. Para a Foto 9, usar `object-position: center top` (ou `center 30%`) para mostrar mais do quadro.

### Alterações em `src/components/GalleryCarouselViagem.tsx`

1. **Adicionar campo opcional `objectPosition`** ao objeto da Foto 9 no array:
   ```ts
   {
     gallery: "/images/galeria-viagem-foto9-thumb.webp",
     popup: "/images/galeria-viagem-foto9-popup.webp",
     alt: "Viagem - Galeria 9",
     description: "Caixa Alta - 43x63cm",
     objectPosition: "center 40%"
   }
   ```

2. **Aplicar no `<img>`** via style inline:
   ```tsx
   <img
     src={image.gallery}
     alt={image.alt}
     className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
     style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
     loading="lazy"
   />
   ```

Apenas esses dois pontos serão alterados. Nenhum outro elemento da galeria será modificado.

