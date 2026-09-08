# Plano de execução — Aetheria Codex

**Atualizado:** 08/09/2026  
**Objetivo:** transformar este arquivo no plano operacional do Codex, incorporando as correções encontradas na auditoria e organizando a execução em **camadas com gates obrigatórios**.

> **Regra de ouro:** Dados → URLs/SEO → Cache/PWA → Testes/CI → Deploy → Novas features.
>
> Não iniciar a próxima camada enquanto o gate da camada atual não estiver verde.

---

## 0. Estado de referência

| Item | Estado atual | Referência |
|---|---:|---|
| Raças/grupos | **22** | `characters-api.json` |
| Personagens versionados na API | **487** | `characters-api.json` |
| API de personagens | 🟡 | existe e está funcional, mas o build de imagens precisa ser alinhado ao WebP |
| WebP | 🟡 | `imageWebp` existe na API; `build_api_json.ps1` ainda usa PNG como ponto de partida |
| URL de produção | 🔴 | ainda existem referências ao antigo `/Temporario` |
| Service Worker | 🟡 | cache-first existe; política de versionamento/offline precisa ser revisada |
| Testes Playwright | ✅ | smoke/regression/a11y já existem |
| CI | ❌ | criar pipeline automático |
| Acessibilidade axe-core | ✅ | baseline documentado em `docs/auditoria-a11y.md` |
| 404 tematizada | ✅ | `404.html` + SW |
| Breadcrumb | ✅ | 22/22 páginas de raça |
| Preferência de movimento | ✅ | toggle + `prefers-reduced-motion` |
| Transições direcionais | ✅ | cobertura E2E existente |

### Correção de contagem

O backlog antigo registrava **493 personagens**, mas o `characters-api.json` atualmente versionado declara **487** e `totalGroups: 22`. Até a próxima regeneração oficial, **487 é o valor de referência**. Não usar 493 manualmente.

---

# CAMADA 0 — Congelamento e fonte de verdade

**Prioridade:** 🔴 crítica

### Tarefas

- [ ] Confirmar `main` como branch de produção.
- [ ] Confirmar `22` grupos e `487` personagens.
- [ ] Definir URL oficial: `https://bsmiguell.github.io/Codex`.
- [ ] Definir `characters-api.json` como artefato gerado para a contagem publicada.
- [ ] Manter `Temporario.md` apenas como plano; `/Temporario` não é URL de produção.
- [ ] Se necessário, criar configuração central de publicação, evitando URLs e números espalhados.

### Gate 0

```text
[ ] 22 grupos confirmados
[ ] 487 personagens confirmados
[ ] URL /Codex definida
[ ] nenhuma nova implementação usa 493 como número fixo
```

---

# CAMADA 1 — Pipeline de dados e imagens

**Prioridade:** 🔴 crítica  
**Bloqueia:** todas as camadas seguintes.

## Problema

`scripts/build_api_json.ps1` procura primeiro arquivos PNG e somente depois procura o WebP correspondente. Isso é frágil para um acervo migrado para WebP: um personagem que tenha apenas `.webp` pode deixar de entrar corretamente na API.

## Correção obrigatória

Refatorar `Find-ImageFile`/pipeline para procurar os formatos independentemente:

```text
Ficha do personagem
       │
       ├── procura WebP → imageWebp
       │
       └── procura PNG  → image (fallback)
```

### Regras

1. Matching por nome exato.
2. Depois nome normalizado.
3. Depois prefixo + separador.
4. Nunca reutilizar uma imagem para dois personagens.
5. Aceitar WebP + PNG, somente WebP ou somente PNG.
6. Sem imagem: `null` + warning, sem excluir a ficha.
7. Caminhos sempre relativos à raiz e com `/`.

### Arquivos

- `scripts/build_api_json.ps1`
- `characters-api.json`
- `scripts/build_historia_api.ps1`
- `tests/lazy-check.mjs`
- `tests/smoke.mjs`

### Execução

```powershell
powershell -File scripts\build_api_json.ps1
powershell -File scripts\build_historia_api.ps1
```

### Gate 1

```text
[ ] totalGroups == 22
[ ] totalCharacters == 487, salvo mudança de dados explicitamente validada
[ ] nenhuma ficha é perdida por depender de PNG
[ ] todo WebP existente aparece em imageWebp
[ ] PNG existente aparece em image como fallback
[ ] nenhum personagem usa imagem duplicada
[ ] paths começam por codex/
[ ] historia-api.json gera sem erro
[ ] smoke/API tests passam
[ ] lazy-check passa
```

**Saída:** API regenerada e validada.

---

# CAMADA 2 — Migração definitiva de URL e SEO

**Prioridade:** 🔴 crítica

