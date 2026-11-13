const V='cxf-field-v1';
const SHELL=['./','index.html','leaflet.js','leaflet.css','config.js','base.jpg','icon.png','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='cxf-tiles').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
  }else if(u.hostname.endsWith('nationalmap.gov')){
    e.respondWith(caches.open('cxf-tiles').then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}))));
  }
});
