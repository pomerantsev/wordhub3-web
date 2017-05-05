const CACHE_NAME = 'wordhub-cache';

self.addEventListener('fetch', async function (event) {

  event.respondWith((async function () {

    try {
      const fetchRequest = event.request.clone();

      const fetchResponse = await fetch(fetchRequest);

      if (fetchResponse && fetchResponse.ok && fetchResponse.type === 'basic') {
        const fetchResponseToCache = fetchResponse.clone();
        (async function () {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, fetchResponseToCache);
        })();
      }

      return fetchResponse;
    } catch (e) {
      // We're offline
      return await caches.match(event.request);
    }
  })());

});
