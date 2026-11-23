// Cache exclusivo da interface pública. Nunca armazenar tokens, dados de saúde ou respostas privadas.
const CACHE = "fluir-public-shell-v2";
const PUBLIC_ASSETS = [
  "/index.html",
  "/offline.html",
  "/css/landing.css",
  "/Assets/brand/fluir-symbol.svg",
  "/Assets/brand/icons/fluir-192.png",
  "/Assets/brand/icons/fluir-512.png",
  "/Assets/brand/icons/apple-touch-icon.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PUBLIC_ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((key) =>
      (key.startsWith("fluir-public-shell-") || key.startsWith("fluir-shell-")) && key !== CACHE
    ).map((key) => caches.delete(key)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("Authorization")) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode === "navigate") {
    // Não copiar páginas privadas para cache. Sem rede: tela genérica, sem dados pessoais.
    event.respondWith(fetch(request).catch(async () =>
      (await caches.match("/offline.html")) || Response.error()));
    return;
  }
  if (!PUBLIC_ASSETS.includes(url.pathname)) return;
  event.respondWith(fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request)));
});
