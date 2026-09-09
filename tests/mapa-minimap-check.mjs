// Teste do §6.1 — Minimap (W5.1 ja existia desde 02/09; este teste
// protege a feature de regressao silenciosa).
// Cobre:
//   1. Canvas existe e tem dimensao 160x180
//   2. Tem aria-label "Minimapa de navegacao"
//   3. Click no canvas muda cam.tx/cam.tz (exposto em window.__MAPA__)
//   4. Hint "Clique para teleportar" presente
//   5. Canvas NAO esta vazio apos primeiro frame (tem pixels != fundo)
//
// Licao 11a: serviceWorkers: "block" + installPageListeners.
// Licao 12a: waitForFunction > waitForTimeout.

import { chromium } from "playwright";

const BASE = process.env.AETHERIA_URL || "http://localhost:8124";

const browser = await chromium.launch({ headless: true });
let pass = 0,
  fail = 0;
const check = (n, ok, d = "") => {
  console.log(`${ok ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
  ok ? pass++ : fail++;
};

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
  const ctx = await browser.newContext({ serviceWorkers: "block" });
  const page = await ctx.newPage();
  installPageListeners(page);

  // Bypass do HTTP cache (Lição: SW block nao basta, browser cache tambem serve)
  await ctx.route("**/*", async (route) => {
    try {
      const headers = { ...route.request().headers(), "cache-control": "no-cache" };
      await route.continue({ headers });
    } catch {
      try {
        await route.abort();
      } catch {}
    }
  });

  await page.goto(BASE + "/Mapa_Aetheria.html?nocache=" + Date.now(), { waitUntil: "load" });
  // Espera a API de diagnostico + minimap pronto
  await page.waitForFunction(() => window.__MAPA__ && document.querySelector("#minimapCanvas"), {
    timeout: 8000
  });

  // 1) Canvas existe com dimensao correta
  const dims = await page.locator("#minimapCanvas").evaluate((c) => ({
    w: c.width,
    h: c.height,
    dw: c.getBoundingClientRect().width
  }));
  check(
    "Canvas minimap tem dimensao 160x180",
    dims.w === 160 && dims.h === 180,
    `w=${dims.w} h=${dims.h} dw=${dims.dw}`
  );

  // 2) Acessibilidade: aria-label + hint
  const aria = await page.locator("#minimap").getAttribute("aria-label");
  check("Container tem aria-label", aria === "Minimapa de navegação", `aria-label=${aria}`);
  const hint = await page.locator("#minimapHint").textContent();
  check(
    "Hint 'Clique para teleportar' presente",
    /teleport/i.test(hint || ""),
    `hint=${(hint || "").trim()}`
  );

  // 3) Click muda cam.tx/cam.tz (estado observavel)
  //    Click em (mx=0.2, my=0.2) — perto do canto mas nao extremo,
  //    evita levar cam a bordas do mapa (proj.z -> 0 causa
  //    createRadialGradient non-finite pre-existente).
  const before = await page.evaluate(() => ({
    tx: window.__MAPA__.estado().tx,
    tz: window.__MAPA__.estado().tz
  }));
  const box = await page.locator("#minimapCanvas").boundingBox();
  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.2);
  // Espera o tween de 380ms resolver e o estado assentar
  await page.waitForFunction(
    (b) => {
      const s = window.__MAPA__.estado();
      return Math.abs(s.tx - b.tx) > 5 || Math.abs(s.tz - b.tz) > 5;
    },
    before,
    { timeout: 2000 }
  );
  const after = await page.evaluate(() => ({
    tx: window.__MAPA__.estado().tx,
    tz: window.__MAPA__.estado().tz
  }));
  const moved = Math.abs(after.tx - before.tx) > 5 || Math.abs(after.tz - before.tz) > 5;
  check(
    "Click no canto do minimap move a cam (tx ou tz mudou >5)",
    moved,
    `before=(${before.tx.toFixed(1)},${before.tz.toFixed(1)}) after=(${after.tx.toFixed(1)},${after.tz.toFixed(1)})`
  );

  // 4) Click no centro do minimap (mx=0.5, my=0.5) volta cam ao centro
  await page.waitForTimeout(500); // espera tween anterior assentar
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(500);
  const recenter = await page.evaluate(() => ({
    tx: window.__MAPA__.estado().tx,
    tz: window.__MAPA__.estado().tz
  }));
  check(
    "Click no centro do minimap recentraliza (tx,tz ~ 0)",
    Math.abs(recenter.tx) < 5 && Math.abs(recenter.tz) < 5,
    `tx=${recenter.tx.toFixed(2)} tz=${recenter.tz.toFixed(2)}`
  );

  // 5) Canvas NAO esta vazio: tem pixels diferentes do fundo.
  //    Amostra uma grade 5x5 — basta 1 pixel nao-fundo para passar.
  //    Fundo: gradient entre #0a1426 (10,20,38) e #1a120e (26,18,14).
  const hasContent = await page.evaluate(() => {
    const c = document.querySelector("#minimapCanvas");
    const ctx = c.getContext("2d");
    let nonBg = 0;
    for (let gx = 0; gx < 5; gx++) {
      for (let gy = 0; gy < 5; gy++) {
        const x = Math.floor((gx + 0.5) * (c.width / 5));
        const y = Math.floor((gy + 0.5) * (c.height / 5));
        const d = ctx.getImageData(x, y, 1, 1).data;
        // conta como "nao-fundo" se tem alpha > 0 e cor com luminancia > 60
        // OU se tem qualquer matiz (R, G ou B) > 80 (pin/borda branca/retangulo vista)
        const lum = d[0] * 0.3 + d[1] * 0.6 + d[2] * 0.1;
        if (lum > 60 || d[0] > 80 || d[1] > 80 || d[2] > 80) nonBg++;
      }
    }
    return nonBg;
  });
  check(
    "Canvas tem pixels renderizados (algum > luminancia 60)",
    hasContent > 0,
    `pixels nao-fundo=${hasContent}/25`
  );

  await ctx.close();
} finally {
  await browser.close();
}

console.log(`\n${pass} ✅ / ${fail} ❌`);
process.exit(fail === 0 ? 0 : 1);
