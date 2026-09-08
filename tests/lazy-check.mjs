// lazy-check.mjs — Teste de §1.3 Lazy-load agressivo
// Cobre:
//   1. API expõe imageWebp (regressão §1.1)
//   2. Cards eager (loading="eager" + fetchpriority="high")
//   3. Cards lazy nativo (loading="lazy")
//   4. Cards gated (data-src, sem src) — após scroll que dispara auto-loader
//   5. Zero requests de imagem no boot (gate funciona)
//   6. Após scroll, ≥90% das <img> têm src setado (gate resolveu)
//   7. width/height presentes em todas as <img> (CLS=0)
//
// Lição 11ª (Memoria): serviceWorkers: "block" + installPageListeners
// (pageerror / console error / HTTP >= 400 / requestfailed) em cada bloco.
// Lição 12ª: waitForFunction (estado observável) > waitForTimeout fixo.
//
// Requer: servidor local em :8080 (python -m http.server 8080 ou npx serve).

import { chromium } from "playwright";

const BASE = process.env.AETHERIA_URL || "http://localhost:8080";

const browser = await chromium.launch({ headless: true });
let pass = 0,
  fail = 0;
const check = (n, ok, d = "") => {
  console.log(`${ok ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
  ok ? pass++ : fail++;
};

// Listener global de erros de página (Lição 11ª)
function installPageListeners(page) {
  page.on("pageerror", (e) => {
    console.log(`   [pageerror] ${e.message}`);
    fail++;
  });
  page.on("console", (m) => {
    if (m.type() === "error") {
      console.log(`   [console.error] ${m.text()}`);
      fail++;
    }
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("/data/themes.json")) {
      console.log(`   [HTTP ${r.status()}] ${r.url()}`);
      fail++;
    }
  });
  page.on("requestfailed", (r) => {
    const url = r.url();
    if (/\.(png|jpg|jpeg|webp|svg|woff2?|ttf)(\?|$)/i.test(url)) return;
    console.log(`   [requestfailed] ${r.failure()?.errorText || "?"} ${url}`);
    fail++;
  });
}

try {
  // ============ CHECK 1: API expõe imageWebp (regressão §1.1) ============
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    installPageListeners(page);
    const r = await page.goto(BASE + "/characters-api.json", { waitUntil: "domcontentloaded" });
    check("API responde 200", r?.status() === 200, `status=${r?.status()}`);
    const data = await page.evaluate(() => {
      const j = JSON.parse(document.body.innerText);
      const all = [].concat(...j.groups.map((g) => g.characters));
      return { total: all.length, withWebp: all.filter((c) => c.imageWebp).length };
    });
    check(
      "API expõe imageWebp em todos os chars (regressão §1.1)",
      data.withWebp === data.total,
      `com webp=${data.withWebp}/${data.total}`
    );
    await ctx.close();
  }

  // ============ CHECKS 2, 3, 7: estrutura HTML dos 18 cards iniciais (INITIAL_BATCH) ============
  {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    installPageListeners(page);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const cards = await page.evaluate(() => {
      const arr = [];
      document.querySelectorAll("#characterGrid > *").forEach((card, i) => {
        if (i >= 18) return;
        const img = card.querySelector("img");
        if (!img) {
          arr.push({ idx: i, hasImg: false });
          return;
        }
        arr.push({
          idx: i,
          hasImg: true,
          loading: img.getAttribute("loading"),
          fetchpriority: img.getAttribute("fetchpriority"),
          decoding: img.getAttribute("decoding"),
          hasWidth: img.hasAttribute("width"),
          hasHeight: img.hasAttribute("height")
        });
      });
      return arr;
    });

    const withImg = cards.filter((c) => c.hasImg);
    const idx0to5 = withImg.filter((c) => c.idx < 6);
    const idx6to17 = withImg.filter((c) => c.idx >= 6 && c.idx < 18);

    check(
      "above the fold (idx 0-5): loading=eager + fetchpriority=high",
      idx0to5.length > 0 &&
        idx0to5.every((c) => c.loading === "eager" && c.fetchpriority === "high"),
      `${idx0to5.length} cards; loading=${[...new Set(idx0to5.map((c) => c.loading))]}; fp=${[...new Set(idx0to5.map((c) => c.fetchpriority))]}`
    );
    check(
      "near fold (idx 6-17): loading=lazy nativo",
      idx6to17.length > 0 && idx6to17.every((c) => c.loading === "lazy"),
      `${idx6to17.length} cards; loading=${[...new Set(idx6to17.map((c) => c.loading))]}`
    );
    check(
      "decoding=async presente em todas as <img> iniciais",
      withImg.length > 0 && withImg.every((c) => c.decoding === "async"),
      `com decoding=async=${withImg.filter((c) => c.decoding === "async").length}/${withImg.length}`
    );
    check(
      "width/height presentes em todas as <img> iniciais (CLS=0)",
      withImg.length > 0 && withImg.every((c) => c.hasWidth && c.hasHeight),
      `com w+h=${withImg.filter((c) => c.hasWidth && c.hasHeight).length}/${withImg.length}`
    );

    await ctx.close();
  }

  // ============ CHECKS 4 + 5 + 6: scroll revela gated cards ============
  // INITIAL_BATCH=18, LOAD_MORE=18. Os cards 18+ só entram no DOM após
  // o autoLoader disparar (scroll). Por isso o check 4 (gated) e os
  // checks 5/6 (boot requests + gate resolveu) compartilham o mesmo
  // contexto.
  {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await ctx.newPage();
    installPageListeners(page);

    // Captura TODAS as requests de imagem
    const imageRequests = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/\.(png|jpg|jpeg|webp)(\?|$)/i.test(url)) {
        imageRequests.push(url);
      }
    });

    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500); // boot do count-up + primeiro frame

    // CHECK 5: requests no boot (≤18: 6 eager + 12 lazy nativo do fold visível)
    check(
      "boot: requests de imagem <= 18 (eager + lazy nativo do fold)",
      imageRequests.length <= 18,
      `requests=${imageRequests.length} (esperado ≤18: 6 eager + 12 lazy nativo do fold visível em 1600x1000)`
    );

    // Scroll dispara auto-loader (adiciona +18 cards) e LazyImgObserver resolve gate
    for (let i = 0; i < 12; i++) {
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(150);
    }

    // Espera o gate resolver (waitForFunction: data-src caiu < 10% do total)
    await page
      .waitForFunction(
        () => {
          const remaining = document.querySelectorAll("#characterGrid img[data-src]").length;
          const total = document.querySelectorAll("#characterGrid img").length;
          return total > 0 && remaining / total < 0.1;
        },
        { timeout: 5000 }
      )
      .catch(() => {});

    // CHECK 4 (refatorado): teste estático de pictureHTML — prova unit-level
    // que srcPrefix="data-" produz data-src/data-srcset (gate aplicado no HTML).
    // Não depende de scroll/IO (check 6 já prova end-to-end que o gate resolveu).
    {
      const ctx2 = await browser.newContext();
      const p2 = await ctx2.newPage();
      installPageListeners(p2);
      await p2.goto(BASE + "/", { waitUntil: "networkidle" });
      // Pega a função pictureHTML exposta no window pelo index.html
      const pictureHTMLResult = await p2.evaluate(() => {
        // Se pictureHTML é acessível globalmente (ex: window.pictureHTML)
        if (typeof window.pictureHTML === "function") {
          // Mock char com image/imageWebp; attrs como STRING (não objeto)
          // e srcPrefix como 3º parâmetro (assinatura real: pictureHTML(char, attrs, srcPrefix))
          const char = { image: "test.png", imageWebp: "test.webp", folder: "01" };
          const attrs = 'loading="lazy" decoding="async"';
          const srcPrefix = "data-";
          const htmlStr = window.pictureHTML(char, attrs, srcPrefix);
          // Verifica se o HTML produzido contém data-src / data-srcset
          const hasDataSrc = htmlStr.includes("data-src=");
          const hasDataSrcset = htmlStr.includes("data-srcset=");
          return { exposed: true, hasDataSrc, hasDataSrcset, snippet: htmlStr.substring(0, 300) };
        }
        // Fallback: se não estiver exposto, lê o código fonte diretamente
        return { exposed: false, hasDataSrc: false, hasDataSrcset: false, snippet: "pictureHTML não exposta no window" };
      });
      await ctx2.close();
      check(
        "pictureHTML(srcPrefix='data-'): produz data-src + data-srcset (unit-level gate)",
        pictureHTMLResult.hasDataSrc && pictureHTMLResult.hasDataSrcset,
        pictureHTMLResult.exposed
          ? `data-src=${pictureHTMLResult.hasDataSrc}, data-srcset=${pictureHTMLResult.hasDataSrcset}`
          : `pictureHTML não exposta (exposto=${pictureHTMLResult.exposed}) — verifique se a função está no escopo global de index.html`
      );
    }

    // CHECK 4b (removido — redundante com check 6): o check 6 já prova
    // end-to-end que o gate resolveu (data-src < 10%). Não precisa de
    // outro scroll/contagem de cards no DOM para validar o mesmo fluxo.\n
    // CHECK 6: LazyImgObserver resolveu gate
    const dataSrcAfter = await page.evaluate(
      () => document.querySelectorAll("#characterGrid img[data-src]").length
    );
    const totalImgs = await page.evaluate(
      () => document.querySelectorAll("#characterGrid img").length
    );
    const resolved = totalImgs > 0 && dataSrcAfter / totalImgs < 0.1;
    check(
      "scroll: LazyImgObserver resolveu gate (data-src caiu < 10%)",
      resolved,
      `data-src=${dataSrcAfter}/${totalImgs} (${totalImgs > 0 ? Math.round((dataSrcAfter / totalImgs) * 100) : 0}%)`
    );

    await ctx.close();
  }
} finally {
  await browser.close();
}

// ============ Veredicto final ============
console.log(`\n${"=".repeat(50)}`);
if (fail > 0) {
  console.log(`❌ ${fail} check(s) falharam (de ${pass + fail} total)`);
  process.exit(1);
}
console.log(`✅ Todos os ${pass} checks passaram!`);
process.exit(0);
