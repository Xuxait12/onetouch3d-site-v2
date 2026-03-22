
Objetivo: corrigir de forma robusta a seção “Por que escolher nossos quadros?” nas 4 modalidades para que clique, imagem, texto e estado visual ativo funcionem tanto no preview quanto na produção.

1. Confirmar a origem do problema
- O código atual do repositório já tem `activeTab`, `onClick={() => setActiveTab(tab.id)}`, `activeContent` e classes condicionais.
- Como a produção em `onetouch3d.com.br` foi reproduzida com falha, o cenário mais provável é:
  - bundle publicado desatualizado em relação ao repo atual, ou
  - implementação atual estar frágil o suficiente para falhar em produção apesar de parecer correta localmente.

2. Endurecer a implementação dos 4 componentes
- Arquivos:
  - `src/components/WhyChooseUsTabsCorrida.tsx`
  - `src/components/WhyChooseUsTabsCiclismo.tsx`
  - `src/components/WhyChooseUsTabsViagem.tsx`
  - `src/components/WhyChooseUsTabsTriathlon.tsx`
- Refatorar para uma estrutura mais explícita e menos sujeita a inconsistência:
  - derivar `activeContent` com fallback garantido para a aba 1
  - extrair um handler `handleTabChange(tabId)` para centralizar `setActiveTab`
  - aplicar estado ativo de forma inequívoca no botão (`aria-selected`, texto ativo e pill)
  - manter a transição existente (`transition-colors duration-300`)
  - manter troca de imagem e texto diretamente ligada ao `activeTab`

3. Corrigir possíveis fragilidades visuais/estruturais
- Tornar o container das tabs semanticamente mais claro:
  - wrapper com `role="tablist"`
  - cada botão com `type="button"`
- Garantir que o pill animado não interfira com clique nem mascaramento visual.
- Revisar posicionamento absoluto do pill para evitar desalinhamento ou aparência de “sempre na primeira aba”.

4. Garantir atualização real do conteúdo
- Fazer a imagem depender claramente da aba ativa, inclusive com `key` consistente.
- Fazer o texto depender do mesmo objeto ativo.
- Preservar imagens mobile/desktop onde já existirem (Ciclismo e Triathlon).

5. Verificar integração nas páginas de modalidade
- Confirmar uso correto dos componentes em:
  - `src/pages/Corrida.tsx`
  - `src/pages/Ciclismo.tsx`
  - `src/pages/Viagem.tsx`
  - `src/pages/Triathlon.tsx`
- Não alterar layout das páginas, apenas o comportamento da seção.

6. Validação após implementação
- Testar em desktop e mobile:
  - clicar nas 3 abas em cada modalidade
  - confirmar mudança de imagem
  - confirmar mudança de texto
  - confirmar destaque visual da aba ativa
  - confirmar navegação por setas em telas menores
- Comparar preview e versão publicada para garantir paridade e evitar novo descompasso.

Detalhes técnicos
```text
Comportamento esperado por clique:
botão clicado
  -> setActiveTab(tab.id)
  -> activeContent recalculado
  -> img.src muda
  -> description muda
  -> botão ativo recebe classe ativa
  -> pill reposiciona
```

Resultado esperado
- Corrida, Ciclismo, Viagem e Triathlon passam a ter tabs realmente interativas e visualmente consistentes.
- A implementação fica mais resiliente, reduzindo risco de o bug reaparecer em produção.
