import { spawn } from 'node:child_process';
import { chromium, firefox, webkit } from '@playwright/test';

const port=4183;
const base='http://127.0.0.1:'+port+'/jet-engine-lab/';
const server=spawn('bun',['run','preview','--port',String(port)],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
let serverOutput='';
server.stdout.on('data',b=>serverOutput+=String(b));
server.stderr.on('data',b=>serverOutput+=String(b));
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const ensureServer=async()=>{
 for(let i=0;i<70;i++){try{const response=await fetch(base);if(response.ok)return;}catch{}await delay(120);}
 throw Error('Production preview did not start: '+serverOutput.slice(-500));
};
try{
 await ensureServer();
 for(const [name,driver] of Object.entries(process.argv.includes('--all-browsers')?{chromium,webkit,firefox}:{chromium})){
  const browser=await driver.launch({headless:true,...(name==='chromium'?{args:['--enable-unsafe-swiftshader']}: {})});
  try{
   const context=await browser.newContext({viewport:{width:1280,height:820},serviceWorkers:'allow'});
   const page=await context.newPage(),errors=[],cadResponses=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.url().includes('/assets/solidcraft/'))cadResponses.push([response.status(),response.url()]);});
   await page.goto(base+'#/engines/turbojet',{waitUntil:'domcontentloaded'});
   await page.getByRole('heading',{name:'An engine to explore.'}).waitFor({timeout:10000});
   await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:12000});
   await page.waitForFunction(()=>['intake-duct','compressor-cassette','combustor-liner','turbine-wheel','nozzle-housing','shaft-single-spool'].every(name=>performance.getEntriesByType('resource').some(entry=>entry.name.endsWith('/assets/solidcraft/'+name+'.glb'))),{timeout:20000});
   const threeD=await page.locator('.visual-engine-scene canvas').count();
   if(!threeD||await page.locator('.cad-asset-error,.webgl-fallback').count())throw Error('SolidCraft-only 3D renderer failed');
   for(const file of ['intake-duct','compressor-cassette','combustor-liner','turbine-wheel','nozzle-housing','shaft-single-spool']){
    if(!cadResponses.some(([status,url])=>status===200&&url.endsWith('/'+file+'.glb')))throw Error('Real CAD response missing: '+file);
   }
   await page.goto(base+'#/reference',{waitUntil:'domcontentloaded'});
   await page.getByText('Component map explorer').waitFor({timeout:12000});
   await page.getByRole('button',{name:'HPC',exact:true}).click();
   await page.screenshot({path:'docs/visual-first-release/production-'+name+'.png',fullPage:true});
   if(errors.length)throw Error('Page errors: '+errors.join(' | '));
   console.log(name.toUpperCase(),'PASS','engine=SolidCraft CAD','reference map=loaded');
   if(name==='chromium'){
    await page.goto(base+'#/engines/turbojet',{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(950);
    const controller=await page.evaluate(()=>navigator.serviceWorker.controller?.scriptURL);
    if(!controller?.includes('/jet-engine-lab/sw.js'))throw Error('Service worker not controlling preview');
    await context.setOffline(true);
    await page.goto(base+'#/reference',{waitUntil:'domcontentloaded'});
    await page.getByText('Component map explorer').waitFor({timeout:7000});
    console.log('CHROMIUM OFFLINE PASS: cached shell and reference module');
   }
   if(name==='chromium'){
    const negative=await browser.newContext({viewport:{width:1280,height:820},serviceWorkers:'block'});
    const broken=await negative.newPage();
    await broken.route('**/assets/solidcraft/intake-duct.glb',route=>route.abort('failed'));
    await broken.goto(base+'#/engines/turbojet',{waitUntil:'domcontentloaded'});
    await broken.getByText('CAD ASSET UNAVAILABLE').first().waitFor({timeout:20000});
    if(await broken.locator('.webgl-fallback').count())throw Error('3D model substituted by fallback after CAD failure');
    await negative.close();
    console.log('CHROMIUM CAD ERROR PASS: unavailable asset raises explicit status');
   }
   await context.close();
  }finally{await browser.close();}
 }
}finally{server.kill('SIGTERM');}
