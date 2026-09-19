# Plano operacional — Aetheria Codex

**Atualizado:** 19/09/2026 — ciclo de estabilização concluído após CI #43
**HEAD de referência:** `f386a7ab5bef3d83d59dbc65e235ca1f3a799c24`
**Objetivo:** manter este arquivo como a fonte operacional do estado atual, dos gates, das prioridades e do próximo trabalho.

> **Regra de ouro:** estabilizar → validar → publicar → documentar → evoluir.
>
> **Ordem:** Dados → URLs/SEO → Cache/PWA → Testes/CI → Deploy → Features → Documentação/manutenção.

---

# 1. Estado atual — fotografia oficial

| Área | Estado | Situação comprovada |
|---|---:|---|
| Grupos/raças | 🟢 | **22** |
| Personagens | 🟢 | **487** |
| WebP | 🟢 | **487/487** |
| PNG fallback | 🟢 | legado/local, não versionado |
| Personagens sem imagem | 🟢 | **0** |
| `characters-api.json` | 🟢 | build + validação |
| `historia-api.json` | 🟢 | build + validação |
| URL oficial | 🟢 | `/Codex` |
| Service Worker | 🟢 | `v1.4.0` |
| Rituais | 🟢 | **22/22** |
| Conquistas | 🟢 | 5 implementadas |
| Wiki/cross-links | 🟢 | mapa integrado |
| Transições | 🟢 | **82/82** |
| Smoke test | 🟢 | **0 erros HTTP/console** |
| Lint JS | 🟢 | passou |
| Prettier | 🟢 | passou |
| Markdownlint | 🟢 | passou |
| URL/SEO | 🟢 | passou |
| GitHub Pages | 🟢 | deploy publicado |
| CI remoto | 🟢 | **CI #43 verde** |
| Sistema de magia | 🟡 | base criada, integração pendente |
| Camadas extras do mapa | 🟡 | política/mágica/rotas/conflitos pendentes |
| NVDA manual | 🟡 | documentação pronta, teste real pendente |

**Regra:** depois de novas alterações, um gate antigo só continua válido quando for novamente comprovado no HEAD atual.

---

# 2. GATE DE ESTABILIDADE

## Gate 0 — Fonte de verdade
**Estado:** 🟢 APROVADO

```text
[✓] 22 grupos
[✓] 487 personagens
[✓] characters-api.json como referência
[✓] 493 tratado somente como histórico
[✓] produção = /Codex
```

## Gate 1 — Dados e imagens
**Estado:** 🟢 APROVADO

```text
[✓] 487 WebP
[✓] imageWebp validado
[✓] fallback legado preservado
[✓] 0 personagem sem imagem
[✓] build da API
[✓] build da história
[✓] validate-api
```

## Gate 2 — URL e SEO
**Estado:** 🟢 APROVADO

```text
[✓] URLs públicas em /Codex
[✓] canonical
[✓] Open Graph
[✓] Twitter Card
[✓] sitemap
[✓] share/embed
[✓] url-check
```

## Gate 3 — PWA / cache / offline
**Estado:** 🟢 APROVADO

```text
[✓] Service Worker v1.4.0
[✓] precache atualizado
[✓] limpeza de caches antigos
[✓] network-first para navegação
[✓] cache-first para assets publicados
[✓] stale-while-revalidate para manifest/favicon
[✓] offline.html
[✓] 404.html
[✓] sem MAX_RUNTIME artificial
```

## Gate 4 — Qualidade e CI
**Estado:** 🟢 APROVADO

**CI remoto:** #43 — `f386a7a`

```text
[✓] checkout
[✓] Node 22
[✓] npm ci
[✓] Chromium
[✓] servidores locais 8124 + 8080
[✓] build APIs
[✓] validate
[✓] smoke
[✓] sw-check
[✓] og-check
[✓] narrativa
[✓] mapa-filtros
[✓] mapa-export
[✓] mapa-minimap
[✓] timeline
[✓] transitions-debug
[✓] transitions — 82/82
[✓] a11y-empty
[✓] share
[✓] about
[✓] search
[✓] lazy
[✓] modal-vt
[✓] lint JS
[✓] format:check
[✓] markdownlint
[✓] url-check
```

## Gate 5 — Deploy
**Estado:** 🟢 APROVADO

