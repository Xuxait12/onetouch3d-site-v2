

## Plano: Atualizar descrições das linhas 3 e 4 (imagens recém-adicionadas) na Galeria /corrida

Atualizar o campo `description` das 8 imagens das linhas 3 e 4 (índices 8–15) no array `galleryImages` em `src/components/GalleryCarouselCorrida.tsx`. As 8 imagens originais (linhas 1 e 2) permanecem inalteradas.

### Mudanças por posição

**Linha 3 (índices 8–11):**

| # | Imagem | Descrição atual | Nova descrição |
|---|---|---|---|
| 1 | berlin | Maratona de Berlim | **Caixa Alta 43x43cm** |
| 2 | boston | Maratona de Boston | **Caixa Alta 33x43cm** |
| 3 | chicago | Maratona de Chicago | **Caixa Alta 33x33cm** |
| 4 | disney | Disney Marathon | **Caixa Baixa 63x83cm** |

**Linha 4 (índices 12–15):**

| # | Imagem | Descrição atual | Nova descrição |
|---|---|---|---|
| 1 | lamision | La Mision | **Caixa Alta 33x43cm** |
| 2 | rrm | Rio do Rastro Marathon | **Caixa Alta 43x43cm** |
| 3 | poa | Maratona de Porto Alegre | **Caixa Alta 33x43cm** |
| 4 | poa2 | Maratona de Porto Alegre | **Caixa Baixa 33x43cm** |

### O que NÃO será alterado
- Caminhos das imagens (`gallery`, `popup`)
- Campos `alt`
- Imagens 1–8 (linhas 1 e 2 originais)
- Layout, grid responsivo, lightbox, animações
- Qualquer outro arquivo

### Responsividade
Sem alterações de layout. As descrições continuam exibidas no overlay de hover (desktop) e no lightbox (todos dispositivos) — comportamento já responsivo.

