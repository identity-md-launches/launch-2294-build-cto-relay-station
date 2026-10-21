// Offline portability checks and a rendered small/mono/reversed specimen of the delivered assets.
import { chromium, webkit } from '@playwright/test';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '../..');
const out = resolve(root, 'docs/validation/steps-brand-v1');
await mkdir(resolve(out, 'screenshots'), { recursive: true });
const report = { status: 'PASS', assets: [], browserErrors: [], consoleErrors: [], externalRequests: [], engines: [] };
const variants = ['steps-lockup.svg', 'steps-lockup-mono.svg', 'steps-lockup-reversed.svg'];
for (const name of await readdir(resolve(root, 'brand/svg'))) {
  const source = await readFile(resolve(root, 'brand/svg', name), 'utf8');
  assert.doesNotMatch(source, /<script|foreignObject|href\s*=|url\(|@import|<text|<image|<style/i, name);
  assert.match(source, /<title>[^<]+<\/title>/, name);
  if (/lockup|wordmark|symbol/.test(name)) assert.doesNotMatch(source, /<rect/, name);
  report.assets.push({ path: 'brand/svg/' + name, bytes: Buffer.byteLength(source), sha256: createHash('sha256').update(source).digest('hex'), portable: true });
}
for (const [name, w, h] of [['favicon-16.png', 16, 16], ['favicon-32.png', 32, 32], ['apple-touch-icon.png', 180, 180], ['steps-avatar-512.png', 512, 512], ['steps-lockup-604.png', 604, 144], ['og.png', 1200, 630]]) {
  const b = await readFile(resolve(root, 'brand/png', name));
  assert.equal(b.subarray(1, 4).toString(), 'PNG'); assert.equal(b.readUInt32BE(16), w); assert.equal(b.readUInt32BE(20), h);
  report.assets.push({ path: 'brand/png/' + name, width: w, height: h, bytes: b.length, sha256: createHash('sha256').update(b).digest('hex') });
}
const symbols = await readFile(resolve(root, 'brand/svg/steps-symbol.svg'), 'utf8');
const favicon = await readFile(resolve(root, 'brand/svg/steps-favicon.svg'), 'utf8');
for (const [engine, runtime] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await runtime.launch({ executablePath: engine === 'webkit' ? process.env.W1_WEBKIT_EXECUTABLE : process.env.W1_CHROMIUM_EXECUTABLE });
  try {
    const page = await browser.newPage({ viewport: { width: 720, height: 540 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => report.browserErrors.push({ engine, message: e.message }));
    page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push({ engine, message: m.text() }); });
    await page.route(/^https?:/, route => { report.externalRequests.push(route.request().url()); return route.abort(); });
    const marks = await Promise.all(variants.map(async (v, i) => `<section style="padding:24px;background:${i === 2 ? '#22231F' : '#F6F5F1'};color:${i === 2 ? '#FFFFFF' : '#22231F'}"><p style="margin:0 0 12px">${v}</p>${await readFile(resolve(root, 'brand/svg', v), 'utf8')}</section>`));
    await page.setContent(`<body style="margin:0;font:16px Arial;background:#F6F5F1;color:#22231F"><div style="display:grid;grid-template-columns:1fr 1fr">${marks.join('')}<section style="padding:24px"><p>Small symbol: 16 / 24 / 32</p>${[16, 24, 32].map(n => symbols.replace('width="32" height="32"', `width="${n}" height="${n}"`)).join(' ')}<p>Optical favicon: 16 / 32</p>${favicon} ${favicon.replace('width="16" height="16"', 'width="32" height="32"')}</section></div></body>`);
    assert.equal(await page.locator('svg').count(), 8);
    for (const svg of await page.locator('svg').all()) {
      assert.equal(await svg.evaluate(el => el.getBoundingClientRect().width > 0), true);
    }
    await page.screenshot({ path: resolve(out, 'screenshots', `brand-specimen-${engine}.jpg`), type: 'jpeg', quality: 65 });
    report.engines.push({ engine, status: 'PASS', renderedVariants: variants, smallSymbolSizes: [16, 24, 32], faviconSizes: [16, 32] });
  } finally { await browser.close(); }
}
assert.deepEqual(report.browserErrors, []); assert.deepEqual(report.consoleErrors, []); assert.deepEqual(report.externalRequests, []);
await writeFile(resolve(out, 'brand-check.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, assets: report.assets.length, engines: report.engines, pageErrors: report.browserErrors.length, consoleErrors: report.consoleErrors.length }));
