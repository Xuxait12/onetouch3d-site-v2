

## Plano: Reposicionar botão WhatsApp em `HeroSectionCampanha`

Trocar o posicionamento absoluto do `<a>` do WhatsApp em `src/components/HeroSectionCampanha.tsx`.

### Mudança
- **De:** `absolute bottom-12 left-12`
- **Para:** `absolute top-[62%] left-12`

Linha afetada (atual):
```tsx
className="absolute bottom-12 left-12 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full shadow-lg font-semibold transition-colors z-10"
```

Linha nova:
```tsx
className="absolute top-[62%] left-12 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full shadow-lg font-semibold transition-colors z-10"
```

### O que NÃO será alterado
- Nenhuma outra classe, prop ou lógica do botão
- `useCampanhaAtiva.tsx`, `Corrida.tsx` ou qualquer outro arquivo

### Arquivos afetados
- **Editado:** `src/components/HeroSectionCampanha.tsx` (1 linha)

