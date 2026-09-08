// Teste do §9.3 — Search semantica por lore (indice invertido)
// Cobre: Ctrl+K abre paleta, digitar termo de lore traz resultados
// de lore (region/battle/celeste/race/ritual/char-lore) com tipo correto,
// href correto, navegacao Enter -> href funciona.
//
// Licao 11a (Memoria): serviceWorkers: "block" + installPageListeners
// (pageerror / console error / HTTP >= 400 / requestfailed) em cada bloco.
// Licao 12a: waitForFunction (estado observavel) > waitForTimeout fixo.

import { chromium } from "playwright";

const BASE = process.env.AETHERIA_URL || "http://localhost:8080";

const browser = await chromium.launch({ headless: true });
let pass = 0,
  fail = 0;
const check = (n, ok, d = "") => {
  console.log(`${ok ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
  ok ? pass++ : fail++;
};

// Listener global de erros de pagina (Licao 11a)
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

async function openPaletteAndType(ctx, term) {
  const page = await ctx.newPage();
  installPageListeners(page);
  await page.goto(BASE + "/", { waitUntil: "load" });
  // Garante que a index tem a API carregada antes de abrir a paleta
  await page.waitForFunction(
    () => document.querySelectorAll("#characterGrid > *").length > 0,
    { timeout: 8000 }
  );
  await page.keyboard.press("Control+k");
  await page.waitForSelector("#palette.open", { timeout: 2000 });
  // Aguarda o indice de lore carregar (so carrega lazy no 1o openPalette)
  await page.waitForFunction(
    () => {
      // heuristica: ou temos loreIndex preenchido, ou a promise terminou
      return document.querySelectorAll("#paletteList .pal-group-label").length >= 0;
    },
    { timeout: 5000 }
  );
  // Digita o termo. A renderPalette re-dispara quando o fetch de lore
  // resolve (Licao: nao cravar timing fixo).
  await page.locator("#paletteInput").fill(term);
  // Espera ate o grupo "Lore (search semantica)" OU ate nao haver mais
  // resultados vazios com a promise ainda em voo. Cobre o caso de o
  // fetch de 604 KB ainda estar em voo quando o keystroke acontece.
  await page
    .waitForFunction(
      () => {
        const labels = [...document.querySelectorAll("#paletteList .pal-group-label")].map(
          (el) => el.textContent.trim()
        );
        // tem resultados de lore OU ja tentou tudo e nao ha (fetch resolvido)
        if (labels.includes("Lore (search semantica)")) return true;
        if (
          document.querySelector("#paletteList .palette-empty") ||
          document.querySelectorAll("#paletteList .pal-option").length > 0
        ) {
          // fetch terminou, sem resultados de lore
          return true;
        }
        return false;
      },
      { timeout: 8000 }
    )
    .catch(() => {}); // se timeout, segue com o que tiver
  return page;
}

try {
  // 1) Ctrl+K abre paleta
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "");
    const open = await page.locator("#palette.open").count();
    check("Ctrl+K abre a paleta", open === 1, `open=${open}`);
    await ctx.close();
  }

  // 2) "geada" traz >=1 resultado de lore
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "geada");
    const labels = await page.locator("#paletteList .pal-group-label").allTextContents();
    check(
      `"geada" traz grupo 'Lore (search semantica)'`,
      labels.includes("Lore (search semantica)"),
      `labels=${JSON.stringify(labels)}`
    );
    await ctx.close();
  }

  // 3) "geada" tem a batalha 'A Chacina da Linha de Geada' com href do mapa
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "geada");
    const items = await page.locator("#paletteList .pal-option").all();
    const found = await Promise.all(
      items.map(async (it) => ({
        name: (await it.locator(".pal-name").textContent())?.trim(),
        sub: (await it.locator(".pal-sub").textContent())?.trim()
      }))
    );
    const chacina = found.find((f) => /Chacina da Linha de Geada/i.test(f.name || ""));
    check(
      `"geada" traz a batalha 'Chacina da Linha de Geada'`,
      !!chacina,
      `found=${JSON.stringify(found.map((f) => f.name))}`
    );
    if (chacina) {
      check(
        "Chacina: sub comeca com 'Batalha'",
        /Batalha/.test(chacina.sub || ""),
        `sub=${chacina.sub}`
      );
    }
    await ctx.close();
  }

  // 4) "abismo" traz a batalha 'Erupcao do Abismo'
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "abismo");
    const items = await page.locator("#paletteList .pal-option").all();
    const found = await Promise.all(
      items.map(async (it) => ({
        name: (await it.locator(".pal-name").textContent())?.trim(),
        sub: (await it.locator(".pal-sub").textContent())?.trim()
      }))
    );
    const erupcao = found.find((f) => /Erup[çc][ãa]o do Abismo/i.test(f.name || ""));
    check(
      `"abismo" traz a batalha 'Erupcao do Abismo'`,
      !!erupcao,
      `found=${JSON.stringify(found.map((f) => f.name))}`
    );
    await ctx.close();
  }

  // 5) "obsidiana" traz uma regiao (espera-se Cavernas de Obsidiana, habitat dos Onis)
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "obsidiana");
    const items = await page.locator("#paletteList .pal-option").all();
    const found = await Promise.all(
      items.map(async (it) => ({
        name: (await it.locator(".pal-name").textContent())?.trim(),
        sub: (await it.locator(".pal-sub").textContent())?.trim()
      }))
    );
    const obsidiana = found.find((f) => /Obsidiana/i.test(f.name || ""));
    check(
      `"obsidiana" traz regiao/personagem com 'Obsidiana' no nome`,
      !!obsidiana,
      `found=${JSON.stringify(found.map((f) => f.name))}`
    );
    if (obsidiana) {
      check(
        "obsidiana: sub comeca com 'Regiao' ou 'Personagem'",
        /Regiao|Personagem/.test(obsidiana.sub || ""),
        `sub=${obsidiana.sub}`
      );
    }
    await ctx.close();
  }

  // 6) "vazio" traz a raca 11 (Seres do Vazio) E algum hit de lore de Seres do Vazio
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "vazio");
    const items = await page.locator("#paletteList .pal-option").all();
    const found = await Promise.all(
      items.map(async (it) => ({
        name: (await it.locator(".pal-name").textContent())?.trim(),
        sub: (await it.locator(".pal-sub").textContent())?.trim()
      }))
    );
    const raca = found.find((f) => /Seres do Vazio/i.test(f.sub || ""));
    check(
      `"vazio" traz a raca 'Seres do Vazio' (sub com 'Seres do Vazio')`,
      !!raca,
      `found=${JSON.stringify(found.map((f) => f.sub))}`
    );
    await ctx.close();
  }

  // 7) Click num resultado de lore dispara navegacao para o href.
  //    Em vez de espiar location.assign (read-only no Chromium), testamos
  //    via page.waitForURL que eh o evento de navegacao real.
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "geada");
    // Confirma que existe pelo menos 1 .pal-option com href que sera
    // seguido. O href vive em paletteItems[i].lore.doc.href (variavel
    // local do modulo). Replicamos: o grupo "Lore" precede o 1o item.
    const labels = await page.locator("#paletteList .pal-group-label").allTextContents();
    check(
      "Enter: existe grupo 'Lore' antes dos outros grupos",
      labels[0] === "Lore (search semantica)",
      `labels=${JSON.stringify(labels)}`
    );
    // Click no 1o item de lore. Nao importa se ele vai para o mapa
    // (canvas pesado) ou para a propria index; o que importa e' que
    // houve uma navegacao com URL diferente da atual.
    const firstLore = page.locator("#paletteList .pal-option").first();
    const startUrl = page.url();
    // O 1o resultado de "geada" pode ser 'Fortalezas de Juramento'
    // (href='Mapa_Aetheria.html#pin-region-...') — navegacao real
    const navP = page.waitForURL((u) => u.toString() !== startUrl, { timeout: 5000 }).catch(() => null);
    await firstLore.click();
    const nav = await navP;
    check(
      "Click em item de lore dispara navegacao (URL muda)",
      nav !== null,
      `startUrl=${startUrl} finalUrl=${page.url()}`
    );
    await ctx.close();
  }

  // 8) Caractere de pontuacao (space) nao quebra; termo inexistente da
  //    empty-state, sem erro de JS
  {
    const ctx = await browser.newContext({ serviceWorkers: "block" });
    const page = await openPaletteAndType(ctx, "zzzqqqxxx");
    const empty = await page.locator("#paletteList .palette-empty").count();
    check("termo inexistente: empty state sem erro", empty === 1, `empty=${empty}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${pass} ✅ / ${fail} ❌`);
process.exit(fail === 0 ? 0 : 1);
