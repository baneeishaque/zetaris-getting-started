const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4200';

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
  page.setDefaultTimeout(45000);

  try {
    await page.goto(`${BASE_URL}/series/new`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#series-name');
    await page.fill('#series-name', 'Live PL total');
    await page.selectOption('#series-geo', 'PL');
    await page.selectOption('#series-sex', 'T');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/series\/[0-9a-f-]+$/);

    try {
      await page.waitForSelector('app-rate-chart svg');
    } catch {
      const alert = await page.locator('.alert.error').innerText().catch(() => '(no error alert)');
      throw new Error(`Live Eurostat chart did not render. Alert: ${alert}`);
    }

    const firstRow = await page.locator('tbody tr').first().innerText();
    assert.match(firstRow, /2026-08/);
    assert.match(firstRow, /3\.4/);
    console.log(`PASS live Eurostat fetch: ${firstRow.replace(/\s+/g, ' ')}`);

    if (errors.length > 0) {
      throw new Error(`Browser console/page errors:\n${errors.join('\n')}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
