import {chromium} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {PARTS} from '../src/app/data/parts';
import {PHASES} from '../src/app/data/learning-stages';

// One original SolidCraft assembly persists through all five learning stages.
// A regression that replaces the scene with a second detail model fails here.
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:['--enable-unsafe-swiftshader']});
const errors=[];
mkdirSync('docs/solidcraft-cad',{recursive:true});
try{
 for(const [engine,phases] of Object.entries(PHASES)){
  const page=await browser.newPage({viewport:{width:1500,height:900}});
  try{
   const loaded=[];
   page.on('response',response=>{
    if(response.url().includes('/assets/solidcraft/'))loaded.push([response.status(),response.url()]);
   });
   page.on('pageerror',error=>errors.push(engine+': '+error.message));
   await page.goto((process.env.CAD_SMOKE_BASE ?? 'http://127.0.0.1:4173/').replace(/\/?$/, '/')+`#/engines/${engine}`,{waitUntil:'domcontentloaded'});
   await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:25000});
   await page.locator('.cad-loading-surface').waitFor({state:'hidden',timeout:25000});
   const viewport=page.locator('.visual-engine-scene canvas');
   await viewport.evaluate(el=>el.dataset.assemblySyncMarker='original-mounted-assembly');
   const initial=loaded.length;
   if(initial===0)errors.push(`${engine}: no SolidCraft CAD asset responses at assembly load`);
   if(loaded.some(([status])=>status!==200))errors.push(`${engine}: unsuccessful CAD asset response`);
   await page.screenshot({path:`docs/solidcraft-cad/sync-${engine}-full.png`});
   for(const [index,phase] of phases.entries()){
    await page.locator('.visual-stages button').nth(index).click();
    await page.getByRole('button',{name:'Show full engine'}).waitFor({state:'visible'});
    const same=await viewport.evaluate(el=>el.dataset.assemblySyncMarker==='original-mounted-assembly');
    if(!same)errors.push(`${engine}/${phase.name}: 3D canvas was replaced on stage change`);
    if((await page.locator('.visual-cad-mark').innerText()).trim()!=='CAD DETAIL')
     errors.push(`${engine}/${phase.name}: CAD detail label missing`);
    const title=await page.locator('.visual-part-note strong').innerText();
    if(phase.parts.length>1&&!title.includes(`${phase.parts.length} components`))
     errors.push(`${engine}/${phase.name}: expected ${phase.parts.length} grouped components; got ${title}`);
    if(await page.locator('.cad-asset-error,.webgl-fallback').count())
     errors.push(`${engine}/${phase.name}: CAD error rendered`);
    if(index===1){
     await page.waitForTimeout(350);
     await page.screenshot({path:`docs/solidcraft-cad/sync-${engine}-stage.png`});
    }
   }
   if(loaded.length!==initial)errors.push(`${engine}: additional CAD assets fetched when navigating lessons (${initial} -> ${loaded.length})`);
   await page.getByRole('button',{name:'Show full engine'}).click();
   if((await page.locator('.visual-cad-mark').innerText()).trim()!=='CAD ASSEMBLY')
    errors.push(`${engine}: full assembly did not restore`);
   console.log(`${engine}: ${PARTS[engine].length} integrated parts, ${phases.length} focused stages, same canvas, ${initial} original CAD responses`);
  }finally{await page.close();}
 }
}finally{await browser.close();}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log('PASS: 25/25 stages stay within the five existing SolidCraft engine assemblies.');
