const CACHE_NAME = 'wordhub-cache';

self.addEventListener('fetch', async function (event) {

  if (event.request.mode === 'cors') {
    // Requesting something from another domain - means that we're trying to access the API,
    // no need to handle this request with the service worker.
    return;
  }

  event.respondWith((async function () {

    try {
      const fetchRequest = event.request.clone();

      const fetchResponse = await fetch(fetchRequest);

      if (fetchResponse && fetchResponse.ok && fetchResponse.type === 'basic') {
        const fetchResponseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponseToCache);
        });
      }

      return fetchResponse;
    } catch (e) {
      // We're offline
      return await caches.match(event.request);
    }
  })());

});
