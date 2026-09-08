# README - Aetheria Codex

> ðŸ¤– **Para assistentes de IA (Claude e similares):** ao iniciar uma conversa sobre este projeto, leia este README por inteiro para entender a estrutura, E DEPOIS LEIA [`Memoria.md`](Memoria.md) â€” Ã© a linha do tempo oficial com todas as alteraÃ§Ãµes, erros jÃ¡ resolvidos, liÃ§Ãµes tÃ©cnicas (armadilhas de PowerShell 5.1) e pendÃªncias. Ao terminar qualquer manutenÃ§Ã£o, adicione uma entrada lÃ¡ com data/hora e commit.

> ðŸ’¡ **Prompt sugerido para iniciar uma nova conversa:** _"Leia o README.md e o Memoria.md deste projeto para absorver todo o contexto antes de qualquer tarefa."_

---

## O que Ã© este projeto

**Aetheria Codex** Ã© um cÃ³dice de personagens de fantasia autoral: **487 personagens** distribuÃ­dos em **22 categorias/raÃ§as**, cada um com ficha em Markdown (histÃ³ria + descriÃ§Ã£o visual detalhada) e arte `.png`. Sobre esse acervo roda um site galeria estÃ¡tico â€” sem backend, sem dependÃªncias, sÃ³ HTML/CSS/JS puro.

O fluxo Ã©: **fichas `.md` nas pastas â†’ scripts PowerShell geram `characters-api.json` e `README.md` â†’ `index.html` consome a API JSON**.

## ðŸ“¸ Galeria do Site

**Home â€” hero com stats e destaque do dia** (tema claro): contadores animados (487 personagens Â· 22 raÃ§as), destaque determinÃ­stico pelo dia do ano (com reroll ðŸŽ²) e CTAs para o mapa e "Surpreenda-me".

![Home â€” hero com destaque do dia](docs/screenshots/index-hero.jpg)

**Cards "Carta do CÃ³dice"** (tema escuro): moldura de manuscrito com cantos que crescem no hover, tilt 3D, foil hologrÃ¡fico que segue o ponteiro, filete e badge na cor da raÃ§a, blur-up das artes.

![Cards-carta com foil holo](docs/screenshots/index-cards.jpg)

**Filtro por raÃ§a:** chips compactos em linha rolÃ¡vel; o ativo Ã© preenchido com a cor da categoria (aqui Onis) e a seleÃ§Ã£o fica na URL (`#g=04_Onis`) â€” deep-link compartilhÃ¡vel.

![Filtro por raÃ§a ativo](docs/screenshots/index-filtros.jpg)

**Modal folheÃ¡vel:** morf cardâ†’modal (View Transitions), abas ðŸ“œ HistÃ³ria (com lore da raÃ§a) e ðŸ§¬ Ficha tÃ©cnica, navegaÃ§Ã£o â€¹ â€º + teclas â†â†’ com contador "N / M", copiar link e focus trap.

![Modal folheÃ¡vel do personagem](docs/screenshots/index-modal.jpg)

**Paleta de comandos (Ctrl+K ou /):** busca fuzzy insensÃ­vel a acentos com ranking global â€” personagens, raÃ§as e aÃ§Ãµes no mesmo resultado (digitar "aat" jÃ¡ traz o Aatrox).

![Paleta de comandos Ctrl+K](docs/screenshots/index-palette.jpg)

**Mapa "Mesa de Guerra Arcana":** mundo 3D em Canvas 2D puro (sem bibliotecas), cÃ¢mera orbital (arrasto/roda/pinÃ§a) e 26 pins â€” 16 regiÃµes, 5 batalhas e 5 cÃ©us â€” alimentados pelo `historia-api.json`.

![Mapa do mundo em 3D](docs/screenshots/mapa.jpg)

**Outros Ã¢ngulos da cÃ¢mera orbital** â€” arrastar gira e inclina o mundo; aqui em vista girada, com os penhascos do relevo em primeiro plano e a geleira Ã  direita:

![Mapa em Ã¢ngulo girado](docs/screenshots/mapa-girado.jpg)

**Pin selecionado:** o painel lateral traz a lore do local (aqui as Cavernas de Obsidiana, casa dos Onis) e o chip HABITANTES com a contagem de personagens â€” clicÃ¡vel, leva Ã  galeria jÃ¡ filtrada.

![Painel de lore do pin aberto](docs/screenshots/mapa-pin.jpg)

**Vista rasante:** com a cÃ¢mera quase na horizontal o relevo aparece de perfil â€” penhascos em silhueta, vulcÃ£o com lava emissiva e os pins dos cÃ©us flutuando sobre o mundo.

![Mapa em vista rasante](docs/screenshots/mapa-rasante.jpg)

**PÃ¡gina de raÃ§a** (1 das 22, todas geradas por `scripts\\build_racas.ps1`): herÃ³i rotativo com autoplay, reveal por caractere, tilt/glare na arte, chips de atributos e deep-link por personagem.

![PÃ¡gina de raÃ§a â€” herÃ³i rotativo](docs/screenshots/raca-hero.jpg)

**Acervo da raÃ§a:** todos os membros clicÃ¡veis (abrem o herÃ³i), navegaÃ§Ã£o entre as 22 raÃ§as e dados embutidos na prÃ³pria pÃ¡gina â€” funciona atÃ© abrindo o arquivo direto (`file://`).

![Acervo completo da raÃ§a](docs/screenshots/raca-acervo.jpg)

## âœ¨ Features Q4/2026 â€” Galeria Visual

Capturas dedicadas das **17 funcionalidades entregues no ciclo Q4/2026** â€” cada bloco descreve **o que o usuÃ¡rio vÃª** + **como a captura foi produzida**. Para os detalhes internos de cada feature, ver "ðŸ–¥ï¸ Como as Telas Funcionam" abaixo (mesmo marcador Â§X.X).

### A. Onboarding & Descoberta (desktop)

**Toast instrutivo do botÃ£o "ðŸ“² Instalar"** â€” detecÃ§Ã£o adaptativa por UA, com 3 variantes (Chromium, iOS Safari, fallback) e micro-copy distinta por engine.
![Toast instrutivo do botao PWA](docs/screenshots/feat-pwa-install-toast.jpg)

_Mecanismo:_ o IIFE `installPwa()` (`index.html` ~linha 3303) testa `beforeinstallprompt` (Chromium), `navigator.standalone` (iOS) e cai num toast genÃ©rico nos demais; aparece em 7s e some sozinho, sÃ³ na 1Âª visita.
_ImplementaÃ§Ã£o:_ capturado com `page.evaluate(() => localStorage.clear())` + reload, viewport 1600x1000, servidor :8080; o Chromium dispara `beforeinstallprompt` mesmo sem o usuÃ¡rio instalar.
_Tecnologias:_ `beforeinstallprompt` event, `e.preventDefault()` (sem isso o Chrome mata o gatilho nativo), `navigator.standalone`, `setTimeout(..., 7000)`, classes `.toast`/`.toast--ios`/`.toast--fallback`.
_DecisÃ£o:_ iOS nÃ£o dispara `beforeinstallprompt` â€” sem o toast instrutivo, o usuÃ¡rio iOS nunca descobriria "Compartilhar â†’ Adicionar Ã  Tela de InÃ­cio" (Â§3.3 Q4).

**Onboarding 4 passos â€” tela 1 (Bem-vindo)** â€” overlay central com 4 dots, botÃµes prev/next/skip, micro-copy de boas-vindas.
![Onboarding 4 passos - tela 1](docs/screenshots/feat-onboarding-passo1.jpg)

_Mecanismo:_ `<div id="onboardOverlay">` em `position:fixed` com backdrop `rgba(0,0,0,.65)`; o passo atual (1/4) Ã© destacado e o progresso fica visÃ­vel nos 4 dots animados.
_ImplementaÃ§Ã£o:_ capturado com `localStorage.removeItem("aetheria.onboarded")` + reload (Playwright), viewport 1600x1000, sem flag de pupulaÃ§Ã£o â€” Ã© a 1Âª visita real.
_Tecnologias:_ `localStorage["aetheria.onboarded"]` com `version:"1"` (sÃ³ mostra de novo se `version !== "1"`), `.is-active` na `.onboard-step[n]`, `@keyframes onboardFadeIn`.
_DecisÃ£o:_ 4 passos com 4 saÃ­das (Pular / Esc / backdrop / Ãºltimo Next = "ComeÃ§ar a explorar") para respeitar tanto apressados quanto curiosos â€” todos persistem em `localStorage` (Â§4.3 Q4).

**Onboarding 4 passos â€” tela 2 apÃ³s click em Next** â€” mesma estrutura, micro-copy de "Explore o cÃ³dice", dot 2/4 ativo.
![Onboarding 4 passos - tela 2 apos Next](docs/screenshots/feat-onboarding-passo2.jpg)

_Mecanismo:_ o click em Next incrementa o Ã­ndice, troca o conteÃºdo do overlay e move o dot ativo com transiÃ§Ã£o CSS de `transform: translateX`; o estado do passo Ã© local (nÃ£o persiste atÃ© o Ãºltimo Next).
_ImplementaÃ§Ã£o:_ capturado com `page.click("#onboardNext")` + `waitForTimeout(300)` (Playwright) para garantir a transiÃ§Ã£o antes do screenshot.
_Tecnologias:_ mesmo overlay do passo 1, `aria-live="polite"` no conteÃºdo, foco automÃ¡tico no botÃ£o Next para navegaÃ§Ã£o por teclado.
_DecisÃ£o:_ a animaÃ§Ã£o do dot Ã© a Ãºnica pista visual de progresso â€” sem ela, o usuÃ¡rio nÃ£o saberia que ainda hÃ¡ 2 passos (Â§4.3 Q4).

**Skip-link a11y (Tab pressionado na home)** â€” o link "Pular para conteÃºdo principal" aparece no canto superior esquerdo, com outline visÃ­vel.
![Skip-link a11y com Tab pressionado](docs/screenshots/feat-skiplink.jpg)

_Mecanismo:_ o `<a href="#mainContent" class="skipLink">` Ã© o primeiro elemento focÃ¡vel do `<body>`; ao receber foco ele ganha `transform: translate(0,0)` e outline `:focus-visible`.
_ImplementaÃ§Ã£o:_ capturado com `page.keyboard.press("Tab")` logo apÃ³s o `goto`, em viewport 1600x1000, sem mouse â€” sÃ³ o foco de teclado ativa o link.
_Tecnologias:_ `:focus-visible`, `transform: translateY(-100%)` â†’ `translateY(0)`, atributo `id="mainContent"` no `<main>`, ARIA `aria-label="Pular para conteÃºdo principal"`.
_DecisÃ£o:_ WCAG 2.4.1 (Bypass Blocks) â€” o usuÃ¡rio de teclado/tecnologia assistiva pula a navegaÃ§Ã£o sem tabular por 30+ chips antes do conteÃºdo (Â§4.1 Q4).

### B. Galeria Aprimorada (desktop)

**DiÃ¡rio de PÃ¡ginas expandido: 3 mini-cards por perÃ­odo** â€” ManhÃ£/Tarde/Noite abaixo do destaque principal; o card do perÃ­odo atual tem borda tingida na cor da raÃ§a.
![Diario de Paginas expandido 3 mini-cards](docs/screenshots/feat-daily-featured-3p.jpg)

