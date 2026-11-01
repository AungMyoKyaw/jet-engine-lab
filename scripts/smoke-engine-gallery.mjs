import {chromium,webkit} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const base='http://127.0.0.1:4173/';
const ids=['turbojet','turbofan','afterburning-turbofan','centrifugal-turbojet','geared-turbofan'];
const isWebKit=process.env.JETLAB_BROWSER==='webkit';
const browser=await (isWebKit?webkit:chromium).launch({headless:true,...(isWebKit?{}:{args:['--enable-unsafe-swiftshader']})});
const issues=[];
async function scene(page,id){
 await page.goto(base+'#/engines/'+id,{waitUntil:'domcontentloaded'});
 await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:20000});
 await page.getByRole('heading',{name:'An engine to explore.'}).waitFor();
 await page.waitForTimeout(180);
}
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 page.on('pageerror',e=>issues.push('JavaScript: '+e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/'))issues.push(r.status()+' '+r.url())});
 await scene(page,'turbofan');
 await page.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
 await page.getByRole('dialog',{name:'Explore five jet engines'}).waitFor();
 if(await page.locator('.visual-gallery-card').count()!==5)issues.push('gallery count');
 for(const id of ids){
  const img=page.locator('img[src$="/'+id+'.png"]');
  await img.waitFor();
  const ready=await img.evaluate(e=>e.complete&&e.naturalWidth>0);
  if(!ready)issues.push(id+' preview image missing');
 }
 await page.screenshot({path:'docs/engine-gallery-audit/gallery-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Explore Afterburning turbofan'}).click();
 await page.getByText('03 / FIGHTER').waitFor();
 await page.getByRole('button',{name:/Experiment/}).click();
 await page.getByRole('button',{name:'AFTERBURNER ON'}).click();
 await page.getByRole('button',{name:'LIGHT AFTERBURNER'}).click();
 const flameButton=page.getByRole('button',{name:'AFTERBURNER ON'});
 if(await flameButton.getAttribute('aria-pressed')!=='true')issues.push('afterburner toggle');
 await page.getByRole('slider',{name:'Nozzle opening illustration'}).fill('83');
 if(await page.getByRole('slider',{name:'Nozzle opening illustration'}).inputValue()!=='83')issues.push('nozzle opening');
 if(!(await page.locator('.visual-readout').innerText()).includes('NOT MODELED'))issues.push('visual-only engine has fabricated performance');
 await page.screenshot({path:'docs/engine-gallery-audit/afterburner-on.png',fullPage:true});
 const downloadEvent=page.waitForEvent('download');
 await page.getByRole('button',{name:'Options'}).click();
 await page.getByRole('menuitem',{name:'Save experiment'}).click();
 const downloaded=await downloadEvent;
 const project=JSON.parse(await readFile(await downloaded.path(),'utf8'));
 if(project.visualEngine!=='afterburning-turbofan')issues.push('visual engine project state not persisted');
 await page.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
 await page.getByRole('button',{name:'Explore Centrifugal turbojet'}).click();
 await page.getByText('04 / RADIAL').waitFor();
 await page.locator('.visual-stages button').nth(1).click();
 await page.getByRole('heading',{name:'Impeller.'}).waitFor();
 await page.waitForTimeout(850);
 await page.screenshot({path:'docs/engine-gallery-audit/radial-impeller.png',fullPage:true});
 await page.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
 await page.getByRole('button',{name:'Explore Geared turbofan'}).click();
 await page.getByText('05 / GEARED').waitFor();
 await page.locator('.visual-stages button').nth(1).click();
 await page.getByRole('heading',{name:'Gearbox.'}).waitFor();
 await page.getByRole('button',{name:/Experiment/}).click();
 await page.getByRole('button',{name:'REVEAL GEAR POWER PATH'}).click();
 await page.waitForTimeout(850);
 await page.screenshot({path:'docs/engine-gallery-audit/geared-power.png',fullPage:true});
 if(!(await page.locator('.visual-readout').innerText()).includes('NOT MODELED'))issues.push('geared fake performance');
 await page.close();
 for(const width of [390,768]){
  const mobile=await browser.newPage({viewport:{width,height:844}});
  mobile.on('pageerror',e=>issues.push(width+': '+e.message));
  await scene(mobile,'afterburning-turbofan');
  await mobile.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
  await mobile.getByRole('dialog',{name:'Explore five jet engines'}).waitFor();
  const layout=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,cards:[...document.querySelectorAll('.visual-gallery-card')].map(x=>{const r=x.getBoundingClientRect();return{left:r.left,right:r.right}})}));
  if(layout.scroll>width+1||layout.cards.some(c=>c.left<0||c.right>width+1))issues.push('gallery mobile overflow '+JSON.stringify(layout));
  if(width===390)await mobile.screenshot({path:'docs/engine-gallery-audit/gallery-mobile.png',fullPage:true});
  await mobile.getByRole('button',{name:'Explore Geared turbofan'}).click();
  await mobile.getByRole('button',{name:/Experiment/}).click();
  await mobile.getByRole('button',{name:'REVEAL GEAR POWER PATH'}).waitFor();
  await mobile.close();
 }
 if(issues.length)throw Error(issues.join(' | '));
 console.log('GALLERY SMOKE PASS: 5 engine cards, 3 new interactive architectures, stage focus, visual-only numerical integrity, mobile 390/768, project persistence');
}finally{await browser.close()}
