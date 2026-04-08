const CACHE_NAME = 'animeinfo-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension')) return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});