// Worker-rendered supplemental checks. Run from repository root; no runtime source mutation.
import { chromium, webkit } from '../../../../frontend/node_modules/playwright/index.mjs';
import { expect } from '../../../../frontend/node_modules/@playwright/test/index.mjs';
import { startPreview } from '../../../../frontend/scripts/static-preview.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const out = new URL('../', import.meta.url);
const server = await startPreview(0), origin = `http://127.0.0.1:${server.address().port}`;
const report = { rows: [], pageErrors: [], consoleErrors: [], failedRequests: [] };
try {
 for (const [engine, runtime] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await runtime.launch({ executablePath: engine === 'webkit' ? process.env.W1_WEBKIT_EXECUTABLE : process.env.W1_CHROMIUM_EXECUTABLE });
  try { for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => report.pageErrors.push({ engine, width, message: e.message }));
    page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push({ engine, width, text: m.text() }); });
    page.on('response', r => { if (r.status() >= 400) report.failedRequests.push({ engine, width, status: r.status(), url: r.url() }); });
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.goto(origin + '/preview/');
    const primary = page.getByRole('link', { name: /Explore demo project/ }); await primary.waitFor();
    const entryBox = await primary.boundingBox(); assert.ok(entryBox.y + entryBox.height <= 844); assert.equal(await overflow(), 0);
    await page.screenshot({ path: new URL(`screenshots/${engine}-entry-${width}.jpg`, out).pathname, type: 'jpeg', quality: 40 });
    await page.getByRole('button', { name: 'Connect wallet', exact: true }).click();
    const wallet = page.getByRole('dialog', { name: 'Connect wallet' }); await wallet.waitFor();
    assert.equal(await overflow(), 0); await page.keyboard.press('Escape');
    await primary.click(); await page.getByRole('heading', { name: 'Relay introduction', exact: true }).waitFor();
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('platform.fixture.v1'));
      const last = state.checkpoints.find(c => c.id === 'fx-branch-1:3');
      for (let n = 4; n <= 12; n++) state.checkpoints.push({ ...structuredClone(last), id: `fx-branch-1:${n}`, revision: n });
      state.branches.find(b => b.id === 'fx-branch-1').latestCheckpoint = 'fx-branch-1:12';
      localStorage.setItem('platform.fixture.v1', JSON.stringify(state));
    });
    await page.reload(); await page.getByRole('heading', { name: 'Round 12 output', exact: true }).waitFor();
    assert.equal(await page.locator('.round-item').count(), 13); assert.equal(await overflow(), 0);
    const historical = page.getByRole('button', { name: /^Select Round 4(?:,|$)/ }); await historical.click();
    assert.equal(await historical.getAttribute('aria-current'), 'step'); await page.getByRole('heading', { name: 'Round 4 output', exact: true }).waitFor();
    await page.locator('.sequence').screenshot({ path: new URL(`screenshots/${engine}-long-rail-${width}.jpg`, out).pathname, type: 'jpeg', quality: 40 });
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    const form = page.getByRole('dialog', { name: 'Prepare a contribution' }); await form.waitFor(); assert.equal(await overflow(), 0);
    const field = form.getByLabel('New asset name', { exact: true }); await field.focus();
    assert.equal(await field.evaluate(el => getComputedStyle(el).fontSize), '16px'); await page.keyboard.press('Escape');
    // Restore the deterministic state before reviewing funding; no signatures or purchases.
    await page.evaluate(() => localStorage.removeItem('platform.fixture.v1')); await page.reload();
    await page.getByRole('heading', { name: 'Round 3 output', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Review funding', exact: true }).first().click();
    const funding = page.getByRole('dialog', { name: 'Fund a contribution' }); await funding.waitFor();
    await expect(funding.getByRole('button', { name: '1. Approve exact amount' })).toBeEnabled();
    assert.equal(await overflow(), 0); assert.equal(await funding.getByRole('button', { name: '2. Purchase execution' }).isDisabled(), true);
    await page.screenshot({ path: new URL(`screenshots/${engine}-funding-quoted-${width}.jpg`, out).pathname, type: 'jpeg', quality: 40 });
    report.rows.push({ engine, width, entryAction: entryBox, longRail: '13 checkpoints; historical selection retained', wallet: 'open/Escape', preparation: '16px focused input/Escape', funding: 'purchase disabled until explicit approval', overflow: 0 });
    await page.close();
  }} finally { await browser.close(); }
 }
 assert.deepEqual(report.pageErrors, []); assert.deepEqual(report.consoleErrors, []); assert.deepEqual(report.failedRequests, []);
 report.status = 'PASS';
} catch(e) { report.status = 'FAIL'; report.error = e.stack; process.exitCode = 1; }
finally { await writeFile(new URL('extended-layout.json', out), JSON.stringify(report, null, 2) + '\n'); await new Promise(r => server.close(r)); }
console.log(JSON.stringify(report));
