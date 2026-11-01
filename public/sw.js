const REV='jetlab-v2-alpha-3';
const SHELL=REV+'-shell',RUNTIME=REV+'-runtime',MAX_RUNTIME=28;
const scope=self.registration.scope;

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  const shell=await fetch(scope,{cache:'reload'});
  if(!shell.ok)throw Error('Could not cache application shell.');
  await cache.put(scope,shell);
  try {
   const response=await fetch(new URL('precache-manifest.json',scope),{cache:'no-store'});
   if(!response.ok)throw Error('Precache manifest unavailable.');
   const manifest=await response.json();
   if(manifest.version!==1 || !Array.isArray(manifest.assets))throw Error('Invalid precache manifest.');
   const paths=manifest.assets.filter(p=>typeof p==='string'&&p&&!p.startsWith('/')&&!p.includes('..'));
   await Promise.all(paths.map(async p=>{
    const url=new URL(p,scope).href,resource=await fetch(url,{cache:'reload'});
    if(!resource.ok)throw Error('Could not cache '+p);
    await cache.put(url,resource);
   }));
  } catch(error) {
   // Shell stays cached, but affected offline routes may not be ready.
   console.warn('Jet Engine Lab precache incomplete:',error);
  }
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const name of await caches.keys())
   if(name.startsWith('jetlab-')&&name!==SHELL&&name!==RUNTIME)await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==location.origin||!url.href.startsWith(scope))return;
 const navigation=request.mode==='navigate';
 const staticAsset=/\.(?:js|css|woff2?|png|svg|webp|hdr|glb|gltf|ktx2?|wasm|json)$/i.test(url.pathname);
 if(!navigation&&!staticAsset)return;
 event.respondWith((async()=>{
  const shellCache=await caches.open(SHELL);
  if(navigation){
   try {
    const result=await fetch(request);
    if(result.ok)await shellCache.put(scope,result.clone());
    return result;
   }catch{return await shellCache.match(scope)||Response.error();}
  }
  const shellAsset=await shellCache.match(request,{ignoreVary:true});
  if(shellAsset)return shellAsset;
  const runtime=await caches.open(RUNTIME);
  const cached=await runtime.match(request,{ignoreVary:true});
  if(cached)return cached;
  try {
   const response=await fetch(request);
   if(response.ok){
    await runtime.put(request,response.clone());
    const keys=await runtime.keys();
    for(const key of keys.slice(0,Math.max(0,keys.length-MAX_RUNTIME)))await runtime.delete(key);
   }
   return response;
  }catch{return Response.error();}
 })());
});
