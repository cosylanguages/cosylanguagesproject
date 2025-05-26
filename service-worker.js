const CACHE_NAME = 'cosylanguages-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/scripts/utils.js',
  '/scripts/data/vocab-data.js',
  '/scripts/data/grammar-data.js',
  '/scripts/data/speaking-data.js',
  '/scripts/data/image-data.js',
  '/scripts/data/translations.js',
  '/scripts/data/voices.js',
  '/scripts/data/gender-practice-data.js',
  '/scripts/data/verb-practice-data.js',
  '/scripts/data/possessives-practice-data.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});