_Mecanismo:_ o seed do dia (YYYY-MM-DD) gera 3 personagens determinÃ­sticos (1 por perÃ­odo: â˜€ï¸ ManhÃ£ 5-12h / ðŸŒ¤ï¸ Tarde 12-18h / ðŸŒ™ Noite 18-5h); o card do perÃ­odo corrente (baseado no horÃ¡rio local) recebe classe `.is-now` com borda + fundo na cor da raÃ§a dele.
_ImplementaÃ§Ã£o:_ capturado com `page.addInitScript(() => { Date.now = () => 1700000000000 })` no Playwright para forÃ§ar 14h, mostrando a Tarde ativa; screenshot full-viewport 1600x1000.
_Tecnologias:_ `Intl.DateTimeFormat().hour`, hash determinÃ­stico sobre `seed + periodIndex`, CSS `border: 2px solid var(--race-color)` via `themes.json`.
_DecisÃ£o:_ 1 destaque â†’ 3 opÃ§Ãµes reduz a fricÃ§Ã£o de reroll manual; o usuÃ¡rio sempre vÃª um personagem "do seu turno" sem precisar clicar ðŸŽ² (Â§4.5 Q4).

**Modal scrollado mostrando os 3 botÃµes Share / Copiar link / Embed** â€” aÃ§Ãµes de compartilhamento do personagem, cada uma com Ã­cone e micro-copy prÃ³prios.
![Modal com 3 botoes de share](docs/screenshots/feat-modal-share-3botoes.jpg)

_Mecanismo:_ os 3 botÃµes ficam no rodapÃ© da ficha tÃ©cnica do modal: `#modalShare` usa Web Share API, `#modalShareBtn` usa Clipboard API, `#embedBtn` gera `<iframe>` 400Ã—500 com `loading="lazy"`. Toast de confirmaÃ§Ã£o em todos.
_ImplementaÃ§Ã£o:_ capturado com `page.click(".character-card")` para abrir o modal, depois `page.evaluate(() => { const m = document.querySelector("#modal"); m.scrollTop = m.scrollHeight; })` para revelar os 3 botÃµes.
_Tecnologias:_ `navigator.share({title, text, url})`, `navigator.clipboard.writeText(url)`, `URL.createObjectURL` para o `<iframe>` blob, toast genÃ©rico `.toast--success`.
_DecisÃ£o:_ 3 caminhos cobrem 3 pÃºblicos (mobile share, link copy para chat, embed para blog/wiki) â€” Web Share sozinho exclui desktop e quem quer embedar (Â§4.4 Q4).

**Dialog "Sobre" do footer** â€” `<dialog>` nativo com 4 seÃ§Ãµes (contagens vivas, lista de features, atalhos de teclado, "como tudo Ã© construÃ­do").
![Dialog Sobre do footer](docs/screenshots/feat-about-dialog.jpg)

_Mecanismo:_ `<dialog id="aboutDialog">` aberto por `showModal()` via click no `#aboutLink`; Esc / click-fora / Ã— fecham; scroll travado no `<body>` enquanto aberto.
_ImplementaÃ§Ã£o:_ capturado com `page.click("#aboutLink")` + `waitForSelector("#aboutDialog[open]")` em viewport 1600x1000.
_Tecnologias:_ HTML `<dialog>` (nÃ£o `<div role=dialog>`), `dialog::backdrop`, contador animado `requestAnimationFrame`, atalhos listados com `<kbd>`.
_DecisÃ£o:_ `<dialog>` nativo dÃ¡ focus trap + Esc de graÃ§a; reimplementar com JS puro seria esquecer a borda semÃ¢ntica e provavelmente o backdrop (Â§5.5 Q4).

**Paleta de comandos aberta (Ctrl+K)** â€” busca fuzzy com ranking global, 3 tipos no mesmo resultado (personagens, raÃ§as, aÃ§Ãµes).
![Paleta Ctrl+K aberta](docs/screenshots/feat-palette.jpg)

_Mecanismo:_ modal central com `<input>` focado automaticamente; cada keystroke recalcula o ranking fuzzy insensÃ­vel a acentos e rerenderiza a lista agrupada por tipo (desempate: personagem > raÃ§a > aÃ§Ã£o).
_ImplementaÃ§Ã£o:_ capturado com `page.keyboard.press("Control+k")` (ou `Meta+k` no macOS); o input "aat" foi digitado para mostrar o Aatrox no topo do ranking.
_Tecnologias:_ ARIA `role="combobox"`, matching fuzzy com normalizaÃ§Ã£o NFD + remoÃ§Ã£o de diacrÃ­ticos, `aria-activedescendant` + live region.
_DecisÃ£o:_ "aat" traz o Aatrox entre DemÃ´nios â€” provar que a busca Ã© global, nÃ£o escopada por filtro ativo, Ã© o que diferencia a paleta de um `<select>` comum.

### C. Mapa & Linha do Tempo (desktop)

**Mapa com filtro de raÃ§a (Onis) ativo** â€” pins das outras raÃ§as esmaecidos, chip "Onis" destacado com a cor canÃ´nica.
![Mapa com filtro de raca Onis](docs/screenshots/feat-mapa-filtro-raca.jpg)

_Mecanismo:_ o chip de filtro aplica `opacity:0.25` aos pins cujo `data-race` nÃ£o bate com a raÃ§a selecionada, com transiÃ§Ã£o CSS de 200ms; o chip ativo Ã© preenchido com a cor de `themes.json`.
_ImplementaÃ§Ã£o:_ capturado via `page.evaluate(() => location.hash = "#04_Onis")` (deep-link) + reload, depois `window.__MAPA__.abrir("Cavernas_de_Obsidiana")` no console para prÃ©-abrir o painel da regiÃ£o dos Onis.
_Tecnologias:_ querySelector sobre `g[data-race]`, custom property `--race-onis`, hashchange listener, API de diagnÃ³stico `window.__MAPA__` (`abrir`, `camera`, `estado`, `ids`, `exportarVista`).
_DecisÃ£o:_ o filtro via hash fecha o circuito mapa â†” galeria â†” APIs â€” o mesmo `#<folder>` funciona nos dois lados (Â§6.3 Q4).

**Linha do Tempo narrativa do mundo** â€” 4 atos cinematogrÃ¡ficos com Ken Burns nos quadros de batalha, do ano 0 ao ano 12.
![Linha do tempo narrativa](docs/screenshots/feat-linha-do-tempo.jpg)

_Mecanismo:_ pÃ¡gina dedicada com timeline horizontal scrollÃ¡vel; cada ato Ã© uma seÃ§Ã£o fullscreen com parallax sutil e revel por caractere nos tÃ­tulos.
_ImplementaÃ§Ã£o:_ capturado em `Linha_do_Tempo.html` servido por `python -m http.server 8080`, viewport 1600x1000, com scroll para o inÃ­cio do Ato 2 (Guerra da Fenda) para mostrar um quadro de batalha.
_Tecnologias:_ `historia-api.json` (mesma fonte do mapa), `assets/timeline.css` + `assets/timeline-data.js`, `requestAnimationFrame` para o Ken Burns, `IntersectionObserver` para o reveal.
_DecisÃ£o:_ consome a mesma `historia-api.json` do mapa â€” mudar a lore em `Aetheria_Dados_do_Mundo.md` reflete nos dois sem retrabalho (Â§9.1 Q4).

### D. Mobile (390Ã—844) â€” paridade das features

Todas as 7 capturas abaixo comprovam que **nada do Q4/2026 Ã© sÃ³ desktop** â€” onboarding, filtros, modal, paleta, mapa, timeline e about dialog tÃªm paridade responsiva.

**Onboarding mobile (390Ã—844)** â€” mesmo overlay de 4 passos, mas o conteÃºdo ocupa quase toda a viewport; botÃ£o Next com target â‰¥44px.
![Onboarding mobile](docs/screenshots/feat-mob-onboarding.jpg)

_Mecanismo:_ o overlay usa `width: min(92vw, 480px)` e padding maior; os botÃµes ficam empilhados verticalmente para acomodar o polegar.
_ImplementaÃ§Ã£o:_ capturado em viewport 390Ã—844 (iPhone 14), `localStorage.removeItem("aetheria.onboarded")` + reload, `isMobile: true` + `hasTouch: true` no contexto Playwright.
_Tecnologias:_ `min(92vw, 480px)`, `@media (max-width: 720px)`, `touch-action: manipulation`, target `min-height: 44px`.
_DecisÃ£o:_ alvo â‰¥44px (WCAG 2.5.5) e empilhamento evitam o "erro do polegar" em 1Âª visita no celular.

**Cards mobile filtrados por DemÃ´nios (05)** â€” grade 1-coluna com chips de raÃ§a condensados no topo rolÃ¡vel.
![Cards mobile filtrados por Demonios](docs/screenshots/feat-mob-cards-demonios.jpg)

_Mecanismo:_ a grade vira `grid-template-columns: 1fr` abaixo de 720px; os chips de filtro viram uma faixa horizontal com `scroll-snap-type: x mandatory`.
_ImplementaÃ§Ã£o:_ capturado apÃ³s `page.goto("index.html#g=05_Demonios")` em viewport 390Ã—844, scroll para a regiÃ£o da grade.
_Tecnologias:_ CSS Grid `grid-template-columns: 1fr`, `scroll-snap-type: x mandatory` no carrossel de chips, blur-up mantido.
_DecisÃ£o:_ 1 coluna no mobile preserva o tilt 3D do card sem cortar a moldura de manuscrito nos 390px de largura.

**Modal mobile** â€” ocupa 100% da viewport, swipe touch para prÃ³ximo/anterior personagem.
![Modal mobile](docs/screenshots/feat-mob-modal.jpg)

_Mecanismo:_ o modal ganha `width: 100vw; height: 100dvh; border-radius: 0` abaixo de 720px; swipe horizontal dispara `stepModal(Â±1)` com threshold de 50px.
_ImplementaÃ§Ã£o:_ capturado com `page.click(".character-card")` em viewport 390Ã—844, apÃ³s `window.scrollTo(0, 800)` para garantir card visÃ­vel.
_Tecnologias:_ `touchstart`/`touchend` em `#modalMedia` com `Math.abs(deltaX) > 50`, `100dvh` (dynamic viewport height), `stepModal()` reusado das setas.
_DecisÃ£o:_ no mobile, as setas â€¹ â€º somem e o swipe vira o gesto natural â€” o handler reusa a mesma funÃ§Ã£o das setas para evitar drift de lÃ³gica.

**Paleta mobile (ativada com "/")** â€” vira folha inferior (bottom sheet) com 92vw de largura, input com `inputmode="search"`.
![Paleta mobile](docs/screenshots/feat-mob-palette.jpg)

_Mecanismo:_ abaixo de 720px a paleta troca de modal central para bottom sheet ancorado no rodapÃ©; o atalho "/" funciona mesmo com teclado virtual aberto.
_ImplementaÃ§Ã£o:_ capturado com `page.keyboard.press("/")` em viewport 390Ã—844, apÃ³s focar no body (nÃ£o em um input) para evitar conflito com a barra do navegador.
_Tecnologias:_ `transform: translateY(100%) â†’ 0`, `inputmode="search"`, `autocapitalize="off"`, `autocomplete="off"`, listener `keydown` no `document`.
_DecisÃ£o:_ Ctrl+K Ã© awkward no celular (sem Ctrl fÃ­sico); "/" Ã© o atalho canÃ´nico do Spotlight/Gmail-mobile e jÃ¡ era parte do spec.

