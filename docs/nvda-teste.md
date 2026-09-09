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

## Próximo passo para fechar #13
1. Executar NVDA real em máquina com Windows + NVDA atualizado.
2. Teste manual guiado: `Tab`/`Shift+Tab`, `Ctrl+K` (paleta), abrir modal, `ESC`/`Enter`, `skip-link`.
3. Atualizar este arquivo com resultados.
4. Marcar #13 como ✅ no checklist (se 0 problemas) ou listar correções.
