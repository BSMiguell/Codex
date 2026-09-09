import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const swPath = path.join(root, "sw.js");
const sw = fs.readFileSync(swPath, "utf8");

const cacheableMatch = sw.match(
  /function isCacheableAsset\(url\)\s*\{([\s\S]*?)\n\}/
);
const cacheableBody = cacheableMatch?.[1] ?? "";

const checks = [
  ["versao 1.3.0", /const VERSION = "aetheria-v1\.3\.0"/.test(sw)],
  ["sem MAX_RUNTIME", !/MAX_RUNTIME/.test(sw)],
  ["stale-while-revalidate", /event\.waitUntil\(update\)/.test(sw)],
  ["manifest em revalidacao", /\/manifest\.webmanifest/.test(sw)],
  ["favicon em revalidacao", /\/assets\/favicon\.svg/.test(sw)],
  ["WebP no runtime", /webp/.test(cacheableBody)],
  ["cache sem limite artificial", /cache-first sem limite artificial/.test(sw)],
  [
    "videos fora do runtime",
    !/\.(?:mp4|webm|mov)(?:$|[^a-z0-9])/i.test(cacheableBody),
  ],
  [
    "limpeza de caches antigos",
    /startsWith\("aetheria-"\) && !key\.startsWith\(VERSION\)/.test(sw),
  ],
  ["fallback offline", /offline\.html/.test(sw)],
  ["fallback 404", /404\.html/.test(sw)],
];

const failed = checks.filter(([, result]) => result === false);

if (failed.length) {
  console.error("ERRO — regressao no Service Worker:");
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log(`OK — Service Worker v1.3.0 validado; ${checks.length} verificacoes passaram.`);
