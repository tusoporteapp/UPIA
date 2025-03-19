const CACHE_NAME = 'site-cache-v1';
const OFFLINE_URL = '/offline.html'; // Crea una página offline.html personalizada si deseas

const ASSETS_TO_CACHE = [
    '/index.html', // Página principal
    '/offline.html', // Página offline personalizada
    '/javascript/blogger-api.js', // Scripts
    '/javascript/blogger-cache.js',
    '/javascript/bold-and-bright.js',
    '/service-worker.js',
    '/fonts/inter', // Fuentes
    '/images/products/', // Carpeta con imágenes
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => caches.match(OFFLINE_URL));
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
