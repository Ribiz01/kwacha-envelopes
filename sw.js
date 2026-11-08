// Kwacha Envelopes service worker: always loads the newest app when online, falls back to the cached copy offline.
const VERSION = "ke-v6";
const SHELL = ["/", "/styles.css?v=6", "/features.css?v=6", "/app.js?v=6", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // Network first for everything: updates show up immediately; the cache is only used offline.
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req.mode === "navigate" ? "/" : req, copy)); }
    return res;
  }).catch(() => caches.match(req.mode === "navigate" ? "/" : req).then(r => r || caches.match(req, { ignoreSearch: true }))));
});
