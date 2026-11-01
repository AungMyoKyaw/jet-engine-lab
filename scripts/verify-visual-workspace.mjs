import { chromium } from '@playwright/test';

const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
const base='http://127.0.0.1:4173/#/engines/';
const errors=[],reports=[];
try {
 for(const [width,height,engine] of [[1920,1080,'turbofan'],[1440,900,'turbojet'],[1024,768,'turbofan'],[768,900,'turbojet'],[390,844,'turbofan'],[360,740,'turbojet']]){
  console.log('CHECKING',width,height);
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(width+' page '+e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(width+' console '+m.text())});
  await page.goto(base+engine,{waitUntil:'domcontentloaded'});
  await page.locator('.viewport canvas').waitFor({state:'visible',timeout:12000});
  await page.waitForTimeout(600);
  const data=await page.evaluate(()=>{
   const rect=s=>{const el=document.querySelector(s),r=el?.getBoundingClientRect();return r&&{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};
   return {scrollWidth:document.documentElement.scrollWidth,innerWidth:innerWidth,documentHeight:document.body.scrollHeight,stage:rect('.lab-frame'),viewport:rect('.viewport-canvas'),controls:rect('.below-grid'),throttle:rect('.stage-throttle'),telemetry:rect('.telemetry'),
    actions:[...document.querySelectorAll('.viewport-controls >button')].map(el=>{const r=el.getBoundingClientRect();return{text:el.textContent?.trim(),left:Math.round(r.left),right:Math.round(r.right),visible:r.right<=innerWidth+2&&r.left>=-2};})};
  });
  if(data.scrollWidth>width+2)errors.push(width+' horizontal overflow '+data.scrollWidth);
  if(data.actions.some(a=>!a.visible))errors.push(width+' toolbar action clipped '+JSON.stringify(data.actions));
  if(height>=900 && width>=1024 && data.controls?.y>=height)errors.push(width+' advanced controls not visible in initial viewport');
  if(data.throttle?.y>=height)errors.push(width+' primary throttle not visible above fold');
  await page.getByRole('button',{name:'INSPECT PARTS'}).click();
  await page.getByRole('button',{name:'Close component inspector'}).waitFor({state:'visible'});
  await page.getByRole('button',{name:'Close component inspector'}).click();
  if(await page.locator('.part-panel').count())errors.push(width+' inspector remained after close');
  const select=page.locator('select[aria-label="Camera view"]');
  await select.selectOption('side');
  if(await select.inputValue()!=='side')errors.push(width+' camera preset failed');
  await page.locator('.viewport-controls button').last().click();
  if(await select.inputValue()!=='threequarter')errors.push(width+' camera reset failed');
  if(width===390||width===360){
   const t=page.getByRole('slider',{name:'Quick throttle'});
   const before=Number(await t.inputValue());
   await t.focus();await t.press('ArrowRight');
   const after=Number(await t.inputValue());
   if(after!==before+1)errors.push(width+' quick throttle did not update ('+before+' → '+after+')');
  }
  if(width===1024||width===768){await page.screenshot({path:'docs/visual-audit/after/engine-'+width+'.png',fullPage:true});}
  if(width===390){
   await page.getByRole('button',{name:'INSPECT PARTS'}).click();
   await page.screenshot({path:'docs/visual-audit/after/mobile-inspector.png'});
   await page.getByRole('button',{name:'Close component inspector'}).click();
   await page.getByRole('button',{name:'Toggle light/dark theme'}).click();
   await page.screenshot({path:'docs/visual-audit/after/mobile-light.png',fullPage:true});
  }
  reports.push({viewport:width+'x'+height,engine,...data});
  await page.close();
 }
 console.log(JSON.stringify({reports,errors},null,2));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}