## Problema

Ainda existem referências ao antigo endereço `/Temporario` em código/geradores. Isso pode contaminar canonical, Open Graph, sitemap, páginas de raça e links compartilháveis.

### Busca obrigatória

```text
bsmiguell.github.io/Temporario
```

### Corrigir

- `index.html` — canonical, `og:url`, Twitter Card e URLs absolutas.
- `scripts/build_racas.ps1`.
- `scripts/build_sitemap.ps1`.
- HTMLs de raça gerados.
- links de share/embed.
- documentação que apresente a URL antiga como atual.

### Regra

`Temporario.md` pode continuar com esse nome. O nome do arquivo não é um problema. A URL `/Temporario` em artefatos publicados é.

### Novo teste

Criar `tests/url-check.mjs` para falhar quando `/Temporario` aparecer em arquivos publicados/gerados.

### Gate 2

```text
[ ] 0 URLs de produção apontando para /Temporario
[ ] canonical = /Codex
[ ] OG:url = /Codex
[ ] sitemap = /Codex
[ ] páginas de raça = /Codex
[ ] share/embed = /Codex
[ ] url-check passa
```

---

# CAMADA 3 — Service Worker, cache e offline

**Prioridade:** 🟠 alta

### Objetivo

Eliminar cache obsoleto e tornar a promessa de offline compatível com o comportamento real.

### 3.1 Versionamento

Centralizar a versão do cache/Service Worker. Toda mudança de assets deve produzir uma versão nova de forma previsível.

### 3.2 Separar cache essencial e mídia

```text
PRECACHE
├── index.html
├── CSS/JS essenciais
├── manifest
├── JSON essencial
├── offline.html
└── 404.html

RUNTIME
└── imagens/personagens/páginas acessadas
```

### 3.3 Offline

Diferenciar claramente shell offline, mídias já visitadas e acervo completo. Só declarar o acervo inteiro offline se houver mecanismo explícito para baixá-lo todo.

### Gate 3

```text
[ ] versão do SW muda após alteração relevante
[ ] cache antigo é removido
[ ] shell abre offline
[ ] offline.html funciona
[ ] 404.html funciona
[ ] mídia já visitada funciona offline
[ ] atualização não mantém JS/CSS antigo indefinidamente
[ ] documentação reflete a capacidade real de offline
```

---

# CAMADA 4 — Qualidade automatizada e CI

**Prioridade:** 🟠 alta

### Criar

```text
.github/workflows/ci.yml
```

### Pipeline

```text
checkout
  ↓
lint / prettier / markdownlint
  ↓
build API
  ↓
validação dos dados
  ↓
smoke
  ↓
a11y
  ↓
regressões específicas
  ↓
SEO/URL check
  ↓
artefato aprovado
```

### Testes críticos

```text
npm run lint
npm run smoke
npm run a11y-axe
npm run lazy-check
npm run og-check
npm run share-check
npm run mapa-filtros-check
npm run mapa-export-check
npm run narrativa-check
npm run timeline-check
npm run search-check
npm run transitions-check
npm run url-check
```

Se algum script não existir exatamente com esse nome no `package.json`, adaptar o comando ao script real antes de ativar o workflow.

### Gate 4

```text
[ ] CI roda em PR
[ ] CI roda em push para main
[ ] build de API falha o CI quando inválido
[ ] divergência de contagem falha o CI
[ ] /Temporario falha o CI
[ ] pageerror/console error falha o CI
[ ] a11y regressiva falha o CI
[ ] testes críticos passam
```

---

# CAMADA 5 — Deploy controlado

**Prioridade:** 🟡 alta

### Fluxo

```text
feature/fix
    ↓
Pull Request
    ↓
CI — Camadas 0→4
    ↓
verde
    ↓
merge main
    ↓
GitHub Pages
    ↓
smoke pós-deploy
```

### Gate 5 — Produção

```text
[ ] home abre
[ ] busca funciona
[ ] modal funciona
[ ] mapa funciona
[ ] timeline funciona
[ ] páginas de raça funcionam
[ ] imagens WebP carregam
[ ] fallback PNG funciona
[ ] share aponta para /Codex
[ ] canonical aponta para /Codex
[ ] sitemap aponta para /Codex
[ ] 404 funciona
[ ] offline funciona
```

---

# CAMADA 6 — Melhorias de produto

**Só iniciar quando Camadas 1–5 estiverem verdes.**

## 6A — Páginas de raça

- [ ] §7.1 — layouts únicos para as 22 raças.
- [ ] §7.2 — conquistas por raça.
- [ ] §7.3 — wiki/enciclopédia cruzada.

## 6B — Conteúdo narrativo

