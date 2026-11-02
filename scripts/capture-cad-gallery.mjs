import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto('http://127.0.0.1:4173/#/engines/turbofan',{waitUntil:'domcontentloaded'});
  await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:20000});
  await page.getByRole('button',{name:/EXPLORE THE COLLECTION/}).click();
  const gallery=page.getByRole('dialog',{name:'Explore five jet engines'});
  await gallery.waitFor({state:'visible',timeout:10000});
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('.visual-gallery-card img'))
     .length===5&&Array.from(document.querySelectorAll('.visual-gallery-card img'))
     .every(img=>img instanceof HTMLImageElement&&img.complete&&img.naturalWidth>0),null,{timeout:20000});
  await page.screenshot({path:'docs/readme/gallery-desktop.png',fullPage:true});
  console.log('Gallery screenshot refreshed from all five SolidCraft CAD preview assets');
}finally{await browser.close()}
