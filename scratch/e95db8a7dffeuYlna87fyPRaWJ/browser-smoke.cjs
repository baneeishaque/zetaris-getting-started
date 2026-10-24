const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4200';
const STORAGE_KEY = 'eurostat-crud.saved-series.v1';
const SCREENSHOT = '/home/ext_root/lab-data/zetaris-getting-started/scratch/e95db8a7dffeuYlna87fyPRaWJ/browser-smoke.png';

function dimension(index) {
  return {
    label: 'Dimension',
    category: {
      index,
      label: Object.fromEntries(Object.keys(index).map((key) => [key, key])),
    },
  };
}

const fixture = {
  version: '2.0',
  class: 'dataset',
  label: 'Unemployment by sex and age - monthly data',
  source: 'ESTAT',
  updated: '2026-10-21T11:00:00+0200',
  value: { 0: 4.2, 1: 4.0, 2: 3.9 },
  id: ['freq', 's_adj', 'age', 'unit', 'sex', 'geo', 'time'],
  size: [1, 1, 1, 1, 1, 1, 3],
  dimension: {
    freq: dimension({ M: 0 }),
    s_adj: dimension({ SA: 0 }),
    age: dimension({ TOTAL: 0 }),
    unit: dimension({ PC_ACT: 0 }),
    sex: dimension({ T: 0 }),
    geo: dimension({ PL: 0 }),
    time: dimension({ '2024-01': 0, '2024-02': 1, '2024-03': 2 }),
  },
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.setDefaultTimeout(15000);

  await page.route(/\/une_rt_m\?/, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixture),
    }),
  );

  try {
    await page.goto(`${BASE_URL}/series`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.empty-state');
    assert.match(await page.locator('.empty-state').innerText(), /No saved series yet/);
    console.log('PASS empty state');

    await page.locator('.page-actions a', { hasText: 'New series' }).click();
    await page.waitForSelector('#series-name');
    await page.fill('#series-name', 'Poland total');
    await page.selectOption('#series-geo', 'PL');
    await page.selectOption('#series-sex', 'T');
    await page.fill('#series-note', 'Smoke test note');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/series\/[0-9a-f-]+$/);
    await page.waitForSelector('app-rate-chart svg');

    assert.match(await page.locator('h1').innerText(), /Poland total/);
    assert.equal(await page.locator('tbody tr').count(), 3);
    assert.match(await page.locator('tbody tr').first().innerText(), /2024-03/);
    assert.match(await page.locator('tbody tr').first().innerText(), /3\.9/);
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    assert.equal(stored.version, 1);
    assert.equal(stored.items.length, 1);
    console.log('PASS create and read');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('app-rate-chart svg');
    assert.match(await page.locator('h1').innerText(), /Poland total/);
    console.log('PASS reload persistence');

    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await page.waitForSelector('#series-name');
    assert.equal(await page.inputValue('#series-name'), 'Poland total');
    await page.fill('#series-name', 'Poland total updated');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/series\/[0-9a-f-]+$/);
    await page.waitForSelector('app-rate-chart svg');
    assert.match(await page.locator('h1').innerText(), /Poland total updated/);
    console.log('PASS update');

    await page.screenshot({ path: SCREENSHOT, fullPage: true });
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Delete series' }).click();
    await page.waitForURL(/\/series$/);
    await page.waitForSelector('.empty-state');
    assert.match(await page.locator('.empty-state').innerText(), /No saved series yet/);
    const afterDelete = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    assert.equal(afterDelete.items.length, 0);
    console.log('PASS delete');

    if (errors.length > 0) {
      throw new Error(`Browser console/page errors:\n${errors.join('\n')}`);
    }

    console.log('PASS browser CRUD smoke test');
  } catch (error) {
    await page.screenshot({ path: SCREENSHOT, fullPage: true }).catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
