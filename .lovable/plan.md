
## Plano: Correção Definitiva do Bug de Preços no Mobile

### Diagnóstico Confirmado

Analisando a imagem do cliente e o código, o problema é claro:
- **Visualmente**: 53x73cm está selecionado (círculo preenchido)
- **Preço exibido**: R$ 353,90 (preço do 33x43cm)
- **Preço correto**: R$ 575,00

Isso indica que o **estado visual do RadioGroup** mudou, mas o **estado React (`selectedSize`)** não foi atualizado corretamente.

---

### Causa Raiz

A arquitetura atual tem um **conflito de handlers de evento**:

```typescript
// Container div com onClick
<div onClick={() => setSelectedSize(option.size)}>
  // RadioGroup com onValueChange
  <RadioGroup onValueChange={setSelectedSize}>
    <RadioGroupItem value={option.size} />
  </RadioGroup>
</div>
```

**Problema**: Em dispositivos móveis (especialmente Safari iOS):
1. O RadioGroupItem do Radix UI tem seu próprio gerenciamento de estado interno
2. O clique no RadioGroupItem pode não propagar para o container div
3. O Radix atualiza visualmente o círculo, mas o `onValueChange` pode não disparar corretamente
4. O `onClick` do container não é acionado porque o evento foi "consumido" pelo RadioGroupItem

---

### Solução Proposta

Remover a duplicação de handlers e usar uma abordagem mais robusta:

#### Opção A (Recomendada): Usar apenas o onValueChange do RadioGroup

Remover o `onClick` do container div e confiar apenas no `onValueChange` do RadioGroup, mas adicionar `onTouchEnd` como fallback:

```typescript
<RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
  <div className="grid grid-cols-2 gap-2 sm:gap-3">
    {sizeOptions.map((option) => (
      <div 
        key={option.size} 
        className="flex items-center space-x-2 p-2 -m-1 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors"
        onTouchEnd={(e) => {
          // Fallback para mobile: forçar atualização no touchEnd
          e.preventDefault();
          setSelectedSize(option.size);
        }}
        onClick={(e) => {
          // Desktop: prevenir dupla execução se veio de touch
          if (e.detail === 0) return; // Touch events have detail=0
          setSelectedSize(option.size);
        }}
      >
        <RadioGroupItem value={option.size} id={`size-${option.size}`} />
        <Label htmlFor={`size-${option.size}`} className="cursor-pointer text-xs sm:text-sm select-none">
          {option.size}
        </Label>
      </div>
    ))}
  </div>
</RadioGroup>
```

#### Opção B (Mais Simples): Substituir por input nativo

Em vez de usar RadioGroup do Radix, usar inputs nativos que têm melhor suporte mobile:

```typescript
<div className="grid grid-cols-2 gap-2 sm:gap-3">
  {sizeOptions.map((option) => (
    <label 
      key={option.size} 
      className="flex items-center space-x-2 p-2 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors"
    >
      <input 
        type="radio"
        name="product-size"
        value={option.size}
        checked={selectedSize === option.size}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="h-5 w-5"
      />
      <span className="text-xs sm:text-sm select-none">{option.size}</span>
    </label>
  ))}
</div>
```

---

### Implementação Escolhida: Opção A Melhorada

Para manter a consistência visual com o resto do site (usando Radix UI), vou implementar a Opção A com melhorias:

1. **Adicionar `onTouchEnd`** com `preventDefault()` para garantir que o evento seja processado
2. **Manter `onClick`** apenas para desktop
3. **Adicionar `e.stopPropagation()`** no RadioGroupItem para evitar bubbling indesejado
4. **Usar `pointer-events-none`** no RadioGroupItem para forçar o container a receber o evento

---

### Alterações por Arquivo

| Arquivo | Alteração |
|---------|-----------|
| `ProductSectionTriathlonLocal.tsx` | Corrigir handlers de evento para tamanho |
| `ProductSectionCorridaLocal.tsx` | Aplicar mesma correção |
| `ProductSectionCiclismoLocal.tsx` | Aplicar mesma correção |
| `ProductSectionViagemLocal.tsx` | Aplicar mesma correção |

---

### Código da Correção

Para cada arquivo de produto, a seção de tamanhos será alterada de:

```typescript
<div>
  <Label className="text-base font-medium mb-3 block">Tamanho</Label>
  <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {sizeOptions.map((option) => (
        <div 
          key={option.size} 
          className="flex items-center space-x-2 p-2 -m-1 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors"
          onClick={() => setSelectedSize(option.size)}
        >
          <RadioGroupItem value={option.size} id={`triathlon-size-${option.size}`} />
          <Label htmlFor={`triathlon-size-${option.size}`} className="cursor-pointer text-xs sm:text-sm select-none">
            {option.size}
          </Label>
        </div>
      ))}
    </div>
  </RadioGroup>
</div>
```

Para:

```typescript
<div>
  <Label className="text-base font-medium mb-3 block">Tamanho</Label>
  <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {sizeOptions.map((option) => (
        <label 
          key={option.size} 
          htmlFor={`triathlon-size-${option.size}`}
          className="flex items-center space-x-2 p-2 -m-1 cursor-pointer touch-manipulation rounded-md hover:bg-muted/50 active:bg-muted transition-colors select-none"
          onTouchEnd={(e) => {
            e.preventDefault();
            setSelectedSize(option.size);
          }}
        >
          <RadioGroupItem 
            value={option.size} 
            id={`triathlon-size-${option.size}`}
            className="pointer-events-none"
          />
          <span className="text-xs sm:text-sm">
            {option.size}
          </span>
        </label>
      ))}
    </div>
  </RadioGroup>
</div>
```

**Mudanças chave**:
1. Trocar `<div>` por `<label>` nativo (melhor suporte de acessibilidade e mobile)
2. Remover `onClick` que conflitava com `onValueChange`
3. Adicionar `onTouchEnd` com `preventDefault()` para mobile
4. Adicionar `pointer-events-none` no RadioGroupItem para forçar eventos a irem para o label
5. Remover Label component e usar span simples (evita conflito de htmlFor)

---

### Resultado Esperado

Após as correções:
- Ao tocar em qualquer tamanho no mobile, o preço atualizará instantaneamente
- O estado visual e o estado React estarão sempre sincronizados
- Funciona em iOS Safari, Android Chrome e todos os navegadores desktop
- Zero delay de 300ms graças ao `touch-manipulation`

---

### Arquivos a Modificar

1. `src/pages/stores/ProductSectionTriathlonLocal.tsx` (linhas 351-369)
2. `src/pages/stores/ProductSectionCorridaLocal.tsx` (seção de tamanhos correspondente)
3. `src/pages/stores/ProductSectionCiclismoLocal.tsx` (seção de tamanhos correspondente)
4. `src/pages/stores/ProductSectionViagemLocal.tsx` (seção de tamanhos correspondente)

---

### Notas Técnicas

- O Radix UI RadioGroup tem um problema conhecido em mobile onde o estado interno pode dessincronizar do estado React
- A solução usando `<label>` nativo é mais robusta que `<div>` com `onClick`
- O `pointer-events-none` no RadioGroupItem força todos os eventos a serem capturados pelo container `<label>`
- O `onTouchEnd` com `preventDefault()` evita que o browser processe o toque como click sintético
