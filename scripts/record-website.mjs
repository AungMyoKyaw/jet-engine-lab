/**
 * Record the entire Jet Engine Lab, with an optional short visual smoke test.
 *
 * Usage:
 *   bun add --dev playwright
 *   bun run record
 *
 * Optional:
 *   RECORD_URL=https://example.com bun run record
 *   bun run record --quick
 *
 * Output is deliberately excluded from Git, including raw browser capture.
 */
import { mkdir, rm, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';

const quick = process.argv.includes('--quick');
const root = resolve(import.meta.dir, '..');
const outputDir = resolve(root, 'recordings');
const rawDir = resolve(outputDir, 'raw');
const output = resolve(outputDir, quick ? 'jet-engine-lab-smoke.mp4' : 'jet-engine-lab-complete.mp4');
const captureUrl = process.env.RECORD_URL || 'http://127.0.0.1:4173/';
const library = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = await import(library);

await mkdir(rawDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader']
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
  recordVideo: { dir: rawDir, size: { width: 1600, height: 900 } },
  colorScheme: 'light'
});
const page = await context.newPage();
page.setDefaultTimeout(15000);

const consoleErrors=[];
const pageErrors=[];
page.on('console', m => {if(m.type()==='error') consoleErrors.push(m.text());});
page.on('pageerror', e => pageErrors.push(e.message));
const events=[];
const begin=Date.now();
const now = () => ((Date.now()-begin)/1000).toFixed(1);
const mark = (name, details={}) => {
  events.push({second:Number(now()),name,...details});
  console.log('['+now()+'s] '+name);
};
const sleep = ms => page.waitForTimeout(ms);
const scrollY = () => page.evaluate(() => window.scrollY);
const getTop = selector => page.locator(selector).first().evaluate(el => Math.max(0, el.getBoundingClientRect().top + window.scrollY - 70));
async function scrollTo(target,pxPerSec=470) {
  const from=await scrollY();
  const to = typeof target==='number' ? target : await getTop(target);
  const span=Math.abs(to-from);
  if(span<2)return;
  const duration=Math.max(450,Math.min(8500,Math.round(span/pxPerSec*1000)));
  await page.evaluate(({y,duration}) => new Promise(resolve => {
    const startY=window.scrollY, distance=y-startY,start=performance.now();
    function step(t){
      const p=Math.min(1,(t-start)/duration);
      const ease=p*p*(3-2*p);
      window.scrollTo({top:startY+distance*ease,behavior:'instant'});
      if(p<1)requestAnimationFrame(step);else resolve();
    }
    requestAnimationFrame(step);
  }),{y:to,duration});
}
async function setRange(id,value) {
  await page.locator('#'+id).evaluate((el,v)=>{
    el.value=String(v);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  },value);
}
async function click(selector) { await page.locator(selector).first().click(); }
async function pause(ms=1000) { await sleep(quick ? Math.min(250,ms) : ms); }
async function sceneDrag(){
  const bounds=await page.locator('#engine-canvas').boundingBox();
  if(!bounds)return;
  const sx=bounds.x+bounds.width*.49,sy=bounds.y+bounds.height*.52;
  await page.mouse.move(sx,sy);
  await page.mouse.down();
  for(let i=0;i<=45;i++){
    const p=i/45;
    await page.mouse.move(sx+130*p,sy+48*Math.sin(p*Math.PI),{steps:1});
    await sleep(quick?5:28);
  }
  await page.mouse.up();
}
async function checkTopAndRecord(name, selector) {
  const top=await getTop(selector);
  mark(name,{y:Math.round(top)});
  await scrollTo(top);
  await pause(1400);
}

