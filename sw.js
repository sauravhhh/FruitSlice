const CACHE='fruitslice-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
'./img/whole-0.jpg','./img/whole-1.jpg','./img/whole-2.jpg','./img/whole-3.jpg',
'./img/half-0.jpg','./img/half-1.jpg','./img/half-2.jpg','./img/half-3.jpg'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cp=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,cp));
      return r;
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html')))
  );
});
