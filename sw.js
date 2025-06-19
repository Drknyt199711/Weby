const CACHE_NAME = 'tic-tac-toe-v2'; // Increment this version number when you update files
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event: Caches all assets specified in urlsToCache
self.addEventListener('install', event => {
    console.log('Service Worker: Install Event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching all assets');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache assets', error);
            })
    );
});

// Fetch event: Intercepts network requests and serves from cache first
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return cached response
                if (response) {
                    console.log(`Service Worker: Serving from cache - ${event.request.url}`);
                    return response;
                }
                // No cache hit - fetch from network
                console.log(`Service Worker: Fetching from network - ${event.request.url}`);
                return fetch(event.request)
                    .catch(() => {
                        // This catch block handles network failures.
                        // You could serve a generic offline page here if needed.
                        console.error('Service Worker: Network request failed for', event.request.url);
                        // For a simple Tic-Tac-Toe, failing to fetch might just mean no image or asset loads
                        // if it wasn't in cache and network is off.
                    });
            })
    );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activate Event');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches that are not in the whitelist
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`Service Worker: Deleting old cache - ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
