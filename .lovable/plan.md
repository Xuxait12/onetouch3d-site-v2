

## Plano: Responsividade de imagens e botão em `HeroSectionCampanha`

Adicionar detecção de viewport ao componente `src/components/HeroSectionCampanha.tsx` para trocar imagem de fundo e posição do botão WhatsApp por breakpoint.

### Mudanças no arquivo `src/components/HeroSectionCampanha.tsx`

**1. Tipo `Campanha` local (estende o do hook)**
Como o hook `useCampanhaAtiva` ainda não exporta os novos campos, declarar localmente uma interface estendida apenas para uso do componente:
```ts
interface CampanhaResponsiva extends Campanha {
  foto_background_tablet?: string | null;
  foto_background_mobile?: string | null;
}
```
A prop passa a aceitar `CampanhaResponsiva`.

**2. Hook interno de breakpoint**
Dentro do componente, usar `useState` + `useEffect` com listener de `resize`:
```ts
type Device = "mobile" | "tablet" | "desktop";

const getDevice = (): Device => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

const [device, setDevice] = useState<Device>(getDevice);

useEffect(() => {
  const onResize = () => setDevice(getDevice());
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
```

**3. Seleção da imagem com fallback para desktop**
```ts
const bgSrc =
  device === "mobile"
    ? campanha.foto_background_mobile || campanha.foto_background
    : device === "tablet"
    ? campanha.foto_background_tablet || campanha.foto_background
    : campanha.foto_background;
```
Usar `bgSrc` no `src` da `<img>`.

**4. Posicionamento responsivo do botão WhatsApp**
```ts
const buttonPositionClass =
  device === "mobile"
    ? "top-[60%] left-1/2 -translate-x-1/2"
    : device === "tablet"
    ? "top-[55%] left-[12%]"
    : "top-[58%] left-[18%]";
```
Aplicar no `className` do `<a>`, substituindo o atual `top-[58%] left-[18%]` fixo, mantendo todas as outras classes (`absolute`, cores, padding, `z-10`, etc).

### O que NÃO será alterado
- `useCampanhaAtiva.tsx` (tipo do hook permanece; estensão é local ao componente)
- Tabela `campanhas` no Supabase
- `Corrida.tsx` ou qualquer outro arquivo

### Arquivos afetados
- **Editado:** `src/components/HeroSectionCampanha.tsx`

