const CACHE_NAME = 'wordhub-cache';

const MAX_NETWORK_WAIT_TIME = 3000;

self.addEventListener('fetch', async function (event) {

  if (event.request.mode === 'cors') {
    // Requesting something from another domain - means that we're trying to access the API,
    // no need to handle this request with the service worker.
    return;
  }

  event.respondWith((async function () {

    const fetchRequest = event.request.clone();
    const cachedResponse = await caches.match(event.request);

    try {
      // If request is cached, only wait for a response for a certain time,
      // then default to reading from the cache
      const fetchResponse = await Promise.race([
        fetch(fetchRequest),
        new Promise((resolve, reject) =>
          cachedResponse ?
            setTimeout(reject, MAX_NETWORK_WAIT_TIME) :
            resolve()
        )
      ]);

      if (fetchResponse && fetchResponse.ok && fetchResponse.type === 'basic') {
        const fetchResponseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponseToCache);
        });
      }

      return fetchResponse;
    } catch (e) {
      // We're offline
      return cachedResponse;
    }
  })());

});
