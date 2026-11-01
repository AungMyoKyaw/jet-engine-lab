import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const engines=['turbojet','turbofan','afterburning-turbofan','centrifugal-turbojet','geared-turbofan'];
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
try{
 await mkdir('public/assets/engine-previews',{recursive:true});
 const page=await browser.newPage({viewport:{width:1120,height:670},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of engines){
  await page.goto('http://127.0.0.1:4173/#/engines/'+id,{waitUntil:'domcontentloaded'});
  await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:25000});
  await page.addStyleTag({content:'.visual-lab > :not(.visual-engine-scene){visibility:hidden!important}.visual-engine-scene{z-index:10!important}'});
  await page.waitForTimeout(750);
  const file='public/assets/engine-previews/'+id+'.png';
  await page.locator('.visual-engine-scene').screenshot({path:file,animations:'disabled'});
  console.log('Saved',id,file);
 }
 if(errors.length)throw Error(errors.join(' | '));
 await page.close();
}finally{await browser.close()}
