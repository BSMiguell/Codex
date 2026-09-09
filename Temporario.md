# Plano operacional — Aetheria Codex

**Atualizado:** 09/09/2026  
**Objetivo:** manter este arquivo como a fonte operacional do trabalho: estado real do projeto, prioridades, gates, riscos, sequência de execução e próximos passos.

> **Regra de ouro:** primeiro estabilizar o que existe; depois validar; só então adicionar novas features.
>
> **Ordem:** Dados → URLs/SEO → Cache/PWA → Testes/CI → Deploy → Features → Documentação/manutenção.

---

# 1. Estado atual — fotografia do projeto

## 1.1 Fonte de verdade técnica

| Item | Estado | Referência |
|---|---:|---|
| Grupos/raças | 🟢 **22** | `characters-api.json` |
| Personagens | 🟢 **487** | `characters-api.json` |
| WebP | 🟢 **487/487** | `imageWebp` validado |
| PNG fallback | 🟢 **487/487** | `image` validado |
| Personagens sem imagem | 🟢 **0** | `tests/validate-api.mjs` |
| `characters-api.json` | 🟢 | gerado e validado |
| `historia-api.json` | 🟢 | regiões, celestes, batalhas, raças e rituais |
| URL oficial | 🟢 `/Codex` | produção |
| GitHub Pages | 🟢 | deploy atual publicado |
| Service Worker | 🟢 `v1.4.0` | precache expandido |
| Conquistas | 🟢 | 5 conquistas implementadas |
| Rituais | 🟢 **22/22** declarados | `assets/rituals.js` |
| Wiki/cross-links do mapa | 🟢 | `.map-crosslinks` |
| Sistema de magia | 🟡 | base criada, integração pendente |
| Camadas extras do mapa | 🟡 | política/mágica/rotas/conflitos pendentes |
| NVDA real | 🟡 | documentação criada, teste manual pendente |
| CI | 🔴 **não considerar verde ainda** | última sequência teve falhas em testes de regressão |
| Documentação operacional | 🟡 | este arquivo está sendo ressincronizado |

## 1.2 HEAD / publicação

O repositório recebeu muitas atualizações depois da primeira implantação do CI. O estado atual inclui, entre outros:

- sistema de conquistas;
- 22 rituais;
- cross-links do mapa;
- evolução do mapa e minimapa;
- base de magia;
- documentação de política/magia;
- documentação de testes NVDA;
- Service Worker `v1.4.0`;
- diagnóstico para transições;
- atualizações de README por automação.

**Regra:** não assumir que um gate antigo continua válido depois de dezenas de commits. Cada grande bloco de mudanças deve ser revalidado contra o HEAD atual.

---

# 2. Regras de estado e prioridade

## 🔴 P0 — Bloqueadores

Problemas que podem invalidar a confiança no projeto ou no CI.

1. Resolver/verificar a estrutura de `assets/rituals.js`.
2. Descobrir e corrigir os erros reais que ainda fazem `transitions-check` falhar.
3. Rodar o CI contra o estado atual do `main` e obter um resultado verde real.
4. Só depois atualizar os gates documentais para refletir o resultado comprovado.

## 🟠 P1 — Alta prioridade

- sincronizar `Temporario.md`, checklists e memórias;
- revisar testes afetados pelas novas features;
- confirmar Service Worker e cache após a expansão das features;
- validar que os novos scripts estão cobertos pelo CI.

## 🟡 P2 — Evolução

- sistema formal de magia;
- camadas extras do mapa;
- teste manual com NVDA;
- melhorias de documentação e UX.

## 🟢 P3 — Futuro

Novas features somente depois do circuito de estabilidade estar verde.

---

# 3. CAMADA 0 — Congelamento e fonte de verdade

**Estado:** 🟢 VALIDADA

```text
[✓] 22 grupos
[✓] 487 personagens
[✓] fonte de verdade = characters-api.json
[✓] 493 não é contagem atual
[✓] URL oficial = /Codex
```

### Regra de contagem

O backlog histórico pode conter 493, mas o número operacional atual é **487 personagens em 22 grupos**. Não reintroduzir 493 como meta ou total sem uma decisão explícita.

---

# 4. CAMADA 1 — Pipeline de dados e imagens

**Estado:** 🟢 CONCLUÍDA

### O que foi estabilizado

- WebP e PNG são descobertos independentemente.
- WebP é a imagem principal.
- PNG é fallback.
- Ficha sem imagem não é descartada.
- Caminhos são relativos e normalizados com `/`.
- Não há reutilização indevida de imagem entre personagens.

### Arquivos principais

