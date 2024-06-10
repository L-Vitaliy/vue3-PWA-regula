import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

// Register precache routes (static cache)
precacheAndRoute(self.__WB_MANIFEST || [])

// Clean up old cache
cleanupOutdatedCaches()

registerRoute(
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [],
    }),
    'GET',
)

// Install and activate service worker
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
