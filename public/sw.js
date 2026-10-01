const CACHE_NAME = 'telugu-panchangam-2027-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('Purging cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let all dev and script traffic pass directly to network
  if (event.request.url.includes('run.app') || event.request.url.includes('localhost') || event.request.url.includes('/src/')) {
    return;
  }
  
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