let rawVideo, result;
try {
  mark('Open published website',{url:captureUrl});
  await page.goto(captureUrl,{waitUntil:'domcontentloaded',timeout:90000});
  await page.evaluate(async()=> { await document.fonts.ready; document.documentElement.style.scrollBehavior='auto'; });
  await page.locator('#thrust-number').waitFor({state:'visible'});
  await page.waitForFunction(() => {
    const number=document.querySelector('#thrust-number')?.textContent?.trim();
    return number && number !== '—' && Number.isFinite(Number(number));
  },null,{timeout:60000});
  await sleep(400);
  const readySeconds=(Date.now()-begin)/1000;
  const state = await page.evaluate(() => ({
    title:document.title,documentHeight:document.documentElement.scrollHeight,
    viewHeight:innerHeight,renderError:!!document.querySelector('.scene-error'),
    sections:[...document.querySelectorAll('main section')].map(s=>({label:s.id||s.classList[0],top:Math.round(s.offsetTop)})),
    webgl:!!document.querySelector('canvas')
  }));
  if(state.renderError) throw Error('3D scene failed to initialize');
  if(!state.webgl) throw Error('3D engine canvas missing');
  mark('DOM and 3D initialized',state);
  await pause(2400);
  if(quick){
    await scrollTo('.workbench',950);
    await pause(700);
  } else {
    await checkTopAndRecord('01 / Engine anatomy','.workbench');
    await sceneDrag();
    await pause(1200);
    for(let i=1;i<5;i++){
      await click('.stage-item[data-stage="'+i+'"]');
      mark('Inspect engine stage '+(i+1));
      await pause(1250);
    }
    await click('#explode-button');mark('Exploded engine');
    await pause(3200);
    await click('#cutaway-button');mark('Solid casing');
    await pause(2100);
    await click('#cutaway-button');
    await click('#explode-button');
    await click('#reset-button');
    await pause(1200);

    await checkTopAndRecord('02 / Live cycle controls','.control-section');
    await setRange('throttle',92);
    await setRange('pressure-ratio',18);
    await setRange('mach',.55);
    mark('Adjust fuel, compression and flight speed');
    await pause(2400);
    await click('#reset-inputs');
    await pause(1400);
    await scrollTo('.slider-grid',430);
    await pause(1400);

    await checkTopAndRecord('03 / Aerodynamics','#aerodynamics');
    await scrollTo('.aero-workspace',390);
    await pause(2300);
    await setRange('aoa',19);
    await setRange('airspeed',150);
    mark('Illustrative separated flow at high incidence');
    await pause(2600);
    await setRange('aoa',6);
    await pause(1100);
    await scrollTo('.concept-grid',430);
    await pause(2500);
    await scrollTo('.velocity-lab',420);
    await pause(1700);
    await setRange('rotor-rpm',12000);
    await setRange('axial-speed',180);
    await setRange('swirl-change',75);
    mark('Change rotor-relative velocity triangle');
    await pause(2300);
    await scrollTo('.equation-strip',420);
    await pause(1700);

    await checkTopAndRecord('04 / Brayton cycle analysis','#cycle');
    await scrollTo('.cycle-card',410);
    await pause(2600);
    await scrollTo('.station-table',390);
    await pause(2100);
    await scrollTo('.cycle-explain-grid',420);
    await pause(2300);
    await scrollTo('.formula-panel',390);
    await pause(1600);

    await checkTopAndRecord('05 / Field guide','#learn');
    await scrollTo('.guide-layout',410);
    await pause(2100);
    await click('.quiz-choice:nth-child(2)');
    mark('Interactive knowledge check');
    await pause(1300);
    await click('#quiz-next');
    await pause(550);
    await click('.quiz-choice:nth-child(3)');
    await pause(1200);
    await click('#quiz-next');
    await pause(550);
    await click('.quiz-choice:nth-child(1)');
    await pause(1000);
    await scrollTo('.site-footer',410);
    mark('Sources and footer');
    await pause(2200);

    // Final uninterrupted coverage pass: overlapping viewport samples from
    // document top to the last pixel. This catches content skipped by anchor jumps.
    mark('Complete top-to-bottom coverage pass');
    await scrollTo(0,1800);
    await pause(1400);
    const length=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    const step=550; // 350px overlap in a 900px high viewport.
    for(let y=step;y<length;y+=step){
      await scrollTo(y,quick?950:600);
      await pause(460);
    }
    await scrollTo(length,530);
    mark('Entire document covered',{endY:Math.round(length)});
    await pause(1800);
  }

  const framesPath=resolve(outputDir,quick?'smoke-end.png':'complete-end.png');
  await page.screenshot({path:framesPath});
  await context.close();
  rawVideo=await page.video().path();
  await browser.close();
  mark('Browser recording saved',{file:rawVideo});
  const args=['-y','-hide_banner','-loglevel','error','-ss',String(Math.max(0,readySeconds-.1)),'-i',rawVideo,
    '-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p',
    '-movflags','+faststart',output];
  console.log('Encoding MP4...');
  const encoded=spawnSync('ffmpeg',args,{encoding:'utf8',timeout:240000});
  if(encoded.status!==0) throw Error('ffmpeg conversion failed: '+encoded.stderr);
  const fileStat=await stat(output);
  mark('MP4 ready',{file:output,sizeBytes:fileStat.size});
  result={output,fileSize:fileStat.size,seconds:Math.round((Date.now()-begin)/1000),
    url:captureUrl,quick,trimmedLoadingSeconds:readySeconds,events,consoleErrors,pageErrors};
  await writeFile(resolve(outputDir,quick?'smoke-report.json':'complete-recording-report.json'),JSON.stringify(result,null,2)+'\n');
  if(consoleErrors.length||pageErrors.length){
    console.error('Browser issues:',{consoleErrors,pageErrors});
    process.exitCode=1;
  }
  console.log(JSON.stringify({video:output,bytes:fileStat.size,events:events.length,consoleErrors:consoleErrors.length,pageErrors:pageErrors.length},null,2));
}catch(error){
  console.error('Recording failed:',error);
  try{await context.close();await browser.close();}catch{}
  process.exitCode=1;
}
