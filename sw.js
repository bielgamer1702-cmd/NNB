/* Offline shell only. 3D models remain on-demand so the game does not download hundreds
   of megabytes or cache obsolete avatars during the first visit. */
const CACHE='amazonia-fluxo-20261123-selecao-missao-v7';
const FILES=["./ui/hud-rodape.js","./ui/campo.js", "./ui/campo.css", "./ui/locais/brt.jpg", "./ui/locais/cidade-nova.jpg", "./ui/locais/mangueirao.jpg", "./ui/locais/marco.jpg", "./ui/locais/republica.jpg", "./ui/locais/sao-bras.jpg", "./ui/locais/shopping.jpg", "./ui/locais/ufpa.jpg", "./ui/locais/utinga.jpg", "./ui/locais/ver-o-peso.jpg"].concat(['./','./index.html','./ui/revisao-final-modo-4197.css','./ui/revisao-final-modo-4197.js','./ui/revisao-fluidez-como-jogar-20261122.css','./ui/revisao-fluidez-como-jogar-20261122.js','./ui/referencias-rigidas-20261122.css','./ui/referencias-rigidas-20261122.js',
 './ui/ref-sol-original.png','./ui/ref-clima-original.png','./ui/ref-fisica-original.png',
 './ui/ref-missao-original.png','./ui/ref-expedicao-original.png','./ui/ref-hud-aprovado.png',
 './ui/rigor-final.css','./ui/rigor-final.js','./ui/ajustes-20261121.css','./ui/ajustes-20261121.js',
 './ui/final-ui.css','./ui/final-ui.js','./ui/approved-art.css','./ui/approved-art.js',
 './ui/expedition-new.js','./ui/stability-final.js','./ui/stability-final.css',
 './ui/world-revision.js','./ui/revisao-final-2026.js','./ui/revisao-final-2026.css',

 './ui/investigacao-sonora-aprovada.png','./ui/flavia-retrato-fundo-pergaminho.webp',
 './ui/botao-transparente-clima.png','./ui/botao-transparente-fisica.png',
 './ui/botao-transparente-missao.png','./ui/botao-transparente-caderno.png',
 './manifest.webmanifest','./icon-192.png','./icon-512.png']);
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async c=>{
  for(const f of FILES){try{await c.add(new Request(f,{cache:'reload'}));}catch(e){console.warn('Offline:',f,e);}}
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE && /^(amazonia-|amazon-fluxo-|af-laboratorio-vivo-)/.test(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=='GET'||u.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request,{cache:'no-cache'}).then(resp=>{
   if(resp.ok&&(/\/assets3d\/|\/ui\/model-(?:samuel|gaby)\.js$/.test(u.pathname))){
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
   }
   return resp;
 }).catch(async()=>{const cache=await caches.open(CACHE);const res=await cache.match(event.request);
   if(res)return res;return event.request.mode==='navigate'?(await cache.match('./index.html'))||Response.error():Response.error();
 }));
});
