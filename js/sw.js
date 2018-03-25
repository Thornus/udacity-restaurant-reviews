var CACHE_NAME = 'restaurant-reviews-cache-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js'
];

self.addEventListener('install', function(event) {
  console.log('gfbefgeg');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
