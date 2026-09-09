// sw.js - Service Worker do Aetheria Codex
// Estrategia:
//   - Network-first para navegacao (HTML) -> sempre fresco
//   - Cache-first para assets estaticos publicados -> rapido e offline
//   - Stale-while-revalidate para manifest/favicon -> entrega cache e atualiza em paralelo
// O offline e progressivo: recursos ja visitados permanecem disponiveis sem internet.

const VERSION = "aetheria-v1.3.0";
const CORE_CACHE = `${VERSION}-core`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./offline.html",
  "./404.html", // §11.4 — GH Pages auto-serve para qualquer rota 404
  "./manifest.webmanifest",
  "./sitemap.xml",
  "./assets/codex.css",
  "./assets/favicon.svg",
  "./assets/favicon-32.png",
  "./assets/favicon-192.png",
  "./assets/apple-touch-icon.png",
  "./assets/og-cover.jpg",
  "./data/themes.json",
  "./data/search-index.json", // §9.3 — indice da search semantica (Ctrl+K por lore)
];

const REVALIDATE_PATHS = new Set([
  "/manifest.webmanifest",
  "/assets/favicon.svg",
  "/assets/favicon-32.png",
  "/assets/favicon-192.png",
  "/assets/apple-touch-icon.png",
]);

function isRevalidateAsset(url) {
  return REVALIDATE_PATHS.has(url.pathname);
}

function isCacheableAsset(url) {
  return /\.(?:css|js|json|webmanifest|png|jpe?g|webp|svg|ico|woff2?)$/i.test(url.pathname);
}

async function putRuntime(req, res) {
  if (!res || res.status !== 200) return;
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(req, res.clone());
}

async function putCore(req, res) {
  if (!res || res.status !== 200) return;
  const cache = await caches.open(CORE_CACHE);
  await cache.put(req, res.clone());
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch((err) => {
        // nao falha o install se algum opcional nao existir
        console.warn("[SW] precache parcial:", err);
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("aetheria-") && !key.startsWith(VERSION))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // CDN nao passa pelo SW

  // 1) Navegacao: network-first com fallback de cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // §11.4 — GH Pages devolve 404 com HTML (nao rejeita, res.ok=false).
          // Se for 404, serve a 404 tematizada e NAO cacheia o HTML cru do GH Pages.
          if (res.status === 404) {
            return caches.match("./404.html");
          }
          const clone = res.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("./offline.html"))
        )
    );
    return;
  }

  // 2) Manifest/favicon: stale-while-revalidate no CORE_CACHE.
  // Como esses arquivos ja estao no precache, a atualizacao precisa substituir
  // a entrada do CORE_CACHE para que caches.match() veja a versao nova.
  if (isRevalidateAsset(url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const update = fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              return putCore(req, res);
            }
            return null;
          })
          .catch(() => null);

        if (cached) {
          event.waitUntil(update);
          return cached;
        }

        return update.then(() => caches.match(req));
      })
    );
    return;
  }

  // 3) Assets publicados: cache-first sem limite artificial de quantidade.
  // Isso permite que WebP/JSON/JS/CSS ja visitados continuem offline.
  if (isCacheableAsset(url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then(async (res) => {
            await putRuntime(req, res);
            return res;
          })
          .catch(() => cached);
      })
    );
  }
});

// mensagem: o usuario pediu pular o cache e recarregar
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
