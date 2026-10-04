const CACHE_NAME = 'uama-admin-shell-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Área administrativa e API sempre usam a rede.
  // Nenhum dado privado do painel é armazenado offline.
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/'))
  ) {
    event.respondWith(fetch(request));
    return;
  }
});