**Mapa mobile (390Ã—844)** â€” Canvas 2D com pinÃ§a (2 dedos) e toque longo para abrir painel, cÃ¢mera com limites de pitch para nÃ£o furar o relevo.
![Mapa mobile](docs/screenshots/feat-mob-mapa.jpg)

_Mecanismo:_ a cÃ¢mera responde a `touchstart`/`touchmove`/`touchend` com 1 dedo = orbital, 2 dedos = pan + zoom; o painel de lore vira um sheet inferior.
_ImplementaÃ§Ã£o:_ capturado em `Mapa_Aetheria.html` viewport 390Ã—844, com `window.__MAPA__.camera({yaw: 0.3, pitch: 0.8, dist: 1.4})` para uma vista 3/4 de boa legibilidade.
_Tecnologias:_ `TouchEvent.touches`, distÃ¢ncia euclidiana entre 2 dedos para zoom, `pointer-events: none` no sheet inferior quando fechado, debounce de 16ms.
_DecisÃ£o:_ Canvas 2D puro escala sem custo (zero deps), e os 2 modos de toque nÃ£o conflitam com o scroll da pÃ¡gina (`touch-action: none` sÃ³ no canvas).

**Linha do Tempo mobile** â€” timeline vertical com cards empilhados, Ken Burns preservado nos quadros.
![Linha do tempo mobile](docs/screenshots/feat-mob-linha-do-tempo.jpg)

_Mecanismo:_ a timeline horizontal vira vertical (`flex-direction: column`) abaixo de 720px; os atos ocupam `min-height: 100dvh` cada para preservar o ritmo cinematogrÃ¡fico.
_ImplementaÃ§Ã£o:_ capturado em `Linha_do_Tempo.html` viewport 390Ã—844, com scroll para o Ato 3 (ErupÃ§Ã£o do Abismo) onde o vulcÃ£o com lava emissiva Ã© mais visÃ­vel.
_Tecnologias:_ `@media (orientation: portrait)` + `flex-direction: column`, `scroll-snap-type: y mandatory` opcional, Ken Burns com `transform-origin: center`.
_DecisÃ£o:_ a inversÃ£o horizontalâ†’vertical Ã© mandatÃ³ria no portrait â€” manter horizontal forÃ§aria o usuÃ¡rio a girar o celular pra cada ato.

**About dialog mobile** â€” `<dialog>` ocupando 100dvh, scroll interno no conteÃºdo (nÃ£o no body).
![About mobile](docs/screenshots/feat-mob-about.jpg)

_Mecanismo:_ o `<dialog>` ganha `width: 100vw; height: 100dvh; border-radius: 0` e o conteÃºdo interno rola com `overflow-y: auto` no prÃ³prio dialog (nÃ£o no body).
_ImplementaÃ§Ã£o:_ capturado com `page.click("#aboutLink")` em viewport 390Ã—844, scroll para a seÃ§Ã£o "Atalhos de teclado" para mostrar a lista de `<kbd>`.
_Tecnologias:_ `<dialog>` nativo + `100dvh`, `overscroll-behavior: contain` no conteÃºdo, `<kbd>` estilizado com borda inferior 2px.
_DecisÃ£o:_ scroll interno evita o "rubber-band" duplo (body + dialog) que dÃ¡ em alguns Androids quando ambos rolam.

## Estrutura do Projeto

