/* Aetheria Codex — Page Entry + Directional Transition Trigger (Q4/2026 §11.12 v5)
 *
 * Responsabilidades (duas):
 *
 *  1) SETAR A DIREÇÃO antes de cada navegação. No clique de um <a>
 *     interno, calculamos a posição espacial do link e gravamos
 *     `data-transition-direction` no <html>. O CSS em
 *     `assets/transitions.css` lê esse atributo via
 *     `html[data-transition-direction="X"]::view-transition-old(root)`
 *     e define qual keyframe roda. A Cross-document View Transitions
 *     API (Chrome 111+, 2026 universal) cuida de fazer A sair + B
 *     entrar com aquele keyframe — ZERO re-exec de scripts, ZERO
 *     cloneNode, ZERO `const has already been declared`.
 *
 *  2) FALLBACK pra browsers sem VT API (raro em 2026 mas existe):
 *     um fade-in de opacity no body via WAAPI puro. SEM transform
 *     (Lição 21ª: `transform` no body cria containing block e
 *     quebra todos os `position: fixed` — .modal abria com 6924px
 *     em vez de 720px). `opacity` é seguro.
 *
 * Regra de posição (4 direções) — baseada no bounding rect do <a>:
 *   - terço superior (y < 33% vp)            → "down"  (A sai pra baixo, B entra de cima)
 *   - terço inferior (y > 66% vp)            → "up"    (A sai pra cima, B entra de baixo)
 *   - metade esquerda  (x < 50% vp)          → "right" (A sai pra esquerda, B entra da direita)
 *   - metade direita   (x >= 50% vp)         → "left"  (A sai pra direita, B entra da esquerda)
 *
 * Por que prioriza vertical sobre horizontal: links de nav (header)
 * tipicamente ficam no topo e devem "empurrar pra baixo" a página
 * nova. Links de footer "puxam pra cima". Links laterais
 * (cards, sidebar) usam horizontal.
 *
 * Respeita:
 *   - body.no-fx: kill switch do usuário
 *   - prefers-reduced-motion: kill switch do SO
 *   - Hierarquia: body.no-fx > prefers-reduced-motion
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  if (typeof document.documentElement === "undefined") return;

  // === KILL SWITCHES ===
  function shouldAnimate() {
    if (document.body && document.body.classList && document.body.classList.contains("no-fx")) return false;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch (e) { /* matchMedia indisponível em browser antigo */ }
    return true;
  }

  // === DETECÇÃO DE SUPORTE À VT API ===
  // A feature fica em `document` (ver https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition).
  // Para cross-doc VT, basta `@view-transition { navigation: auto }` no CSS;
  // o browser implementa sozinho. Não precisa de JS pra iniciar.
  function crossDocVTSupported() {
    // Heurística: VT API foi shipped no Chrome 111 (mar/2023), Edge 111,
    // Opera 97. Safari só no 18.2 (dez/2024). Em 2026, ~96% dos browsers
    // suportam. Checamos se `::view-transition` pseudo existe.
    try {
      return CSS && CSS.supports && CSS.supports("selector(::view-transition-old(root))");
    } catch (e) {
      return false;
    }
  }

  // === DIREÇÃO POR POSIÇÃO ===
  function directionForLink(link) {
    try {
      const r = link.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (!vw || !vh) return "down"; // fallback seguro
      const xRatio = (r.left + r.width / 2) / vw;
      const yRatio = (r.top + r.height / 2) / vh;
      // Vertical domina
      if (yRatio < 0.34) return "down";  // topo → B entra de cima
      if (yRatio > 0.66) return "up";    // base → B entra de baixo
      // Horizontal no meio da página
      if (xRatio < 0.5)  return "right"; // esquerda → B entra da direita
      return "left";                      // direita → B entra da esquerda
    } catch (e) {
      return "down";
    }
  }

  // === FILTRO DE LINKS VÁLIDOS ===
  // Pula: cross-origin, mailto:, tel:, # só, target=_blank, download,
  // modificadores (ctrl/shift/cmd pra abrir em nova aba).
  function isInternalNavLink(link, ev) {
    if (!link || !link.getAttribute) return false;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (link.target && link.target !== "" && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;
    // Modificadores abrem em nova aba — deixa o browser tratar
    if (ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey)) return false;
    // Cross-origin
    try {
      const u = new URL(href, window.location.href);
      if (u.origin !== window.location.origin) return false;
      // Mesma URL exata: sem transição
      if (u.pathname === window.location.pathname && u.search === window.location.search) return false;
    } catch (e) {
      return false;
    }
    return true;
  }

  // === TRIGGER DE DIREÇÃO (rodado no clique) ===
  // Seta o atributo ANTES do browser iniciar a nav, usando capture phase
  // pra rodar antes de qualquer handler de stopPropagation/preventDefault.
  document.addEventListener("click", function (ev) {
    if (!shouldAnimate()) return;
    if (!crossDocVTSupported()) return;
    const link = ev.target && ev.target.closest ? ev.target.closest("a[href]") : null;
    if (!link) return;
    if (!isInternalNavLink(link, ev)) return;
    const dir = directionForLink(link);
    // Seta no <html> (documentElement) — o CSS escuta esse seletor.
    document.documentElement.setAttribute("data-transition-direction", dir);
    // Sessão: se a nav falhar (browser aborta), limpa o atributo
    // depois de 1s pra não contaminar navs futuras.
    setTimeout(function () {
      try { document.documentElement.removeAttribute("data-transition-direction"); } catch (e) {}
    }, 1000);
  }, true); // capture phase

  // === FALLBACK WAAPI (browsers sem VT API) ===
  // Anima OPACITY (não transform — Lição 21ª) no body como fade-in
  // genérico de 350ms. Sem `view-transition-name` no body pra não
  // interferir com a VT API nos browsers que suportam.
  if (!shouldAnimate()) return;
  if (crossDocVTSupported()) return; // VT API cuida da entrada visual
  if (typeof document.body === "undefined") return;
  if (typeof document.body.animate !== "function") return;

  try {
    document.body.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: 350,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both"
      }
    );
  } catch (e) {
    console.warn("[page-entry] fallback WAAPI falhou:", e);
  }
})();
