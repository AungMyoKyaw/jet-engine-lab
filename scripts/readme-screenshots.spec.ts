import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const ROOT = process.env.JETLAB_SCREENSHOT_BASE ?? 'https://aungmyokyaw.github.io/jet-engine-lab/';
const OUTPUT = 'docs/readme';
const engineUrl = (id: string) => ROOT + '?capture=readme-20261105-' + id + '#/engines/' + id;
const distinctiveCAD: Record<string, string> = {
  turbofan: 'fan-blisk',
  'afterburning-turbofan': 'afterburner-assembly',
  'centrifugal-turbojet': 'radial-impeller',
  'geared-turbofan': 'planetary-reducer',
};

test.setTimeout(90_000);
test.use({ colorScheme: 'dark', serviceWorkers: 'block' });
test.beforeEach(async ({ page }) => {
  // Screenshot sessions must not inherit project recovery from another engine.
  await page.addInitScript(() => localStorage.removeItem('jetlab-recovery-v1'));
});

async function openEngine(page: import('@playwright/test').Page, id: string) {
  await page.goto(engineUrl(id), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.visual-engine-scene canvas')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('heading', { name: 'An engine to explore.' })).toBeVisible();
  const cad = distinctiveCAD[id];
  if (cad) {
    await page.waitForFunction(file => performance.getEntriesByType('resource').some(
      entry => entry.name.endsWith('/assets/solidcraft/' + file + '.glb')
    ), cad, { timeout: 30_000 });
  }
  // A network response can finish before React reveals the complete CAD assembly.
  await expect(page.locator('.cad-assembly-loading')).toBeHidden({ timeout: 45_000 });
  await expect(page.locator('.cad-asset-error')).toHaveCount(0);
  await page.waitForTimeout(1200);
}

async function waitForGalleryImages(page: import('@playwright/test').Page) {
  // The production gallery lazy-loads cards below the fold. Screenshot capture
  // must fetch all five before rendering the entire collection for documentation.
  await page.locator('.visual-gallery-card img').evaluateAll(nodes => nodes.forEach(node => {
    (node as HTMLImageElement).loading = 'eager';
  }));
  await expect.poll(() => page.locator('.visual-gallery-card img').evaluateAll(
    nodes => nodes.every(node => (node as HTMLImageElement).complete &&
      (node as HTMLImageElement).naturalWidth > 0)
  ), { timeout: 30_000 }).toBe(true);
}

test('README desktop engine and gallery screenshots', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 1600, height: 900 });
  await openEngine(page, 'turbofan');
  await page.screenshot({ path: OUTPUT + '/turbofan-workspace.png', animations: 'disabled' });

  await page.getByRole('button', { name: /EXPLORE THE COLLECTION/ }).click();
  await expect(page.getByRole('dialog', { name: 'Explore five jet engines' })).toBeVisible();
  await expect(page.locator('.visual-gallery-card')).toHaveCount(5);
  await waitForGalleryImages(page);
  // Give the five cards enough vertical space so none is clipped.
  await page.setViewportSize({ width: 1600, height: 1050 });
  await page.screenshot({ path: OUTPUT + '/gallery-desktop.png', animations: 'disabled' });
});

test('README afterburner experiment screenshot', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 1600, height: 900 });
  await openEngine(page, 'afterburning-turbofan');
  await page.getByRole('button', { name: 'Experiment', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Experiment', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('03 / FIGHTER')).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Nozzle opening illustration' })).toBeVisible();
  await page.getByRole('slider', { name: 'Nozzle opening illustration' }).fill('80');
  if (await page.getByRole('button', { name: 'LIGHT AFTERBURNER' }).count()) {
    await page.getByRole('button', { name: 'LIGHT AFTERBURNER' }).click();
  }
  await expect(page.getByRole('button', { name: 'AFTERBURNER ON' })).toBeVisible();
  await page.waitForTimeout(800);
  await page.screenshot({ path: OUTPUT + '/afterburner-experiment.png', animations: 'disabled' });
});

test('README centrifugal impeller detail screenshot', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 1600, height: 900 });
  await openEngine(page, 'centrifugal-turbojet');
  await page.getByRole('button', { name: 'Understand', exact: true }).click();
  await page.locator('.visual-stages button').nth(1).click();
  await expect(page.getByRole('heading', { name: 'Impeller.' })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: OUTPUT + '/centrifugal-impeller.png', animations: 'disabled' });
});

test('README geared power path screenshot', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 1600, height: 900 });
  await openEngine(page, 'geared-turbofan');
  await page.getByRole('button', { name: 'Experiment', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Experiment', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'REVEAL GEAR POWER PATH' })).toBeVisible();
  await page.getByRole('button', { name: 'REVEAL GEAR POWER PATH' }).click();
  await page.waitForTimeout(1300);
  await page.screenshot({ path: OUTPUT + '/geared-power.png', animations: 'disabled' });

  console.log('READ_ME_SCREENSHOT', OUTPUT + '/geared-power.png');
});

test('README exploded CAD and cycle diagnostics screenshots', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 1600, height: 900 });
  await openEngine(page, 'turbofan');

  await page.getByRole('button', { name: 'Toggle exploded view' }).click();
  const separation = page.getByRole('slider', { name: 'Assembly separation' });
  await expect(separation).toBeVisible();
  await expect(separation).toHaveValue('100');
  await separation.focus();
  await separation.press('ArrowRight');
  await expect(separation).toHaveValue('105');
  await page.waitForTimeout(450);
  await page.screenshot({ path: OUTPUT + '/exploded-assembly.png', animations: 'disabled' });

  await page.getByRole('button', { name: 'Toggle exploded view' }).click();
  await page.getByRole('button', { name: 'Experiment', exact: true }).click();
  await expect(page.locator('.visual-diagnostics')).toBeVisible();
  await expect(page.getByText('Shaft-work gap')).toBeVisible();
  await page.screenshot({ path: OUTPUT + '/cycle-diagnostics.png', animations: 'disabled' });
});

test('README mobile screenshots — live production', async ({ page }) => {
  await mkdir(OUTPUT, { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await openEngine(page, 'geared-turbofan');
  await page.screenshot({ path: OUTPUT + '/engine-mobile.png', animations: 'disabled' });
  await page.getByRole('button', { name: /EXPLORE THE COLLECTION/ }).click();
  await expect(page.getByRole('dialog', { name: 'Explore five jet engines' })).toBeVisible();
  await expect(page.locator('.visual-gallery-card')).toHaveCount(5);
  await waitForGalleryImages(page);
  await page.screenshot({ path: OUTPUT + '/gallery-mobile.png', animations: 'disabled' });
  console.log('READ_ME_SCREENSHOT', OUTPUT + '/engine-mobile.png');
  console.log('READ_ME_SCREENSHOT', OUTPUT + '/gallery-mobile.png');
});