| Caminho                | FunÃ§Ã£o                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `codex/`               | As 22 pastas numeradas (`codex\\01_Humanos` a `codex\\22_Bersek`) â€” uma categoria/raÃ§a por pasta; dentro, o arquivo `Aetheria_Codex_de_*.md` com as fichas + os PNGs/WebPs dos personagens                                                                                                     |
| `index.html`           | Site galeria (tema claro/escuro, busca, filtros por categoria, modal folheÃ¡vel, PWA, onboarding, share/embed) â€” consome `characters-api.json`                                                                                                                                                  |
| `Mapa_Aetheria.html`   | Mapa 3D do mundo "Mesa de Guerra Arcana" (Canvas 2D puro, 26 pins, cÃ¢mera orbital, filtro raÃ§a/era, export PNG) â€” consome `historia-api.json`                                                                                                                                                 |
| `Linha_do_Tempo.html`  | Linha do tempo narrativa do mundo (4 atos cinematogrÃ¡ficos + 5 batalhas Ã©picas) â€” gerada de `historia-api.json`                                                                                                                                                                               |
| `offline.html`         | PÃ¡gina de fallback do Service Worker (offline-first)                                                                                                                                                                                                                                             |
| `racas/`               | 22 pÃ¡ginas de raÃ§a geradas pelo `scripts\\build_racas.ps1` â€” showcase rotativo dos membros, lore, acervo, rituais e navegaÃ§Ã£o entre raÃ§as (dados embutidos, funciona em file://)                                                                                                           |
| `assets/`              | Recursos estÃ¡ticos compartilhados: `codex.css` (105 KB, 22 raÃ§as), `rituals.js` (10 rituais do modal), `transitions.js` (transiÃ§Ãµes de pÃ¡gina), `timeline.css`+`timeline-data.js`, subpastas `brand/`, `ornaments/`, `textures/`, `ui/`, `videos/`, Ã­cones (favicon, apple-touch, og-cover) |
| `data/`                | Configs estÃ¡ticas: `themes.json` (cor/Ã­cone das 22 raÃ§as â€” fonte canÃ´nica Ãºnica) + `characters.schema.json` (schema JSON da API)                                                                                                                                                           |
| `Historia/`            | Lore autoral do mundo (narrativa livre) + `Aetheria_Dados_do_Mundo.md`, a fonte estruturada da API da histÃ³ria (16 regiÃµes, 5 batalhas, 5 celestes, 22 raÃ§as, 10 rituais)                                                                                                                      |
| `characters-api.json`  | API estÃ¡tica gerada â€” Ãºnica fonte de dados do site (22 grupos, 487 personagens, sem array flat)                                                                                                                                                                                               |
| `historia-api.json`    | API estÃ¡tica da histÃ³ria (regiÃµes, celestes, batalhas, raÃ§as e rituais) â€” consumida pelo mapa, racas e linha do tempo                                                                                                                                                                       |
| `manifest.webmanifest` | Manifesto PWA (3 Ã­cones, 4 shortcuts, pt-BR) â€” gerado por `scripts\\build_manifest.ps1`                                                                                                                                                                                                        |
| `sw.js`                | Service Worker (network-first p/ HTML, cache-first p/ assets, offline.html, `skipWaiting`+`clients.claim`)                                                                                                                                                                                        |
| `Memoria.md`           | ðŸ“Œ Linha do tempo oficial do projeto: alteraÃ§Ãµes, erros/correÃ§Ãµes, liÃ§Ãµes tÃ©cnicas, pendÃªncias â€” LER PRIMEIRO em toda sessÃ£o                                                                                                                                                         |
| `Temporario.md`        | ðŸ“‹ Backlog Q4/2026 consolidado (status dos 10 itens + 39 subitens do plano, prÃ³ximas sugestÃµes)                                                                                                                                                                                               |
| `graphify-out/`        | ðŸ•¸ï¸ Grafo de conhecimento do projeto (skill `/graphify`) â€” ver seÃ§Ã£o prÃ³pria abaixo                                                                                                                                                                                                       |
| `docs/`                | `screenshots/` (28 capturas JPEG: 11 da galeria base + 17 da galeria Q4/2026) + `relatorio-arte.md` (gerado por `relatorio_arte.py`)                                                                                                                                                              |
| `tests/`               | 15 testes Node (Playwright) + 2 utilitÃ¡rios Python + 2 scripts Node utilitÃ¡rios â€” ver seÃ§Ã£o prÃ³pria abaixo                                                                                                                                                                                 |
| `scripts/`             | 12 scripts PowerShell (build/mainutenÃ§Ã£o) + 3 utilitÃ¡rios Python (padronizaÃ§Ã£o/relatÃ³rios) â€” ver tabela dedicada abaixo                                                                                                                                                                   |

## ðŸ–¥ï¸ Como as Telas Funcionam

### `index.html` â€” galeria "EvoluÃ§Ã£o Premium"

- **Dados:** tudo vem do `characters-api.json` via `fetch()` (por isso precisa de servidor local â€” ver "Como Rodar o Site"). Sem backend, sem dependÃªncias.
- **Hero:** contadores count-up em `requestAnimationFrame`, **destaque do dia determinÃ­stico** (dia-do-ano % total, reroll ðŸŽ²) e glow ambiente tingido pela cor da raÃ§a do destaque.
- **Cards-carta:** tilt 3D com um Ãºnico loop rAF para o card sob o cursor; foil holo `color-dodge` guiado pela posiÃ§Ã£o do ponteiro (sÃ³ em `hover: fine` e sem `prefers-reduced-motion`); blur-up das artes; primeira dobra com `fetchpriority=high`, resto lazy.
- **Modal folheÃ¡vel:** morph cardâ†’modal via **View Transitions** (o `view-transition-name` Ã© atribuÃ­do sÃ³ durante a transiÃ§Ã£o e limpo no fim â€” nome duplicado quebra o snapshot); abas HistÃ³ria/Ficha; navegaÃ§Ã£o por teclas â†â†’ sobre os resultados filtrados com deep-link `#<id>`; focus trap de verdade (Tab nÃ£o escapa); lore da raÃ§a vem do `historia-api.json` (fetch tolerante a falha).
- **Paleta Ctrl+K** (ou `/`): personagens + 22 raÃ§as + aÃ§Ãµes num **mesmo ranking global** com desempate por tipo; matching fuzzy insensÃ­vel a acentos; ARIA combobox completo; vira folha no mobile.
- **URL state:** `#g=&q=&sort=&fav=` â€” compatÃ­vel com deep-links antigos (`#<pasta>` do mapa e `#<personagem>`); filtros, busca e favoritos sobrevivem a reload e sÃ£o compartilhÃ¡veis.
- **Auto-load:** sentinel com IntersectionObserver (rootMargin 900px) carrega mais cards ao rolar; o botÃ£o "Carregar mais" continua como fallback e Ã© o caminho Ãºnico com reduced-motion.
- **Temas:** 22 cores/Ã­cones de raÃ§a aplicados a cards, modal, filtros e glow; claro/escuro (a 1Âª visita respeita `prefers-color-scheme`); tema, favoritos e header fixado persistem em `localStorage`; personagem sem arte ganha placeholder local desenhado (monograma + hachura na cor da categoria).

### `racas/*.html` â€” 22 pÃ¡ginas de raÃ§a (geradas)

- **Geradas por `scripts\\build_racas.ps1`** a partir da API â€” nunca edite os HTMLs Ã  mÃ£o: mude o template do script e regenere. Guard interno confere a soma de membros contra o JSON.
- **Dados embutidos** no payload `#race-data` dentro de cada pÃ¡gina â†’ funciona em `file://`, sem servidor e sem fetch.
- **HerÃ³i rotativo:** autoplay de 7s com barra de progresso nos dots, trocas animadas por WAAPI, reveal do nome por caractere, tilt 3D + glare + Ken Burns na arte; a pausa por hover vale SÃ“ no palco (nÃ£o na pÃ¡gina inteira) e `focusin` pausa no herÃ³i todo (acessibilidade).
- **Deep-link `#<id>`** abre direto no personagem (listener `hashchange` cobre navegaÃ§Ã£o same-document); ficha lateral mostra os 6 atributos da ficha; acervo clicÃ¡vel; setas â€¹ â€º e Ã­ndice das 22 raÃ§as; tema persistido em `localStorage.racasTheme`.
- **Reveals Ã  prova de falha:** o conteÃºdo nasce VISÃVEL no CSS; o estado oculto `.pre-reveal` sÃ³ Ã© aplicado via JS quando `IntersectionObserver` existe, com sweep de seguranÃ§a de 900ms â€” sem JS ou com IO morto, nada fica invisÃ­vel (liÃ§Ã£o do "bug dos reveals", ver `Memoria.md`).

### `Mapa_Aetheria.html` â€” Mesa de Guerra Arcana

- **Canvas 2D puro** (zero bibliotecas): heightmap procedural com biomas por regiÃ£o, cÃ¢mera orbital (arrasto/roda/pinÃ§a/duplo-clique reset), painter algorithm com flat shading e nÃ©voa, lava conectada e veios emissivos.
- **26 pins clicÃ¡veis** (16 regiÃµes + 5 batalhas + 5 cÃ©us) consumindo `historia-api.json`, com fallback embutido completo para `file://` (o fetch Ã© pulado sem ruÃ­do).
- **Filtro por raÃ§a + era** (W5): chips de camada (RegiÃµes / Batalhas / CÃ©us) + filtro de raÃ§a (deep-link `#<folder>`) â€” fecha o circuito mapaâ†”galeriaâ†”APIs.
- **Rota narrativa entre pins** (Â§6.2 Q4): 5 batalhas encadeadas em 4 atos cinematogrÃ¡ficos com transiÃ§Ã£o visual; navegaÃ§Ã£o pela timeline dentro do prÃ³prio mapa.
- **Exportar vista como PNG** (Â§6.4 Q4): botÃ£o "ðŸ“¸ Salvar vista" gera `aetheria-mapa-<timestamp>.png` 1280Ã—720 (esconde HUDs durante a captura e restaura no callback).
- **Painel lateral** com a lore do local e chips HABITANTES/COMBATENTES que abrem a galeria filtrada (`index.html#<pasta>`).
- **API de diagnÃ³stico `window.__MAPA__`:** `estado()` (cÃ¢mera, painel, camadas), `abrir(id)`, `camera({yaw,pitch,dist})`, `telaDePOI(id)`, `ids()` e `exportarVista()` â€” feita para testes automatizados; foi assim que as capturas de outros Ã¢ngulos do README foram tiradas (o mapa Ã© Canvas, pins nÃ£o sÃ£o elementos do DOM).

### `Linha_do_Tempo.html` â€” narrativa do mundo

- **4 atos cinematogrÃ¡ficos + 5 batalhas** (Inverno Eterno â†’ Guerra da Fenda â†’ ErupÃ§Ã£o do Abismo â†’ Verao do Vazio), do ano 0 ao ano 12.
- Gerada a partir de `historia-api.json` (consome a mesma fonte do mapa) â€” funciona em `file://` via fallback.
- Mesma estÃ©tica dark-first das pÃ¡ginas de raÃ§a, com Ken Burns nos quadros de batalha e revel por caractere nos tÃ­tulos.
- `assets/timeline.css` + `assets/timeline-data.js` sÃ£o os assets especÃ­ficos desta pÃ¡gina.

### PWA & Service Worker

- **Manifest** (`manifest.webmanifest`, gerado por `scripts\\build_manifest.ps1`): 3 Ã­cones (192/32/180), 4 shortcuts (Mapa, Os Aspectos, Alvamortos, DemÃ´nios do Caos), `display: standalone`, `theme_color: #1a120e`, categorias `books/entertainment/lifestyle`, `lang: pt-BR`.
- **Service Worker** (`sw.js`): network-first para HTML (versÃ£o nova sempre chega), cache-first para assets estÃ¡ticos (`PRECACHE_URLS`), `MAX_RUNTIME=200` entradas, `skipWaiting` + `clients.claim` para atualizaÃ§Ã£o imediata, fallback `offline.html` quando o fetch falha.
- **BotÃ£o "ðŸ“² Instalar" no header** (Â§3.3 Q4): detecta `beforeinstallprompt` (Chromium/Android/Desktop), iOS Safari via toast instrutivo de 7s ("Compartilhar â†’ Adicionar Ã  Tela de InÃ­cio"), Firefox/outros via toast explicativo; some quando `display-mode: standalone` ou `navigator.standalone`.
- **Fallback offline** (`offline.html`): pÃ¡gina leve (1 KB de CSS prÃ³prio) servida pelo SW quando o fetch do HTML principal falha; mesmo tema dark-first do site.

### Features de descoberta & UX

- **DiÃ¡rio de PÃ¡ginas diÃ¡rio expandido** (Â§4.5 Q4): 1 destaque â†’ 3 mini-cards por perÃ­odo (â˜€ï¸ ManhÃ£ 5-12h / ðŸŒ¤ï¸ Tarde 12-18h / ðŸŒ™ Noite 18-5h), determinÃ­stico por seed do dia; click no mini-card troca o destaque principal. O card do perÃ­odo atual fica com borda + fundo tingido na cor da raÃ§a.
- **Cross-fade cinematogrÃ¡fico** (Â§4.6 Q4): troca de destaque usa 2 layers (`#current` / `#incoming`) com `featureArtOut` 700ms + `setTimeout` 730ms de cleanup (monotÃ´nico via token â€” cliques rÃ¡pidos nÃ£o corrompem estado). Sem WAAPI, sÃ³ CSS keyframes + classes. CompatÃ­vel com `prefers-reduced-motion`.
- **Onboarding 4 passos** (Â§4.3 Q4): overlay com 4 passos (Bem-vindo / Explore o cÃ³dice / Mapa & rituais / Buscar & favoritar), 4 dots, prev/next/skip, 4 caminhos de saÃ­da (Pular, Esc, backdrop, Ãºltimo Next); persistÃªncia em `localStorage["aetheria.onboarded"]` com `version:"1"`.
- **Dialog "Sobre"** (Â§5.5 Q4): `<dialog id="aboutDialog">` com 4 seÃ§Ãµes (contagens vivas, lista de features, atalhos de teclado, "Como tudo Ã© construÃ­do"); abre via `#aboutLink` no footer, fecha por Esc / click-fora / botÃ£o.
- **Compartilhar (3 botÃµes no modal)** (Â§4.4 Q4): `#modalShare` (SVG â†’ Web Share API), `#modalShareBtn` (ðŸ”— Copiar link, fallback clipboard), `#embedBtn` (ðŸ“‹ Embed, gera `<iframe>` 400Ã—500 com `loading="lazy"`). Toast de confirmaÃ§Ã£o em todos.
- **Lazy-load agressivo de PNGs** (Â§1.3 Q4): 3 zonas no `index.html` â€” (1) **eager** para os 6 primeiros cards (`loading="eager" fetchpriority="high" decoding="async"`), (2) **native lazy** para cards 6-17 (`loading="lazy" decoding="async"`), (3) **IO-gated** para cards 18+ (`<img data-src="...">` resolvido por `IntersectionObserver` com `rootMargin: 500px` que copia `data-src`â†’`src` e remove o atributo). Todas as `<img>` tÃªm `width="1024" height="1024"` (CLS=0) + `decoding="async"` (libera main thread). Fallback: `loading="lazy"` nativo sem JS (cards iniciais) + `<source>` WebP com `imageWebp` (Â§1.1). Boot: â‰¤9 requests de imagem (6 eager + 3 lazy nativo do fold visÃ­vel em 1600Ã—1000) vs 18+ antes.
- **A11y** (Â§4.1+Â§4.2 Q4): skip-link para `#mainContent`, MICRO_COPY personalizado para 22 raÃ§as, top-3 sugestÃµes no empty-state dos filtros, contraste WCAG 4.5:1 em todas as 22 cores de tema (via `bestInk` com threshold `L > 0.18` calibrado), alvos â‰¥44px no touch, `prefers-reduced-motion` global zerando 6 media queries + guard JS, swipe touch no modal (handler `touchstart`/`touchend` em `#modalMedia` com threshold 50px reusando `stepModal`).
- **Favoritos persistentes:** `localStorage.aetheriaFavs` (Set serializado como array), badge de coraÃ§Ã£o tingido na cor da raÃ§a, atalho via paleta Ctrl+K (aÃ§Ã£o "Ver favoritos").

## ðŸ“‚ Scripts (`scripts/`)

| Script                     | FunÃ§Ã£o                                                                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build_api_json.ps1`       | 1. **OBRIGATÃ“RIO** â€” parseia `codex/*/Aetheria_Codex_de_*.md` e gera `characters-api.json` (22 grupos, sem array flat, com PNG+WebP links e guard de pastas com arte sem ficha)                                                            |
| `build_historia_api.ps1`   | 2. **OBRIGATÃ“RIO** â€” parseia `Historia/Aetheria_Dados_do_Mundo.md` e gera `historia-api.json` (16 regiÃµes, 5 batalhas, 5 celestes, 22 raÃ§as, 10 rituais, com validaÃ§Ã£o cruzada raÃ§aâ†”regiÃ£oâ†”batalha)                              |
| `build_readme.ps1`         | 3. Gera este `README.md` a partir do `characters-api.json` (seÃ§Ãµes descritivas manuais + elenco automÃ¡tico das 22 raÃ§as)                                                                                                                  |
| `build_racas.ps1`          | 4. Gera as 22 pÃ¡ginas em `racas/*.html` a partir da API (template Ãºnico com payload `[ordered]` embutido, OG/Twitter meta, herÃ³i rotativo, rituais, guard de soma de membros contra JSON)                                                  |
| `build_manifest.ps1`       | 5. Gera `manifest.webmanifest` (PWA) com top 3 raÃ§as como shortcuts e contagens vivas                                                                                                                                                        |
| `build_sitemap.ps1`        | 6. Gera `sitemap.xml` a partir dos `racas/*.html` e HTMLs raiz (index, mapa, linha do tempo)                                                                                                                                                  |
| `make_og_cover.ps1`        | Gera a imagem de capa OG (`assets/og-cover.{jpg,png,svg}`) usada em todas as meta-tags de compartilhamento                                                                                                                                    |
| `absorb_sync.ps1`          | Absorve pasta `NN_*` recriada na raiz pela sync externa do Bruno (idÃªntico por hash descarta, novo move, DIFERENTE guarda como `*.CONFLITO-SYNC.*`); rodar apÃ³s cada sincronizaÃ§Ã£o OU atualizar o destino da sync para `...\Teste\codex\` |
| `fix_encoding.ps1`         | Repara mojibake double-encoded UTF-8â†”CP1252 nos `.md`/`.ps1` (estratÃ©gia: por segmento, preservando partes jÃ¡ corretas; **SEMPRE rodar antes de qualquer diff**)                                                                          |
| `fix_image_typos.ps1`      | Renomeia PNGs com typos inequÃ­vocos (Levenshtein â‰¤2 + pareamento Ãºnico por pasta); casos ambÃ­guos ignorados com aviso                                                                                                                    |
| `dedupe_images.ps1`        | Remove PNGs/WebPs duplicados por hash SHA-256 dentro de cada pasta `codex/NN_*`                                                                                                                                                               |
| `check_missing_images.ps1` | DiagnÃ³stico: classifica cada personagem sem imagem em SEM-ARTE (45), COLISÃƒO (8) ou EM-OUTRA-PASTA (2) â€” somente leitura                                                                                                                  |
| `pad_demonios.py`          | Padroniza `codex/05_Demonios/Aetheria_Codex_de_DemÃ´nios.md` no formato bulleted-bold (Python 3, UTF-8, idempotente, 6 asserts)                                                                                                               |
| `pad_preambulos.py`        | Sincroniza os preÃ¢mbulos (texto antes do primeiro `## N.`) das 22 raÃ§as com a contagem real de fichas (regex mÃ­nima, idempotente)                                                                                                          |
| `relatorio_arte.py`        | Gera `docs/relatorio-arte.md` (somente leitura) listando Ã³rfÃ£os, cÃ³pias idÃªnticas, homÃ´nimos e quase-duplicatas                                                                                                                          |

## Formatos das Fichas (.md)

Cada personagem comeÃ§a numa linha numerada (`## N. Nome, epÃ­teto` ou `N. Nome`) e os campos podem aparecer em **trÃªs estilos** â€” o parser da API aceita todos:

1. **Bulleted-bold** (ex.: Humanos): `- **HistÃ³ria Original:** texto...`
2. **Texto simples** (ex.: Monstros): campos como parÃ¡grafos `HistÃ³ria Original:` seguidos de linha em branco
3. **Esquema Mutantes**: rÃ³tulos prÃ³prios â€” `Classe MutagÃªnica:`, `Anatomia & Detalhes:`, `Atributos Ãšnicos:`

RÃ³tulos reconhecidos pelo parser (com variaÃ§Ãµes): HistÃ³ria Original Â· RaÃ§a/Categoria/Ordem/Classe MutagÃªnica/DemonÃ­aca/Mutante Â· DNA & Raio-X Visual Â· FÃ­sico & Postura Â· Rosto & Cabelo/Anatomia/Detalhes Â· VestuÃ¡rio Â· Paleta de Cores Â· AcessÃ³rios & Equipamento/Atributos Ãšnicos.

## Regras Importantes

- **Encoding:** tudo em UTF-8; os `.ps1` precisam estar salvos **com BOM** (PowerShell 5.1). Nunca salvar `.md` em ANSI.
- **Imagens:** o matching Ã© estrito (nome exato ou normalizado, sem reuso entre personagens). PNG com nome errado fica Ã³rfÃ£o de propÃ³sito â€” ver `Memoria.md` se quiser recuperÃ¡-lo.
- **README e API sÃ£o gerados:** edite sempre os `.md` das pastas e regenere; nunca edite `README.md`/`characters-api.json` diretamente.
- **Git versiona sÃ³ textos:** PNGs ficam fora via `.gitignore` (~1,3 GB).

## ðŸŽ›ï¸ Comando Â«atualizaÃ§Ã£o de personagensÂ»

Quando disser **"personagens atualizados"**, **"atualizaÃ§Ã£o de personagem(s)"**, **"atualizei o codex"** ou **"checar o que mudou"**, o assistente deve executar o checklist padrÃ£o documentado em [`Memoria.md`](Memoria.md) (seÃ§Ã£o COMANDOS): reparar encoding â†’ comparar elenco por pasta â†’ escanear imagens novas/Ã³rfÃ£s/duplicadas â†’ regenerar API+README â†’ relatÃ³rio do que precisa de `.md`, de ediÃ§Ã£o ou de nomes.

## ðŸ•¸ï¸ Grafo de Conhecimento (`/graphify`)

O projeto tem um **grafo de conhecimento navegÃ¡vel em [`graphify-out/`](graphify-out/)**, gerado pela skill `/graphify`: **298 nÃ³s / 311 arestas / 72 comunidades** (snapshot de 02/09/2026 â€” reflete padronizaÃ§Ã£o DemÃ´nios, W7+W8 rituais, sincronizaÃ§Ã£o de preÃ¢mbulos e Bersek novo; labels rotulados em pt-BR via Louvain + override manual).

Arquivos: `graph.html` (visualizaÃ§Ã£o interativa â€” abra no navegador) Â· `GRAPH_REPORT.md` (relatÃ³rio com god nodes, conexÃµes surpreendentes e perguntas sugeridas) Â· `graph.json` (dados brutos do grafo) Â· `manifest.json` + `cost.json` (estado p/ atualizaÃ§Ã£o incremental â€” 3 runs / 139k input / 48k output totais).

**God nodes (top-10):** `abrirRitual()` 14 arestas Â· `Galeria Aetheria Codex` 13 Â· `boot()` 13 Â· `esc()` 12 Â· `goTo()` 10 Â· `splitTitle()` 7 Â· `renderStage()` 7 Â· `Codex dos Bersek de Aetheria (A FÃºria do Ãšltimo Voto)` 6 Â· `initParticles()` 6 Â· `buildRoster()` 6.

**Hiperarestas principais:** 22 raÃ§as do codex (hyperedge canÃ´nica) Â· 8 personagens homÃ´nimos entre pastas (Ulthar, Vanek, Aurelion, Garrion, Kyran, Nyxaris, Stellaris, Vespera â€” marcados como variantes intencionais) Â· Conflito central Deuses/Aspectos vs Seres do Vazio (ErupÃ§Ã£o do Abismo).

**Para assistentes de IA:** ao responder perguntas sobre lore, personagens, regiÃµes, batalhas ou arquitetura do site, consulte o grafo em vez de re-ler tudo:

- `/graphify query "pergunta"` â€” resposta atravessando o grafo (BFS amplo; `--dfs` rastreia um caminho; `--budget 1500` limita tokens)
- `/graphify path "Entidade A" "Entidade B"` â€” caminho mais curto entre dois conceitos
- `/graphify explain "NomeDoNo"` â€” explicaÃ§Ã£o em linguagem simples de um nÃ³
- `/graphify --update` â€” re-extrai sÃ³ arquivos novos/alterados (rodar apÃ³s mudanÃ§as grandes de conteÃºdo)

_O `graph.json` Ã© um snapshot: depois de adicionar/editar muitas fichas ou pÃ¡ginas, rode `/graphify --update` para atualizÃ¡-lo. A skill detecta 128 nÃ³s isolados (lacunas de documentaÃ§Ã£o) e 41 comunidades finas (<3 nÃ³s) â€” query explore ajuda a mapear._

## Como Rodar o Site

O `fetch()` do JSON nÃ£o funciona abrindo o arquivo direto no navegador (restriÃ§Ã£o de origem `file://`). Use um servidor local:

```powershell
# opÃ§Ã£o 1 - Python
python -m http.server 8080
# opÃ§Ã£o 2 - Node
npx serve .
```

Depois abra `http://localhost:8080`.

## Como Regenerar os Artefatos

```powershell
# 1. APIS (obrigatÃ³rias antes de qualquer outra)
powershell -File scripts\build_api_json.ps1        # gera characters-api.json a partir das fichas .md
powershell -File scripts\build_historia_api.ps1    # gera historia-api.json a partir de Historia/Aetheria_Dados_do_Mundo.md
# 2. HTMLs + manifest + sitemap (consomem as APIs)
powershell -File scripts\build_manifest.ps1        # gera manifest.webmanifest (PWA) com top 3 racas
powershell -File scripts\build_sitemap.ps1         # gera sitemap.xml a partir de racas/*.html
powershell -File scripts\build_racas.ps1           # gera as 22 pÃ¡ginas de raÃ§a em racas/
# 3. DocumentaÃ§Ã£o (lÃª o characters-api.json)
powershell -File scripts\build_readme.ps1          # gera este README.md
```

## ðŸ§ª Testes & Comandos npm

Pipeline de validaÃ§Ã£o local (`npm run all`, <30s) encadeia `validate` + `smoke` + `screens`. PrÃ©-requisito: servidor local em `:8080` (`python -m http.server 8080` ou `npx serve .`).

### Comandos disponÃ­veis

```bash
npm run validate              # 1. validate-api.mjs (standalone, sem browser) â€” 22 grupos, slugs Ãºnicos, imagens existem
npm run smoke                 # 2. smoke E2E (47 checks via Playwright local) â€” filtros, modal, Ctrl+K, contraste WCAG, reduced-motion, visible-focus, swipe touch, cross-fade, herÃ³i, rituais
npm run screens               # 3. 6 capturas PNG 1600x1000 (claro/escuro/filtros/modal/Ctrl+K/mapa)
npm run all                   # 4. validate + smoke + screens em sequÃªncia (= npm run all)

# Checks individuais (regressÃ£o focada):
npm run og-check              # meta-tags OG dinÃ¢micas por personagem (18 checks)
npm run share-check           # 3 botÃµes de share no modal â€” Web Share + clipboard + embed (9 checks)
npm run lazy-check            # Â§1.3 lazy-load agressivo â€” 3 zonas (eager/native/IO-gated) + width/height + decoding=async (10 checks)
npm run about-check           # dialog "Sobre" do footer (4 checks)
npm run onboarding-check      # overlay de 4 passos, persistÃªncia, 4 saÃ­das (11 checks)
npm run a11y-empty-check      # MICRO_COPY 22 raÃ§as + top-3 empty state + skip-link (8 checks)
npm run timeline-check        # pÃ¡gina Linha_do_Tempo â€” 4 atos + 5 batalhas (12 checks)
npm run narrativa-check       # rota narrativa entre 5 pins de batalha (13 checks)
npm run mapa-filtros-check    # filtro de raÃ§a/era no mapa + deep-link (10 checks)
npm run mapa-export-check     # export PNG da vista do mapa (9 checks)

# Qualidade de cÃ³digo:
npm run lint                  # ESLint (tests/) + markdownlint (raiz + scripts/**/*.md)
npm run lint:js               # sÃ³ ESLint
npm run lint:md               # sÃ³ markdownlint
npm run format                # prettier --write .
npm run format:check          # prettier --check . (CI mode)
```

### DependÃªncias de desenvolvimento (5)

| Pacote             | VersÃ£o  | FunÃ§Ã£o                                                                                                                                                  |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint`           | ^9.13.0  | Lint JS (flat config, escopo `tests/`, 6 regras mÃ­nimas: no-undef/no-var/eqeqeq/no-empty como error; no-unused-vars/prefer-const como warn)              |
| `globals`          | ^15.11.0 | Pacote de globals Node para ESLint                                                                                                                        |
| `prettier`         | ^3.3.3   | Formatter (printWidth 100, trailingComma "none", endOfLine "lf")                                                                                          |
| `markdownlint-cli` | ^0.42.0  | Lint Markdown (4 regras ativas: MD009/MD012/MD024/MD046; 7 desabilitadas por falso-positivo em prosa)                                                     |
| `playwright`       | ^1.62.1  | SDK de automaÃ§Ã£o browser (Chromium headless) â€” usado por `tests/feature-shots.mjs` para capturar as 17 telas Q4/2026 em `docs/screenshots/feat-*.jpg` |

