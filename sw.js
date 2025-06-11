// ===== SERVICE WORKER FOR WHITEOUT COMPANION PWA =====

const CACHE_NAME = 'whiteout-companion-v2.0.0';
const STATIC_CACHE = 'whiteout-static-v2.0.0';
const DYNAMIC_CACHE = 'whiteout-dynamic-v2.0.0';

// Files to cache immediately (App Shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/base.css',
  '/styles/modern-ui.css',
  '/scripts/main.js',
  '/scripts/pwa.js',
  '/scripts/monetization.js',
  '/data/facilitiesData.js',
  '/data/buffData.js',
  '/data/translations.js',
  '/assets/map.png',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Dynamic content patterns
const DYNAMIC_PATTERNS = [
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/fonts\.googleapis\.com/,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:js|css)$/
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Initialize dynamic cache
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Installation failed:', error);
    })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
      
      // Notify clients about update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            message: 'Service Worker updated successfully'
          });
        });
      });
    })
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Static assets - Cache First
    if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace('/', '')))) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: API calls - Network First
    if (url.pathname.includes('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 3: Images and fonts - Cache First
    if (DYNAMIC_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await cacheFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: HTML pages - Stale While Revalidate
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Strategy 5: Everything else - Network First
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    
    // Return offline fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return await getOfflineFallback();
    }
    
    // For other requests, try cache or throw
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// ===== CACHING STRATEGIES =====

// Cache First - Good for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First - Good for API calls
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate - Good for HTML pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });
  
  return cachedResponse || await fetchPromise;
}

// Offline fallback page
async function getOfflineFallback() {
  const cache = await caches.open(STATIC_CACHE);
  const fallback = await cache.match('/index.html');
  
  if (fallback) {
    return fallback;
  }
  
  // Create a basic offline page if main page not cached
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline - Whiteout Companion</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          text-align: center;
          padding: 20px;
          margin: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .offline-container {
          max-width: 400px;
        }
        h1 { margin-bottom: 20px; }
        p { margin-bottom: 15px; opacity: 0.9; }
        button {
          background: #4facfe;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <h1>📱 You're Offline</h1>
        <p>Whiteout Companion works offline! Your data is saved locally.</p>
        <p>Reconnect to the internet to sync your latest changes.</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('[SW] Performing background sync...');
    
    // Get all clients (open tabs)
    const clients = await self.clients.matchAll();
    
    // Notify clients about sync
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        message: 'Background sync completed'
      });
    });
    
    console.log('[SW] Background sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const defaultOptions = {
    body: 'New update available for Whiteout Companion!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-72x72.png'
      }
    ],
    requireInteraction: true,
    tag: 'whiteout-notification'
  };
  
  let notificationData = defaultOptions;
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...defaultOptions, ...data };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Whiteout Companion', notificationData)
  );
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Open or focus the app
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clients) => {
      // Check if app is already open
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      
      // Open new window if app not open
      return self.clients.openWindow('/');
    })
  );
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION',
        version: CACHE_NAME
      });
      break;
      
    case 'FORCE_UPDATE':
      // Clear caches and reload
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'RELOAD_REQUIRED',
            message: 'App updated, reload required'
          });
        });
      });
      break;
      
    case 'CACHE_URLS':
      // Manually cache specific URLs
      if (event.data.urls && Array.isArray(event.data.urls)) {
        caches.open(DYNAMIC_CACHE).then((cache) => {
          return cache.addAll(event.data.urls);
        }).then(() => {
          event.ports[0].postMessage({
            type: 'CACHE_SUCCESS',
            message: 'URLs cached successfully'
          });
        }).catch((error) => {
          event.ports[0].postMessage({
            type: 'CACHE_ERROR',
            message: 'Failed to cache URLs',
            error: error.message
          });
        });
      }
      break;
  }
});

// ===== PERIODIC BACKGROUND SYNC =====
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'whiteout-sync') {
    event.waitUntil(performPeriodicSync());
  }
});

async function performPeriodicSync() {
  try {
    console.log('[SW] Performing periodic sync...');
    
    // Check for app updates
    const response = await fetch('/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      // Could check version or other update indicators here
    }
    
    // Notify clients about periodic sync
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'PERIODIC_SYNC',
        message: 'Periodic sync completed'
      });
    });
    
  } catch (error) {
    console.error('[SW] Periodic sync failed:', error);
  }
}

// ===== ERROR HANDLING =====
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

// ===== UTILITY FUNCTIONS =====

// Clean up old caches based on age or size
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const cachesToDelete = [];
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith('whiteout-') && 
        cacheName !== STATIC_CACHE && 
        cacheName !== DYNAMIC_CACHE) {
      cachesToDelete.push(caches.delete(cacheName));
    }
  }
  
  await Promise.all(cachesToDelete);
  console.log('[SW] Cache cleanup completed');
}

// Preload critical resources
async function preloadCriticalResources() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const criticalResources = [
    '/assets/icons/icon-192x192.png',
    '/assets/map.png'
  ];
  
  try {
    await cache.addAll(criticalResources);
    console.log('[SW] Critical resources preloaded');
  } catch (error) {
    console.error('[SW] Failed to preload critical resources:', error);
  }
}

// Run cleanup periodically
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Once per day

console.log('[SW] Service Worker script loaded successfully');