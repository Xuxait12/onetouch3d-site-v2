

## Adicionar produto 43x63cm na página Viagem

### Arquivo modificado

**`src/pages/stores/ProductSectionViagemLocal.tsx`**

### Alteração

Adicionar uma nova entrada no array `sizeOptions` (linha 36-43), entre o tamanho `43x53cm` e `53x73cm`:

```
{ size: "43x63cm", fullPrice: 601.30, pixPrice: 575.50, isQuote: false },
```

E adicionar a imagem correspondente no objeto `productImages` (linha 46-53):

```
"43x63cm": "/images/viagem-43x63-caixa-alta.webp",
```

> Nota: caso a imagem `/images/viagem-43x63-caixa-alta.webp` não exista ainda no projeto, o produto usará o fallback (imagem do 33x43cm). Será necessário fazer upload da imagem separadamente.

### O que NÃO será alterado

- Nenhuma rota, controller, serviço ou integração backend
- Nenhuma tabela ou schema
- Nenhuma lógica de carrinho, checkout ou API
- Nenhum outro produto existente

