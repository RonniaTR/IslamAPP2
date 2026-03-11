/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'islamic-v3-20260311';
const APP_SHELL = '/';

function isCacheableRequest(request) {
  if (request.method !== 'GET') return false;
  if (request.url.includes('/api/')) return false;
  return request.url.startsWith(self.location.origin);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([APP_SHELL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (!isCacheableRequest(event.request)) return;

  // Navigation requests should prefer fresh HTML to avoid stale UI after deploy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(APP_SHELL, copy));
          return response;
        })
        .catch(() => caches.match(APP_SHELL))
    );
    return;
  }

  // Static assets: cache first, then network fallback and cache fill.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'İslami Yaşam Asistanı', body: 'Günlük bilgi kartı hazır!', icon: '/favicon.ico' };
  try { data = event.data.json(); } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body, icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico', vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
      actions: [{ action: 'open', title: 'Aç' }]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const client = clients.find(c => c.url.includes(self.location.origin));
      if (client) { client.focus(); client.navigate(url); }
      else { self.clients.openWindow(url); }
    })
  );
});

// Daily reminder via periodic sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-knowledge') {
    event.waitUntil(
      self.registration.showNotification('Günün Bilgisi', {
        body: 'Yeni bir İslami bilgi kartı seni bekliyor!',
        icon: '/favicon.ico', badge: '/favicon.ico',
        data: { url: '/' }
      })
    );
  }
});