**Regra zero-deps em runtime:** o site (`index.html`, `racas/*.html`, `Mapa_Aetheria.html`, `Linha_do_Tempo.html`) NÃƒO usa nenhuma biblioteca externa â€” GSAP foi removido em 02/09/2026; tudo Ã© HTML + CSS + JS puro. As 5 deps acima sÃ£o sÃ³ para o pipeline de validaÃ§Ã£o local + capturas de tela.

### Testes utilitÃ¡rios (Python + Node)

| Arquivo                   | FunÃ§Ã£o                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/analyze.mjs`       | Analisa os artefatos gerados e emite relatÃ³rio HTML (pÃ¡gina de QA local)                                                                            |
| `tests/convert_webp.py`   | Pipeline PNGâ†’WebP (489/489 convertido em 02/09; converte cada `codex/NN_*/X.png` em `X.webp` irmÃ£o)                                                |
| `tests/make-favicons.mjs` | Gera os favicons `favicon-{32,192}.png` e `apple-touch-icon.png` a partir do SVG canÃ´nico                                                            |
| `tests/make-og-cover.mjs` | Gera a imagem de capa OG (`og-cover.{jpg,png}`) â€” wrapper Node do `scripts/make_og_cover.ps1`                                                       |
| `tests/screenshots.mjs`   | Captura as 6 telas principais (1600Ã—1000) em `tests/screenshots/` (gerado, ignorado do git)                                                          |
| `tests/feature-shots.mjs` | Captura as 17 telas das features Q4/2026 (10 desktop 1600Ã—1000 + 7 mobile 390Ã—844) em `docs/screenshots/feat-*.jpg` â€” galeria visual deste README |
| `tests/validate-api.mjs`  | Valida o `characters-api.json` standalone: 22 grupos, slugs Ãºnicos, todas imagens existem em disco, 2 avisos esperados (homÃ´nimos Ulthar/Vanek)     |

**ConvenÃ§Ã£o de testes Playwright:** `serviceWorkers: "block"` em todos os 12 contextos (LiÃ§Ã£o 11Âª â€” SW segura versÃ£o antiga em testes), `permissions: ["clipboard-read", "clipboard-write"]` para os share-checks, `installPageListeners(page)` em cada bloco (helper que captura `pageerror` + console error + HTTP â‰¥ 400 + `requestfailed` de JS/CSS/fonts).

## Resumo Por Categoria

Total: **487 personagens** em **22 categorias** (API gerada em 2026-09-02).

<details>
<summary><strong>01_Humanos</strong> â€” 24 personagens <code>Aetheria_Codex_de_Humano.md</code></summary>

Aokiji, o Sentinela do Gelo Eterno | Astrid, a FÃºria das Montanhas de Ferro | Brakkus, o Colosso de Titanio | Broly, a Ira do VÃ³rtice Astral | Davy Jones, o BarÃ£o do Abismo Profundo | Dragon, o Arconte do Vento RevolucionÃ¡rio | Enjin, o NÃ´made das Areias Quentes | Garp, o Punho do Imperador | J-V-3, o Cavaleiro da Chama Eterna | Laxus, o Senhor do TrovÃ£o Dourado | Maki, a LÃ¢mina sem Sombra | Raiden, o Invicto do CÃ­rculo de Pedra | Rocks, o Flagelo dos Sete Mares | Scopper, o MercenÃ¡rio dos Machados Duplos | Shanks, o Imperador da Vontade Suprema | Solaria, a Rapier de Luz Solar | Star, a Comandante da Ordem Suprema | Toji, o CaÃ§ador Sem Magia | Chougoukin-Kurobikari-V-1, o TitÃ£ de Metal Vivo | Emporio-Alnino, o Mestre da Corrente Viva | Irelia, a DanÃ§arina da LÃ¢mina de Flores | Kaelen-V-1, o Vigia das RuÃ­nas Douradas | Sakata-Kintoki-V-1, o HerÃ³i do Machado Ãureo | Shamrock, o Espadachim da Coroa Partida

</details>

<details>
<summary><strong>02_Mutantes</strong> â€” 48 personagens <code>Aetheria_Codex_de_Mutantes.md</code></summary>

All-For-One-V-1 | Aegis-Prime-V-1 | Bloodfang-V-1 | Bone-Kore-V-1 | Borok-V-1 | Crush-V-1 | Dracorex-V-1 | Echo-Kore-V-1 | Fenrir-Rugidor-V-1 | Frostbite-V-1 | Gale-V-1 | Gargoyle-V-1 | Genzo-V-1 | Gorefist-V-1 | Gorgath-V-1 | Grimm-V-1 | Malakar | Vermis | Lobisomem-V-1 | Malagor-V-1 | Nomu-V-1 | Pyrowolf-V-1 | Rage-Kore-V-1 | Rin-Kore-V-1 | Savage-Mane-V-1 | Savage-V-1 | Scraptron-V-1 | Tri-Gorgon-V-1 | Ulthar | Valerion-V-1 | Valthier-V-1 | Vector-X-V-1 | Vespera | Vyrn-Wing-V-1 | Wargen-V-1 | Xylion-V-1 | Zephyros-V-1 | Zylithor-V-1 | Kruul-V-1, o GuardiÃ£o da Crosta Primordial | Morrigan-V-1, a Soberana da Lua Corrompida | Tusker-V-1, o BÃºfalo de Guerra Infinita | Venath-V-1, a Predadora da NÃ©voa Rubra | Vespis-V-1, a Rainha dos FerrÃµes de Prata | Amalgam-V-1, o Colosso da Mente Parasita | Clawbound-V-1, o Gigante Muscular de TitÃ£ | Umbracryst-V-1, o GuardiÃ£o de Amestista Obscura | Gargor-V-1, o Senhor das Asas de Granito | Lupus-V-1, o Berserker Lupino de Olhos HeterocromÃ¡ticos

</details>

<details>
<summary><strong>03_Ordens_E_Guerreiros</strong> â€” 22 personagens <code>Aetheria_Codex_de_Ordens_e_Guerreiros.md</code></summary>

Frostmourne-V-1 | Grom-V-1 | Ironshroud-V-1 | Kaldor-Kore | Ksante-V-1 | Leonidas-V-1 | Lord-Kaelthorn | Maw-Shin | Mortalis-V-1 | Nameless-King-V-1 | Pyroth-V-1 | Skull-Knight-V-1 | Solano-V-1 | Soul-of-Cinder-V-1 | Thrum-V-1 | Uriel-V-1 | Vesperion | Vorgreth | Vorgrim-Ironspine | Vulcan-V-1 | Xerxes | Zephyrus-V-1

</details>

<details>
<summary><strong>04_Onis</strong> â€” 31 personagens <code>Aetheria_Codex_de_Onis.md</code></summary>

Akuma-Ghen-V-1 | Akuma-V-1 | Brutalus-V-1 | Enma-Okon-V-1 | General-Krogan-V-1 | Grakthor-V-1 | Kaguro-V-1 | Kagutsuchi-Kore-V-1 | Khorvath-V-1 | Kore-Magma-V-1 | Kurenai-Rage-V-1 | Kurogane-Enma-V-1 | Kurokaze-V-1 | Kyofu-Kore-V-1 | Kyo-Zen-V-1 | Onikar-V-1 | Raijin-Kore-V-1 | Ryu-Kore-V-1 | Vulkathor-V-1 | Xan-Drakar-V-1 | Zanka-Kore-V-1 | Zan-Kuro-V-1 | Zen-Kore-Shin-V-1 | Zorthar-V-1 | Akatoran-V-1 | Hakuzen-V-1 | Kagezangetsu-V-1 | Gokudou-V-1 | Kurorag-V-1 | Onigore-V-1 | Yami-Kuren-V-1

</details>

<details>
<summary><strong>05_Demonios</strong> â€” 41 personagens <code>Aetheria_Codex_de_DemÃ´nios.md</code></summary>

Aatrox-V-1, o Tirano de Sangue | Abaddom-V-1, o Arauto da RuÃ­na | Belial-V-1, o Lorde da CorrupÃ§Ã£o | Black-Sperm-V-1, a Sombra Singular | Cyber-Gore-V-1, o Algoz TecnolÃ³gico | Denji-V-1, o DemÃ´nio da Serra | Drakhar, o Senhor dos BÃ¡rbaros CaÃ­dos | Drakon-Ghen-V-1, o DragÃ£o Abissal | Dread-V-1, o Espreitador dos Pesadelos | Garrison-V-1, o Executor de AÃ§o Negro | Golden-Sperm-V-1, o Imperador Reluzente | Golgoth-V-1, o TitÃ£ Sombrio | Grunbeld-V-2, o DragÃ£o de Prata | Ignarok-V-1, o Destruidor VulcÃ¢nico | Kaelthas-V-1, o Feiticeiro Espectral | Kokushibo-V-1, o Primeiro Espadachim DemÃ´nio | Monspiet-V-1, o Cavalheiro da Chama Negra | Mordecai-V-1, o SatÃ­rico do Abismo | Nalakor-V-1, o Sacerdote das Asas CaÃ­das | Nocthira-V-1, a Dama das Rosas Negras | Nocth-V-1, o Anjo do Aniquilamento | Obsidius-V-1, o Berserker Rochoso | Onyx-V-1, o AutÃ´mato Sombrio | Oongway-V-1, o Mestre do Sangue Antigo | Orochi-V-1, o Rei das MÃºltiplas Serpentes | Platinum-Sperm-V-1, a Velocidade Absoluta | Pyros-V-1, o IncendiÃ¡rio do Abismo | Sad-Sperm-V-1, o Lamento Silencioso | Shadowweaver-V-1, o TecelÃ£o do Tormento | Sion-V-1, o Colosso ImparÃ¡vel | Surtur-V-1, o Gigante do Apocalipse | Swain-V-1, o Estrategista DemonÃ­aco | Thul-V-1, o Eremita dos Chifres Prateados | Topo-V-1, o TitÃ£ Violeta | Umbras-V-1, o Rei da Penumbra Fendida | Valdrak-V-1, o DragÃ£o de Armadura Carmesim | Vyrnath-V-1, a Sombra Rastejante | Xar-Koth-V-1, o Lorde do CÃ­rculo RÃºnico | Yoru-V-1, a CrianÃ§a da MaledicÃªncia | Yrul-V-1, o Anjo DemonÃ­aco Agachado | Zoran-V-1, o Mestre do Vento Sombrio

</details>

<details>
<summary><strong>06_Desconhecidos</strong> â€” 15 personagens <code>Aetheria_Codex_de_Desconhecidos.md</code></summary>

Astra-V-1 | Aurelion-V-1 | Corvusgrem-V-1 | Dreadcleaver | Helioth-V-1 | Kyran-V-1 | Noxaris | Noxaris-V-1 | Nyxaris-V-1 | Stellaris-V-1 | Trifacies | Vanek-V-1 | Corpus-Karmex-V-1 | Glorivex-V-1 | Mimesis-Solar-V-1

</details>

<details>
<summary><strong>07_Gigantes</strong> â€” 26 personagens <code>Aetheria_Codex_de_Gigantes.md</code></summary>

Asura-V-1 | Azure-Kore-V-1 | Bjornar-V-1 | Bjorn-V-1 | Brawn-V-1 | Charizard | Crimson-V-1 | Elbaf-V-1 | Golem-V-1 | Harald-V-1 | Hydraskull-V-1 | Kabuto-V-1 | Katsu-V-1 | Kos-V-1 | Ladon-V-1 | Loki-V-1 | Nidhogg-V-1 | Pyreus-V-1 | Radahn-V-1 | Torstein-V-1 | Typhon-V-1 | Zinogre-V-1 | Zorthak-V-1 | Zrik-V-1 | Malgorg-V-1, o Colosso da Falha de Basalto | Nyxthos-V-1, o Gigante do Eclipse Frio

</details>

<details>
<summary><strong>08_Monstros</strong> â€” 37 personagens <code>Aetheria_Codex_de_Monstros.md</code></summary>

Battle-Beast-V-1 | Behemoth-V-1 | Besouro-V-1 | Davy-Jones-V-1 | Drakul-Zar-V-1 | Dredgor-V-1 | Garchomp-V-1 | Gargul-V-1 | Glacius-V-1 | Gloop-V-1 | Gnash-V-1 | Gorathos-V-1 | Gorgoroth-V-1 | Guardian-Ape-V-1 | Ignisaurus-V-1 | Karkas-V-1 | Kongor-V-1 | Kragor-V-1 | Kragos-V-1 | Magmoros-V-1 | Magnar-V-1 | Morbidus-V-1 | Necros-V-1 | Nero-V-1 | Nihilus-V-1 | Ossifago-V-1 | Pyrogon-V-1 | Pyroxen-V-1 | Ratatoskr-V-1 | Root-V-1 | Shao-Kahn-V-1 | Vermithrax-V-1 | Vexor-V-1 | Volcanus-V-1 | Vorgas-V-1 | Zarich-V-1 | Ghul-Drakar-V-1

</details>

<details>
<summary><strong>09_Semi_Deuses</strong> â€” 30 personagens <code>Aetheria_Codex_de_Semideuses.md</code></summary>

Aethel-V-1 | Aether-Kore-V-1 | Astrolon-V-1 | Aureon-V-1 | Aurion-V-1 | Azazel-V-1 | Dio-Heaven-V-1 | Enel-V-1 | Haku-V-1 | Hercules-V-1 | Ignis-V-1 | Malenia-V-2 | Morthan-V-1 | Nika-V-1 | Ossuaria-V-1 | Radagon-of-the-Golden-Order-V-1 | Shikon-Kore-V-1 | Skarner-V-1 | Skel-Shin-V-1 | Sun-Wukong-V-1 | Volthazar-V-1 | Xul'gath-V-1 | Zaza-V-1 | Dividade-V-1 | Rei-Demonio-V-1, o Soberano da Queda | Solenya-V-1, a Filha da Aurora Viva | Sun-Apeiron-V-1, o Infinito Incandescente | Sylvaris-V-1, o Regente do Bosque Celeste | Thalric-V-1, o MarÃ©-Forte | The-Radiance-V-1, a Ãšltima Claridade

</details>

<details>
<summary><strong>10_Os_Observadores</strong> â€” 9 personagens <code>Aetheria_Codex_de_Observadores.md</code></summary>

Auroris | Ecliptus | Meridianis | Nyxaris | Stellaris | Umbralis | Vorlaris | Abissal | Orbe-Negro

</details>

<details>
<summary><strong>11_Seres_Do_Vazio</strong> â€” 20 personagens <code>Aetheria_Codex_de_Seres_do_Vazio.md</code></summary>

Abyss-Maw-V-1 | Akuma-Zan-V-1 | Alaric-V-1 | Apex-V-1 | Astrion-V-1 | Erebus-V-1 | Kael'thas-V-1 | Kael-V-1 | Kallysta-V-1 | Kalthazar-V-1 | Koku-Kore-V-1 | Korvessa-Nightlash-V-1 | Kraivos-V-1 | Krown-Kore-V-1 | Mahoraga-V-1 | Malakor-V-1 | Multi-Supreme-V-1 | Oblivion-V-1 | Wraith-V-1 | Xanthos-V-1

</details>

<details>
<summary><strong>12_Magos</strong> â€” 23 personagens <code>Aetheria_Codex_de_Magos.md</code></summary>

Abyssal-V-1 | Aetheron | Baelor Hellfire | Corvus-V-1 | Drakhen-V-1 | Dravok-V-1 | Gowther-Original-1 | Hajime | Ignisara-V-1 | Infernus Ember | jin-enjoji-V-1, o Arquivista do Selo Ardente | Kaelen Ignis | Kagutsuchi-Ren-V-1, o Herdeiro da Chama Divina | Lucien-Blackthorn-V-1, o Mago das Trevas Nobres | Malakai-V-1 | Melina-V-1 | Mortis-V-1 | Shinso-V-1 | Thomas-V-1 | Valerius-V-1, o Mestre da MarÃ© Arcana | Vanek | Void-V-1 | Zephyr-V-1

</details>

<details>
<summary><strong>13_Deuses</strong> â€” 18 personagens <code>Aetheria_Codex_de_Deuses.md</code></summary>

Bone-Plume-V-1 | Clangoro-V-1 | Gorvum-V-1 | Kaminari-V-1 | Oculon-V-1 | Ossuarion-V-1 | Renji-V-1 | Saint-Vail-V-1 | Solkhamun-V-1 | Solvain-V-1 | Ulthar | Valeriana-V-1 | Vanek | Vyrn-V-1 | Aethon-Sol-V-1, o Pai do Disco Incandescente | Florivax, a Deusa das EstaÃ§Ãµes Vivas | Mycelium-V-1, o Deus do Subsolo Silencioso | Pyrhen-V-1, o Deus da Cinza Sagrada

</details>

<details>
<summary><strong>14_Demonios_Do_Caos</strong> â€” 11 personagens <code>Aetheria_Codex_de_DemÃ´nios_do_Caos.md</code></summary>

Aetheronen | Florivaxes | Garrion-V-1 | Jinx-V-1 | Kestrel | Gorgonax | Nyxar | Stel | Vespera-Jest-V-1 | Harlex-V-1, o Rasgador de Ecos | Mimikor-V-1, a Risada da RuÃ­na

</details>

<details>
<summary><strong>15_Os_Aspectos</strong> â€” 9 personagens <code>Aetheria_Codex_de_Aspectos.md</code></summary>

Aurelion, o Aspecto do Caos MagmÃ¡tico | Auriel-Bane, o Aspecto do Sol Dourado | Fulminox, o Aspecto da Tempestade Fulgurante | Kyran, o Aspecto da Forja VulcÃ¢nica | Corvax, o Aspecto do PressÃ¡gio | Eonis-V-1, o Aspecto da Eternidade | Garrion, o Aspecto da RuÃ­na Santa | Solvyr-V-1, o Aspecto da Harmonia Ardente | Umbryx-V-1, o Aspecto da Penumbra Profunda

</details>

<details>
<summary><strong>16_Alvamortos</strong> â€” 20 personagens <code>Aetheria_Codex_de_Alvamortos.md</code></summary>

Cyclor-V-1, o Ciclope do Selo Espiritual | Espiral, o Mestre do VÃ³rtice Espiritual | Jinkai, o Monge do Juramento Sombrio | Kage-Rin, o PrÃ­ncipe das Sombras Silenciosas | Kanshorin, o TitÃ£ da AurÃ©ola de Pedra | Maelstrom, o VÃ³rtice de Almas Agitadas | Mogara, o GuardiÃ£o das Profundezas | Oboroshin, o Fantasma da Lua Sangrenta | Omen-V-1, o Mensageiro do Eclipse Sagrado | Orokuzan, o Imperador da Montanha de Ferro | Reigetsu, o Santo Patriarca das Chamas Frias | Renshomaru, o Guerreiro do Manto das Sombras | Rudoraka, o Carcereiro dos Ossos Vazios | Sankai, o Eremita da NÃ©voa Ancestral | Tenshuro, o Arquiteto do Labirinto de Almas | Yagama, o CaÃ§ador de Sombras | Yambara, a Sacerdotisa da Cinza Serena | Zagetsu, o Ceifador do CrepÃºsculo Negro | Zangetsuo, o GuardiÃ£o do Vazio Eterno | Zangureki, o Carrasco do TrovÃ£o Negro

</details>

<details>
<summary><strong>17_Meio_Sangue</strong> â€” 18 personagens <code>Aetheria_Codex_de_Meio_Sangue.md</code></summary>

Barba-Branca-V-1, o Almirante dos Mares Distantes | Boreas-V-1, o TitÃ£ das Montanhas Geladas | Ibaraki-V-1, o DemÃ´nio da Escama Roxa | Kaido-V-1, o DragÃ£o de Chifres de Touro | Kakuzu-V-1, o Tanoeiro de CoraÃ§Ãµes | Kross-V-1, o Pirata do Mar de Sangue | Kuma-V-1, o Tirano Pacifista | Muscular-V-1, o Berserker das Fibras Vivas | Satan-Soul-V-1, a Imperatriz Sucubus | Solan-V-1, o Guerreiro do Fogo Solar | Tentaku-V-1, o GuardiÃ£o da Mente Abissal | Thalrok-V-1, o Rei TritÃ£o do Tridente Sagrado | Thorne-V-1, o Cavaleiro CaÃ­do da Asa Negra | Vespera-V-1, a Dama da Noite Eterna | Jax-V-1, o Duelista do Sangue Raro | Kaelia-V-1, a GuardiÃ£ das Duas Linhagens | Katauri-V-2, a Voz da Noite Profunda | Saru-V-1, o Herdeiro da FÃºria Selvagem

</details>

<details>
<summary><strong>18_Canibais</strong> â€” 21 personagens <code>Aetheria_Codex_de_Canibais.md</code></summary>

Dokuro-V-1, o Mascarado da Caveira DemonÃ­aca | Ganshu-V-1, o Lutador dos Olhos de Ã‰ter | Goku-Maru-V-1, o Colosso do EstÃ´mago do Inferno | Kultar-V-1, o Wendigo do Chifre Flamejante | Ryogen-V-1, o Punho do DragÃ£o Faminto | Soma-V-1, o Carrasco da Garra Branca | Sukuna-V-1, o Rei Absoluto das MutaÃ§Ãµes | Zankoku-V-1, o Flagelo dos Oito BraÃ§os | Akashura-V-1, o Ceifador da Fome Rubra | Dokan-V-1, o Cronista das MandÃ­bulas Rachadas | Fushu-V-1, o Arauto do Banquete Sem Fim | Gashu-V-1, o ArtesÃ£o das LÃ¢minas de Osso | Haru-V-1, o Jovem da Garganta Selvagem | Kurobane-V-1, o Executor da Asa Negra | Mugen-V-1, o Infinito da Carnificina | Nyxarar, o Senhor do Capuz do Eclipse | Reigen-V-1, o Punho do Julgamento Feral | Ryouka-V-1, a CaÃ§adora da Lua Esfomeada | Shigoro-V-1, o Devorador de Tambores | Yatsura-V-1, o Silencioso das Costelas Vivas | Ranka-V-1, a Fera do Penhasco Carmesim

</details>

<details>
<summary><strong>19_Barbaros</strong> â€” 17 personagens <code>Aetheria_Codex_de_Barbaros.md</code></summary>

Dreadhelm-V-1, o Flagelo de AÃ§o | Godfrey-First-Elden-Lord-V-1, o Rei leÃ£o dos Ermos | Gorak-V-1, o CaÃ§ador das Bestas Primordiais | Kragnar-V-1, o Carrasco de Sangue | Leon-V-1, o Berserker Descorrentado | Nosferatu-Zodd-V-1, o Ogro dos Picos Nevados | Ragnar-V-1, a Tempestade de LÃ¢minas | Thorgan-Bloodaxe-V-1, o BÃ¡rbaro da LÃ¢mina Sangrenta | Thorin-V-1, o GuardiÃ£o de Ferro | Brynja-V-1, a Escudeira da Neve Selvagem | Grimrok-Ironhide-V-1, o Filho da Pele de Ferro | Helga-V-1, a Tempestade da Serra | Skald-V-1, o Cantor das Guerras Antigas | Torak-V-1, o Rompe-Montanhas | Ulfar-V-1, o Lobo do CrepÃºsculo | Ulfr-Wolfclan-V-1, o Herdeiro da Matilha | Varg-V-1, o Alfa da Ruptura

</details>

<details>
<summary><strong>20_AmaldiÃ§oados</strong> â€” 8 personagens <code>Aetheria_Codex_de_AmaldiÃ§oados.md</code></summary>

Crimson-Kore, o Inseto de Carmim | Pyre-V-1, o Rei Esqueleto da Chama Eterna | Scylla-V-1, a Sacerdotisa de Pedra Serpentina | Zenon-V-1, o Monge da OraÃ§Ã£o Abrasadora | Zoro-V-1, o Asura da Dupla Calamidade | Irma-Friede-V-1, a Santa do Gelo Quebrado | Ren-Kuro-V-1, o Portador da Noite Ferida | Takushiro-Ouma, o Asceta do Lamento

</details>

<details>
<summary><strong>21_Demonios_Akuma-Gani</strong> â€” 30 personagens <code>Aetheria_Codex_de_Demonios_Akuma-Gani.md</code></summary>

Imu-Nerona-V-1, a Coroa Flamejante | Imu-Malakor-V-1, o Arauto Alado | Imu-Gorgath-V-1, o Colosso Vigia | Imu-Brakka-V-1, o Esmagador de Reis | Imu-Kenshin-V-1, a LÃ¢mina Silente | Imu-Morok-V-1, o Eremita de Sete Chifres | Imu-Raijin-V-1, o TrovÃ£o Espiral | Imu-Kusari-V-1, a Carcereira de Almas | Imu-Maguma-V-1, a Senhora das Fissuras | Imu-Ryoba-V-1, o Alabardeiro de Mil Olhos | Imu-Gokuen-V-1, o Pilar Ardente | Imu-Aegis-V-1, o BastiÃ£o Cinzento | Imu-Drakon-V-1, o DracÃ´nico das Profundezas | Imu-Executer-V-1, a Carrasca Escura | Imu-Brawler-V-1, o Pugilista Sinistro | Imu-Kageblade-V-1, o Espada das Sombras | Imu-Spear-V-1, o Lanceiro Alado | Imu-Sumi | Imu-Tengu | Imu-Shuten | Imu-Rikimaru | Imu-Kagewani | Imu-Kage-Solar | Imu-Jorogumo | Imu-Goryu | Imu-Skeletal-Equus | Imu-Tentacle-Sheep | Imu-Infernal-Swine | Imu-Feathered-Wyvern | Imu-Abyssal-Worm

</details>

<details>
<summary><strong>22_Bersek</strong> â€” 9 personagens <code>Aetheria_Codex_de_Berseks.md</code></summary>

Ashura | Guts-V-1 | Kargan-V-1, o Portador do Voto Quebrado | Vhalor-V-1, o Devorador de Juramentos | Xathur-V-1 | Kazelen-V-1, o TecelÃ£o de Sangue | Brakka-V-1, o Cortador de Ossos | Igzis-V-1, a Coluna de Magma | Zarek-V-1, o Arauto do Eclipse

</details>

## API JSON â€” Formato dos Dados

```json
{
  "project": "Aetheria Codex",
  "generatedAt": "2026-09-02",
  "totalGroups": 22,
  "totalCharacters": 487,
  "groups":  [ { "folder": "...", "file": "...", "count": N, "characters": [...] } ]

> O array flat `"characters"` saiu do JSON em 26/08/2026: ele duplicava `groups[].characters` e jÃ¡ havia divergido uma vez. Derive a lista plana dos grupos quando precisar.
}
```

Cada personagem tem:

| Campo             | ConteÃºdo                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `number`          | nÃºmero na ficha                                                                                |
| `title`           | nome completo com epÃ­teto ("X, o Y")                                                           |
| `name` / `id`     | nome base (sem epÃ­teto)                                                                        |
| `file` / `folder` | origem no acervo                                                                                |
| `image`           | caminho relativo do PNG ou `null`                                                               |
| `description`     | histÃ³ria original extraÃ­da                                                                    |
| `attributes`      | `race`, `physical`, `faceAndHair`, `outfit`, `palette`, `equipment` (quando existirem na ficha) |

### Exemplo de uso em JavaScript

```js
const api = await (await fetch("./characters-api.json")).json();

