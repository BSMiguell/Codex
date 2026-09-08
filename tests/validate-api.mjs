// validate-api.mjs — valida characters-api.json e o pipeline de imagens
// Uso: node tests/validate-api.mjs
// Requer: characters-api.json gerado por scripts/build_api_json.ps1

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const api = JSON.parse(readFileSync(join(root, "characters-api.json"), "utf8"));

const errors = [];
const warnings = [];
const allChars = api.groups.flatMap((g) => g.characters);

// 1. Campos obrigatorios
for (const c of allChars) {
  if (!c.name) errors.push(`${c.id || "(sem id)"}: falta name`);
  if (!c.id) errors.push(`${c.name || "(sem nome)"}: falta id`);
  if (!c.folder) errors.push(`${c.id}: falta folder`);
  if (c.folder && !/^\d{2}_/.test(c.folder)) {
    errors.push(`${c.id}: folder '${c.folder}' nao segue padrao NN_...`);
  }
}

// 2. Slugs unicos; ids podem repetir entre grupos.
const slugs = new Map();
const idMap = new Map();
for (const c of allChars) {
  if (c.slug) {
    if (slugs.has(c.slug)) {
      errors.push(`slug duplicado: '${c.slug}' (em ${c.folder} e ${slugs.get(c.slug)})`);
    }
    slugs.set(c.slug, c.folder);
  }
  if (idMap.has(c.id)) {
    warnings.push(`id duplicado (homonimo): '${c.id}' em ${c.folder} e ${idMap.get(c.id)}`);
  }
  idMap.set(c.id, c.folder);
}

// 3. Contrato de imagens:
//    - imageWebp deve apontar para WebP quando o personagem possui WebP.
//    - image deve ser o PNG quando houver PNG; caso contrario, cai para WebP.
//    - nenhum arquivo referenciado pode faltar.
//    - a mesma imagem fisica nao pode ser reutilizada por personagens diferentes.
const imageOwners = new Map();
let withWebp = 0;
let withPngFallback = 0;
let withoutImage = 0;

for (const c of allChars) {
  if (c.imageWebp) {
    withWebp++;
    if (!/\.webp$/i.test(c.imageWebp)) {
      errors.push(`${c.id}: imageWebp nao termina em .webp: '${c.imageWebp}'`);
    }
    if (!existsSync(join(root, c.imageWebp))) {
      errors.push(`${c.id}: WebP '${c.imageWebp}' nao encontrada no disco`);
    }
  }

  if (c.image) {
    if (!existsSync(join(root, c.image))) {
      errors.push(`${c.id}: imagem '${c.image}' nao encontrada no disco`);
    }
    if (/\.png$/i.test(c.image)) withPngFallback++;

    if (imageOwners.has(c.image)) {
      errors.push(`imagem duplicada: '${c.image}' usada por ${imageOwners.get(c.image)} e ${c.id}`);
    } else {
      imageOwners.set(c.image, c.id);
    }
  } else {
    withoutImage++;
    warnings.push(`${c.id}: ficha sem imagem`);
  }

  // Se existe WebP, imageWebp deve ser uma referencia valida e diferente apenas
  // quando o fallback principal for PNG.
  if (c.imageWebp && c.image === c.imageWebp) {
    // Valido para personagens WebP-only.
  } else if (c.imageWebp && c.image && !/\.png$/i.test(c.image)) {
    errors.push(`${c.id}: image deveria ser PNG ou, no caso WebP-only, o mesmo WebP de imageWebp`);
  }
}

// 4. Contagens declaradas precisam bater com o conteudo real.
if (allChars.length !== api.totalCharacters) {
  errors.push(`totalCharacters=${api.totalCharacters} mas somando chars=${allChars.length}`);
}
if (api.groups.length !== api.totalGroups) {
  errors.push(`totalGroups=${api.totalGroups} mas groups=${api.groups.length}`);
}

// 5. Guard rail da migracao: se o acervo publicado possui WebP, a API precisa
// expo-lo. Nao fixa 487 aqui para permitir mudancas de dados intencionais.
if (withWebp === 0 && allChars.length > 0) {
  errors.push("nenhum personagem possui imageWebp; pipeline WebP parece quebrado");
}

if (errors.length) {
  console.error(`❌ ${errors.length} erros:`);
  for (const e of errors.slice(0, 30)) console.error("  - " + e);
  if (errors.length > 30) console.error(`  ... e mais ${errors.length - 30}`);
  process.exit(1);
}

let msg = `OK — ${allChars.length} chars, ${api.groups.length} grupos, ${withWebp} WebP, ${withPngFallback} PNG fallback, ${withoutImage} sem imagem`;
if (warnings.length) msg += ` (${warnings.length} aviso(s))`;
console.log(msg);
