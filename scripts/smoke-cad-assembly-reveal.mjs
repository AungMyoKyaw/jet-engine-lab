import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';

const port=4188;
const base=`http://127.0.0.1:${port}/jet-engine-lab/`;
const server=spawn('bun',['run','preview','--port',String(port)],{cwd:process.cwd(),stdio:['ignore','pipe','pipe']});
let serverOutput='';
server.stdout.on('data',data=>serverOutput+=String(data));
server.stderr.on('data',data=>serverOutput+=String(data));
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

try{
 let online=false;
 for(let attempt=0;attempt<70;attempt++){
  try{if((await fetch(base)).ok){online=true;break;}}catch{}
  await delay(150);
 }
 if(!online)throw Error('Preview failed to start: '+serverOutput.slice(-500));
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  for(const {name,width,height} of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
   const context=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
   try{
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    let delayed=false;
    await page.route('**/assets/solidcraft/compressor-case-detail.glb',async route=>{
     delayed=true;
     await delay(6000);
     await route.continue();
    });
    await page.goto(base+'#/engines/turbofan',{waitUntil:'domcontentloaded'});
    const loading=page.locator('.cad-assembly-loading');
    await loading.waitFor({state:'visible',timeout:15000});
    await page.waitForTimeout(900);
    if(!delayed||!await loading.isVisible())throw Error(`${name}: incomplete CAD assembly was revealed before all assets loaded`);
    if(await page.locator('.cad-asset-error').count())throw Error(`${name}: unexpected CAD load error`);
    await loading.waitFor({state:'hidden',timeout:45000});
    if(await page.locator('.cad-asset-error,.webgl-fallback').count())throw Error(`${name}: unexpected CAD error after loading`);
    if(errors.length)throw Error(`${name}: ${errors.join(' | ')}`);
    console.log(`${name.toUpperCase()} PASS: loading status persisted while an original CAD part was delayed; complete engine revealed after loading`);
   }finally{await context.close();}
  }
  const context=await browser.newContext({viewport:{width:1280,height:820},serviceWorkers:'block'});
  try{
   const page=await context.newPage();
   await page.route('**/assets/solidcraft/intake-duct.glb',route=>route.abort('failed'));
   await page.goto(base+'#/engines/turbojet',{waitUntil:'domcontentloaded'});
   await page.getByRole('alert').getByText('CAD ASSET UNAVAILABLE').waitFor({timeout:20000});
   if(await page.locator('.cad-assembly-loading,.webgl-fallback').count())throw Error('Missing CAD kept loading or substituted a fallback');
   const retry=page.getByRole('button',{name:'Retry loading CAD'});
   if(!await retry.isVisible())throw Error('Missing CAD recovery action is inaccessible');
   await Promise.all([page.waitForEvent('load'),retry.click({timeout:10000})]);
   await page.getByRole('alert').getByText('CAD ASSET UNAVAILABLE').waitFor({timeout:20000});
   console.log('MISSING CAD PASS: whole-assembly failure exposed, retry reloads, and no substitute model rendered');
  }finally{await context.close();}
 }finally{await browser.close();}
}finally{server.kill('SIGTERM');}
