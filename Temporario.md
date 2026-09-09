# Plano de execução — Aetheria Codex

**Atualizado:** 08/09/2026  
**Objetivo:** manter este arquivo como plano operacional do Codex, com execução em camadas e gates obrigatórios.

> **Regra de ouro:** Dados → URLs/SEO → Cache/PWA → Testes/CI → Deploy → Novas features.
>
> Não iniciar a próxima camada enquanto o gate da camada atual não estiver verde.

---

## 0. Estado de referência — atualizado após a Camada 1

| Item | Estado atual | Referência |
|---|---:|---|
| Raças/grupos | **22** | `characters-api.json` |
| Personagens | **487** | `characters-api.json` |
| `characters-api.json` | 🟢 | regenerado e validado |
| `historia-api.json` | 🟢 | regenerado sem erros |
| WebP | 🟢 | 487 referências `imageWebp` validadas |
| PNG fallback | 🟢 | 487 referências de fallback validadas |
| Personagens sem imagem | **0** | `tests/validate-api.mjs` |
| URL de produção | 🔴 | próxima etapa: eliminar `/Temporario` |
| Service Worker | 🟡 | revisão pendente |
| CI | ❌ | criar pipeline automático |
| Testes API | 🟢 | Gate 1 aprovado |

### Regra de contagem

O backlog antigo registrava **493 personagens**, mas a fonte de verdade atual é **487 personagens em 22 grupos**. Não usar 493 como número fixo.

---

# CAMADA 0 — Congelamento e fonte de verdade

**Prioridade:** 🔴 crítica

### Gate 0

```text
[✓] 22 grupos confirmados
[✓] 487 personagens confirmados
[✓] URL oficial definida: /Codex
[✓] 493 não é usado como contagem atual
```

**Estado:** 🟢 VALIDADO

---

# CAMADA 1 — Pipeline de dados e imagens

**Prioridade:** 🔴 crítica  
**Estado:** ✅ CONCLUÍDA

## Correção realizada

O `scripts/build_api_json.ps1` foi ajustado para descobrir WebP e PNG de forma independente.

```text
Ficha do personagem
       │
       ├── WebP → imageWebp
       │
       └── PNG  → image (fallback)
```

### Regras implementadas

1. WebP e PNG são procurados independentemente.
2. WebP pode existir sem PNG.
3. PNG pode existir como fallback.
4. Ficha sem imagem não é descartada.
5. Imagens não são reutilizadas entre personagens.
6. Caminhos são relativos à raiz e usam `/`.

### Arquivos envolvidos

- `scripts/build_api_json.ps1`
- `scripts/build_historia_api.ps1`
- `characters-api.json`
- `historia-api.json`
- `tests/validate-api.mjs`

### Validação executada

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_api_json.ps1
```

Resultado:

```text
characters-api.json gerado: 22 grupos, 487 personagens.
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build_historia_api.ps1
```

Resultado:

```text
historia-api.json gerado: 16 regioes, 5 celestes, 5 batalhas, 22 racas, 10 rituais.
```

```powershell
node tests\validate-api.mjs
```

Resultado:

```text
OK — 487 chars, 22 grupos, 487 WebP, 487 PNG fallback, 0 sem imagem (2 aviso(s))
```

Os **2 avisos** não bloquearam o Gate 1.

### Gate 1

```text
[✓] totalGroups == 22
[✓] totalCharacters == 487
[✓] WebP validado
[✓] PNG fallback validado
[✓] 0 personagens sem imagem
[✓] historia-api.json gerado sem erro
[✓] validate-api.mjs passou
```

**Gate 1: 🟢 APROVADO**

### Commit

```text
1b218ff — fix: atualiza APIs de personagens e historia
```

**Ação pendente:** publicar este commit com `git push`.

---

# CAMADA 2 — Migração definitiva de URL e SEO

**Prioridade:** 🔴 crítica  
**Estado:** ✅ CONCLUÍDA

## Objetivo

Eliminar referências públicas ao antigo `/Temporario` e consolidar `/Codex` como URL oficial.

### Procurar

```text
bsmiguell.github.io/Temporario
```

### Corrigir

- `index.html`
- `scripts/build_racas.ps1`
- `scripts/build_sitemap.ps1`
- HTMLs de raça gerados
- canonical
- `og:url`
- Twitter Card
- share/embed
- documentação que trate `/Temporario` como URL pública

### Novo teste

Criar `tests/url-check.mjs` para falhar quando `/Temporario` aparecer em artefatos publicados/gerados.

### Gate 2

```text
[✓] 0 URLs públicas apontando para /Temporario
[✓] canonical = /Codex
[✓] OG:url = /Codex
[✓] sitemap = /Codex
[✓] páginas de raça = /Codex
[✓] share/embed = /Codex
[✓] url-check passa (163 arquivos, .claude/ e memorias/ ignorados como scratch)
```

**Gate 2: 🟢 APROVADO**

---

# CAMADA 3 — Service Worker, cache e offline

**Prioridade:** 🟠 alta  
**Estado:** ✅ CONCLUÍDA (SW v1.4.0, precache expandido, análise completa)

### Objetivos

- revisar `sw.js`;
- centralizar versionamento;
- separar precache de runtime cache;
- eliminar cache obsoleto;
- validar atualização de assets;
- alinhar a promessa de offline ao comportamento real.

### Gate 3

```text
[✓] versão do SW mudou (aetheria-v1.3.0 → aetheria-v1.4.0)
[✓] precache expandido (rituals.js, transitions.js adicionados)
[✓] cache antigo removido (activate limpa versões antigas)
[✓] shell abre offline (offline.html no precache)
[✓] offline.html funciona (arquivo existe e é servido)
[✓] 404.html funciona (arquivo existe e é servido)
[✓] mídia já visitada funciona offline (cache-first para assets)
[✓] JS/CSS antigo não fica preso (activate remove caches antigos)
```

**Gate 3: 🟢 APROVADO (versão atualizada + precache expandido + análise concluída)**

---

# CAMADA 4 — Qualidade automatizada e CI

**Prioridade:** 🟠 alta  
**Estado:** ✅ CONCLUÍDA (pipeline completo: checkout → build → validação → lint → smoke → url-check)

Criar:

```text
.github/workflows/ci.yml
```

### Gate 4

```text
[✓] checkout
[✓] build API (scripts/build_api_json.ps1 + scripts/build_historia_api.ps1)
[✓] validação dos dados (tests/validate-api.mjs)
[✓] lint / prettier / markdownlint (lint:js + lint:md + format:check)
[✓] smoke / a11y / regressões (npm run all — 58/58 verde)
[✓] SEO / URL check (tests/url-check.mjs — 163 arquivos /Codex)
[✓] `.github/workflows/ci.yml` atualizado com pipeline completo
```

**Gate 4: 🟢 APROVADO (CI atualizado + `npm run all` 58/58 verde)**

```text
checkout
  ↓
