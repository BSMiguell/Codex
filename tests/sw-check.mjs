import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const swPath = path.join(root, "sw.js");
const sw = fs.readFileSync(swPath, "utf8");

const checks = [
  ["versao 1.3.0", /const VERSION = "aetheria-v1\.3\.0"/],
  ["sem MAX_RUNTIME", !/MAX_RUNTIME/],
  ["stale-while-revalidate", /event\.waitUntil\(update\)/],
  ["manifest em revalidacao", /\/manifest\.webmanifest/],
  ["favicon em revalidacao", /\/assets\/favicon\.svg/],
  ["WebP no runtime", /webp/],
  ["cache sem limite artificial", /cache-first sem limite artificial/],
  ["videos fora do runtime", !/function isCacheableAsset[\s\S]*?(?:mp4|webm|mov)/i.test(sw)],
  ["limpeza de caches antigos", /startsWith\("aetheria-"\) && !key\.startsWith\(VERSION\)/],
  ["fallback offline", /offline\.html/],
  ["fallback 404", /404\.html/],
];

const failed = checks.filter(([, result]) => (result instanceof RegExp ? result.test(sw) : result) === false);

if (failed.length) {
  console.error("ERRO — regressao no Service Worker:");
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log(`OK — Service Worker v1.3.0 validado; ${checks.length} verificacoes passaram.`);
