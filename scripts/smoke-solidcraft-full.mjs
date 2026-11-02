import {chromium} from '@playwright/test';
import {PARTS} from '../src/app/data/parts';

const assets={
  inlet:'intake-duct',fan:'rotor-stage',compressor:'rotor-stage',
  impeller:'radial-impeller',diffuser:'radial-diffuser',
  burner:'combustor-manifold',turbine:'rotor-stage',
  gearbox:'planetary-reducer',afterburner:'afterburner-assembly',
  nozzle:'nozzle-housing',bypass:'bypass-lattice'
};
const engines=['turbojet','turbofan','afterburning-turbofan','centrifugal-turbojet','geared-turbofan'];
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
const failures=[];
try{
  for(const engine of engines){
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const requests=[];
    page.on('response',response=>{
      if(response.url().includes('/assets/solidcraft/'))requests.push([response.status(),response.url()]);
    });
    page.on('pageerror',error=>failures.push(engine+': JS '+error.message));
    await page.goto('http://127.0.0.1:4173/#/engines/'+engine,{waitUntil:'domcontentloaded'});
    await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:25000});
    const files=[...new Set(PARTS[engine].map(part=>assets[part.kind]))];
    await page.waitForFunction(expected=>expected.every(file=>
      performance.getEntriesByType('resource').some(resource=>resource.name.endsWith('/assets/solidcraft/'+file+'.glb'))
    ),files,{timeout:25000});
    await page.waitForTimeout(1100);
    for(const file of files){
      if(!requests.some(([status,url])=>status===200&&url.endsWith('/'+file+'.glb')))
        failures.push(engine+' missing CAD '+file);
    }
    await page.screenshot({path:'docs/solidcraft-cad/full-'+engine+'.png',fullPage:true});
    console.log(engine+': '+files.length+' CAD asset families loaded; screenshot captured');
    await page.close();
  }
}finally{
  await browser.close();
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
else console.log('PASS: all 5 integrated SolidCraft assemblies, real CAD asset responses and screenshots');
