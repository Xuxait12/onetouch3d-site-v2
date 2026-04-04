

## Plano: Comprimir imagens WebP com Squoosh CLI

### O que sera feito
Executar o comando `npx @squoosh/cli` para recomprimir todas as imagens `.webp` do projeto na pasta `public/` com qualidade 75, reduzindo o tamanho dos arquivos sem perda visual significativa.

### Etapas

1. **Listar imagens WebP existentes** — identificar todos os arquivos `.webp` em `public/` e subpastas para confirmar o escopo.

2. **Executar compressao** — rodar o comando Squoosh com output na mesma pasta (`-d public/`), sobrescrevendo os arquivos originais:
   ```
   npx @squoosh/cli --webp '{"quality":75}' -d public/ public/images/*.webp
   ```
   Nota: o glob `public/**/*.webp` pode precisar ser expandido manualmente dependendo do shell. Sera feito por subpasta se necessario (`public/images/`, `public/logos/`, `public/logos-maratonas/`, etc.).

3. **Verificar resultado** — comparar tamanhos antes/depois para confirmar a reducao.

### Observacoes
- Nenhum codigo fonte sera alterado — apenas os arquivos de imagem serao recomprimidos.
- As imagens ja sao `.webp`, entao a compressao adicional depende da qualidade original. Se ja estiverem em qualidade <= 75, o ganho pode ser minimo.

