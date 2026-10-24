const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4200';
const ENV_FILE = '/home/ext_root/lab-data/zetaris-getting-started/.env.local';
const STORAGE_KEY = 'eurostat-crud.saved-series.v1';
const CONNECTION_KEY = 'eurostat-crud.zetaris-connection.v1';
const SCREENSHOT =
  '/home/ext_root/lab-data/zetaris-getting-started/scratch/e95db8a7dffeuYlna87fyPRaWJ/browser-zetaris-smoke.png';

function readEnv(name) {
  const text = fs.readFileSync(ENV_FILE, 'utf8');
  const match = new RegExp(`^${name}=(.*)$`, 'm').exec(text);
  if (!match) {
    throw new Error(`Missing ${name} in .env.local`);
  }
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

async function main() {
  const apiKey = readEnv('ZETARIS_API_KEY');
  const orgId = readEnv('ZETARIS_ORG_ID');
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
  page.setDefaultTimeout(30000);

  try {
    await page.goto(`${BASE_URL}/settings`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#zetaris-api-key');
    assert.match(await page.locator('.connection-banner').innerText(), /not configured/);
    await page.fill('#zetaris-base-path', '/zetaris-api');
    await page.fill('#zetaris-org-id', orgId);
    await page.fill('#zetaris-api-key', apiKey);
    await page.getByRole('button', { name: 'Test connection' }).click();
    await page.waitForSelector('.alert.success');
    assert.match(await page.locator('.alert.success').innerText(), /Connection works/);
    console.log('PASS Zetaris connection test');

    await page.getByRole('button', { name: 'Save connection' }).click();
    await page.waitForFunction(
      (key) => sessionStorage.getItem(key) !== null,
      CONNECTION_KEY,
    );
    assert.equal(await page.locator('.connection-banner').count(), 0);
    const sessionConnection = await page.evaluate(
      (key) => JSON.parse(sessionStorage.getItem(key)),
      CONNECTION_KEY,
    );
    assert.equal(sessionConnection.apiKey, apiKey);
    assert.equal(sessionConnection.orgId, orgId);
    console.log('PASS Zetaris connection saved');

    await page.goto(`${BASE_URL}/series/new`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#series-name');
    await page.fill('#series-name', 'Poland total via Zetaris');
    await page.fill('#series-note', 'Zetaris smoke test');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/series\/[0-9a-f-]+$/);
    await page.waitForSelector('app-rate-chart svg');

    assert.match(await page.locator('h1').innerText(), /Poland total via Zetaris/);
    assert.equal(await page.locator('tbody tr').count(), 24);
    assert.match(await page.locator('tbody tr').first().innerText(), /2026-08/);
    assert.match(await page.locator('tbody tr').first().innerText(), /3\.4/);
    const sourceLine = page.locator('.source-line').last();
    assert.match(await sourceLine.innerText(), /via Zetaris/);
    assert.match(await sourceLine.innerText(), /eurostat\.une_rt_m_pl_series_table/);
    console.log('PASS create and read from Zetaris');

    await page.getByRole('button', { name: 'Show all observations' }).click();
    await page.waitForFunction(() => document.querySelectorAll('tbody tr').length === 356);
    assert.equal(await page.locator('tbody tr').count(), 356);
    console.log('PASS full 356-row series');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('app-rate-chart svg');
    assert.match(await page.locator('h1').innerText(), /Poland total via Zetaris/);
    console.log('PASS reload persistence');

    await page.getByRole('link', { name: 'Edit', exact: true }).click();
    await page.waitForSelector('#series-name');
    assert.equal(await page.inputValue('#series-name'), 'Poland total via Zetaris');
    await page.fill('#series-name', 'Poland total updated via Zetaris');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/series\/[0-9a-f-]+$/);
    await page.waitForSelector('app-rate-chart svg');
    assert.match(await page.locator('h1').innerText(), /updated via Zetaris/);
    console.log('PASS update');

    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    assert.equal(stored.version, 1);
    assert.equal(stored.items.length, 1);
    assert.equal(JSON.stringify(stored).includes(apiKey), false);
    console.log('PASS API key not in localStorage');

    await page.screenshot({ path: SCREENSHOT, fullPage: true });
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Delete series' }).click();
    await page.waitForURL(/\/series$/);
    await page.waitForSelector('.empty-state');
    const afterDelete = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      STORAGE_KEY,
    );
    assert.equal(afterDelete.items.length, 0);
    console.log('PASS delete');

    if (errors.length > 0) {
      throw new Error(`Browser console/page errors:\n${errors.join('\n')}`);
    }

    console.log('PASS Zetaris browser smoke test');
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
