// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkmo-yTbEd8LE6XtAPsJkmstLos7wlUew",
    authDomain: "bet-sharing.firebaseapp.com",
    projectId: "bet-sharing",
    storageBucket: "bet-sharing.firebasestorage.app",
    messagingSenderId: "21069245479",
    appId: "1:21069245479:web:a851ffb095ddb1b93a7202"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Betting Tracker';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || 'New notification',
    icon: payload.notification?.icon || './icon-192.png',
    badge: './icon-192.png',
    tag: payload.data?.tag || 'bet-notification',
    data: {
      url: payload.data?.url || './public.html',
      click_action: payload.data?.click_action || payload.fcmOptions?.link
    },
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || event.notification.data?.click_action || './public.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes('public.html') && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
