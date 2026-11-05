import {chromium} from '@playwright/test';
import {PARTS} from '../src/app/data/parts';

const assets={
  inlet:['intake-duct'],fan:['fan-blisk','fan-outlet-guides'],compressor:['compressor-cassette','stator-vane-ring','compressor-case-detail','compressor-service-hardware'],
  impeller:['radial-impeller'],diffuser:['radial-diffuser'],
  burner:['combustor-liner','combustor-dome','combustor-manifold','combustor-thermal-hardware'],turbine:['turbine-wheel','turbine-nozzle-guide','turbine-shroud','bearing-cartridge','bearing-roller-train'],
  gearbox:['planetary-reducer','gearbox-support-hardware'],afterburner:['afterburner-assembly'],
  nozzle:['nozzle-housing','nozzle-petals','nozzle-actuators'],bypass:['bypass-lattice']
};
const supportedEngines=['turbojet','turbofan','afterburning-turbofan','centrifugal-turbojet','geared-turbofan'];
const requested=process.argv.slice(2);
if(requested.some(engine=>!supportedEngines.includes(engine))) throw Error('Unknown engine: '+requested.filter(engine=>!supportedEngines.includes(engine)).join(', '));
const engines=requested.length?requested:supportedEngines;
const browser=await chromium.launch({headless:true,args:process.platform==='darwin'?['--use-gl=angle','--use-angle=metal']:['--enable-unsafe-swiftshader']});
const failures=[];
try{
  for(const engine of engines){
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const requests=[];
    page.on('response',response=>{
      if(response.url().includes('/assets/solidcraft/'))requests.push([response.status(),response.url()]);
    });
    page.on('pageerror',error=>failures.push(engine+': JS '+error.message));
    await page.goto((process.env.CAD_SMOKE_BASE ?? 'http://127.0.0.1:4173/').replace(/\/?$/, '/')+'#/engines/'+engine,{waitUntil:'domcontentloaded'});
    await page.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:25000});
    const shaft=engine==='turbojet'||engine==='centrifugal-turbojet'?'shaft-single-spool':'shaft-dual-spool';
    const files=[...new Set([...PARTS[engine].flatMap(part=>assets[part.kind]),shaft])];
    await page.waitForFunction(expected=>expected.every(file=>
      performance.getEntriesByType('resource').some(resource=>resource.name.endsWith('/assets/solidcraft/'+file+'.glb'))
    ),files,{timeout:25000});
    await page.waitForTimeout(1100);
    if(await page.locator('.cad-asset-error,.webgl-fallback').count())
      failures.push(engine+' showed CAD load error or WebGL failure');
    for(const file of files){
      if(!requests.some(([status,url])=>status===200&&url.endsWith('/'+file+'.glb')))
        failures.push(engine+' missing CAD '+file);
    }
    await page.screenshot({path:'docs/solidcraft-cad/full-'+engine+'.png',fullPage:true});
    // Gallery previews should show only the machine. Preserve the complete
    // interface capture above as smoke-test evidence.
    await page.addStyleTag({content:`
      .visual-header,.visual-coordinate,.visual-side-controls,.visual-flow,
      .visual-narrative,.visual-readout,.visual-bottom,.visual-options,
      .visual-experiment,.visual-disclaimer,.visual-back-engine {
        visibility:hidden !important;
      }
    `});
    await page.screenshot({path:'docs/solidcraft-cad/gallery-'+engine+'.png',fullPage:true});
    console.log(engine+': '+files.length+' CAD asset families loaded; evidence and clean gallery captured');
    await page.close();
  }
}finally{
  await browser.close();
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}
else console.log('PASS: '+engines.length+' integrated SolidCraft assemblies, real CAD asset responses and screenshots');