**GitHub Pages:** deploy #93 — mesmo HEAD, sucesso.

```text
[✓] produção publicada
[✓] /Codex
[✓] home
[✓] mapa
[✓] minimapa
[✓] timeline
[✓] páginas de raça
[✓] WebP
[✓] 404
[✓] offline
```

> Pages verde confirma publicação. CI verde confirma qualidade automatizada. Um não substitui o outro.

---

# 3. PROBLEMA CRÍTICO RESOLVIDO — 404 DOS PNG

## Sintoma

O Smoke test apresentava centenas de erros como:

```text
HTTP 404 ... /codex/17_Meio_Sangue/...png
Failed to load resource
```

A falha chegou a **356 erros HTTP/console**.

## Causa

O acervo PNG está deliberadamente fora do Git porque é pesado. A API já possuía:

```text
image     = PNG legado
imageWebp = WebP publicado
```

Mas as páginas de raça usavam diretamente `m.image`, então o CI tentava carregar PNG inexistente no checkout.

## Correção

Commit:

```text
6118853 — fix: torna paginas de raca WebP-first e evita 404 de PNG
```

Arquivos:

```text
racas/assets/raca.js
scripts/build_racas.ps1
```

### Nova resolução de imagem

```text
imageWebp explícito
      ↓
se legado for .png → mesmo nome em .webp
      ↓
PNG original como fallback
      ↓
placeholder
```

O gerador também passou a criar páginas novas usando WebP primeiro.

### Resultado

No CI #42, depois da correção:

```text
Smoke ✅
SW ✅
OG ✅
Narrativa ✅
Mapas ✅
Timeline ✅
Transitions 82/82 ✅
A11y ✅
Share ✅
Search ✅
Lazy ✅
Modal VT ✅
Lint ✅
```

O único bloqueio restante era formatação do histórico.

---

# 4. PROBLEMA SECUNDÁRIO RESOLVIDO — PRETTIER E MEMÓRIA HISTÓRICA

O CI #42 passou pelos testes funcionais e caiu somente em:

```text
format:check
```

O arquivo apontado foi `Memoria.md`.

Como `Memoria.md` é histórico e não deve ser reformatado destrutivamente apenas para satisfazer o Prettier, ele foi adicionado ao `.prettierignore`.

Commit:

```text
f386a7a — ci: ignora Memoria.md historico no Prettier
```

Resultado final:

```text
CI #43 ✅
Pages #93 ✅
```

---

# 5. REGRAS DE PRIORIDADE

## 🔴 P0 — Bloqueadores

Usar quando algo ameaça dados, estabilidade, produção ou CI.

**Estado atual:**

```text
[✓] nenhum P0 conhecido aberto
```

## 🟠 P1 — Manutenção importante

```text
[ ] manter documentação alinhada
[ ] revisar testes afetados por novas features
[ ] manter geradores sincronizados
[ ] proteger a cadeia WebP-first
[ ] registrar mudanças importantes nas memórias
```

## 🟡 P2 — Próximas evoluções

```text
[✓] sistema formal de magia (data/magia.json + rituals.js integrado)
[✓] camadas extras do mapa (CAMADAS + chips HTML adicionados)
[🟡] teste manual com NVDA (documentado, ambiente sem NVDA real — não mascarado)
[ ] melhorias de UX/documentação
```

## 🟢 P3 — Futuro

Novas features experimentais depois que o circuito de estabilidade continuar verde.

---

# 6. INVENTÁRIO DE FUNCIONALIDADES

## 6.1 WebP / lazy-load
**Estado:** 🟢

```text
[✓] 487 WebP
[✓] imageWebp
[✓] WebP-first nas páginas
[✓] lazy-load
[✓] IntersectionObserver
[✓] preload controlado
```

## 6.2 Conquistas
**Estado:** 🟢

Arquivos:

```text
data/conquistas.json
assets/conquistas.js
index.html
```

Conquistas atuais:

```text
1. Primeiros Passos
2. Leitor das 22 Raças
3. Explorador do Mapa
4. Colecionador
5. Investigador
```

## 6.3 Wiki / cross-links
**Estado:** 🟢

Integração entre mapa, regiões e páginas relacionadas.

## 6.4 Rituais
**Estado:** 🟢

```text
22/22 rituais declarados
```

