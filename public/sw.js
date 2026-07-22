// Willow service worker — exists solely to receive push events and show
// the daily reminder notification. No caching/offline support is attempted.

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // Ignore malformed payloads and fall back to defaults below.
  }

  const title = data.title || 'Willow';
  const options = {
    body: data.body || 'Time for your daily check-in.',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
