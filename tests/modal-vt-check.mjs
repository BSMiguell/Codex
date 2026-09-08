// modal-vt-check.mjs — regressão para o bug "duplicate view-transition-name"
// Uso:    node tests/modal-vt-check.mjs
// Requer: servidor local em :8080
//
// Valida que abrir/fechar/reabrir o modal do personagem NÃO gera erros de
// View Transitions no console (quebravam a transição e o TypeError que
// abortava a página). Cobre:
//   1. 1ª abertura (snapshot ANTES único)
//   2. Fechar + reabrir (VT consecutiva — race entre 2 VT)
//   3. Seta → próximo personagem (re-trigger da VT sem fechar)
//   4. Esc fecha (cleanup do nome no finally)
//   5. Clique em outro card (VT com artEl e modalMedia diferentes)
//
// Lição: a regra da VT API (single-doc) é que durante o snapshot ANTES, o
// `view-transition-name` deve ser ÚNICO na página. Se 2 elementos têm o
// mesmo nome simultaneamente, o browser aborta com InvalidStateError +
// "Unexpected duplicate view-transition-name".

import { chromium } from "playwright";
import { setTimeout as wait } from "node:timers/promises";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  serviceWorkers: "block", // Lição 11ª: SW segura versão antiga em testes
});
const page = await ctx.newPage();

// Captura erros de página + console (Lição 9ª: installPageListeners em
// todo bloco, sem isso um ReferenceError silencioso passa batido)
const errs = [];
page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errs.push(`console: ${m.text()}`);
});

// 1ª visita: pre-marcar como onboarded pra não pegar o overlay (Lição 9ª
// estendida: storageState em todo contexto de teste que abre index.html)
await page.addInitScript(() => {
  localStorage.setItem("aetheria.onboarded", JSON.stringify({ version: "1", at: Date.now() }));
});

await page.goto("http://localhost:8080/index.html", { waitUntil: "networkidle" });
await page.waitForSelector(".character-card", { timeout: 10000 });
await wait(1500); // boot + lazy-load

const checks = [];

// 1. 1ª abertura
await page.click(".character-card");
await page.waitForSelector("#modal.open", { timeout: 5000 });
await wait(800);
checks.push("1ª abertura");

// 2. Fechar + reabrir (VT consecutiva)
await page.click("#modalClose");
await page.waitForSelector("#modal:not(.open)", { timeout: 5000 });
await wait(500);
await page.click(".character-card");
await page.waitForSelector("#modal.open", { timeout: 5000 });
await wait(800);
checks.push("fechar + reabrir");

// 3. Seta → próximo (re-trigger da VT sem fechar)
await page.keyboard.press("ArrowRight");
await wait(800);
checks.push("ArrowRight (próximo personagem)");

// 4. Esc fecha
await page.keyboard.press("Escape");
await page.waitForSelector("#modal:not(.open)", { timeout: 5000 });
await wait(500);
checks.push("Esc fecha");

// 5. Clique em outro card
const cards = await page.$$(".character-card");
await cards[3].click();
await page.waitForSelector("#modal.open", { timeout: 5000 });
await wait(800);
checks.push("clique em outro card");

await browser.close();

// Filtra erros relacionados a VT (o que esse teste cobre)
const vtErrors = errs.filter(
  (m) =>
    m.includes("view-transition-name") ||
    m.includes("View Transition") ||
    m.includes("InvalidStateError") ||
    m.includes("startTime") ||
    m.includes("Transition was aborted"),
);

console.log("=== modal-vt-check ===");
console.log("Checks executados:", checks.length, "→", checks.join(" / "));
console.log("Page+console errors totais:", errs.length);
console.log("VT-related errors:", vtErrors.length);
if (errs.length) {
  console.log("--- TODOS OS ERROS:");
  for (const e of errs) console.log("  •", e.substring(0, 200));
}
if (vtErrors.length) {
  console.log("\n❌ FALHA: VT errors detectados");
  process.exit(1);
}
console.log("\n✅ PASS: nenhum erro de VT em", checks.length, "aberturas consecutivas do modal");
