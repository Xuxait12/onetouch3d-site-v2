

## Ajuste no fluxo pos-PIX da /confirmacao-whatsapp

### O que muda

Atualmente, ao clicar "Fechar" no modal de sucesso (QR Code PIX), o sistema faz logout e redireciona para a home (`/`). A mudanca e:

1. **Remover o redirect para home** -- o usuario permanece na pagina `/confirmacao-whatsapp`
2. **Novo estado "agradecimento"** -- ao clicar "Fechar", o modal fecha e a pagina exibe um estado de agradecimento (nao mais a tela de auth)
3. **Conteudo do estado de agradecimento**:
   - Logo OneTouch3D no topo
   - Mensagem "Muito obrigado! :)" (emoji)
   - Botao (1): "Ver QR Code / PIX novamente" -- reabre o modal no estado de sucesso (QR Code + instrucoes)
   - Botao (2): "Copiar chave PIX" -- copia `54999921515` para o clipboard
4. **No modal reaberto**: remover o botao "Fechar" e deixar apenas o X no canto superior direito para fechar

### Detalhes tecnicos

**Arquivo**: `src/pages/ConfirmacaoWhatsapp.tsx`

**Mudancas**:

- Adicionar novo estado `showThankYou` (boolean, default false)
- Quando o usuario clica "Fechar" no modal de sucesso (linhas 738-768): em vez de fazer logout + navigate, apenas fechar o modal (`setShowModal(false)`) e ativar `setShowThankYou(true)`. Manter o usuario logado.
- Na condicao de renderizacao principal (linha 495), adicionar um terceiro estado: se `showThankYou === true`, renderizar o card de agradecimento em vez do card de auth
- No card de agradecimento:
  - Logo `onetouchLogo` no topo
  - Texto "Muito obrigado! :)"
  - Botao "Ver QR Code / PIX novamente" que faz `setShowModal(true)` (modal ja esta no estado `showSuccess`)
  - Botao "Copiar chave PIX" que usa `navigator.clipboard.writeText(PIX_KEY)` + toast
- No modal de sucesso reaberto via "Ver QR Code / PIX novamente": remover o botao "Fechar" e restaurar o X do DialogContent (remover `[&>button]:hidden` quando em estado de agradecimento)

**Linhas afetadas**: ~30 linhas adicionadas/modificadas. Nenhuma mudanca estrutural.