const gigantes = api.groups.find((grupo) => grupo.folder === "07_Gigantes");
console.log(gigantes.count);
console.log(gigantes.characters.filter((c) => c.folder === "07_Gigantes"));
```

---

## ðŸ“‚ Arquivos NecessÃ¡rios para Entender o Projeto (leia nesta ordem)

> **Para assistentes de IA em uma nova sessÃ£o:** leia **nesta ordem** para absorver todo o contexto do projeto antes de qualquer alteraÃ§Ã£o. O **passo 1 (`Memoria.md`) Ã© obrigatÃ³rio** â€” lÃ¡ estÃ¡ a linha do tempo oficial, regras (ex.: `.claude/settings.json` NUNCA Ã© commitado), armadilhas de PowerShell 5.1 e pendÃªncias de conteÃºdo.

Para compreender completamente este projeto, leia os seguintes arquivos na ordem sugerida:

1. **README.md** (este arquivo) â€” visÃ£o geral, estrutura, dependÃªncias, comandos, scripts e funcionamento
2. **Memoria.md** â€” linha do tempo oficial, alteraÃ§Ãµes, erros resolvidos, liÃ§Ãµes tÃ©cnicas e pendÃªncias; leia PRIMEIRO em qualquer sessÃ£o
3. **Temporario.md** â€” backlog Q4/2026 consolidado (status dos 10 itens + 39 subitens, sugestÃµes de prÃ³ximas sessÃµes)
4. **index.html** â€” site galeria estÃ¡tico (consome `characters-api.json`; tema claro/escuro, busca, filtros, modal, paleta Ctrl+K, PWA, onboarding, share/embed)
5. **Mapa_Aetheria.html** â€” mapa 3D do mundo (consome `historia-api.json`; Canvas 2D puro, 26 pins, filtro raÃ§a/era, export PNG, rota narrativa)
6. **Linha_do_Tempo.html** + **assets/timeline.css** + **assets/timeline-data.js** â€” linha narrativa do mundo (4 atos + 5 batalhas)
7. **offline.html** + **sw.js** + **manifest.webmanifest** â€” PWA completa (Service Worker, fallback offline, manifesto com 3 Ã­cones + 4 shortcuts)
8. **assets/codex.css** (105 KB) â€” CSS principal do site (extraÃ­do do `index.html` em 03/09; cacheÃ¡vel cross-page)
9. **assets/rituals.js** â€” motor de 10 rituais do modal (3 DemÃ´nios + 2 Onis + 1 cada em Humanos/Semideuses/Deuses/Monstros/Meio-Sangue)
10. **assets/transitions.js** â€” transiÃ§Ãµes de pÃ¡gina (04_Onis vÃ­deo + 05_Demonios portÃ£o; importado pelo `index.html`)
11. **racas/assets/raca.js** + **racas/assets/raca.css** â€” assets das 22 pÃ¡ginas de raÃ§a geradas (herÃ³i rotativo, rituais, partÃ­culas, reveal)
12. **data/themes.json** â€” tabela Ãºnica de cor/Ã­cone/label das 22 raÃ§as (fonte canÃ´nica; carregada por `index.html` e `build_racas.ps1`)
13. **data/characters.schema.json** â€” schema JSON da API de personagens (referÃªncia para validaÃ§Ã£o; doc pendente Â§5.3)
14. **characters-api.json** â€” API estÃ¡tica de personagens (gerada por `scripts/build_api_json.ps1`)
15. **historia-api.json** â€” API estÃ¡tica da histÃ³ria (gerada por `scripts/build_historia_api.ps1`; inclui `rituais[]` desde 02/09)
16. **scripts/build_api_json.ps1** â€” gerador da API de personagens (PowerShell 5.1 + BOM; 3 formatos de ficha aceitos)
17. **scripts/build_historia_api.ps1** â€” gerador da API da histÃ³ria (suporta `## RITUAL:` desde 02/09)
18. **scripts/build_racas.ps1** â€” gerador das 22 pÃ¡ginas de raÃ§a (`racas/`)
19. **scripts/build_readme.ps1** â€” gerador deste prÃ³prio README.md
20. **scripts/build_manifest.ps1** + **scripts/build_sitemap.ps1** + **scripts/make_og_cover.ps1** â€” geradores de PWA + sitemap + OG cover
21. **scripts/fix_encoding.ps1** + **fix_image_typos.ps1** + **dedupe_images.ps1** + **check_missing_images.ps1** + **absorb_sync.ps1** â€” utilitÃ¡rios de manutenÃ§Ã£o
22. **scripts/pad_demonios.py** + **pad_preambulos.py** + **relatorio_arte.py** â€” utilitÃ¡rios Python (padronizaÃ§Ã£o de fichas, sincronizaÃ§Ã£o de preÃ¢mbulos, relatÃ³rio de arte)
23. **tests/validate-api.mjs** + **tests/smoke.mjs** + **tests/screenshots.mjs** â€” pipeline `npm run all` (validate + smoke 47 checks + 6 screenshots)
24. **tests/og-check.mjs** + **share-check.mjs** + **about-check.mjs** + **onboarding-check.mjs** + **a11y-empty-check.mjs** + **timeline-check.mjs** + **narrativa-check.mjs** + **mapa-filtros-check.mjs** + **mapa-export-check.mjs** + **lazy-check.mjs** â€” 10 checks focados (98 asserÃ§Ãµes totais)
25. **package.json** + **.prettierrc** + **eslint.config.js** + **.markdownlint.json** â€” tooling de qualidade (`npm run lint`, `npm run format:check`)
26. **docs/screenshots/** (28 capturas JPEG: 11 galeria base + 17 Q4/2026) + **docs/relatorio-arte.md** â€” material visual e diagnÃ³stico de conteÃºdo
27. **graphify-out/** â€” grafo de conhecimento (`/graphify` â€” 298 nÃ³s / 311 arestas / 72 comunidades)
28. **codex/** â€” fichas `.md` e imagens `.png`/`.webp` dos 487 personagens (fonte primÃ¡ria; 22 pastas numeradas)
29. **Historia/** â€” lore autoral do mundo (4 `.md`: Aetheria_Codex_do_Mundo, Aetheria_Dados_do_Mundo, Aetheria_Geografia_e_Batalhas, Aetheria_Super_Historia)

---

## ðŸŒ Link Publicado

Site publicado: https://bsmiguell.github.io/Codex/
Sitemap: https://bsmiguell.github.io/Temporario/sitemap.xml

---

_Ãšltima geraÃ§Ã£o: 06/09/2026 19:42 por `build_readme.ps1`. HistÃ³rico e pendÃªncias: [`Memoria.md`](Memoria.md)._
