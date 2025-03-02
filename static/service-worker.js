const CACHE_NAME = '{{project-name}}-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './manifest.json',
  './icons/favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './pkg/{{crate_name}}.js',
  './pkg/{{crate_name}}_bg.wasm'
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // If both fetch and cache fail, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});

// Clean up old caches when a new service worker takes over
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