- `scripts/build_api_json.ps1`
- `scripts/build_historia_api.ps1`
- `characters-api.json`
- `historia-api.json`
- `tests/validate-api.mjs`

### Validação conhecida

```text
OK — 487 chars, 22 grupos, 487 WebP, 487 PNG fallback, 0 sem imagem (2 aviso(s))
```

### Gate 1

```text
[✓] 22 grupos
[✓] 487 personagens
[✓] 487 WebP
[✓] 487 PNG fallback
[✓] 0 sem imagem
[✓] historia-api.json gerado
[✓] validate-api.mjs passa
```

**Gate 1: 🟢 APROVADO**

---

# 5. CAMADA 2 — URL e SEO

**Estado:** 🟢 CONCLUÍDA

### Resultado

A produção foi consolidada em:

```text
https://bsmiguell.github.io/Codex/
```

Foram alinhados:

- canonical;
- `og:url`;
- Twitter Card;
- sitemap;
- páginas de raça;
- share/embed;
- scripts geradores;
- referências públicas de produção.

A única referência necessária ao antigo `/Temporario` é a própria lógica de migração histórica, que deve continuar preservada para que a ferramenta de migração possa localizar o valor antigo.

### Gate 2

```text
[✓] URLs públicas em /Codex
[✓] canonical /Codex
[✓] OG /Codex
[✓] sitemap /Codex
[✓] páginas de raça /Codex
[✓] share/embed /Codex
[✓] url-check validado
```

**Gate 2: 🟢 APROVADO**

---

# 6. CAMADA 3 — Service Worker, cache e offline

**Estado:** 🟢 CONCLUÍDA — manter sob regressão

## Estado atual

`sw.js` está em:

```text
const VERSION = "aetheria-v1.4.0";
```

O precache inclui, entre outros:

- `index.html`;
- `offline.html`;
- `404.html`;
- manifest;
- sitemap;
- CSS;
- favicons;
- `og-cover.jpg`;
- `themes.json`;
- `search-index.json`;
- `rituals.js`;
- `transitions.js`.

A estratégia atual mantém:

- network-first para navegação;
- cache-first para assets publicados;
- stale-while-revalidate para manifest/favicon;
- limpeza de caches antigos;
- fallback offline/404.

### Atenção

Existe um comentário interno em `sw.js` que ainda menciona **10 rituais**. O projeto agora declara 22. Isso não é bloqueador funcional, mas deve ser corrigido na manutenção documental.

### Gate 3

```text
[✓] versão v1.4.0
[✓] precache expandido
[✓] limpeza de caches antigos
[✓] fallback offline
[✓] fallback 404
[✓] WebP no runtime
[✓] sem limite artificial MAX_RUNTIME
[✓] manifest/favicon com revalidação
```

**Gate 3: 🟢 APROVADO**

---

# 7. CAMADA 4 — Qualidade automatizada e CI

**Estado:** 🔴 **ABERTA / EM ESTABILIZAÇÃO**

> Não marcar esta camada como concluída enquanto o CI do estado atual não estiver verde.

## Pipeline atual

`.github/workflows/ci.yml` executa Node 22, `npm ci`, instala Chromium e inicia servidores locais para os testes Playwright.

O pipeline cobre:

```text
Checkout
  ↓
Node 22
  ↓
npm ci
  ↓
Chromium
  ↓
Servidores locais 8124 + 8080
  ↓
Validação APIs
  ↓
Service Worker
  ↓
Open Graph
  ↓
Narrativa
  ↓
Mapas
  ↓
Timeline
  ↓
Transições
  ↓
Acessibilidade
  ↓
Share / About / Search / Lazy / Modal VT
  ↓
ESLint
  ↓
Prettier
  ↓
Gate
```

## Histórico da estabilização do CI

Foram corrigidos sucessivamente:

1. validação de WebP/PNG no CI;
2. instalação do Chromium;
3. URLs/SEO usados pelo teste OG;
4. servidor local para Playwright;
5. porta necessária para o minimapa;
6. diagnóstico dos erros de transição.

### Último problema conhecido

`transitions-check` apresentou **6 erros de console**, mesmo com a maior parte das verificações passando.

O diagnóstico foi adicionado para revelar a mensagem real dos erros.

### Próximo gate

```text
[ ] CI do HEAD atual verde
[ ] transitions-check verde
[ ] todos os testes críticos verdes
[ ] lint verde
[ ] format:check verde
[ ] URL/SEO verde
```

**Gate 4: 🔴 NÃO APROVADO AINDA**

---

# 8. CAMADA 5 — Deploy controlado

**Estado:** 🟢 PUBLICADO / validar novamente após Gate 4

O GitHub Pages continua construindo e publicando com sucesso no estado atual.

### Checklist

