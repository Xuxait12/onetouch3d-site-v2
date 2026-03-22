

## Plan: Replace "Como Funciona" Tabs with Fixed Cards

### Summary
Replace the tab-based UI in the "Como Funciona" section with 4 always-visible cards showing all steps simultaneously, with arrow separators indicating sequence. Apply to all 3 component files used across 4 pages.

### Files to Modify
1. **`src/components/HowItWorksTabs.tsx`** (used by Corrida + Triathlon)
2. **`src/components/HowItWorksTabsCiclismo.tsx`** (used by Ciclismo)
3. **`src/components/HowItWorksTabsViagem.tsx`** (used by Viagem)

### Changes per File

Each file gets the same structural change — keep the `steps` array (with its specific texts) intact, replace the render logic:

**Remove:**
- All tab state (`useState`, `useRef`, `useEffect`, slider logic, overflow checks)
- Tab buttons bar with animated slider
- Single-panel filtered content display
- `ChevronLeft`/`ChevronRight` imports (no longer needed)

**Add:**
- Import `ArrowRight`, `ArrowDown` from lucide-react
- Render all 4 steps as cards in a responsive grid
- Each card contains: step number badge, icon, title, description
- Arrow separators between cards

**Layout (Tailwind):**
- Desktop (lg+): `grid-cols-7` — 4 card columns + 3 arrow columns, arrows use `ArrowRight`
- Tablet (md): `grid-cols-2` with `ArrowDown` between rows
- Mobile: single column (`grid-cols-1`) with `ArrowDown` between each card

**Card styling** (matching current active panel look):
- `bg-secondary/30 rounded-2xl p-6 border border-border/50`
- Step number as a small accent badge at top
- Icon in accent color below number
- Title as `text-lg font-semibold`
- Description as `text-muted-foreground text-sm leading-relaxed`

### No Page File Changes
The page files (Corrida, Ciclismo, Viagem, Triathlon) continue importing the same components — no changes needed there.

