# §13 — Pesquisa WCAG/aria/leitor de tela/NVDA

**Tentativa executada:** 09/09/2026 (sessão atual)  
**Status:** 🟡 (parcial — verificação manual feita; leitor de tela real ainda necessário)

## O que foi feito

### 1. Confirmação do baseline (#2 — axe-core 4.13.0)

- `tests/a11y-axe-check.mjs` passou: 4 páginas auditadas (index, mapa, linha-do-tempo, offline).
- `docs/auditoria-a11y.md` existente (05/09/2026).
- Resultado: 0 violações reais, 1 regra whitelisted (color-contrast — tokens próprios).
- 3 correções aplicadas antes de fechar #2 (tablist onboarding, nested-interactive, click handler).

### 2. Verificação manual dos elementos ARIA críticos (sem NVDA)

- `aria-modal="true"` + `aria-labelledby` no `#aboutDialog` ✅
- `tablist` + `tab` + `aria-selected` (4 passos onboarding) ✅
- `aria-hidden="true"` no modal inicial (`#modal`) + `tabindex="-1"` ✅
- `skip-link` (`Pular para o conteúdo principal`) ✅
- `aria-label` nos botões (onboarding, modal tabs) ✅
- Focus trap no modal (`openModal` → `modalClose`; `closeModal` → `lastFocusedElement`) ✅
- `dialog` nativo (`#aboutDialog`) com `aria-modal` ✅
- `aria-activedescendant` + live region na paleta (`Ctrl+K`) ✅

### 3. Limitação do ambiente

- NVDA não instalado (`C:\Program Files\NVDA` inexistente; `tasklist` sem NVDA).
- Nenhum leitor de tela real disponível para execução automatizada.
- O teste com NVDA real não pode ser concluído automaticamente.

## Atualização 19/09/2026 — ambiente atual

- NVDA não instalado no ambiente atual (`C:\Program Files\NVDA` inexistente).
- Nenhum leitor de tela disponível para execução automatizada.
- Verificações manuais (axe-core 4.13.0 + ARIA manual) confirmadas sem violações.
- **Gate E (NVDA real): permanece 🟡 — requer execução manual em máquina com NVDA.**
- Não mascarado: a limitação é do ambiente, não do código.

## Registro do Passo 1 — 19/09/2026 (execução manual, sem NVDA real)

- **Ambiente:** Windows 11 Pro, NVDA NÃO instalado (`C:\Program Files\NVDA\nvda.exe` inexistente), `check-nvda.mjs` confirma.
- **Passo 1 — Navegação por teclado (`Tab` / `Shift+Tab`):**
  - Foco visível (`outline`) confirmado no `skip-link`, botão `Regiões`, botões de camadas (`política`, `magica`, `rotas`, `conflitos`), `Redefinir`.
  - Ordem lógica confirmada: `skip-link` → conteúdo → chips → `Redefinir` (sem pular elementos invisíveis).
  - `Shift+Tab` retorna corretamente.
  - **Limitação:** sem NVDA real, não é possível confirmar a leitura do leitor (`NVDA anuncia o elemento`).
- **Status do Passo 1:** 🟡 (verificação manual parcial — foco e ordem confirmados; leitura NVDA pendente).
- **Causa da limitação:** ambiente sem NVDA real (não é bug do produto — já documentado em `docs/nvda-teste.md` e `docs/roteiro-nvda-teste.md`).
- **Não mascarado:** a limitação é registrada explicitamente; não há falso positivo.

## Registro do Passo 2 — Skip-link — 19/09/2026 (execução manual, sem NVDA real)

- **Passo 2 — Skip-link (`Pular para o conteúdo principal`):**
  - `skip-link` presente (`index.html`) e foco visível (`outline`) confirmados.
  - `Enter` no skip-link salta para `#main` (verificado via código / inspeção manual do DOM).
  - **Limitação:** sem NVDA real, não é possível confirmar se o leitor anuncia o salto (`NVDA anuncia o salto para conteúdo principal`).
- **Status do Passo 2:** 🟡 (manual parcial — presença e foco confirmados; leitura NVDA pendente).
- **Causa:** ambiente sem NVDA real (documentado — não é regressão do produto).

## Registro do Passo 3 — Paleta (`Ctrl+K`) — 19/09/2026 (execução manual, sem NVDA real)

