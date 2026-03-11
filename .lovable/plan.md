

# Plano: Corrigir race condition do carrinho após OAuth

## Problema
Após login Google, o `CartContext` inicializa com `items: []` via `useReducer` e só hidrata do `localStorage` num `useEffect` posterior. Nessa janela, o efeito de save grava `items: []` no `localStorage`, sobrescrevendo os dados reais. Além disso, `cartLoaded` não existe em `CartContextType`, causando erro de build.

## Mudanças

### 1. `src/contexts/CartContext.tsx` — Hidratação síncrona

- Remover action `LOAD_CART` e o `useEffect` que a dispara.
- Criar função `getInitialCartState()` que lê `localStorage.cart` (com fallback para `cart_backup`) sincronamente.
- Usar como lazy initializer: `useReducer(cartReducer, INITIAL_CART_STATE, getInitialCartState)`.
- Usar `useRef(true)` para pular o primeiro save (o estado hidratado já está no localStorage).
- Adicionar `cartLoaded: boolean` ao `CartContextType` (sempre `true` pois hidratação é síncrona).

### 2. `src/pages/Checkout.tsx` — Corrigir guards e OAuth redirect

- Unificar os dois blocos de loading redundantes num único guard:
  ```
  if (authLoading || !cartLoaded) → spinner
  ```
- Mover verificação de carrinho vazio para **depois** do guard de loading.
- Alterar `redirectTo` do Google OAuth de URL hardcoded para:
  ```
  `${window.location.origin}/auth/callback?returnTo=/checkout`
  ```

### 3. `src/pages/AuthCallback.tsx` — Suporte a returnTo

- Usar `useSearchParams()` para ler `returnTo` da query string.
- Navegar para `returnTo` (default `/checkout`) em vez de sempre `/checkout`.

## Resultado esperado
Após OAuth, o carrinho é hidratado sincronamente do `localStorage` no primeiro render, sem janela para sobrescrita. O checkout nunca mostra "carrinho vazio" durante carregamento.

