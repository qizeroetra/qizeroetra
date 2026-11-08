const CACHE_NAME = 'ertarifiuti-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json'
];

// Installazione del service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Attivazione del service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestione delle richieste
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Gestione notifiche in background
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nuova notifica',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('ErtaRifiuti', options)
  );
});

// Click sulla notifica
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Sincronizzazione in background per controllare le notifiche
self.addEventListener('sync', event => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkAndSendNotifications());
  }
});

// Funzione per controllare e inviare notifiche
async function checkAndSendNotifications() {
  try {
    // Recupera le assegnazioni da IndexedDB o localStorage
    const assignments = await getAssignments();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (hour === 1 && minute === 0) {
      Object.keys(assignments).forEach(key => {
        const [location, year, month, day] = key.split('-');
        const dateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        if (dateKey === today) {
          const assignment = assignments[key];
          self.registration.showNotification(
            `${location} - ${assignment.type}`,
            {
              body: `Ricordati di preparare ${assignment.type} per ${location}`,
              icon: 'icon-192.png',
              badge: 'icon-192.png',
              requireInteraction: true,
              vibrate: [200, 100, 200]
            }
          );
        }
      });
    }
  } catch (error) {
    console.error('Errore nel controllo notifiche:', error);
  }
}

// Funzione per recuperare le assegnazioni
async function getAssignments() {
  // In un'implementazione completa, questo userebbe IndexedDB
  // Per ora ritorniamo un oggetto vuoto
  return {};
}