```text
[✓] GitHub Pages publica
[✓] home disponível
[✓] /Codex
[✓] WebP
[✓] PNG fallback
[✓] busca
[✓] mapa
[✓] minimapa
[✓] timeline
[✓] páginas de raça
[✓] canonical
[✓] sitemap
[✓] 404
[✓] offline
```

### Regra

Pages verde **não substitui** CI verde. O deploy comprova publicação; o CI comprova qualidade automatizada.

---

# 9. CAMADA 6 — Features já implementadas

**Estado:** 🟢 IMPLEMENTADAS, mas algumas precisam de regressão antes de serem consideradas definitivamente fechadas.

## §6.1 — Minimapa

🟢 Implementado e corrigido para o servidor local usado pelo CI.

## §7.1 — WebP / lazy-load

🟢 Implementado.

- 487 WebP;
- lazy-load;
- IntersectionObserver.

## §7.2 — Conquistas

🟢 Implementado.

Arquivos principais:

- `data/conquistas.json`
- `assets/conquistas.js`
- `index.html`

Conquistas atuais:

1. Primeiros Passos
2. Leitor das 22 Raças
3. Explorador do Mapa
4. Colecionador
5. Investigador

## §7.3 — Wiki/cross-links

🟢 Implementado no `Mapa_Aetheria.html`.

## §8.8–22 — Rituais

🟢 O projeto declara **22/22 rituais**.

🔴 **Porém, revisar `assets/rituals.js` antes de fechar definitivamente:** há indícios de que parte das declarações dos rituais mais recentes ficou fora do escopo da IIFE que declara `RITUALS`, `prefersReduced` e `runAfter`.

Esse ponto pode estar relacionado aos erros de console encontrados no `transitions-check` e deve ser investigado antes de novas features.

---

# 10. CAMADA 6A — Sistema de magia

**Estado:** 🟡 EM CONSTRUÇÃO

### Já existe

- base de sistema;
- tipos de magia;
- regras/custos documentados;
- relação conceitual com os rituais.

### Ainda falta

```text
[ ] data/magia.json como fonte estruturada
[ ] retirar custos hardcoded quando apropriado
[ ] integrar regras com execução dos rituais
[ ] validar UI/UX da magia
[ ] criar testes automatizados do sistema
[ ] atualizar mapa/camadas que dependem da magia
```

**Não marcar §11.9 como concluído antes desses pontos essenciais.**

---

# 11. CAMADA 6B — Camadas extras do mapa

**Estado:** 🟡 PLANEJADAS / PARCIAIS

| Camada | Estado | Próxima ação |
|---|---:|---|
| Política | 🟡 | estruturar `factions[]` / dados reais |
| Mágica | 🟡 | integrar sistema de magia |
| Rotas | 🟡 | definir rotas e dados |
| Conflitos | 🟡 | definir conflitos e relações |

Documentação relacionada:

- `docs/11.5.md`
- documentação de mapa/magia correspondente.

---

# 12. CAMADA 6C — Acessibilidade / NVDA

**Estado:** 🟡

### Já feito

- documentação de teste;
- revisão de ARIA;
- planejamento de validação.

### Falta

```text
[ ] executar teste manual real com NVDA
[ ] registrar navegação por teclado
[ ] verificar foco do modal
[ ] verificar leitura do mapa
[ ] verificar botões de conquistas
[ ] verificar busca Ctrl+K
[ ] registrar resultado na memória/documentação
```

Não transformar documentação de teste em aprovação de teste real.

---

# 13. CAMADA 7 — Documentação e manutenção

**Estado:** 🟡 EM SINCRONIZAÇÃO

## Fontes documentais

### `Memoria.md`

Histórico/original. **Não apagar, substituir ou reescrever destrutivamente.**

### `Temporario.md`

Plano operacional atual, gates, prioridades e próximos passos.

### `memorias/AAAA-MM-DD.md`

Registro diário do que realmente aconteceu naquele dia.

### `docs/checklist-validado.md`

Checklist técnico; deve ser atualizado quando funcionalidades mudarem de estado.

### `README.md`

Documentação geral e visão pública do projeto.

## Problema atual

Alguns documentos ainda refletem estados antigos, por exemplo:

- rituais como 7 + pendências;
- wiki cruzada como ausente;
- estados antigos das features;
- gates antigos do CI.

### Regra

Não apagar o histórico para “corrigir” a documentação. Atualizar o estado atual e preservar a sequência histórica onde ela for necessária.

---

# 14. Plano de execução imediato

## FASE A — Estabilização

### A1 — `assets/rituals.js`

