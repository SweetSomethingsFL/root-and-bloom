/* Root & Bloom — Service Worker
   Cache-first strategy for app shell, network-first for API calls
*/

const CACHE_NAME = "rootbloom-v2";

// App shell files to cache on install
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./ai-features.js",
  "./pc-lessons.js",
  "./data.js",
  "./state-requirements.js",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js"
];

// Install — cache app shell
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local files reliably; CDN files best-effort
      const local  = APP_SHELL.filter(u => u.startsWith("./"));
      const remote = APP_SHELL.filter(u => !u.startsWith("./"));
      return cache.addAll(local).then(() =>
        Promise.allSettled(remote.map(url =>
          fetch(url, { cache: "no-store" })
            .then(res => { if (res.ok) cache.put(url, res); })
            .catch(() => {})
        ))
      );
    })
  );
});

// Activate — remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for app shell, network-first for Anthropic API
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // Always go network for Anthropic API calls
  if (url.includes("api.anthropic.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful GET responses for app files
        if (
          response.ok &&
          event.request.method === "GET" &&
          (url.includes("unpkg.com") || url.startsWith(self.location.origin))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — return cached index.html for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
