const CACHE_NAME = 'betting-tracker-v2';
const urlsToCache = [
  './public.html',
  './admin.html',
  './manifest.json',
  './manifest-admin.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Push notification handler
self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);
  
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Betting Tracker',
        body: event.data.text(),
        icon: './icon-192.png'
      };
    }
  }

  const title = data.title || 'Betting Tracker';
  const options = {
    body: data.body || data.message || 'New notification',
    icon: data.icon || './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './public.html',
      dateOfArrival: Date.now(),
      notificationId: data.id || Date.now()
    },
    actions: [
      {action: 'view', title: 'View', icon: './icon-192.png'},
      {action: 'close', title: 'Close'}
    ],
    requireInteraction: false,
    tag: data.tag || 'bet-notification'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || './public.html')
    );
  }
});

// Background sync for offline notifications
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(
      // Sync logic here
      Promise.resolve()
    );
  }
});
