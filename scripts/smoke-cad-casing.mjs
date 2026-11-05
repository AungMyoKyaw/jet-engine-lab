import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';

const root=(process.env.CAD_SMOKE_BASE ?? 'http://127.0.0.1:4173/').replace(/\/?$/, '/');
const cases=[
  {engine:'turbofan',width:1500,height:900,tag:'desktop'},
  {engine:'geared-turbofan',width:1440,height:900,tag:'geared'},
  {engine:'turbofan',width:390,height:844,tag:'mobile'},
];
const required=['bypass-structural-fittings.glb','intake-lip-hardware.glb'];
const nacelle='bypass-nacelle-panels.glb';
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:['--enable-unsafe-swiftshader']});
const failures=[];
mkdirSync('docs/solidcraft-cad',{recursive:true});
try{
  for(const {engine,width,height,tag} of cases){
    const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
    try{
      const page=await context.newPage();
      const responses=[];
      page.on('response',response=>{
        if(response.url().includes('/assets/solidcraft/'))responses.push({url:response.url(),status:response.status()});
      });
      page.on('pageerror',error=>failures.push(`${tag}: ${error.message}`));
      await page.goto(root+`#/engines/${engine}`,{waitUntil:'domcontentloaded'});
      const canvas=page.locator('.visual-engine-scene canvas');
      await canvas.waitFor({state:'visible',timeout:30000});
      await page.locator('.cad-loading-surface').waitFor({state:'hidden',timeout:40000});
      await page.waitForFunction(files=>files.every(file=>performance.getEntriesByType('resource').some(e=>e.name.endsWith('/assets/solidcraft/'+file))),required,{timeout:20000});
      if(responses.some(r=>r.status!==200))failures.push(`${tag}: failed original CAD response`);
      for(const file of required){
        if(!responses.some(r=>r.status===200&&r.url.endsWith('/'+file)))failures.push(`${tag}: missing original CAD ${file}`);
      }
      if(responses.some(r=>r.url.endsWith('/'+nacelle)))failures.push(`${tag}: hidden casing was fetched too early`);
      if(await page.locator('.cad-asset-error,.webgl-fallback').count())failures.push(`${tag}: CAD failure before casing enabled`);
      await page.screenshot({path:`docs/solidcraft-cad/casing-off-${tag}.png`});

      await page.getByRole('button',{name:'Toggle engine casing'}).click();
      await page.waitForFunction(file=>performance.getEntriesByType('resource').some(e=>e.name.endsWith('/assets/solidcraft/'+file)),nacelle,{timeout:30000});
      await page.locator('.cad-loading-surface').waitFor({state:'hidden',timeout:40000});
      if(!responses.some(r=>r.status===200&&r.url.endsWith('/'+nacelle)))failures.push(`${tag}: the original nacelle GLB never loaded successfully`);
      if(await page.getByRole('button',{name:'Toggle engine casing'}).getAttribute('aria-pressed')!=='true')failures.push(`${tag}: casing did not enable`);
      if(await page.locator('.cad-asset-error,.webgl-fallback').count())failures.push(`${tag}: CAD failure after casing enabled`);
      await page.waitForTimeout(350);
      await page.screenshot({path:`docs/solidcraft-cad/casing-on-${tag}.png`});

      await canvas.evaluate(el=>el.dataset.casingTest='same-assembly');
      await page.locator('.visual-stages button').nth(1).click();
      await page.getByRole('button',{name:'Show full engine'}).waitFor({state:'visible'});
      if(!await canvas.evaluate(el=>el.dataset.casingTest==='same-assembly'))failures.push(`${tag}: learning stage replaced original canvas`);
      if((await page.locator('.visual-cad-mark').innerText()).trim()!=='CAD DETAIL')failures.push(`${tag}: stage did not enter CAD detail mode`);
      await page.getByRole('button',{name:'Show full engine'}).click();
      if((await page.locator('.visual-cad-mark').innerText()).trim()!=='CAD ASSEMBLY')failures.push(`${tag}: full assembly did not restore`);
      await page.getByRole('button',{name:'Toggle engine casing'}).click();
      if(await page.getByRole('button',{name:'Toggle engine casing'}).getAttribute('aria-pressed')!=='false')failures.push(`${tag}: casing did not disable`);
      if(responses.filter(r=>r.url.endsWith('/'+nacelle)).length!==1)failures.push(`${tag}: casing was fetched repeatedly`);
      if(await page.locator('.cad-asset-error,.webgl-fallback').count())failures.push(`${tag}: CAD error after casing disabled`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      if(overflow>2)failures.push(`${tag}: horizontal overflow ${overflow}px`);
      console.log(`${tag}: original CAD casing 200, toggle and learning stage sync, no duplicate fetch`);
    }finally{await context.close();}
  }
}finally{await browser.close();}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('PASS: SolidCraft nacelle visibility, original GLB loading, stage identity and mobile layout.');
