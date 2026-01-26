
## Plano: Correção de Preços no Mobile + Erro de Build

### Diagnóstico Identificado

Após análise detalhada do código, identifiquei **dois problemas**:

---

### Problema 1: Erro de Build (Crítico)

**Arquivo afetado:** `supabase/functions/send-order-confirmation/index.ts`

**Causa:** A linha 3 usa `npm:resend@2.0.0` que requer configuração específica do Deno:
```typescript
import { Resend } from "npm:resend@2.0.0";
```

**Erro exibido:**
```
Could not find a matching package for 'npm:resend@2.0.0' in the node_modules directory
```

**Solução:** Alterar o import para usar esm.sh (compatível com edge functions):
```typescript
import { Resend } from "https://esm.sh/resend@2.0.0";
```

---

### Problema 2: Preços não Atualizam no Mobile

**Arquivos afetados:**
- `src/pages/stores/ProductSectionCorridaLocal.tsx`
- `src/pages/stores/ProductSectionCiclismoLocal.tsx`
- `src/pages/stores/ProductSectionViagemLocal.tsx`
- `src/pages/stores/ProductSectionTriathlonLocal.tsx`
- `src/components/ui/radio-group.tsx`

**Causas identificadas:**

1. **Área de toque muito pequena**: O `RadioGroupItem` tem apenas `h-4 w-4` (16x16 pixels), abaixo do mínimo recomendado de 44x44 pixels para touch targets no mobile

2. **Labels desconectados**: Apesar de usar `htmlFor`, em alguns casos o toque no label pode não propagar corretamente o evento para o RadioGroupItem no mobile

3. **Falta de feedback visual**: Sem animações ou estados intermediários, o usuário pode não perceber que a interação foi registrada

**Soluções propostas:**

#### A) Aumentar área clicável do RadioGroupItem
Modificar `src/components/ui/radio-group.tsx` para ter área de toque maior no mobile:
```typescript
className={cn(
  "aspect-square h-5 w-5 sm:h-4 sm:w-4 rounded-full border border-primary...",
  className
)}
```

#### B) Melhorar estrutura dos radio buttons nos componentes de produto
Envolver cada opção em um container clicável com área de toque adequada:
```typescript
<div 
  key={option.size} 
  className="flex items-center space-x-2 p-2 -m-2 cursor-pointer touch-manipulation"
  onClick={() => setSelectedSize(option.size)}
>
  <RadioGroupItem value={option.size} id={`size-${option.size}`} />
  <Label htmlFor={`size-${option.size}`} className="cursor-pointer text-sm">
    {option.size}
  </Label>
</div>
```

#### C) Adicionar classe `touch-manipulation` para melhor resposta touch
Esta classe CSS otimiza a resposta a eventos de toque, removendo o delay de 300ms que alguns navegadores mobile aplicam.

---

### Alterações por Arquivo

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/send-order-confirmation/index.ts` | Trocar import de `npm:resend` para `esm.sh` |
| `src/components/ui/radio-group.tsx` | Aumentar área de toque de 16px para 20px no mobile |
| `src/pages/stores/ProductSectionCorridaLocal.tsx` | Adicionar container clicável + `touch-manipulation` |
| `src/pages/stores/ProductSectionCiclismoLocal.tsx` | Adicionar container clicável + `touch-manipulation` |
| `src/pages/stores/ProductSectionViagemLocal.tsx` | Adicionar container clicável + `touch-manipulation` |
| `src/pages/stores/ProductSectionTriathlonLocal.tsx` | Adicionar container clicável + `touch-manipulation` |

---

### Detalhes Técnicos

#### Modificação do RadioGroup (radio-group.tsx)
```typescript
const RadioGroupItem = React.forwardRef<...>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Aumentar de h-4 w-4 para h-5 w-5 no mobile, manter h-4 w-4 no desktop
        "aspect-square h-5 w-5 sm:h-4 sm:w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3 w-3 sm:h-2.5 sm:w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
```

#### Modificação nos componentes de Produto (exemplo para Corrida)
```typescript
<RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
  <div className="grid grid-cols-2 gap-2 sm:gap-3">
    {sizeOptions.map((option) => (
      <div 
        key={option.size} 
        className="flex items-center space-x-2 p-2 -m-1 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors"
        onClick={() => setSelectedSize(option.size)}
      >
        <RadioGroupItem value={option.size} id={`corrida-size-${option.size}`} />
        <Label htmlFor={`corrida-size-${option.size}`} className="cursor-pointer text-xs sm:text-sm select-none">
          {option.size}
        </Label>
      </div>
    ))}
  </div>
</RadioGroup>
```

---

### Resultado Esperado

Após as correções:

1. O erro de build será resolvido e o site voltará a funcionar
2. Os radio buttons terão área de toque adequada para mobile (mínimo 44px efetivos)
3. O clique/toque em qualquer parte do container selecionará a opção
4. Feedback visual imediato ao tocar (hover/active states)
5. Sem delay de 300ms graças ao `touch-manipulation`
6. Preços atualizarão corretamente ao selecionar diferentes tamanhos

---

### Ordem de Implementação

1. **Primeiro**: Corrigir o erro de build (import do Resend)
2. **Segundo**: Atualizar o componente RadioGroup
3. **Terceiro**: Atualizar os 4 componentes de produto em paralelo
