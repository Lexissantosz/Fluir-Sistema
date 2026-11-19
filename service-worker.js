/* Cache estritamente de recursos publicos. Dados pessoais, HTML e APIs NUNCA sao guardados. */
const CACHE_NAME = "fluir-public-assets-v1";
const PUBLIC_ASSETS = ["/Assets/brand/fluir-symbol.svg", "/css/login.css", "/css/landing.css"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PUBLIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("fluir-public-assets-") && key !== CACHE_NAME).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.mode === "navigate") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (!/\.(?:css|js|svg|png|jpe?g|webp|woff2?|ico)$/i.test(url.pathname)) return;
  event.respondWith(fetch(req).then((response) => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)));
    }
    return response;
  }).catch(() => caches.match(req)));
});
