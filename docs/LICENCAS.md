# Licenças e Créditos — Aetheria Codex

> Documento vivo: declara a licença do próprio projeto, atribui recursos externos (fontes) e referencia as dependências de desenvolvimento. Atualizado em 04/09/2026 (W14, §11.2 do Q4/2026).

**Convenção**: ✅ declarado · 🟡 pendente de decisão · ❌ gap.

---

## 1. Licença do próprio projeto

**Todos os direitos reservados.**

O conteúdo autoral do Aetheria Codex — incluindo mas não se limitando a:

- **Fichas `.md`** dos 487 personagens (textos de história, descrições físicas, atributos)
- **Imagens `.png`/`.webp`** dos personagens e regiões (geradas com auxílio de IA generativa, sob direção autoral de Bruno Miguel)
- **Lore** do mundo (`Historia/Aetheria_*.md`, `historia-api.json` — regiões, batalhas, celestes, rituais)
- **Identidade visual** (`assets/favicon.svg`, runas dos rituais, divisores, molduras, paleta de cores)

— é protegido por direitos autorais. **Nenhuma parte pode ser copiada, modificada, redistribuída ou usada para fins comerciais sem permissão explícita e por escrito do autor.**

Para pedidos de licenciamento, abrir issue no repositório ou contatar o autor.

**Por que esta escolha**: o conteúdo é autoral e a licença "Todos os direitos reservados" é o padrão legal quando nada é declarado. Outros projetos/open-source só podem reutilizar mediante autorização. Esta decisão pode ser revisada no futuro (ex.: adotar CC BY-NC 4.0 para fomentar derivação não-comercial).

---

## 2. Recursos externos com atribuição

### 2.1 Fontes (Google Fonts)

Carregadas via `<link>` em `index.html` (~linha 72) para todas as páginas HTML do site:

| Fonte             | Uso no projeto                            | Licença                                                                                  | URL oficial                                       |
| ----------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Fraunces**      | Tipografia serif dos títulos e corpo      | [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text) | <https://fonts.google.com/specimen/Fraunces>      |
| **Space Grotesk** | Tipografia sans-serif dos elementos de UI | [SIL Open Font License 1.1](https://openfontlicense.org/open-font-license-official-text) | <https://fonts.google.com/specimen/Space+Grotesk> |

A **SIL Open Font License 1.1** permite uso comercial, modificação e redistribuição das fontes sem necessidade de atribuição obrigatória no produto final — esta tabela é mantida por boa prática e para auditabilidade.

### 2.2 Emojis (Unicode)

O projeto usa **emojis Unicode padrão** (📲, 🔗, 📋, 🎲, 📖, 🧬, 📜, ❓, etc.) em vez de bibliotecas de ícones externas. Emojis são parte do padrão Unicode e não requerem atribuição de licença.

### 2.3 Sem imagens, vídeos ou áudio externos

**Verificado em 04/09/2026 (W14)**: `grep` por URLs externas em todos os HTMLs raiz não retornou nenhum link direto a `.png`/`.jpg`/`.webp`/`.gif`/`.svg`/`.mp4`/`.mp3` de terceiros. Todos os assets visuais servidos pelo site são próprios (gerados/direção de Bruno).

**Exceção**: os favicons/og-cover (`assets/favicon-32.png`, `apple-touch-icon.png`, `favicon-192.png`, `og-cover.{jpg,png,svg}`) são **gerados** a partir do SVG canônico em `assets/favicon.svg` (ver `tests/make-favicons.mjs`).

---

## 3. Dependências de desenvolvimento (não vão pro site)

5 pacotes em `devDependencies` (`package.json`) — usados só pelo pipeline de validação local e pelas capturas de tela. **Não são carregados em runtime pelo site** (regra zero-deps em produção, ver README §"Regra zero-deps em runtime").

| Pacote             | Versão   | Licença                                                   | Uso no projeto                                                                 |
| ------------------ | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `playwright`       | ^1.62.1  | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) | Automação de browser headless para `npm run smoke` e os 12 checks de regressão |
| `eslint`           | ^9.13.0  | [MIT](https://opensource.org/licenses/MIT)                | Lint de JS nos `tests/*.mjs` (flat config, 6 regras mínimas)                   |
| `prettier`         | ^3.3.3   | [MIT](https://opensource.org/licenses/MIT)                | Formatter automático (`npm run format` / `format:check`)                       |
| `markdownlint-cli` | ^0.42.0  | [MIT](https://opensource.org/licenses/MIT)                | Lint de Markdown em `*.md` e `scripts/**/*.md` (`npm run lint:md`)             |
| `globals`          | ^15.11.0 | [MIT](https://opensource.org/licenses/MIT)                | Pacote de globals Node 20+ para o ESLint                                       |

Cada pacote traz seu próprio `LICENSE` em `node_modules/<pkg>/LICENSE`. As licenças acima são as declaradas no `package.json` ou no `README` de cada projeto upstream.

---

## 4. Stack técnica própria (não-externo, sem licença)

Tudo o que o **site serve ao usuário final** (`index.html`, `racas/*.html`, `Mapa_Aetheria.html`, `Linha_do_Tempo.html`, `sw.js`, `manifest.webmanifest`, `assets/*.css|js|svg`) é **autoral**:

- **HTML, CSS e JavaScript**: escritos por Bruno Miguel, sem bibliotecas externas em runtime. Stack: ES modules, Web Animations API, `IntersectionObserver`, `<dialog>` nativo, View Transitions, Canvas 2D (mapa).
- **SVGs autorais**: favicon, runas, divisores, molduras, ícones internos — todos desenhados/produzidos pelo autor.
- **Service Worker**: autoral, cache-first para assets + network-first para HTML + fallback `offline.html`.
- **Esquema JSON da API**: `data/characters.schema.json` é autoral.

---

## 5. Pendências (declaradas)

- **Adicionar FAQ/contato** para pedidos de licenciamento formal (hoje só "abrir issue" — placeholder). Pendente: Bruno decidir canal de contato público (email vs formulário).
- **Reavaliar licença do projeto no futuro** se a comunidade pedir (atualmente "Todos os direitos reservados" trava derivação não-comercial).
- **Catalogar o histórico das gerações de imagens** (data, ferramenta IA usada, prompt) — pendente; seria um `docs/image-attribution.md` separado, com ~490 entradas. Custo: 1-2 dias.

---

## Histórico de atualização

- **04/09/2026 (W14, noite)**: criado durante §11.2 do Q4/2026 (ver `Temporario.md`). 5 seções: licença do projeto (Todos os direitos reservados), recursos externos (Google Fonts OFL + emojis Unicode + zero imagens externas), devDeps (5 pacotes com licença), stack técnica autoral, pendências. Resultado: item #12 do `docs/checklist-validado.md` sai de ❌ para ✅.
