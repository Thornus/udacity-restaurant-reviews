importScripts('js/serviceworker-cache-polyfill.js'); // polyfill needed for service worker to work on all browsers

var CACHE_NAME = 'restaurant-reviews-cache-v1';
var urlsToCache = [
	'/',
	'/css/styles.css',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/js/dbhelper.js'
];

// INSTALL EVENT
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
});

// ACTIVATE EVENT
self.addEventListener('activate', function (event) {
	event.waitUntil(caches.keys()
		.then(cacheNames =>
			Promise.all(
				cacheNames
					.filter(cacheName => cacheName === CACHE_NAME)
					.map(cleanCache)
			)
		));
});


// FETCH EVENT
self.addEventListener('fetch', function (event) {
	console.log('fetch', event.request.url);
	event.respondWith(serveCacheFile(event.request));
});

function serveCacheFile(request) {
	const url = request.url;

	if (shouldFileBeCached(url)) {

		// serve cached file
		return caches.open(CACHE_NAME).then(cache => {
			return cache.match(url).then(response => {
				return response ? response : fetch(request.clone()).then(response => {
					cache.put(url, response.clone());
					return response;
				});
			});
		});

	} else {

		return fetch(request).then(response => {
			return response;
		});

	}
}

function shouldFileBeCached(url) {
	const matchesWithUrlsToCache = urlsToCache.filter(urlToCache => url.indexOf(urlToCache) > -1);
	return matchesWithUrlsToCache.length > 0;
}

function cleanCache(cacheName) {
	return caches.delete(cacheName);
}