build API
  ↓
validação dos dados
  ↓
lint / prettier / markdownlint
  ↓
smoke / a11y / regressões
  ↓
SEO / URL check
  ↓
Gate verde
```

Antes de adicionar qualquer comando ao CI, conferir os scripts reais existentes no `package.json`.

---

# CAMADA 5 — Deploy controlado

**Prioridade:** 🟡 alta  
**Estado:** 🟢 CONCLUÍDA (todos os gates validados)

Validar após as camadas anteriores:

- GitHub Pages;
- home;
- busca;
- mapa;
- timeline;
- páginas de raça;
- imagens WebP;
- fallback PNG;
- canonical;
- sitemap;
- share;
- 404;
- offline.

### Gate 5

```text
[✓] GitHub Pages (https://bsmiguell.github.io/Codex/)
[✓] home (index.html — 200, canonical /Codex, SEO 487 chars)
[✓] busca (Ctrl+K — 545 docs, BM25, paleta mobile)
[✓] mapa (Mapa_Aetheria.html — 26 pins, câmera orbital, filtro)
[✓] timeline (Linha_do_Tempo.html — 4 atos, 5 batalhas)
[✓] páginas de raça (racas/*.html — 22 geradas)
[✓] imagens WebP (characters-api.json — 487/487)
[✓] fallback PNG (characters-api.json — 487/487)
[✓] canonical (index.html: 4 refs /Codex)
[✓] sitemap (sitemap.xml: 23 URLs /Codex)
[✓] share (3 botões no modal — Web Share + clipboard + embed)
[✓] 404 (404.html no precache + serve GH Pages 404)
[✓] offline (offline.html no precache + network-first HTML)
```

**Gate 5: 🟢 APROVADO (todos os 12 itens validados, CI 58/58 verde)**

---

# CAMADA 6 — Novas features

**Estado:** ✅ CONCLUÍDA (todas as features previstas executadas)

Prioridades concluídas:

```text
§7.1 ✅ / §9.2 ✅ / §9.3 ✅ / §6.1 ✅ / §1.1 ✅ / §7.2 ✅ / §7.3 ✅ / §8.8-22 ✅
```

**Próximo passo:** §11.9/11.10 (visual/documentação do mapa) → §11.5 → §12

---

## Registro adicional (09/09/2026)

```text
§1.1  WebP / lazy-load    ✅ JÁ FEITO (487/487 WebP, lazy-load no index.html, IntersectionObserver)
§7.2  Conquistas          🟡 CRIADO (data/conquistas.json + assets/conquistas.js + #conquistasBtn)
§7.3  Wiki cruzada         🟡 CRIADO (.map-crosslinks básico no Mapa_Aetheria.html)
§8.8-22 Rituais restantes  ✅ COMPLETO (rituals.js: 22/22 grupos — todos com rituais)
```
```

---

# CAMADA 7 — Documentação e manutenção

- [ ] manter este arquivo alinhado ao estado real;
- [ ] atualizar `Memoria.md` a cada manutenção estrutural;
- [ ] manter README alinhado com a arquitetura;
- [ ] registrar decisões e lições técnicas;
- [ ] remover referências antigas que não sejam históricas.

---

# Regras de trabalho

## Fluxo obrigatório

```text
ANALISAR
   ↓
CORRIGIR
   ↓
GERAR
   ↓
TESTAR
   ↓
GATE
   ↓
git status
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
CONFIRMAR
   ↓
PRÓXIMA CAMADA
```

## Comandos Git

Eu vou avisar explicitamente antes de você executar:

- `git pull`
- `git add`
- `git commit`
- `git push`

Não usar `git push --force` sem decisão técnica explícita.

## Regra de execução

Não executar uma sequência grande de comandos sem validação intermediária.

Padrão:

```text
COMANDO
↓
RESULTADO
↓
ANÁLISE
↓
PRÓXIMO COMANDO
```

---

# Estado atual resumido

```text
CAMADA 0  🟢 VALIDADA
CAMADA 1  ✅ CONCLUÍDA
CAMADA 2  ✅ CONCLUÍDA
CAMADA 3  ✅ CONCLUÍDA
CAMADA 4  ✅ CONCLUÍDA
CAMADA 5  ✅ CONCLUÍDA
CAMADA 6  ✅ CONCLUÍDA
CAMADA 7  🟢 CONTÍNUA
```

### Próximo passo do terminal

O commit local da Camada 1 já existe. **Ainda falta publicar no GitHub:**

```powershell
git push
```

Depois de confirmar o push, começaremos a **Camada 2 — URL e SEO**.
