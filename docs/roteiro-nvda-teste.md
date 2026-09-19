# Roteiro de teste manual — NVDA real (pós-instalação)

Objetivo: validar a acessibilidade real com leitor de tela NVDA após instalação manual.
Ambiente necessário: Windows + NVDA instalado (`C:\Program Files\NVDA\nvda.exe`), site `Aetheria Codex` aberto no navegador (local ou produção `/Codex`).

## Pré-requisitos
- [ ] NVDA rodando (verificar com `tasklist | findstr nvda` ou `Ctrl+Alt+N`).
- [ ] Site aberto: `index.html` (ou `http://localhost:8124/index.html`).
- [ ] `docs/nvda-teste.md` aberto para registro paralelo.

## Passos (executar na ordem)

### 1. Navegação por teclado — Tab / Shift+Tab
- [ ] Pressionar `Tab`: o foco deve ir para o primeiro elemento interativo (`skip-link` ou botão `Redefinir` ou `Regiões`).
- [ ] Confirmar que o foco é visível (outline) e que o NVDA anuncia o elemento (`skip-link`, `Regiões`, etc.).
- [ ] Pressionar `Shift+Tab`: voltar ao elemento anterior.
- [ ] Confirmar ordem lógica (não pular elementos invisíveis ou ocultos).

### 2. Skip-link (`Pular para o conteúdo principal`)
- [ ] Focar no `skip-link` e pressionar `Enter`.
- [ ] Confirmar que o NVDA anuncia o salto para o conteúdo principal (`main`).
- [ ] Confirmar que o foco vai para o conteúdo, não para o topo da página.

### 3. Paleta (`Ctrl+K`) — busca
- [ ] Pressionar `Ctrl+K`.
- [ ] Confirmar que o modal de busca abre e NVDA anuncia (`aria-modal="true"`).
- [ ] Confirmar `aria-activedescendant` funcionando (NVDA lê a opção selecionada ao navegar com setas).
- [ ] Confirmar a live region (`aria-live`) funcionando (NVDA anuncia resultados).
- [ ] Pressionar `ESC`: modal fecha; NVDA retorna ao elemento anterior (`lastFocusedElement`).

### 4. Modal — onboarding (4 passos) ou `#aboutDialog`
- [ ] Abrir modal (`#aboutDialog` ou onboarding).
- [ ] Confirmar `aria-modal="true"` e `aria-labelledby` funcionando (NVDA anuncia título do modal).
- [ ] Confirmar `tablist` + `tab` + `aria-selected` funcionando (NVDA anuncia o passo/tab selecionado).
- [ ] Confirmar focus trap: `Tab` não sai do modal; `Shift+Tab` retorna ao primeiro elemento.
- [ ] Pressionar `ESC` ou clicar no botão de fechamento: modal fecha; foco retorna ao elemento que abriu (`lastFocusedElement`).

### 5. Botões das camadas do mapa (`Mapa_Aetheria.html`)
- [ ] Ir para `Mapa_Aetheria.html`.
- [ ] Focar nos chips (`Regiões`, `Batalhas`, `Céus`, `Política`, `Magia`, `Rotas`, `Conflitos`).
- [ ] Confirmar que `data-camada` e `aria-pressed` funcionam: NVDA anuncia o estado (`ativo`/`não ativo`) ao alternar.

### 6. Conquistas e busca (`index.html`)
- [ ] Confirmar que `aria-label` nos botões de conquistas e busca funciona.
- [ ] Confirmar que `lazy-load` e `IntersectionObserver` não quebram o foco ou a leitura.

## Registro de resultados

Após cada passo, registrar no arquivo `docs/nvda-teste.md` (ou `memorias/2026-09-19-nvda-evidencia.md` se for criar):
- [ ] Data e hora.
- [ ] Versão do NVDA (`tasklist | findstr nvda` ou `nvda.exe --version`).
- [ ] Versão do site (`index.html` HEAD ou `git rev-parse --short HEAD`).
- [ ] Resultado de cada passo: ✅ (passou) / ❌ (falhou — descrever o erro exato do NVDA).
- [ ] Se falhar: registrar a causa (ex: `aria-modal` não anunciado, focus trap quebrado, `aria-activedescendant` não sincronizado) e criar uma correção no código (não mascarar).

## Critério de fechamento (`Gate E` — 🟢)
- [ ] Todos os passos acima confirmados com NVDA real.
- [ ] 0 problemas críticos (se houver problemas menores, listar e corrigir).
- [ ] `docs/nvda-teste.md` atualizado com evidências.
- [ ] `docs/checklist-validado.md` (#13) marcado como ✅.
- [ ] `Temporario.md` atualizado (`Gate E` 🟢).

Se não for possível concluir todos os passos (ex: ambiente sem NVDA real), registrar honestamente como 🟡 com a causa documentada (não mascarar).
