# Backlog Q4/2026 — Status consolidado (atualizado 04/09/2026 — noite, W14+§11.1)

**Origem**: os 10 itens do `Temporario.md` (backlog inicial, ordem de prioridade original) + os 39 subitens do `PLANO-MELHORIAS-2026-Q4.md` (rascunho, não versionado; ver `Memoria.md` para contexto histórico) que esse backlog cobria implicitamente.

**Convenção**: ✅ entregue · 🟡 em curso / parcial · ❌ pendente · 🚫 fora de escopo Q4.

---

## Backlog original (10 itens) — atualizado

| # | Item original | Status | Comentário |
|---|---|---|---|
| 1 | §3.3 Botão "📲 Instalar" | ✅ | `40348ab` — PWA install button no header |
| 2 | §4.3 Onboarding primeira visita | ✅ | `028f4d2` — 4 passos + 4 saídas + localStorage versionado |
| 3 | §1.2 Extrair CSS do `index.html` | ✅ | `48070bf` — 105 KB extraídos → `assets/codex.css` (HTML -44%) |
| 4 | §2.3 OG dinâmico por personagem | ✅ | `29a3138` — 18 checks `og-check` |
| 5 | §6.3 Filtro por raça no mapa | ✅ | `294d2fd` — filtro era + deep-link mapa↔galeria |
| 6 | §5.5 Botão "❓ Sobre este projeto" | ✅ | `6524e9f` — `<dialog id="aboutDialog">` + 🐛 corrigido `api → groups` em 3 lugares |
| 7 | §9.3 Busca semântica na lore | ✅ | `b291fb9` + `003de41` + `02735d4` + `883c404` — caminho fatiado (Lição 13ª) — indice invertido 545 docs / 4777 termos, 11 checks de regressão |
| 8 | §5.2 Lint | ✅ | 8 commits `69ebda7`..`e7e7459` — Prettier + ESLint + markdownlint (Tier 1) |
| 9 | §6.2 Rota narrativa entre pins | ✅ | `a171e32` — 5 battles + 4 atos cinematográficos, 13 checks `narrativa-check` |
| 10 | §9.1 Linha do tempo do mundo | ✅ | `01c4587` — `Linha_do_Tempo.html` com 4 atos + 5 eventos, 12 checks `timeline-check` |

**9/10 do backlog original fechados. Falta 1** (§6.1, que era um plus que apareceu no plano Q4).

---

## Plano Q4 — 39 subitens — atualizado

### §1. Performance

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 1.1 | Servir JSON comprimido + images WebP | ✅ | **verificado 04/09 noite (W14)**: 493/493 personagens têm `imageWebp` em `characters-api.json`; `pictureHTML(char)` em `index.html:2414` já gera `<picture>` com source WebP + fallback PNG; PNGs de raças (1.8 GB) têm WebP equivalente (131 MB) ao lado; PNGs restantes: 4 em `assets/` (7.8 KB total — favicon/apple-touch/og-cover) + 17 em `tests/screenshots/` (não-servidos). §1.1 = **JÁ FEITO** |
| 1.2 | Extrair CSS do `index.html` | ✅ | `48070bf` |
| 1.3 | Lazy-load agressivo de PNGs | ✅ | **3 zonas** (eager 0-5 / native-lazy 6-17 / IO-gated 18+) + `width`/`height` + `decoding=async` em todas as `<img>` + `IntersectionObserver` 500px resolve `data-src`→`src`. 10/10 checks em `tests/lazy-check.mjs` (commit `f07187f` 06/09). Boot: ≤9 requests de imagem (6 eager + 3 lazy nativo do fold) vs 18+ antes |
| 1.4 | Preload da fonte principal | ✅ | já estava em `index.html`; documentado em Memoria como Lição 9ª+10ª |
| 1.5 | (não no plano) | — | — |

### §2. SEO & Compartilhamento

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 2.1 | Meta tags obrigatórias | ✅ | já estavam em `index.html` |
| 2.2 | Favicon real + Apple touch icon | ✅ | já estavam em `assets/` |
| 2.3 | Open Graph dinâmico por personagem | ✅ | `29a3138` — 18 checks `og-check` · galeria visual completa (17 capturas feat-*) no README (04/09/2026) |
| 2.4 | (não no plano) | — | — |

