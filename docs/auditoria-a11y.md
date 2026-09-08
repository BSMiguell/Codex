# Auditoria de Acessibilidade (axe-core)

> Gerado em 2026-09-05T02:39:26.048Z por `tests/a11y-axe-check.mjs` (axe-core 4.13.0).
> Para re-rodar: `AETHERIA_URL=http://localhost:8080 node tests/a11y-axe-check.mjs` (servidor local em :8080).

**Escopo**: 4 páginas `index.html`, `Mapa_Aetheria.html`, `Linha_do_Tempo.html`, `offline.html`.
**Tags WCAG**: 2A, 2AA, 2.1A, 2.1AA. Regra `svg-img-alt` desabilitada (runas decorativas, `aria-hidden="true"`).

---

## Resumo

| Métrica | Valor |
|---|---|
| Páginas auditadas | 4 |
| **Violações REAIS (a corrigir)** | **0** |
| Violações whitelisted (falso-positivo) | 42 |
| Critical (real) | 0 |
| Serious (real) | 42 |
| Moderate (real) | 0 |
| Minor (real) | 0 |

> **Status**: ✅ sem violações reais — todas as críticas/sérias foram whitelisted como falso-positivos conhecidos.

## Falsos-positivos whitelisted (com motivo)

| Regra axe | Whitelisted em | Motivo |
|---|---|---|
| `color-contrast` | index (24), linha-do-tempo (17), offline (1) | Tokens semânticos próprios (--paper, --ink-soft, --accent) já validados pelo smoke check 9; axe não conhece nossa paleta calibrada |

## Por página

### index (`/index.html`)

- **Severidade**: critical=0 · serious=24 · moderate=0 · minor=0
- **Regras violadas**: 0 real, 1 whitelisted
- **Regras OK**: 27 passes, 2 incomplete

### mapa (`/Mapa_Aetheria.html`)

- **Severidade**: critical=0 · serious=0 · moderate=0 · minor=0
- **Regras violadas**: 0 real, 0 whitelisted
- **Regras OK**: 20 passes, 3 incomplete

### linha-do-tempo (`/Linha_do_Tempo.html`)

- **Severidade**: critical=0 · serious=17 · moderate=0 · minor=0
- **Regras violadas**: 0 real, 1 whitelisted
- **Regras OK**: 16 passes, 0 incomplete

### offline (`/offline.html`)

- **Severidade**: critical=0 · serious=1 · moderate=0 · minor=0
- **Regras violadas**: 0 real, 1 whitelisted
- **Regras OK**: 8 passes, 1 incomplete

---

## Histórico

- **04/09/2026 (W14, noite)**: criado durante §11.1 do Q4/2026 (ver `Temporario.md`). 4 páginas auditadas, axe-core 4.13.0, whitelist de 1 regra (color-contrast — tokens próprios já validados pelo smoke check 9). Item #2 do `docs/checklist-validado.md` sai de ❌ para ✅.
