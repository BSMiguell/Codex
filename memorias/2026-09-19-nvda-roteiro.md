---
name: memoria-nvda-roteiro-2026-09-19
description: Roteiro de teste manual NVDA criado (docs/roteiro-nvda-teste.md) — passos detalhados para execução após instalação manual do NVDA.
metadata:
  type: project
---

# Roteiro de teste manual NVDA (19/09/2026)

## O que foi feito

- Arquivo `docs/roteiro-nvda-teste.md` criado com 6 seções de passos manuais (Tab, skip-link, paleta `Ctrl+K`, modal, chips do mapa, conquistas/busca).
- Template de registro de resultados incluído (para evidência após execução com NVDA real).
- Critério de fechamento (`Gate E` 🟢) definido: todos os passos confirmados, 0 problemas críticos, `docs/nvda-teste.md` atualizado, `checklist-validado.md` (#13) marcado.
- Regra anti-regressão respeitada: se não concluir (sem NVDA real), registrar como 🟡 com causa documentada.

## Estado

- `docs/nvda-teste.md`: 🟡 — verificação manual confirmada; NVDA real ainda necessário.
- `docs/roteiro-nvda-teste.md`: ✅ criado — pronto para execução após instalação manual (`C:\Program Files\NVDA\nvda.exe`).
- `check-nvda.mjs`: ✅ corrigido (sem `execSync` não usado) — verificação pós-instalação.

## Próximo passo

Executar `node check-nvda.mjs` após instalação manual do NVDA para confirmar a presença. Se `SIM`, seguir `docs/roteiro-nvda-teste.md` e registrar evidências em `docs/nvda-teste.md`. Se `NÃO`, manter como 🟡 (não mascarar).
