// Service worker v9 (network-first + cache-fallback)
const CACHE_NAME = "turkart-cache-v9";
const CORE_ASSETS = ["./", "./index.html", "./manifest.json", "./Turkart.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("message", (event) => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then(resp => { const clone = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(event.request, clone)); return resp; })
    .catch(() => caches.match(event.request))
  );
});
