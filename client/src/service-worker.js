importScripts("https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js");

workbox.setConfig({ modulePathPrefix: "workbox-v7.0.0/" });


const precacheManifest = [];

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest);