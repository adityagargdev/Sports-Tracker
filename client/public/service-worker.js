const CACHE_NAME = 'sport-tracker-v2';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Never intercept API calls, Google OAuth, or external requests
  if (
    url.includes('sports-tracker-api') ||
    url.includes('/api/') ||
    url.includes('accounts.google.com') ||
    !url.startsWith(self.location.origin)
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For navigation requests (page loads), always serve index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(r => r || fetch(event.request))
    );
    return;
  }

  // For everything else: cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});