```text
[ ] abrir arquivo atual
[ ] confirmar escopo da IIFE
[ ] confirmar declaração dos 22 rituais
[ ] confirmar que RITUALS/prefersReduced/runAfter estão no escopo correto
[ ] verificar erros de console
```

**Gate A1:** arquivo estruturalmente correto e sem erro causado por escopo.

### A2 — Transitions

Depois de A1:

```text
[ ] executar diagnóstico
[ ] identificar os 6 erros reais
[ ] corrigir causa, não mascarar teste
[ ] executar transitions-check novamente
```

**Gate A2:** `transitions-check` verde.

### A3 — CI

```text
[ ] aguardar/acionar execução no HEAD atual
[ ] confirmar todos os jobs
[ ] corrigir qualquer nova regressão
```

**Gate A3:** CI completo verde.

---

# 15. FASE B — Reconciliar documentação

Depois de A3:

```text
[ ] atualizar Temporario.md com estado final
[ ] revisar docs/checklist-validado.md
[ ] revisar memória diária correspondente
[ ] corrigir comentários/documentação obsoletos do SW
[ ] confirmar README
```

**Gate B:** documentação não contradiz o estado do código.

---

# 16. FASE C — Magia

Somente após CI verde:

```text
[ ] estruturar data/magia.json
[ ] definir schema
[ ] integrar dados com código
[ ] integrar rituais
[ ] adicionar testes
[ ] validar UI
[ ] atualizar mapa mágico
```

**Gate C:** sistema de magia testado e documentado.

---

# 17. FASE D — Mapa avançado

Depois da magia:

```text
[ ] política
[ ] facções
[ ] magia
[ ] rotas
[ ] conflitos
[ ] relações entre camadas
[ ] testes das novas camadas
```

**Gate D:** camadas extras funcionais e documentadas.

---

# 18. FASE E — Acessibilidade real

```text
[ ] NVDA real
[ ] teclado
[ ] foco
[ ] modal
[ ] busca
[ ] mapa
[ ] conquistas
[ ] registrar evidências
```

**Gate E:** teste manual registrado.

---

# 19. FASE F — Fechamento e manutenção

```text
[ ] CI verde
[ ] Pages verde
[ ] dados verdes
[ ] URLs verdes
[ ] SW verde
[ ] regressões verdes
[ ] documentação sincronizada
[ ] memória diária registrada
[ ] backlog reorganizado
```

Só então considerar a rodada encerrada.

---

# 20. Fluxo obrigatório de trabalho

```text
ANALISAR
   ↓
DEFINIR CAUSA
   ↓
CORRIGIR
   ↓
GERAR / ATUALIZAR
   ↓
TESTAR LOCAL
   ↓
GATE
   ↓
VALIDAR GITHUB ACTIONS
   ↓
CONFIRMAR DEPLOY
   ↓
ATUALIZAR MEMÓRIA / DOCUMENTAÇÃO
   ↓
PRÓXIMO BLOCO
```

## Regra anti-regressão

Não corrigir apenas o teste para fazê-lo passar quando existe possibilidade de bug real no produto.

O teste deve ser corrigido apenas quando houver:

- falso positivo comprovado;
- teste incompatível com a arquitetura atual;
- requisito explicitamente alterado.

---

# 21. Regras Git

Antes de qualquer operação Git destrutiva ou de sincronização, avisar explicitamente.

### Avisar antes de:

- `git pull`
- `git add`
- `git commit`
- `git push`

### Nunca

```text
git push --force
```

sem decisão técnica explícita.

### Execução em etapas

Nunca entregar uma sequência grande de comandos sem validação intermediária.

Padrão:

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

# 22. Estado resumido dos gates

```text
CAMADA 0  🟢 VALIDADA
CAMADA 1  🟢 CONCLUÍDA
CAMADA 2  🟢 CONCLUÍDA
CAMADA 3  🟢 CONCLUÍDA
CAMADA 4  🔴 ABERTA — CI ainda precisa ficar verde no estado atual
CAMADA 5  🟢 PUBLICADO — depende de regressão após Gate 4
CAMADA 6  🟡 FEATURES IMPLEMENTADAS + novas integrações em andamento
CAMADA 7  🟡 DOCUMENTAÇÃO EM SINCRONIZAÇÃO
```

# 23. Próximo passo único

> **Não começar magia, novas camadas do mapa ou novas features ainda.**

O próximo trabalho é:

```text
assets/rituals.js
      ↓
transitions-check
      ↓
CI completo
      ↓
documentação
      ↓
Gate verde
```

Depois disso:

```text
magia → mapa avançado → NVDA → fechamento
```

**Objetivo da próxima rodada:** transformar o estado atual em um estado comprovadamente estável, sem apagar histórico e sem mascarar regressões.