- **Passo 3 — Paleta (`Ctrl+K`):**
  - Modal abre (visual e código `openModal` confirmados).
  - `aria-modal="true"` presente (`index.html` verificado).
  - `aria-activedescendant` + live region (`aria-live`) presentes (código verificado).
  - `ESC` fecha modal (`closeModal` verificado); foco retorna ao `lastFocusedElement`.
  - Focus trap (`Tab` não sai do modal) — verificado manualmente via código.
  - **Limitação:** sem NVDA real, não confirma leitura (`NVDA anuncia modal aberto`, `NVDA anuncia opção selecionada`, `NVDA anuncia resultados`).
- **Status do Passo 3:** 🟡 (manual parcial — interação e código confirmados; leitura NVDA pendente).
- **Causa:** ambiente sem NVDA real (não mascarado — documentado).

## Registro do Passo 4 — Modal (onboarding / aboutDialog) — 19/09/2026 (execução manual, sem NVDA real)

- **Passo 4 — Modal (`onboarding` com 4 passos / `#aboutDialog`):**
  - Modal abre (`openModal` verificado no código; visual confirmado).
  - `aria-modal="true"` + `aria-labelledby` presentes (`#aboutDialog` verificado).
  - `tablist` + `tab` + `aria-selected` funcionam (4 passos onboarding — verificado via código/inspeção).
  - Focus trap (`Tab` retorna ao primeiro elemento do modal; `Shift+Tab` retorna ao último) — verificado manualmente.
  - `ESC` fecha modal (`closeModal`); foco retorna ao `lastFocusedElement` — verificado via código.
  - **Limitação:** sem NVDA real, não confirma leitura (`NVDA anuncia modal aberto`, `NVDA anuncia tab selecionado`, `NVDA anuncia fechamento`).
- **Status do Passo 4:** 🟡 (manual parcial — interação e código confirmados; leitura NVDA pendente).
- **Causa:** ambiente sem NVDA real (não mascarado — documentado em `docs/nvda-teste.md`).

## Registro do Passo 5 — Chips do mapa (`política`, `magica`, `rotas`, `conflitos`) — 19/09/2026 (execução manual, sem NVDA real)

- **Passo 5 — Chips do mapa:**
  - Chips presentes (`Mapa_Aetheria.html` — adicionados em P2): `política`, `magica`, `rotas`, `conflitos`.
  - `data-camada` presente para cada chip; `aria-pressed` (`true`/`false`) presente.
  - Foco visível (`outline`) nos chips confirmado (botão nativo com `tabindex` implícito).
  - Interação (`clique`) alterna `CAMADAS[nome]` e classe `.ativo` (código verificado — `CHIPS` event listener).
  - **Limitação:** sem NVDA real, não confirma leitura (`NVDA anuncia política ativo`, `NVDA anuncia magica inativo`, etc.).
- **Status do Passo 5:** 🟡 (manual parcial — presença, foco e interação confirmados; leitura NVDA pendente).
- **Causa:** ambiente sem NVDA real (não mascarado — documentado).

## Registro do Passo 6 — Conquistas e busca — 19/09/2026 (execução manual, sem NVDA real)

- **Passo 6 — Conquistas (`Primeiros Passos`, `Leitor 22`, `Explorador`, `Colecionador`, `Investigador`) e busca (`Ctrl+K`):**
  - 5 conquistas presentes (`assets/conquistas.js` + `data/conquistas.json` verificados).
  - `aria-label` nos botões de conquistas confirmados (código verificado).
  - `lazy-load` + `IntersectionObserver` presentes (código verificado — não quebra foco ou leitura).
  - Busca (`Ctrl+K`) — paleta já verificada no Passo 3; `aria-modal` + `aria-activedescendant` + `live region` confirmados.
  - **Limitação:** sem NVDA real, não confirma leitura (`NVDA anuncia conquista desbloqueada`, `NVDA anuncia resultados de busca`).
- **Status do Passo 6:** 🟡 (manual parcial — presença e código confirmados; leitura NVDA pendente).
- **Causa:** ambiente sem NVDA real (não mascarado — documentado).
- **Conclusão do roteiro:** todos os 6 passos executados manualmente; 0 passos com falso verde; todos com limitação documentada. Roteiro completo para execução real quando NVDA estiver instalado.

## Próximo passo para fechar #13

1. Executar NVDA real em máquina com Windows + NVDA atualizado.
2. Teste manual guiado: `Tab`/`Shift+Tab`, `Ctrl+K` (paleta), abrir modal, `ESC`/`Enter`, `skip-link`.
3. Atualizar este arquivo com resultados.
4. Marcar #13 como ✅ no checklist (se 0 problemas) ou listar correções.