- [ ] §9.2 — coleções temáticas do Personagem do Momento.
- [ ] §11.9 — sistema formal de magia: regras, limites e custos.
- [ ] §11.10 — wiki personagem ↔ região ↔ batalha.

## 6C — Rituais

- [ ] §8.8–22 / §11.8 — 14 rituais restantes.

## 6D — Mapa

- [ ] §11.5 — política.
- [ ] §11.5 — magia.
- [ ] §11.5 — rotas.
- [ ] §11.5 — conflitos.

**Dependência:** não implementar camadas de mapa cujo conteúdo de worldbuilding ainda não esteja definido.

## 6E — Kit visual

- [ ] §12 — 22 emblemas SVG animados.
- [ ] respeitar `prefers-reduced-motion`.
- [ ] validar contraste.
- [ ] otimizar com SVGO sem remover animações.

---

# CAMADA 7 — Documentação e manutenção contínua

**Prioridade:** 🟢 baixa, mas obrigatória após mudanças estruturais.

- [ ] §5.3 — documentar `characters-api.json` e seu schema/uso.
- [ ] Atualizar README quando a arquitetura mudar.
- [ ] Registrar decisões relevantes em `Memoria.md`.
- [ ] Manter este arquivo alinhado com o estado real.
- [ ] Remover números/URLs antigos de documentação que não sejam históricos.

---

# Backlog já concluído — não reabrir como tarefa nova

| Área | Estado |
|---|---|
| Botão de instalação PWA | ✅ |
| Onboarding | ✅ |
| CSS extraído do `index.html` | ✅ |
| Open Graph dinâmico | ✅ |
| Filtro de raça no mapa | ✅ |
| Dialog “Sobre este projeto” | ✅ |
| Busca semântica na lore | ✅ |
| Lint / Prettier / markdownlint | ✅ |
| Rota narrativa no mapa | ✅ |
| Linha do tempo | ✅ |
| Lazy-load em 3 zonas | ✅ — revalidar após Camada 1 |
| Auditoria axe-core | ✅ |
| Licenças | ✅ |
| SVGs globais otimizados | ✅ |
| 404 tematizada | ✅ |
| Preferência de movimento | ✅ |
| Breadcrumb 22/22 | ✅ |
| Transições direcionais | ✅ |

---

# Fora de escopo atual

| Item | Estado |
|---|---|
| TypeScript-lite | 🚫 — decisão de não migrar agora |
| i18n pt-BR + en-US | 🚫 — Q1/2027 |
| Tendências de design / glassmorphism / scroll-driven | 🚫 — fora do escopo atual |

---

# Critérios globais de conclusão

Uma camada só recebe `✅` quando:

1. código foi alterado;
2. artefatos gerados foram regenerados;
3. testes relevantes passaram;
4. nenhuma regressão conhecida ficou aberta;
5. documentação foi atualizada;
6. o gate correspondente está verde.

### Estados

- `⬜` não iniciado
- `🟡` em execução
- `🔴` bloqueado/crítico
- `🟢` validado
- `✅` concluído
- `🚫` fora de escopo

---

# Próxima execução recomendada

## Sprint 1 — Dados

```text
1. Camada 0
2. corrigir build_api_json.ps1 para WebP/PNG independente
3. regenerar characters-api.json
4. regenerar historia-api.json
5. executar smoke + lazy-check
6. fechar Gate 1
```

## Sprint 2 — URL

```text
1. localizar /Temporario
2. corrigir index.html
3. corrigir build_racas.ps1
4. corrigir build_sitemap.ps1
5. corrigir artefatos gerados
6. criar url-check
7. fechar Gate 2
```

## Sprint 3 — PWA

```text
1. revisar sw.js
2. revisar precache/runtime cache
3. corrigir versionamento
4. validar offline/404
5. fechar Gate 3
```

## Sprint 4 — CI

```text
1. criar workflow
2. conectar build + testes
3. bloquear regressões
4. fechar Gate 4
```

## Sprint 5 — Produto

```text
§7.1 → §9.2 → §11.9/11.10 → §8.8–22 → §11.5 → §12
```

---

# Referências técnicas

- `scripts/build_api_json.ps1` — personagens e imagens
- `scripts/build_historia_api.ps1` — dados da história
- `scripts/build_racas.ps1` — páginas de raça
- `scripts/build_sitemap.ps1` — sitemap
- `sw.js` — PWA/cache
- `characters-api.json` — API gerada e contagem publicada
- `tests/` — regressões automatizadas
- `docs/auditoria-a11y.md` — auditoria de acessibilidade
- `docs/checklist-validado.md` — checklist de auditoria/pesquisa
- `Memoria.md` — histórico técnico e lições do projeto
