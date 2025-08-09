// Cache-first service worker for GitHub Pages
const CACHE = "pfwt-v31";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => 
      cached || fetch(req).then(res => {
        if (req.method === "GET" && new URL(req.url).origin === location.origin) {
          const resClone = res.clone();
          caches.open(CACHE).then(c => c.put(req, resClone));
        }
        return res;
      }).catch(() => cached)
    )
  );
});