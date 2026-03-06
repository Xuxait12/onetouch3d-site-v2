

## Corrigir Open Graph Preview

### Problema
A imagem OG atual aponta para `https://lovable.dev/opengraph-image-p98pqg.png` — uma imagem genérica do Lovable, não do site OneTouch3D.

### Solução

**Arquivo: `index.html`**

1. Substituir a URL da imagem OG por uma imagem própria do site no formato 1200x630px
2. Adicionar tags `og:image:width`, `og:image:height` e `og:image:type` para garantir renderização correta
3. Atualizar também `twitter:image` com a mesma URL
4. Adicionar `og:url` apontando para `https://landing-corrida.lovable.app`

A imagem será servida de `/images/og-home.webp` (ou `.jpg`). Será necessário criar/upload uma imagem 1200x630px representando a home do site.

### Tags finais (substituindo as atuais):
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://landing-corrida.lovable.app" />
<meta property="og:image" content="https://landing-corrida.lovable.app/images/og-home.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://landing-corrida.lovable.app/images/og-home.jpg" />
```

### Ação necessária do usuário
Fazer upload de uma imagem 1200x630px chamada `og-home.jpg` na pasta `/public/images/`. Essa imagem deve ser uma captura da home ou arte institucional da OneTouch3D.

### O que NÃO será alterado
- Nenhum layout, componente, rota, backend, banco ou autenticação

