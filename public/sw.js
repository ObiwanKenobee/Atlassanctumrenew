// ATLAS SANCTUM Service Worker (Workbox-inspired robust caching strategy)
// Version 3.2.0 - Offline Epistemic & Mission Data Resilience

const CACHE_NAME = 'atlas-epistemic-v3';
const API_CACHE_NAME = 'atlas-api-runtime-v3';
const DATA_CACHE_NAME = 'atlas-mission-data-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/metadata.json'
];

// Epistemic Data Endpoints to cache for offline resilience
const CACHEABLE_API_ROUTES = [
  '/api/health',
  '/api/dev/status',
  '/api/agent/registry',
  '/api/agent/missions'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Atlas SW] Pre-caching core application shell & epistemic baseline');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Atlas SW] Pre-cache non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME, API_CACHE_NAME, DATA_CACHE_NAME].includes(key)) {
            console.log('[Atlas SW] Purging stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip WebSocket, chrome-extension, and non-GET requests for standard caching
  if (request.method !== 'GET' || url.protocol.startsWith('ws') || url.protocol === 'chrome-extension:') {
    return;
  }

  // 1. API Cache Strategy (Stale-While-Revalidate with Network Fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (networkError) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            console.log('[Atlas SW] Serving offline cached API response for:', url.pathname);
            return cachedResponse;
          }
          // Synthetic offline response for critical intelligence endpoints
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'Operating in disconnected / localized epistemic mode. Telemetry buffered locally.',
              timestamp: new Date().toISOString()
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
      })
    );
    return;
  }

  // 2. Static Assets Strategy (Cache-First with Network Revalidation)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(async () => {
        // Fallback for HTML navigation
        if (request.headers.get('accept')?.includes('text/html')) {
          const fallback = await caches.match('/index.html');
          if (fallback) return fallback;
        }
        return new Response('Network offline. Atlas Epistemic cache unavailable.', { status: 503 });
      });
    })
  );
});
