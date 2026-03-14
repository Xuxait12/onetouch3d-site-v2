

## Implementation Plan: Dynamic Prices from Supabase

### Overview
Replace hardcoded prices in 4 product pages with data fetched from the `precos` table. Add catalog IDs to cart items.

**Price rule:** `preco` from DB = full card price. PIX price = `preco * 0.95`.

---

### File 1: `src/hooks/usePrices.ts` (NEW)

Create a reusable hook that:
- Takes a `modalidade_id` and queries `supabase.from('precos').select('preco, tamanho_id, tipo_moldura_id').eq('modalidade_id', id).eq('ativo', true)`
- Builds inverse maps from `TAMANHOS` and `TIPOS_MOLDURA` (UUID → label/key)
- Returns:
  - `loading`, `error` states
  - `getPrice(tamanhoLabel, tipoMolduraKey)` → `{ fullPrice, pixPrice, tamanho_id, tipo_moldura_id } | null`
  - `getAvailableSizes(tipoMolduraKey)` → sorted array of size labels with prices
  - `isQuoteOnly(tamanhoLabel, tipoMolduraKey)` → true if entry exists with price ≤ 0

PIX calculation: `Math.round(preco * 0.95 * 100) / 100`

---

### File 2: `src/contexts/CartContext.tsx`

Add 3 optional fields to `CartItem` interface:
```ts
modalidade_id?: string;
tamanho_id?: string;
tipo_moldura_id?: string;
```

No other changes to this file.

---

### File 3: `src/pages/stores/ProductSectionCorridaLocal.tsx`

- Import `usePrices` and `MODALIDADES, TAMANHOS, TIPOS_MOLDURA` from catalog
- Call `usePrices(MODALIDADES.corrida)`
- **Remove** hardcoded `sizeOptionsCaixaAlta` and `sizeOptionsCaixaBaixa` arrays (lines 54-74)
- Define available size labels as constants (for image mapping): `["33x33", "33x43", "37x48", "43x43", "43x53", "43x63", "53x53", "53x73"]`
- Filter sizes dynamically: only show sizes where `getPrice(size, tipoKey)` returns non-null
- Map `selectedType` → tipo_moldura_key: `"caixa-alta"` → `"caixa_alta"`, `"caixa-baixa"` → `"caixa_baixa"`
- Size display format: `"33x33cm"` (append "cm" to label for display, strip "cm" for lookup)
- Price display: use `getPrice()` result for `fullPrice` and `pixPrice`
- `handleAddToCart`: include `modalidade_id: MODALIDADES.corrida`, `tamanho_id`, `tipo_moldura_id` from `getPrice()` result
- `handleCalculateFrete`: use `pixPrice` from `getPrice()`
- Show skeleton/spinner in the price area while `loading` is true
- If `loading`, disable size selection and add-to-cart button

---

### File 4: `src/pages/stores/ProductSectionCiclismoLocal.tsx`

- Same pattern, `usePrices(MODALIDADES.ciclismo)`
- Only has `caixa_alta` frame type
- **Remove** hardcoded `sizeOptions` (lines 36-43)
- Available sizes: `["33x33", "33x43", "37x48", "43x43", "43x53", "53x53"]`
- Filter by `getPrice(size, "caixa_alta")`
- `handleAddToCart`: include catalog IDs, `tipo_moldura_id: TIPOS_MOLDURA.caixa_alta`
- Loading state on prices

---

### File 5: `src/pages/stores/ProductSectionTriathlonLocal.tsx`

- Same pattern, `usePrices(MODALIDADES.triathlon)`
- Has both `caixa_alta` and `caixa_baixa`
- **Remove** hardcoded `sizeOptionsCaixaAlta` and `sizeOptionsCaixaBaixa` (lines 54-70)
- Available sizes: `["33x43", "37x48", "43x43", "43x53", "43x63", "53x73"]`
- Filter by selected frame type
- `handleAddToCart`: include catalog IDs
- Loading state on prices

---

### File 6: `src/pages/stores/ProductSectionViagemLocal.tsx`

- Same pattern, `usePrices(MODALIDADES.viagem)`
- Only `caixa_alta`
- **Remove** hardcoded `sizeOptions` (lines 36-44)
- All possible sizes: `["33x43", "37x48", "43x53", "43x63", "53x73", "63x83", "83x103"]`
- For sizes where `getPrice()` returns null but `isQuoteOnly()` is true → show "Solicitar orcamento" (keep existing quote logic)
- For sizes where neither exists → hide size entirely
- `handleAddToCart`: include catalog IDs
- Loading state on prices

---

### Loading state pattern (all pages)

When `loading` is true, render a skeleton in the price area:
```tsx
{loading ? (
  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-8 w-40" />
    <Skeleton className="h-4 w-48" />
  </div>
) : ( /* existing price display */ )}
```

Disable the "Adicionar ao carrinho" button while loading.

---

### Size label convention

- DB/catalog key: `"33x33"` (no "cm")
- Display/state: `"33x33cm"` (with "cm")  
- Conversion: strip `"cm"` for `getPrice()` lookups, append for display

