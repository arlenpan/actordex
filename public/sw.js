// cache info
var CACHE = 'actordex-cache';
var urlsToCache = [
  '/',
  'css/main.css',
  'css/bulma.css',
  'js/app.js',
  'js/config.js',
  'js/vue.min.js',
  'assets/profile-placeholder.png'
]

// on install
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// on fetching cached files
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});