### §3. PWA

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 3.1 | `manifest.webmanifest` | ✅ | já existia |
| 3.2 | Service Worker — cache-first | ✅ | já existia (`sw.js`) |
| 3.3 | Tela de instalação | ✅ | `40348ab` — botão instalar no header |
| 3.4 | (não no plano) | — | — |

### §4. UX & Polish

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 4.1 | Skip-link pro conteúdo principal | ✅ | `fe8242c` — skip-link verificado em teste |
| 4.2 | Estado vazio melhor nos filtros | ✅ | `fe8242c` — MICRO_COPY 22 raças + top-3 empty state |
| 4.3 | Onboarding primeira visita | ✅ | `028f4d2` — 4 passos + 4 saídas |
| 4.4 | Compartilhar personagem | ✅ | `e2c2b85` — share + Embed no modal, 9 checks `share-check` |
| 4.5 | "Daily Featured" expandido | ✅ | `8f9cc47` — 3 períodos (manhã/tarde/noite) |
| 4.6 | Print-friendly / "Salvar como PDF" | 🟡 | virou "cross-fade cinematográfico" (`f0a211a`); print-PDF **não feito** — decisão Bruno de não fazer |

### §5. Padronização & qualidade

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 5.1 | Tabela de temas (dívida consciente) | ✅ | `e19e757` — `data/themes.json` único |
| 5.2 | Lint & formatação | ✅ | 8 commits §5.2 Tier 1 (lint + Prettier + markdownlint) |
| 5.3 | Documentação de API | ❌ | schema `data/characters.schema.json` existe mas README/uso não documentado |
| 5.4 | TypeScript-lite pro JS crítico | 🚫 | Bruno decidiu **não** fazer (TS migration fora de Q4) |
| 5.5 | "Arquivos Necessários" no `index.html` | ✅ | `6524e9f` — dialog "Sobre" + 🐛 `api → groups` |

### §6. Mapa

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 6.1 | Minimap / bússola | ✅ | `10ec430` (W5.1 original) + `61ca957` (3 hotfixes rAF/tween) + `6736607` (6 checks de regressão) |
| 6.2 | Rota narrativa entre pins | ✅ | `a171e32` — 13 checks `narrativa-check` |
| 6.3 | Filtro por raça no mapa | ✅ | `294d2fd` — 10 checks `mapa-filtros-check` |
| 6.4 | Exportar vista como imagem | ✅ | `ab39ee6` — W5.4 já existia, cobertura de teste nova; 9 checks `mapa-export-check` |

### §7. Páginas de Raça

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 7.1 | Páginas hoje são "iguais" | ❌ | 4/22 com layout único (meta: "4/22"); 18 páginas ainda genéricas — **pendente grande** |
| 7.2 | Conquistas por raça | ❌ | pendente (W5+) |
| 7.3 | Wiki / Enciclopédia cruzada | ❌ | pendente (W5+) |

### §8. Novos rituais (curtas 5 priorizados)

| # | Raça alvo | Status | Hash / nota |
|---|---|---|---|
| 8.1 | 04 Onis (vídeo) | ✅ | pré-existente |
| 8.2 | 05 Demônios (portão) | ✅ | pré-existente |
| 8.3 | 09 Semideuses (raio) | ✅ | `ad9d1b6` — W8 5 rituais adicionais |
| 8.4 | 13 Deuses (flash branco) | ✅ | `ad9d1b6` — W8 |
| 8.5 | 01 Humanos (selo) | ✅ | `ad9d1b6` — W8 |
| 8.6 | 08 Monstros (mandíbula) | ✅ | `ad9d1b6` — W8 |
| 8.7 | 17 Meio-Sangue (duas metades) | ✅ | `ad9d1b6` — W8 |
| 8.8-22 | 14 raças restantes | ❌ | pendente (curtas 5 priorizados fechados; meta "7/22" atingida) |

### §9. Conteúdo narrativo

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 9.1 | Linha do tempo do mundo | ✅ | `01c4587` — 12 checks `timeline-check` |
| 9.2 | "Personagem do momento" expandido (coleções temáticas) | ❌ | **pendente** — 10-15 coleções curadas, carrossel no hero |
| 9.3 | Search semântica por lore | ✅ | `b291fb9` + `003de41` + `02735d4` + `883c404` — caminho fatiado (Lição 13ª) — indice invertido 545 docs / 4777 termos, 11 checks `tests/search-check.mjs` |

