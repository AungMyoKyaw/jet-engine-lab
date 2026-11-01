import { chromium } from '@playwright/test';
const root='http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
const issues=[];
try {
 const desktop=await browser.newPage({viewport:{width:1600,height:900},acceptDownloads:true});
 desktop.on('pageerror',e=>issues.push('desktop: '+e.message));
 await desktop.goto(root+'#/engines/turbofan',{waitUntil:'domcontentloaded'});
 await desktop.getByRole('heading',{name:'An engine to explore.'}).waitFor({timeout:15000});
 await desktop.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:15000});
 await desktop.waitForTimeout(700);
 await desktop.screenshot({path:'docs/visual-first-release/desktop.png',fullPage:true});
 await desktop.getByRole('button',{name:/Understand/}).click();
 await desktop.getByRole('heading',{name:'Intake.'}).waitFor();
 await desktop.getByRole('button',{name:'Next stage'}).click();
 await desktop.getByRole('heading',{name:'Compression.'}).waitFor();
 await desktop.screenshot({path:'docs/visual-first-release/understand.png',fullPage:true});
 await desktop.locator('.visual-stages button').nth(2).click();
 await desktop.getByRole('heading',{name:'Combustion.'}).waitFor();
 await desktop.getByRole('button',{name:/Experiment/}).click();
 await desktop.getByRole('complementary',{name:'Experiment controls'}).waitFor();
 const throttle=desktop.getByRole('slider',{name:'Power'});
 await throttle.fill('59');
 if(Number(await throttle.inputValue())!==59)issues.push('throttle does not change');
 await desktop.screenshot({path:'docs/visual-first-release/experiment.png',fullPage:true});
 await desktop.getByRole('button',{name:'Close experiment'}).click();
 await desktop.getByRole('button',{name:'Options'}).click();
 await desktop.getByRole('menuitem',{name:'About the physics'}).click();
 await desktop.getByRole('dialog',{name:'Engineering preview explanation'}).waitFor();
 await desktop.getByRole('button',{name:'Close dialog'}).click();
 await desktop.getByRole('button',{name:'Options'}).click();
 const downloadEvent=desktop.waitForEvent('download');
 await desktop.getByRole('menuitem',{name:'Save experiment'}).click();
 const file=await downloadEvent;
 if(!file.suggestedFilename().endsWith('.jetlab.json'))issues.push('project download extension');
 await desktop.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
 await desktop.getByRole('dialog',{name:'Explore five jet engines'}).waitFor();
 await desktop.getByRole('button',{name:'Explore Turbojet'}).click();
 await desktop.getByText('01 / THE ORIGINAL').waitFor();
 await desktop.getByRole('button',{name:'Toggle engine casing'}).click();
 await desktop.getByRole('button',{name:'Reset 3D view'}).click();
 await desktop.getByRole('button',{name:'Toggle theme'}).click();
 await desktop.screenshot({path:'docs/visual-first-release/light.png',fullPage:true});
 const rect=await desktop.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth,view:document.querySelector('.visual-engine-scene')?.getBoundingClientRect().height}));
 if(rect.scroll>rect.width+1)issues.push('desktop horizontal overflow');
 await desktop.close();
 for(const [width,height] of [[390,844],[360,740],[768,900],[1280,800],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',e=>issues.push(width+': '+e.message));
  await page.goto(root+'#/engines/turbofan',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'An engine to explore.'}).waitFor();
  await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:15000});
  await page.waitForTimeout(500);
  const m=await page.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll('.visual-stages button')].map(b=>{const r=b.getBoundingClientRect();return Math.round(r.left)>=0&&Math.round(r.right)<=window.innerWidth+1})}));
  if(m.scroll>width+1||m.buttons.some(v=>!v))issues.push(width+' overflow '+JSON.stringify(m));
  if(width===390){
   await page.screenshot({path:'docs/visual-first-release/mobile.png',fullPage:true});
   await page.getByRole('button',{name:/Experiment/}).click();
   await page.getByRole('slider',{name:'Power'}).waitFor();
   await page.screenshot({path:'docs/visual-first-release/mobile-experiment.png',fullPage:true});
  }
  console.log(width+'×'+height,'canvas loaded; horizontal overflow',m.scroll-width);
  await page.close();
 }
 if(issues.length)throw Error(issues.join(' | '));
 console.log('VISUAL-FIRST SMOKE PASS: scenes, stages, guided journey, simulator controls, modal, project save, themes, responsive layouts');
}finally{await browser.close()}
