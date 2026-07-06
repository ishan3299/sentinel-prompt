// ponytail: dynamic caching strategy prevents hash mismatches and works offline automatically
const CACHE_NAME = 'sentinel-prompt-cache-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Only intercept HTTP/HTTPS queries (prevent chrome-extension schemes)
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic' && !e.request.url.includes('fonts.')) {
          return response;
        }
        const cacheCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, cacheCopy);
        });
        return response;
      }).catch(() => {
        // Offline fallback
      });
    })
  );
});
