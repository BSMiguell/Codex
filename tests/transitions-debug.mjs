// Diagnóstico temporário dos erros de console do teste de transições.
// Não altera a aplicação e não falha o CI: apenas imprime os detalhes.
import { chromium } from "playwright";

const BASE = process.env.AETHERIA_URL || "http://localhost:8124";
const TARGETS = [
  "/index.html",
  "/racas/humanos.html",
  "/racas/mutantes.html",
];

const browser = await chromium.launch({ headless: true });

try {
  for (const target of TARGETS) {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await ctx.newPage();
    const errors = [];
    const failedRequests = [];

    page.on("pageerror", (error) => {
      errors.push(`pageerror: ${error.message}`);
    });
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(`console.error: ${message.text()}`);
      }
    });
    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText || "unknown"}`);
    });

    await page.goto(BASE + target, { waitUntil: "load" });
    await page.waitForTimeout(1200);

    console.log(`\n=== TRANSITIONS DEBUG ${target} ===`);
    console.log(`console/page errors: ${errors.length}`);
    for (const error of errors) console.log(`  ${error}`);
    console.log(`failed requests: ${failedRequests.length}`);
    for (const request of failedRequests) console.log(`  ${request}`);

    await ctx.close();
  }
} finally {
  await browser.close();
}
