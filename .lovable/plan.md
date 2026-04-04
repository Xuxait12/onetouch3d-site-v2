

## Plano: Alterar tamanho padrão selecionado na loja Viagem

### Problema
O array `ALL_SIZES` começa com `"33x43"`, mas o `useEffect` na linha 57-61 seleciona `finalDisplaySizes[0]`, que depende da ordem filtrada. O tamanho `63x83` está sendo selecionado automaticamente porque provavelmente é o primeiro retornado por `availablePricedSizes`.

### Solução
Forçar a seleção inicial para `"33x43cm"` no `useEffect` de auto-select (linha 57-61), usando esse tamanho quando disponível, e só caindo para `finalDisplaySizes[0]` como fallback.

### Alteração em `src/pages/stores/ProductSectionViagemLocal.tsx`

Linha 57-61 — substituir o `useEffect` de auto-select:

```ts
useEffect(() => {
  if (finalDisplaySizes.length > 0 && (!selectedSize || !finalDisplaySizes.includes(selectedSize.replace("cm", "")))) {
    const preferred = "33x43";
    const defaultSize = finalDisplaySizes.includes(preferred) ? preferred : finalDisplaySizes[0];
    setSelectedSize(defaultSize + "cm");
  }
}, [availablePricedSizes]);
```

Nenhuma outra alteração.

