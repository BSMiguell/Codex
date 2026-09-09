import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbidden = "https://bsmiguell.github.io/Temporario";
const production = "https://bsmiguell.github.io/Codex";
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|xml|json|js|ps1|md|webmanifest|txt)$/i.test(entry.name)) files.push(full);
  }
}

walk(root);
const bad = [];
for (const file of files) {
  const relative = path.relative(root, file);
  if (relative === path.join("scripts", "migrate_codex_urls.ps1")) continue;

  const text = fs.readFileSync(file, "utf8");
  if (text.includes(forbidden)) bad.push(relative);
}

if (bad.length) {
  console.error("ERRO — URL antiga /Temporario encontrada em:");
  for (const file of bad) console.error(`- ${file}`);
  process.exit(1);
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const seoCountOk = index.includes("487 personagens") && index.includes("Códice de 487 Personagens");
const canonicalOk = index.includes(`${production}/`);
const sitemapOk = sitemap.includes(`${production}/`) && !sitemap.includes(forbidden);

if (!seoCountOk) {
  console.error("ERRO — index.html ainda não está com a contagem SEO de 487 personagens.");
  process.exit(1);
}
if (!canonicalOk) {
  console.error("ERRO — canonical de produção não aponta para /Codex.");
  process.exit(1);
}
if (!sitemapOk) {
  console.error("ERRO — sitemap.xml não está apontando integralmente para /Codex.");
  process.exit(1);
}

console.log(`OK — URLs de produção em /Codex; ${files.length} arquivos textuais verificados; SEO da home = 487 personagens.`);
