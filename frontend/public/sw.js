/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'islamic-v16-20250705';
const API_CACHE_NAME = 'islamic-api-v2';
const APP_SHELL = '/';

// API endpoints that should be cached for offline use
const CACHEABLE_API_PATHS = [
  '/api/prayer-times/',
  '/api/quran/surahs',
  '/api/hadith/all',
  '/api/hadith/random',
  '/api/quran/random',
  '/api/knowledge-cards',
  '/api/dhikr',
  '/api/quiz/categories',
  '/api/i18n/',
  '/api/mood/',
  '/api/gamification/badges',
];

function isCacheableApiRequest(request) {
  if (request.method !== 'GET') return false;
  return CACHEABLE_API_PATHS.some(path => request.url.includes(path));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([APP_SHELL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // API requests: Stale-While-Revalidate for cacheable endpoints
  if (isCacheableApiRequest(event.request)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        }).catch(() => {
          return cached || new Response(JSON.stringify({ error: 'offline' }), {
            headers: { 'Content-Type': 'application/json' }, status: 503,
          });
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Navigation: network-first, fallback to cached shell
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

  // Static assets with content hash in URL: cache-first (immutable)
  if (event.request.url.match(/\/static\/(js|css|media)\/.+\.[a-f0-9]{8}\./)) {
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
    return;
  }

  // Skip caching for auth endpoints (security: never cache session data)
  if (event.request.url.includes('/api/auth/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Other same-origin GETs: network-first
  if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
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
      actions: data.actions || [{ action: 'open', title: 'Aç' }],
      tag: data.tag || 'default',
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

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'offline-actions') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_READY' }));
      })
    );
  }
});

// Daily reminder via periodic sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-knowledge') {
    event.waitUntil(
      self.registration.showNotification('Günün Bilgisi', {
        body: 'Yeni bir İslami bilgi kartı seni bekliyor!',
        icon: '/favicon.ico', badge: '/favicon.ico',
        data: { url: '/' }, tag: 'daily-knowledge',
      })
    );
  }
  if (event.tag === 'prayer-reminder') {
    event.waitUntil(
      self.registration.showNotification('Namaz Hatırlatıcısı', {
        body: 'Namaz vaktinin yaklaştığını unutmayın!',
        icon: '/favicon.ico', badge: '/favicon.ico',
        data: { url: '/' }, tag: 'prayer-reminder',
      })
    );
  }
});
