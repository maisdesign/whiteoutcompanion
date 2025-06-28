
const CACHE_NAME = "whiteout-companion-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/translations.js",
  "/facilitiesData.js",
  "/buffData.js",
  "/map.png",
  "/icon-192.png",
  "/icon-512.png"
];

// Installazione: salva in cache i file statici
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione: pulizia vecchie cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Intercetta fetch: risponde da cache se offline
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
