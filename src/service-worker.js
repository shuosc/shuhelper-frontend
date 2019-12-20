workbox.core.setCacheNameDetails({prefix: "shuhelper-frontend"});

self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        await self.skipWaiting();
    } else if (event.data && event.data.type === 'LOGOUT') {
        await caches.delete("api-cache");
    }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


workbox.routing.registerRoute(/\/api\//,
    new workbox.strategies.NetworkFirst({
        "cacheName": "api-cache",
        plugins: [new workbox.expiration.Plugin({maxAgeSeconds: 86400, purgeOnQuotaError: false})]
    }), 'GET'
);

workbox.routing.registerRoute(
    /^https:\/\/cdn\.bootcss\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'bootcss-cdn',
    }),
);

workbox.routing.registerRoute(
    /(^https:\/\/fonts\.font\.im)|(^https:\/\/fonts\.gstatic\.font\.im)/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'font-im-cdn',
    }),
);
