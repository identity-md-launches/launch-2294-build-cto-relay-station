#!/usr/bin/env node
// Renders the PNG exports from brand/svg with the frontend's local Playwright Chromium
// (cd frontend && npm ci && npx playwright install chromium), then reduces the large flat-colour
// exports to an indexed palette with local ffmpeg when it is on PATH. No network, no paid service.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, renameSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const { chromium } = createRequire(resolve(root, "frontend/package.json"))("@playwright/test");
const svgDir = resolve(root, "brand/svg"), pngDir = resolve(root, "brand/png"), pub = resolve(root, "frontend/public");
mkdirSync(pngDir, { recursive: true });
// [source svg, output png, width, height, transparent background, palette-reduce]
const JOBS = [
  ["steps-favicon.svg", "favicon-16.png", 16, 16, true, false],
  ["steps-favicon.svg", "favicon-32.png", 32, 32, true, false],
  ["steps-favicon.svg", "apple-touch-icon.png", 180, 180, true, false],
  ["steps-avatar.svg", "steps-avatar-512.png", 512, 512, false, true],
  ["steps-lockup.svg", "steps-lockup-604.png", 604, 144, true, false],
  ["steps-social.svg", "og.png", 1200, 630, false, true],
];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [src, out, w, h, transparent, palette] of JOBS) {
    const body = readFileSync(resolve(svgDir, src), "utf8").replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`);
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${body}</body></html>`);
    const file = resolve(pngDir, out);
    await page.screenshot({ path: file, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
    if (palette) {
      try {
        const tmp = file + ".pal.png";
        execFileSync("ffmpeg", ["-v", "error", "-y", "-i", file, "-vf", "split[a][b];[a]palettegen=max_colors=64:reserve_transparent=0[p];[b][p]paletteuse=dither=none", "-compression_level", "9", tmp]);
        renameSync(tmp, file);
      } catch (error) { rmSync(file + ".pal.png", { force: true }); console.warn(`palette step skipped for ${out}: ${error.message}`); }
    }
  }
} finally { await browser.close(); }
for (const f of ["favicon-16.png", "favicon-32.png", "apple-touch-icon.png", "og.png"]) copyFileSync(resolve(pngDir, f), resolve(pub, f));
console.log(JOBS.map(j => j[1]).join("\n"));