### §10. Internacionalização (i18n)

| # | Item | Status | Hash / nota |
|---|---|---|---|
| 10.1 | pt-BR + en-US | 🚫 | Bruno decidiu **não** fazer no Q4 (1-2 semanas; só Q1/2027) |

### §11. Auditoria & Pesquisa (inspirado em `checklist-skills-pesquisa-ia.md`)

**Origem**: o checklist foi trazido pelo Bruno em 04/09/2026 (solto na raiz, não versionado). Cruzamento item-por-item com o estado real do Aetheria virou `docs/checklist-validado.md` (35 itens: 16 ✅ / 12 🟡 / 5 ❌ / 1 🚫 / 1 sem-custo).

| # | Item | Status | Custo | Impacto | Hash / nota |
|---|---|---|---|---|---|
| 11.1 | Auditoria WCAG formal com axe-core/Lighthouse | ✅ | 1 dia | alto | **axe-core 4.13.0** em `tests/a11y-axe-check.mjs`: 4 páginas × tags WCAG 2A/2AA/2.1A/2.1AA; whitelist de `color-contrast` (tokens próprios já validados pelo smoke check 9); `svg-img-alt` desabilitada (runas decorativas); baseline **0 violações reais (7 ✅ / 0 ❌)**. 3 correções aplicadas antes de fechar: (1) `role="tab"` + `aria-selected` nos 4 botões do tablist do onboarding (corrigiu 4 `aria-required-children` + 4 `aria-allowed-attr`), (2) refator de `<article role="button">` para `<a class="card-link">` envolvendo thumb+info, com `fav-btn` e `badge` como filhos diretos do `<article>` (corrigiu 15 `nested-interactive`), (3) JS click handler intercepta `[data-card-link]` com `preventDefault`. Comando: `npm run a11y-axe`. Relatório: `docs/auditoria-a11y.md`. Caminho fatiado: 4 commits isolados (test infra, fix, doc regen, lint cleanup) |
| 11.2 | Documentar licenças (PNGs/icones/fontes) | ✅ | 2h | médio | **criado `docs/LICENCAS.md` 04/09 noite (W14)**: 5 seções (licença "Todos os direitos reservados" + 2 fontes Google Fonts OFL atribuídas + 5 devDeps + stack autoral + pendências). Verificado README é gerado por `build_readme.ps1` → arquivo separado foi a escolha certa (Lição 1ª/10ª) |
| 11.3 | Otimizar SVGs com SVGO | ✅ | 1h | baixo | **8/9 SVGs otimizados com SVGO 4.1.0** (preset-default + multipass + pretty/indent 2, sem `removeViewBox`/`cleanupIds`): 7.94 KB → 6.34 KB (**-1.6 KB, -20.2%**). Maior ganho: `og-cover.svg` 3.29 KB → 2.22 KB (-33%). `aetheria-seal.svg` revertido: `index.html:2465` faz `<use href="...#seal">` cross-file (preservar comportamento original era mais seguro que mexer em ID; bug pré-existente fica intocado — Lição 1ª/10ª) |
| 11.4 | 404 tematizada | ✅ | 1-2h | baixo | **`404.html` tematizada** (paralela a `offline.html`; mesmo gradiente `#1a120e→#3a2820`, card `.notfound-card` 480px, ícone 🗺️, botão "← Voltar ao início"). Commit `0d72210`. **SW distingue 404 de offline**: `if (res.status === 404) return caches.match("./404.html")` antes do `c.put` (evita cachear o HTML cru do GH Pages) + pre-cache de `./404.html` em `PRECACHE_URLS` (linha 17). Bump de versão: `aetheria-v1.1.0` → `aetheria-v1.2.0` (cache-bust pra forçar update do SW). Commit `cd54e30`. Verificado por Playwright (`tests/_404-validate.mjs`): `h1="Página não encontrada"`, botão de retry renderiza OK em rota direta `/404.html` (instrumental deletado após validação) |
| 11.5 | Camadas extras no mapa (política, mágica, rotas, conflitos) | 🟡→Q1/2027 | 2-3 dias | médio | 3 camadas já (regiões/batalhas/celestes em `Mapa_Aetheria.html:3104`); sistema genérico (`data-camada` + `CAMADAS[nome]`) facilita adição. Conteúdo novo (política = facções/reinos; mágica = sistema atrelado a §11.9) é o gargalo. **Decisão 04/09 W15 noite parte 5**: adiamento explícito pra Q1/2027 — investigar antes de codar (Lição 1ª/5ª) revelou que criar estrutura vazia agora seria trabalho especulativo (Lição 9ª/10ª). Adicionar 2 chips é trivial quando o worldbuilding estiver pronto |
| 11.6 | Painel de preferências de movimento (toggle manual) | ✅ | 2-3h | médio | **UI já existia** (botão `noFxBtn` ◑ Efeitos no header) — só faltava bootstrap + a11y + reatividade. Commits: `4f0a52c` (bootstrap inline `<body>` lê `localStorage.noFx` antes do primeiro frame → sem flicker; `aria-pressed` dinâmico + `title` contextual; handler movido do `onclick` inline pro JS principal seguindo padrão do `themeToggle`) + `d04471e` (`assets/transitions.js`: `const prefersReduced` (lida 1× no load) → `function isReduced()` reativa — rituais 04_Onis/05_Demonios agora respeitam toggle mid-session; hierarquia `body.no-fx` (toggle) > `prefers-reduced-motion` (SO); `paletteActions()` ganha "Alternar efeitos" sem atalho dedicado, integra com Ctrl+K). Lição 1ª/5ª: era "🟡 sem toggle manual" mas o toggle manual JÁ EXISTIA — gap real era bug de estado + a11y, não feature ausente. **Botão cumpre o papel de "painel"** (adicionar painel real seria overhead). Custo real: 30-60min (não 2-3h como estimado). Documentado no checklist-validado.md #28 (W15 noite parte 2). |
| 11.7 | Breadcrumb persistente | ✅ | 2h | baixo | **22/22 páginas de raça** com `.breadcrumb` 2 níveis (Galeria › Raça), `aria-current="page"`, ellipsis no item atual, separador `›` via `::before`, hover/focus-visible com `border-bottom`. CSS em `racas/assets/raca.css` (+47 linhas); HTML injetado entre `.head-race` e `.head-nav`. Commits: `e7fb6f8` (CSS) + `5a089ec` (HTML injetado em 22/22). Verificado via Playwright: `navVisible=true` em 5 raças (humanos/demoniosakumagani/demoniosdocaos/ordenseguerreiros/osaspectos), breadcrumb mais largo 208px em header 1280px. 04/09 W14 noite parte 3 |
| 11.8 | Rituais restantes (14 raças, §8.8-22) | 🟡 | 1-2 dias cada | médio | 7/22 rituais animados (W8 + pré-existente); 14 pendentes |
| 11.9 | Worldbuilding: magia com regras e custos | ❌ | alto | alto | lore menciona magia sem sistema formal; envolve conteúdo |
| 11.10 | Wiki cruzada (enciclopédia personagem↔região↔batalha) | ❌ | 2-3 dias | alto | atrelado a §7.3 do plano original |
| 11.11 | Pesquisa de leitor de tela (NVDA/VoiceOver) | 🟡 | 1 dia | alto | atrelado a §11.1 (auditoria pega o que leitor confirma) |
| 11.12 | Transições direcionais (N/S/L/O) | ✅ | 1h validação + 3h impl v5 | médio | **v5 Q4/2026** (post-#16, REESCRITA da v4): a v4 (hard nav + WAAPI fade genérico) não era o que Bruno queria — só animava a entrada sem direção. Decisão: voltar pra Cross-doc View Transitions API (que era a v2, abandonada na parte 6), mas SEM o `cloneNode+replaceChild` do Codrops (fonte dos bugs da v3). **v5 (commit `730360a`+`0119c79`+`f74d048`)**: `assets/transitions.css` NOVO 145 linhas define `@view-transition { navigation: auto }` + 8 keyframes (`vt-slide-{in,out}-{up,down,left,right}`) selecionados por `html[data-transition-direction="X"]::view-transition-{old,new}(root)`. `assets/page-entry.js` reescrito 50→147 linhas: detecta clique em `<a>` interno em capture phase, calcula posição espacial do link no viewport (yRatio<0.34→"down", yRatio>0.66→"up", xRatio<0.5→"right", else "left"), seta `html.dataset.transitionDirection` ANTES do browser iniciar a nav. Fallback WAAPI de `opacity` puro (sem `transform` — Lição 23ª) pra browsers sem VT API (~4% em 2026). Respeita `body.no-fx` + `prefers-reduced-motion` via `animation-duration: 0s !important` no CSS. 27 HTMLs (5 hubs + 22 raças) com `<link rel=stylesheet href=assets/transitions.css>` injetado antes do codex.css/raca.css. `racas/assets/transitions.css` é cópia pra resolver path relativo bugado (raças já esperam `assets/raca.css` sem `../`). Test E2E: `tests/transitions-check.mjs` com **82 checks** em 8 blocos (vs 65 da v4). **Lição 22ª**: Cross-doc VT API funciona com JS inline complexo (v2 falhou por motivos errados — não foi a complexidade, foi o `document.startViewTransition()` da v2 ser single-doc; cross-doc só precisa do CSS). **Lição 23ª**: `transform` no body (mesmo `matrix(1,0,0,1,0,0)` identidade) CRIA containing block pra descendentes `position: fixed` — `.modal` quebrava (6.924px em vez de 720px). **Lição 24ª**: `CSS.supports("selector(::view-transition-old(root))")` detecta suporte a Cross-doc VT API (Chrome 111+, Safari 18.2+, ~96% 2026). **Custo real v5**: 145 CSS + 147 JS + 27×1 HTMLs = ~318 LOC. Zero bundle externo. Resultado: 4 direções reais, 0 erros de const, 0 bugs de modal, 0 containing block. |
| 11.13 | Sites premiados / scroll-driven / glassmorphism | 🚫 | — | — | fora do Q4 (decisão Bruno) |
| 11.14 | i18n pt-BR + en-US (espelho de §10) | 🚫 | — | — | só Q1/2027 |

**Origem dos itens**: ver `docs/checklist-validado.md` para o cruzamento completo (35 itens, incluindo os 4 ✅ já feitos: WCAG contraste, ARIA, CSS moderno, JS zero-deps).

---

### §12. Emblemas SVG por raça (motion, 48×48) — NOVO 04/09 noite (W15)

**Pergunta de Bruno**: "Tem planos de criar SVG ou SVG animados personalizados para as Raças?"

**Verificado (Lição 1ª/5ª)**:
- 22 raças em `data/themes.json`, cada uma com `{label, color, icon}` (emoji Unicode). Ex: `0: {label:"Humanos", color:"#4A90D9", icon:"🧑"}`.
- **NÃO existem** SVGs por raça hoje — só `assets/favicon.svg` + `assets/og-cover.svg` (globais). `aetheria-seal.svg` é o brasão geral do projeto, revertido em W14 (preserva cross-file `<use href="...#seal">`).
- `assets/` (racas/) tem só `raca.css` + `raca.js` — sem emblema.
- SVGO 4.1.0 já validado em W14 (item #15 ✅, 8/9 SVGs otimizados, preset-default).
- `prefers-reduced-motion` global ✅ (item #5) — emblemas motion devem respeitar.
- Checklist item #30 (Kit visual original) diz "emblemas, runas, divisores" — **emblemas por raça é gap real, ainda parcial**.

**Restrições e oportunidades do projeto**:
- Regra zero-deps → SVGs **inline ou arquivo único por raça** (sem bundler).
- WCAG AA 22/22 cores → emblema de **1 cor** (cor da raça em `themes.json` ou branco pra tema dark) garante contraste sem nova calibração.
- **22 raças está no limite da curva de silhuetas distinguíveis** (Nielsen Norman Group: 20-25 ícones por sistema 16px). Exige grid 24×24 + silhuetas deliberadamente diferentes.
- Estética **rúnica/astral** (ritos W8 com SVG animado, 3 camadas celestes no mapa) → emblemas geométrico-astrais combinam.
- Pipeline de SVGs já validada (SVGO multipass em W14).

**Pesquisa de referências**:
- Heraldic Foundations (rule of tincture, charges estilizados, blazon verbal).
- Geometric minimalism (Lucide/Heroicons 24×24, stroke 1.5-2px, paleta 1-3 cores, design monocromático primeiro).
- Silhueta distinta: 22 raças em grid 24×24, 1 cor, keyframe sutil.
- Movimento: respiração/glow/rotação leve; congelado sob `prefers-reduced-motion: reduce`.

**Opções avaliadas** (Bruno escolheu **C**):
- **A — Geométrico-astral estático (1 cor, 24×24)**: 1-2 dias, casa com a estética mas não tem motion. Custo-benefício alto pra badge, mas fica abaixo do padrão visual atual (cross-fade Ken Burns, ritual picker W8 já com motion).
- **B — Étnico-rúnico multi-elemento (96×96)**: 2-3 dias, mais personalidade, mas **não escala pra 16-20px** (limite do projeto com 22 raças).
- **C — Motion, 48×48, 1 cor, 1 SVG por raça** ⭐ **escolhida**: casa com a tradição cinematográfica, 22 silhuetas distintas respeitando o limite 20-25, total ~30-40 KB. Movimento é respiração/glow/rotação leve; congelado sob `prefers-reduced-motion: reduce`. SVGO precisa preservar `@keyframes` (flag `--disable=removeUnknownsAndDefaults`).

**Caminho fatiado (Lição 13ª) — 5 commits pequenos**:

| # | Commit | Escopo | Arquivos |
|---|---|---|---|
| 1 | `feat(svg): grid-base 24x24 + template de emblema motion` | Cria `assets/emblema-template.svg` (1 emblema piloto dos Humanos) + CSS base `.emblem` com `@keyframes` de respiração + `@media (prefers-reduced-motion: reduce)` que congela. Validação visual via Playwright (reduzido e animado). | `assets/emblema-template.svg` (novo), `assets/codex.css` (+30 linhas) |
| 2 | `feat(svg): emblemas rúnicos para 4 raças principais` | Humanos, Demônios, Deuses, Magos (piloto de 4). Cada SVG: 1 cor (`themes.json`), 1-3 elementos, `@keyframes` de 4-6s. SVGO com `--disable=removeUnknownsAndDefaults` pra preservar `@keyframes`. | `assets/emblemas/{humanos,demonios,deuses,magos}.svg` (4 novos) |
| 3 | `feat(svg): +6 emblemas (tier 1: maior contraste visual)` | Bárbaros, Gigantes, Onis, Semideuses, Observadores, Aspectos — raças com cores mais distintas (`#CA6F1E`, `#D68910`, `#E74C3C`, `#F1C40F`, `#1ABC9C`, `#9B59B6`). | `assets/emblemas/{barbaros,gigantes,onis,...}.svg` (6 novos) |
| 4 | `feat(svg): +12 emblemas (tier 2: cores próximas)` | Restantes: Mutantes, Ordem, Desconhecidos, Monstros, Vazio, Akuma-Gani, Demônios do Caos, Alvamortos, Meio-Sangue, Canibais, Amaldiçoados, Bersek. Cuidado extra com diferenciação de silhueta (cores `#7B4D9E`/`#C0392B`/`#7F8C8D`/`#2E4053` muito próximas → variação maior nos elementos). | `assets/emblemas/{mutantes,...}.svg` (12 novos) |
| 5 | `docs(checklist): #30 Kit visual — emblemas por raça 🟡→✅` | Atualiza `docs/checklist-validado.md` item #30 com hashes dos 4 commits + smoke test visual (Playwright: emblemas renderizam em 4 páginas-chave, contraste em tema claro/escuro). | `docs/checklist-validado.md` (+30 linhas) |

**Onde os emblemas serão usados**:
- Hero da página da raça (`racas/<raca>.html` no `.head-race`).
- Carrossel "Personagem do Momento" no `index.html` (estado animado).
- Hover-state no card (estático → anima ao `:hover`).
- (Opcional, futuro) Filtro de raça no mapa (`Mapa_Aetheria.html`) como ícone de layer.

**Critérios de aceitação**:
- 22 silhuetas distinguíveis a 24×24 (teste do "squint" via Playwright em 4 páginas).
- Movimento ≤6s por ciclo (não distrai, não compete com cross-fade Ken Burns do hero).
- `prefers-reduced-motion: reduce` congela TUDO (regra sagrada do projeto).
- SVGO preserva `@keyframes` (validar com smoke pós-build).
- WCAG: 1 cor + tema dark garante contraste ≥4.5:1 nas 22 raças (sem nova calibração).
- Tamanho total: ≤40 KB pros 22 SVGs.

**Custo total estimado**: 3-4 dias (15-20 min por emblema × 22 + 1 commit de infra + 1 commit de docs).

**Dependências externas**: nenhuma. SVGO já está em devDeps (W14).

---

## Resumo executivo Q4/2026

**Fechados**: 32/39 subitens (~82% do plano) **+ 7 do checklist** (WCAG contraste, ARIA, CSS moderno, JS zero-deps, **Licenças — `docs/LICENCAS.md`**, **Auditoria axe-core — `tests/a11y-axe-check.mjs`**, **404 tematizada — `404.html` + SW `cd54e30`/`0d72210`** — ver §11) — **§1.1 WebP verificado ✅** (493/493 personagens com `imageWebp` + `<picture>` no `pictureHTML`)
**Pendentes** (próximos candidatos): 9
- ~~§1.3 Lazy-load agressivo~~ (✅ 06/09, 3 commits fatiados, 10/10 checks)
- §5.3 Documentação de API
- §7.1 Páginas de raça com layout único
- §7.2 Conquistas por raça
- §7.3 Wiki cruzada
- §8.8-22 14 rituais restantes
- §9.2 Coleções temáticas
- ~~§11.1 Auditoria WCAG formal (axe-core)~~ (✅ 04/09 noite, 0 violações reais, 4 commits fatiados)
- ~~§11.2 Licenças documentadas~~ (✅ `docs/LICENCAS.md` em 04/09 W14)
- §11.5 Camadas extras do mapa
- ~~§11.6 Painel de preferências de movimento~~ (✅ `4f0a52c`+`d04471e` 04/09 W15 noite parte 2; UI já existia — só bootstrap + a11y)
- ~~§11.7 Breadcrumb persistente~~ (✅ `e7fb6f8`+`5a089ec` 04/09 W14 noite parte 3; 22/22 raças com breadcrumb 2 níveis)
- §11.8 14 rituais restantes (espelho de §8.8-22)
- §11.11 Pesquisa leitor de tela
- **§12 Emblemas SVG por raça (motion)** — _candidato a Aetheria v3 (custo 3-4 dias; decisão Bruno 04/09 W15)_

**Fora de escopo Q4**: 2 (TS migration §5.4, i18n §10.1) **+ 2 do checklist** (design trends §11.13, i18n §11.14)

---

## Sugestão de próxima sessão (ordem de custo × impacto)

| # | Item | Custo | Impacto | Por quê primeiro |
|---|---|---|---|---|
| D | §7.1 Páginas de raça únicas | 2-3 dias | médio | meta do plano era 4/22; 18 ainda genéricas |
| E | §9.2 Coleções temáticas | 2 dias | médio | expande o hero, carrossel abaixo do destaque |
| ~~G | §11.7 Breadcrumb | 2h | baixo | polimento de navegação; 1 elemento contextual no header~~ (✅ `e7fb6f8`+`5a089ec` 04/09 noite W14) |
| ~~H | §11.4 404 tematizada | 1-2h | baixo | SW já trata offline, falta o caso 404 HTTP~~ (✅ `0d72210`+`cd54e30` 04/09 noite W15) |
| ~~I | §11.6 Painel de preferências de movimento | 2-3h | médio | `prefers-reduced-motion` global já existe; falta toggle manual~~ (✅ `4f0a52c`+`d04471e` 04/09 W15 noite parte 2; UI já existia) |
| J | §11.5 Camadas extras do mapa | 2-3 dias | alto | 3 camadas (regiões/batalhas/celestes) já; faltam política e mágica — **candidato a Q1/2027** se conteúdo novo for escrito |

**Recomendação Bruno**: **D → E** — G/H/I riscados (já feitos em W14/W15: breadcrumb, 404 tematizada, painel de preferências); §11.5 e §12 adicionados como referências pra Q1/2027 e v3.