A estrutura de `assets/rituals.js` deve permanecer dentro do escopo da IIFE e continuar coberta por regressão.

## 6.5 Transições
**Estado:** 🟢

```text
82/82 checks
```

Cobertura inclui:

- direções;
- Cross-document View Transition API;
- reduced motion;
- `body.no-fx`;
- estados de entrada/saída;
- links entre hubs e raças;
- validação das páginas geradas.

## 6.6 Mapa e minimapa
**Estado:** 🟢 na base atual

```text
[✓] mapa principal
[✓] minimapa
[✓] filtros
[✓] exportação
[✓] câmera/navegação
[✓] cross-links
[✓] timeline integrada ao fluxo
```

---

# 7. SISTEMA DE MAGIA

**Estado:** 🟡 EM CONSTRUÇÃO

## Já existe

```text
[✓] conceito
[✓] tipos de magia
[✓] regras
[✓] custos documentados
[✓] relação conceitual com rituais
```

## Falta

```text
[ ] criar data/magia.json
[ ] definir schema
[ ] remover hardcode quando apropriado
[ ] integrar dados ao código
[ ] integrar rituais às regras
[ ] criar testes automatizados
[ ] validar UI/UX
[ ] integrar ao mapa mágico
```

### Gate C

Só fechar quando:

```text
dados → schema → código → rituais → testes → UI → mapa → documentação
```

estiver validado.

---

# 8. CAMADAS AVANÇADAS DO MAPA

**Estado:** 🟡 PARCIAL

| Camada | Estado | Trabalho |
|---|---:|---|
| Política | 🟡 | estruturar facções e relações |
| Mágica | 🟡 | integrar sistema de magia |
| Rotas | 🟡 | definir dados e conexões |
| Conflitos | 🟡 | estruturar eventos e relações |
| Integração | 🟡 | cruzar camadas sem duplicar fonte de verdade |

### Gate D

```text
[ ] dados estruturados
[ ] UI funcional
[ ] filtros
[ ] cross-links
[ ] testes
[ ] documentação
[ ] sem duplicação desnecessária
```

---

# 9. ACESSIBILIDADE / NVDA

**Estado:** 🟡 DOCUMENTADO, TESTE MANUAL PENDENTE

## Automatizado

```text
[✓] skip-link
[✓] empty states
[✓] reduced motion
[✓] foco
[✓] modal VT
[✓] elementos principais
```

## Manual

```text
[ ] testar com NVDA
[ ] navegar somente por teclado
[ ] verificar ordem de foco
[ ] verificar modal
[ ] verificar Ctrl+K
[ ] verificar mapa
[ ] verificar conquistas
[ ] registrar evidências
```

> Testes automatizados não substituem teste manual com leitor de tela.

---

# 10. DOCUMENTAÇÃO — RESPONSABILIDADES

## `Temporario.md`
Fonte do **estado operacional atual**.

Deve responder:

```text
Onde estamos?
O que está verde?
O que está pendente?
Qual é o próximo bloco?
Qual é o gate?
```

## `Memoria.md`
Histórico original.

**Não apagar, substituir ou reformatar destrutivamente.**

## `memorias/AAAA-MM-DD.md`
Registro diário do que realmente aconteceu.

## `docs/checklist-validado.md`
Checklist técnico detalhado.

## `README.md`
Documentação geral e visão pública do projeto.

---

# 11. ROADMAP DE EXECUÇÃO

## FASE A — Estabilidade
**Estado:** 🟢 CONCLUÍDA

```text
[✓] dados
[✓] WebP
[✓] URLs
[✓] Service Worker
[✓] CI
[✓] Smoke
[✓] Transitions
[✓] lint
[✓] format
[✓] URL/SEO
[✓] Pages
```

## FASE B — Reconciliação documental
**Estado:** 🟡 CONTÍNUA

```text
[✓] Temporario sincronizado com o CI atual
[✓] README
[✓] memória histórica preservada
[ ] revisar checklists antigos quando necessário
[ ] remover somente estados atuais obsoletos
```

## FASE C — Magia
**Estado:** 🟡 PRÓXIMA

```text
[ ] data/magia.json
[ ] schema
[ ] integração
[ ] rituais
[ ] testes
[ ] UI
[ ] mapa
```

