
**Alteração da Posição da Seção "Compartilhe Essa Energia"**

A seção "Compartilhe Essa Energia" será movida para baixo da seção "Nossa Loja" (produtos) e logo acima da seção "Perguntas Frequentes" (FAQ) em todas as páginas das modalidades.

**Arquivos a serem modificados:**
1. `src/pages/Corrida.tsx`
2. `src/pages/Triathlon.tsx`
3. `src/pages/Viagem.tsx`
4. `src/pages/Ciclismo.tsx`

**Detalhes Técnicos:**
* Em cada um desses arquivos, vou localizar o componente de compartilhamento (`<ShareSectionCorrida />`, `<ShareSection />`, `<ShareSectionViagem />`, `<ShareSectionCiclismo />`) e movê-lo para logo após o componente da loja (`<ProductSection*Local />`) e antes do componente do FAQ (`<FAQSection* />`).
