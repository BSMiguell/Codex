// transitions-check.mjs — Teste do §11.12 v5 (Q4/2026 — Cross-doc View Transitions API direcional)
//
// Estratégia v5: ZERO SPA, ZERO cloneNode, ZERO re-exec de scripts.
// A Cross-document View Transitions API (Chrome 111+, 2026 universal)
// cuida do ciclo A→B lendo os keyframes em `assets/transitions.css`,
// que por sua vez leem `data-transition-direction` setado no <html>
// por `page-entry.js` no clique do <a>.
//
// Cobre:
//   1. F5 + reload + 5 navegações: zero console error, zero const
//      duplicado, sem regressão do bug do v3
//   2. transitions.css carrega em 5 hubs + 22 raças = 27 HTMLs
//   3. page-entry.js carrega em 5 hubs + 22 raças = 27 HTMLs
//   4. Cross-doc VT API suportada no browser de teste
//   5. page-entry.js seta data-transition-direction correto baseado na
//      posição do <a>: topo→down, base→up, esquerda→right, direita→left
//   6. body.no-fx: kill switch (transição não roda)
//   7. prefers-reduced-motion: kill switch
//   8. v3 morto: page-transitions.js, transition-direction.js, gsap.min.js
//      retornam 404
//
// Falha = exit code != 0. Sucesso = exit 0 + "X passed, 0 failed".

import { chromium } from "playwright";

const BASE = process.env.AETHERIA_URL || "http://localhost:8124";

const browser = await chromium.launch({ headless: true });
let pass = 0,
  fail = 0;
