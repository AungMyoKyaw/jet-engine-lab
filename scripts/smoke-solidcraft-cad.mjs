import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = 'http://127.0.0.1:4173/';
const cases = [
  { engine: 'turbofan', stage: 1, assets: ['compressor-cassette','stator-vane-ring','compressor-case-detail'], label: 'compressor' },
  { engine: 'turbofan', stage: 2, assets: ['combustor-liner','combustor-dome','combustor-manifold'], label: 'combustor' },
  { engine: 'geared-turbofan', stage: 1, assets: ['planetary-reducer'], label: 'gearbox' },
  { engine: 'geared-turbofan', stage: 0, assets: ['fan-blisk','fan-outlet-guides'], label: 'fan' },
  { engine: 'turbojet', stage: 3, assets: ['turbine-wheel','turbine-nozzle-guide','turbine-shroud','bearing-cartridge'], label: 'turbine' },
  { engine: 'turbojet', stage: 4, assets: ['nozzle-housing','nozzle-petals','nozzle-actuators'], label: 'nozzle' },
];
mkdirSync('docs/solidcraft-cad', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
const failures = [];
try {
  for (const entry of cases) {
    const page = await browser.newPage({viewport: { width: 1500, height: 900 }});
    const assetResponses = [];
    page.on('pageerror', e => failures.push(entry.label + ': ' + e.message));
    page.on('response', r => {
      if (r.url().includes('/assets/solidcraft/')) assetResponses.push({status: r.status(), url: r.url()});
    });
    await page.goto(base + '#/engines/' + entry.engine, { waitUntil: 'domcontentloaded' });
    await page.locator('.visual-engine-scene canvas').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('.visual-stages button').nth(entry.stage).click();
    const stageLabel = await page.locator('.visual-stages button').nth(entry.stage).innerText();
    if (entry.label === 'nozzle' && !/exhaust/i.test(stageLabel)) failures.push('nozzle: incorrect focused stage ' + stageLabel);
    await page.locator('.visual-cad-mark').waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1800);
    for(const asset of entry.assets){
      const hits = assetResponses.filter(x => x.url.endsWith('/' + asset + '.glb') && x.status === 200);
      if (!hits.length) failures.push(entry.label + ': CAD asset ' + asset + ' did not load');
    }
    const visible = await page.locator('.visual-cad-mark').innerText();
    if (!visible.includes('CAD DETAIL')) failures.push(entry.label + ': no CAD detail UI');
    await page.screenshot({ path: 'docs/solidcraft-cad/' + entry.label + '.png', fullPage: true });
    await page.getByRole('button', {name: 'Show full engine'}).click();
    if ((await page.locator('.visual-cad-mark').textContent())?.trim() !== 'CAD ASSEMBLY') failures.push(entry.label + ': focus did not close');
    await page.close();
  }
  const mobile = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.on('pageerror',e=>failures.push('mobile: '+e.message));
  await mobile.goto(base+'#/engines/geared-turbofan',{waitUntil:'domcontentloaded'});
  await mobile.locator('.visual-engine-scene canvas').waitFor({state:'visible',timeout:20000});
  await mobile.locator('.visual-stages button').nth(1).click();
  await mobile.getByRole('button',{name:'Show full engine'}).waitFor({state:'visible',timeout:15000});
  await mobile.waitForTimeout(1400);
  const dimensions=await mobile.evaluate(()=>({width:window.innerWidth,scroll:document.documentElement.scrollWidth}));
  if(dimensions.scroll>dimensions.width+1)failures.push('mobile horizontal overflow '+JSON.stringify(dimensions));
  await mobile.screenshot({path:'docs/solidcraft-cad/mobile.png',fullPage:true});
  await mobile.getByRole('button',{name:'Show full engine'}).click();
  if((await mobile.locator('.visual-cad-mark').textContent())?.trim()!=='CAD ASSEMBLY')failures.push('mobile return navigation failed');
  await mobile.close();
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('SolidCraft CAD: new CAD families loaded, 6 desktop focus views, mobile focus and return navigation verified.');
}
