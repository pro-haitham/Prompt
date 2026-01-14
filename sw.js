const CACHE_VERSION="v"+new Date().getTime();
const CACHE_NAME=`mirrorart-cache-${CACHE_VERSION}`;
const urlsToCache=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install",event=>{
    event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});

self.addEventListener("activate",event=>{
    event.waitUntil(
        caches.keys().then(keys=>Promise.all(keys.map(key=>key!==CACHE_NAME&&caches.delete(key))))
    );
});

self.addEventListener("fetch",event=>{
    event.respondWith(
        caches.match(event.request).then(response=>response||fetch(event.request).catch(()=>{
            if(event.request.destination==="document") return caches.match("./index.html");
        }))
    );
});