const check = (n, ok, d = "") => {
  console.log(`${ok ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
  ok ? pass++ : fail++;
};

// Lista completa: 5 hubs + 22 raças
const HUBS = ["index.html", "Mapa_Aetheria.html", "Linha_do_Tempo.html", "404.html", "offline.html"];
const RACAS = [
  "alvamortos", "amaldicoados", "barbaros", "bersek", "canibais", "demonios",
  "demoniosakumagani", "demoniosdocaos", "desconhecidos", "deuses", "gigantes",
  "humanos", "magos", "meiosangue", "monstros", "mutantes", "onis",
  "ordenseguerreiros", "osaspectos", "osobservadores", "semideuses", "seresdovazio"
];

try {
  // ============================================================
  // BLOCO 1: F5 + reload + 5 navegações — sem regressão
  // ============================================================
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push("console.error: " + m.text()); });

    // (a) F5 inicial
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(800);
    check("F5 inicial: /index.html sem erro de console", errors.length === 0, `errors=${errors.length}`);
    errors.length = 0;
    check("F5 inicial: title correto", (await page.title()).includes("Aetheria Codex"));

    // (b) F5 reload
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(800);
    check("F5 reload: console limpo", errors.length === 0, `errors=${errors.length}`);
    errors.length = 0;

    // (c) Hard nav → Mapa
    await page.goto(BASE + "/Mapa_Aetheria.html", { waitUntil: "load" });
    await page.waitForTimeout(1200);
    check("Hard nav → Mapa: console limpo (sem const duplicado)", errors.length === 0, `errors=${errors.length}`);
    errors.length = 0;

    // (d) Voltar pro index
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(800);
    check("Voltar → index: console limpo", errors.length === 0, `errors=${errors.length}`);
    errors.length = 0;

    // (e) 5 navegações seguidas
    const seq = [
      { name: "Mapa", path: "/Mapa_Aetheria.html" },
      { name: "Linha", path: "/Linha_do_Tempo.html" },
      { name: "Humanos", path: "/racas/humanos.html" },
      { name: "Mutantes", path: "/racas/mutantes.html" },
      { name: "Index", path: "/index.html" }
    ];
    for (const step of seq) {
      await page.goto(BASE + step.path, { waitUntil: "load" });
      await page.waitForTimeout(1200);
      const ok = page.url().toLowerCase().includes(step.path.toLowerCase().replace(".html", ""));
      check(`5 nav → ${step.name}: URL contém "${step.path}"`, ok, `url=${page.url()}`);
      check(`5 nav → ${step.name}: console limpo`, errors.length === 0, `errors=${errors.length}`);
      errors.length = 0;
    }

    await ctx.close();
  }

  // ============================================================
  // BLOCO 2: transitions.css carrega em 5 hubs + 22 raças
  // ============================================================
  {
    for (const html of HUBS) {
      const ctx = await browser.newContext({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(BASE + "/" + html, { waitUntil: "load" });
      await page.waitForTimeout(300);
      const ok = await page.evaluate(() => {
        // Procura <link rel=stylesheet href=...transitions.css> na head
        const links = Array.from(document.querySelectorAll("link[rel=stylesheet]"));
        return links.some((l) => (l.getAttribute("href") || "").includes("transitions.css"));
      });
      check(`${html}: <link rel=stylesheet href=assets/transitions.css> presente`, ok);
      await ctx.close();
    }

    for (const raca of RACAS) {
      const ctx = await browser.newContext({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(BASE + "/racas/" + raca + ".html", { waitUntil: "load" });
      await page.waitForTimeout(300);
      const ok = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("link[rel=stylesheet]"));
        return links.some((l) => (l.getAttribute("href") || "").includes("transitions.css"));
      });
      check(`racas/${raca}.html: <link> transitions.css presente`, ok);
      await ctx.close();
    }
  }

  // ============================================================
  // BLOCO 3: page-entry.js carrega em 5 hubs + 22 raças
  // ============================================================
  {
    for (const html of HUBS) {
      const ctx = await browser.newContext({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(BASE + "/" + html, { waitUntil: "load" });
      await page.waitForTimeout(300);
      const ok = await page.evaluate(() => {
        return Array.from(document.scripts).some((s) => (s.src || "").includes("page-entry.js"));
      });
      check(`${html}: <script src=...page-entry.js> presente`, ok);
      await ctx.close();
    }

    for (const raca of RACAS) {
      const ctx = await browser.newContext({ serviceWorkers: "block" });
      const page = await ctx.newPage();
      await page.goto(BASE + "/racas/" + raca + ".html", { waitUntil: "load" });
      await page.waitForTimeout(300);
      const ok = await page.evaluate(() => {
        return Array.from(document.scripts).some((s) => (s.src || "").includes("page-entry.js"));
      });
      check(`racas/${raca}.html: <script src=...page-entry.js> presente`, ok);
      await ctx.close();
    }
  }

  // ============================================================
  // BLOCO 4: VT API suportada no browser de teste
  // ============================================================
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    const supported = await page.evaluate(() => {
      try {
        return CSS && CSS.supports && CSS.supports("selector(::view-transition-old(root))");
      } catch (e) { return false; }
    });
    check("Cross-doc VT API: browser de teste suporta (CSS.supports)", supported);
    await ctx.close();
  }

  // ============================================================
  // BLOCO 5: page-entry.js seta data-transition-direction correto
  //   baseado na posição do <a>:
  //     topo (y<33%)    → "down"  (B entra de cima)
  //     base (y>66%)    → "up"    (B entra de baixo)
  //     esquerda (x<50%)→ "right" (B entra da direita)
  //     direita  (x>=50%)→"left"  (B entra da esquerda)
  // ============================================================
  {
    // Injeta 4 links sintéticos em posições conhecidas e clica cada um
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(500);

    // Adiciona 4 âncoras invisíveis em posições fixas
    await page.evaluate(() => {
      const positions = [
        { id: "_test-top",    x: 50, y: 5  },
        { id: "_test-bottom", x: 50, y: 95 },
        { id: "_test-left",   x: 10, y: 50 },
        { id: "_test-right",  x: 90, y: 50 }
      ];
      for (const p of positions) {
        const a = document.createElement("a");
        a.id = p.id;
        a.href = "Mapa_Aetheria.html";
        a.textContent = "x";
        a.style.cssText = `position:fixed; left:${p.x}%; top:${p.y}%; z-index:99999; padding:8px; background:red; color:white;`;
        document.body.appendChild(a);
      }
    });

    // Para cada link: simula o HANDLER de page-entry.js (que seta o atributo).
    // Não clicamos de verdade (isso dispararia a nav); chamamos a mesma lógica
    // de detecção de direção via evaluate.
    const directions = await page.evaluate(() => {
      // Replica a função directionForLink do page-entry.js (mantida
      // sincronizada manualmente — se mudar lá, mudar aqui)
      function directionForLink(link) {
        const r = link.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const xRatio = (r.left + r.width / 2) / vw;
        const yRatio = (r.top + r.height / 2) / vh;
        if (yRatio < 0.34) return "down";
        if (yRatio > 0.66) return "up";
        if (xRatio < 0.5)  return "right";
        return "left";
      }
      const map = {};
      for (const id of ["_test-top", "_test-bottom", "_test-left", "_test-right"]) {
        map[id] = directionForLink(document.getElementById(id));
      }
      return map;
    });

    check("Direção: link no topo (y=5%)  → 'down'",  directions["_test-top"] === "down", `got=${directions["_test-top"]}`);
    check("Direção: link na base (y=95%) → 'up'",    directions["_test-bottom"] === "up", `got=${directions["_test-bottom"]}`);
    check("Direção: link à esquerda (x=10%) → 'right'", directions["_test-left"] === "right", `got=${directions["_test-left"]}`);
    check("Direção: link à direita (x=90%)  → 'left'",  directions["_test-right"] === "left", `got=${directions["_test-right"]}`);

    // Validação do atributo no <html> via clique REAL (com handler de nav
    // neutralizado pra não navegar de verdade)
    await page.evaluate(() => {
      // Previne a nav hard (testamos só o efeito colateral do handler)
      document.querySelectorAll("a[href]").forEach(a => {
        a.addEventListener("click", e => e.preventDefault(), { capture: true });
      });
    });

    // Limpa atributo anterior
    await page.evaluate(() => document.documentElement.removeAttribute("data-transition-direction"));
    // Clica no link do topo
    await page.locator("#_test-top").click();
    const topDir = await page.evaluate(() => document.documentElement.getAttribute("data-transition-direction"));
    check("Clique real em #_test-top: html[data-transition-direction] = 'down'", topDir === "down", `got=${topDir}`);

    await page.evaluate(() => document.documentElement.removeAttribute("data-transition-direction"));
    await page.locator("#_test-left").click();
    const leftDir = await page.evaluate(() => document.documentElement.getAttribute("data-transition-direction"));
    check("Clique real em #_test-left: html[data-transition-direction] = 'right'", leftDir === "right", `got=${leftDir}`);

    await ctx.close();
  }

  // ============================================================
  // BLOCO 6: kill switch body.no-fx
  //   - com body.no-fx: clique NÃO seta data-transition-direction
  // ============================================================
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    // Seta localStorage ANTES do load (o bootstrap lê no-fx)
    await page.addInitScript(() => { localStorage.setItem("noFx", "1"); });
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(500);

    const hasNoFx = await page.evaluate(() => document.body.classList.contains("no-fx"));
    check("body.no-fx: classe aplicada via localStorage", hasNoFx);

    // Adiciona link e clica
    await page.evaluate(() => {
      const a = document.createElement("a");
      a.id = "_kill-link";
      a.href = "Mapa_Aetheria.html";
      a.textContent = "x";
      a.style.cssText = "position:fixed; top:5%; left:50%; z-index:99999;";
      document.body.appendChild(a);
      a.addEventListener("click", e => e.preventDefault(), { capture: true });
    });

    await page.locator("#_kill-link").click();
    const dir = await page.evaluate(() => document.documentElement.getAttribute("data-transition-direction"));
    check("body.no-fx: clique NÃO seta data-transition-direction", !dir, `got=${dir}`);

    await ctx.close();
  }

  // ============================================================
  // BLOCO 7: kill switch prefers-reduced-motion
  // ============================================================
  {
    const ctx = await browser.newContext({
      serviceWorkers: "block",
      reducedMotion: "reduce"
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const a = document.createElement("a");
      a.id = "_kill-link-rm";
      a.href = "Mapa_Aetheria.html";
      a.textContent = "x";
      a.style.cssText = "position:fixed; top:5%; left:50%; z-index:99999;";
      document.body.appendChild(a);
      a.addEventListener("click", e => e.preventDefault(), { capture: true });
    });

    await page.locator("#_kill-link-rm").click();
    const dir = await page.evaluate(() => document.documentElement.getAttribute("data-transition-direction"));
    check("prefers-reduced-motion: clique NÃO seta data-transition-direction", !dir, `got=${dir}`);

    await ctx.close();
  }

  // ============================================================
  // BLOCO 8: v3 morto — arquivos removidos do repo
  // ============================================================
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    await page.goto(BASE + "/index.html", { waitUntil: "load" });
    await page.waitForTimeout(300);

    const r1 = await page.evaluate(async () => (await fetch("/assets/page-transitions.js")).status);
    const r2 = await page.evaluate(async () => (await fetch("/assets/transition-direction.js")).status);
    const r3 = await page.evaluate(async () => (await fetch("/assets/gsap.min.js")).status);
    check("v3 morto: /assets/page-transitions.js retorna 404", r1 === 404, `status=${r1}`);
    check("v3 morto: /assets/transition-direction.js retorna 404", r2 === 404, `status=${r2}`);
    check("v3 morto: /assets/gsap.min.js retorna 404", r3 === 404, `status=${r3}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