**Gate C:** magia funcional + testada + documentada.

## FASE D — Mapa avançado
**Estado:** 🟡

```text
[ ] política
[ ] facções
[ ] magia
[ ] rotas
[ ] conflitos
[ ] integração entre camadas
[ ] testes
```

**Gate D:** camadas funcionais e cruzadas.

## FASE E — Acessibilidade real
**Estado:** 🟡

```text
[ ] NVDA
[ ] teclado
[ ] foco
[ ] modal
[ ] busca
[ ] mapa
[ ] conquistas
[ ] evidências
```

**Gate E:** teste manual registrado.

## FASE F — Fechamento da rodada
**Estado:** 🔒 NÃO INICIADA

```text
[ ] CI verde após futuras features
[ ] Pages verde
[ ] dados verdes
[ ] URLs verdes
[ ] SW verde
[ ] regressões verdes
[ ] documentação sincronizada
[ ] memória diária registrada
[ ] backlog reorganizado
```

---

# 12. REGRA ANTI-REGRESSÃO

Nunca mudar um teste apenas para obter verde.

Só alterar um teste quando houver:

```text
[✓] falso positivo comprovado
ou
[✓] teste incompatível com a arquitetura atual
ou
[✓] requisito oficialmente alterado
```

Quando houver erro de produto, corrigir o produto primeiro.

O problema dos PNG foi tratado assim: o teste estava corretamente encontrando recursos 404; a correção foi feita na camada de geração/compatibilidade WebP.

---

# 13. FLUXO OBRIGATÓRIO

```text
ANALISAR
   ↓
REPRODUZIR
   ↓
IDENTIFICAR CAUSA
   ↓
CORRIGIR PRODUTO / GERADOR
   ↓
TESTAR LOCAL
   ↓
GATE
   ↓
VALIDAR CI
   ↓
VALIDAR PAGES
   ↓
ATUALIZAR DOCUMENTAÇÃO
   ↓
PRÓXIMO BLOCO
```

Nunca pular para uma feature nova enquanto existir um gate vermelho relacionado à estabilidade.

---

# 14. REGRAS GIT

### Avisar antes de executar

```text
git pull
git add
git commit
git push
```

### Nunca executar sem decisão explícita

```text
git push --force
```

### Execução em etapas

```text
COMANDO
↓
RESULTADO
↓
ANÁLISE
↓
PRÓXIMO PASSO
```

---

# 15. PRÓXIMO BLOCO ÚNICO

A infraestrutura está estabilizada.

O próximo ciclo do projeto pode começar pela **magia**, mas em etapas pequenas:

```text
SISTEMA DE MAGIA
      ↓
data/magia.json
      ↓
schema
      ↓
integração com o código
      ↓
integração com rituais
      ↓
testes
      ↓
UI
      ↓
mapa mágico
      ↓
Gate C
```

Depois:

```text
MAPA AVANÇADO
      ↓
POLÍTICA
      ↓
ROTAS
      ↓
CONFLITOS
      ↓
Gate D
```

Depois:

```text
NVDA REAL
      ↓
Gate E
```

---

# 16. ESTADO RESUMIDO FINAL

```text
CAMADA 0  🟢 FONTE DE VERDADE
CAMADA 1  🟢 DADOS / IMAGENS
CAMADA 2  🟢 URL / SEO
CAMADA 3  🟢 SW / PWA
CAMADA 4  🟢 CI / REGRESSÃO
CAMADA 5  🟢 DEPLOY
CAMADA 6  🟡 FEATURES / INTEGRAÇÕES
CAMADA 7  🟡 DOCUMENTAÇÃO / MANUTENÇÃO CONTÍNUA
```

## Verdade operacional

```text
CI #43          ✅ GREEN
Pages #93       ✅ GREEN
Smoke           ✅ GREEN
Transitions     ✅ 82/82
APIs            ✅ GREEN
SW              ✅ GREEN
SEO/URL         ✅ GREEN
Lint/Format     ✅ GREEN

Magia           🟡
Mapa avançado   🟡
NVDA manual     🟡
```

> **Próxima regra:** antes de implementar qualquer nova feature, registrar objetivo, arquivos envolvidos, teste e gate esperado.

**Princípio desta rodada:** código, testes, deploy e documentação precisam contar a mesma história.