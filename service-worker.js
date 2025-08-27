const CACHE_NAME = 'ultimate-calculator-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.6.4/math.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js',
  'manifest.json'
];

// Installs the service worker and caches core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetches content from the cache first, then the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network
        return fetch(event.request);
      })
  );
});

// Cleans up old caches
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
