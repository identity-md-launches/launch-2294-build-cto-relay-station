#!/usr/bin/env node
// Writes every STEPS vector asset from the single geometry file the app also imports
// (frontend/src/brand/geometry.json) plus the committed text outlines. No dependencies, no fonts,
// no scripts, links, foreignObject or remote references in any output.
// Usage: node brand/tools/build-brand.mjs   (then node brand/tools/rasterize.mjs for PNGs)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const g = JSON.parse(readFileSync(resolve(root, "frontend/src/brand/geometry.json"), "utf8"));
const text = JSON.parse(readFileSync(resolve(root, "brand/source/text-outlines.json"), "utf8")).lines;
const C = g.colors, WHITE = "#FFFFFF";
const svgDir = resolve(root, "brand/svg"), pub = resolve(root, "frontend/public");
mkdirSync(svgDir, { recursive: true });

const svg = (w, h, title, body, viewBox = `0 0 ${w} ${h}`) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${viewBox}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const symbol = (earlier, latest) => `<path fill="${earlier}" d="${g.symbol.earlier.join("")}"/><path fill="${latest}" d="${g.symbol.latest}"/>`;
const word = fill => `<path fill="${fill}" fill-rule="evenodd" d="${g.wordmark.path}"/>`;
// Horizontal lockup: symbol at 1.5x so its S is 36 units against the 24-unit cap height.
const LOCKUP = { w: 151, h: 36 };
const lockup = (earlier, latest, ink) =>
  `<g transform="translate(-7.5 -6) scale(1.5)">${symbol(earlier, latest)}</g><g transform="translate(45 6)">${word(ink)}</g>`;

const files = {
  "steps-symbol.svg": svg(32, 32, "STEPS symbol", symbol(C.ink, C.action)),
  "steps-symbol-mono.svg": svg(32, 32, "STEPS symbol, one colour", symbol(C.ink, C.ink)),
  "steps-symbol-reversed.svg": svg(32, 32, "STEPS symbol, reversed", symbol(WHITE, C.action)),
  "steps-wordmark.svg": svg(106, 24, "STEPS", word(C.ink)),
  "steps-wordmark-reversed.svg": svg(106, 24, "STEPS", word(WHITE)),
  "steps-lockup.svg": svg(LOCKUP.w, LOCKUP.h, "STEPS", lockup(C.ink, C.action, C.ink)),
  "steps-lockup-mono.svg": svg(LOCKUP.w, LOCKUP.h, "STEPS", lockup(C.ink, C.ink, C.ink)),
  "steps-lockup-reversed.svg": svg(LOCKUP.w, LOCKUP.h, "STEPS", lockup(WHITE, C.action, WHITE)),
  "steps-favicon.svg": svg(16, 16, "STEPS", `<path fill="${C.paper}" d="${g.favicon.tile}"/><path fill="${C.ink}" d="${g.favicon.earlier.join("")}"/><path fill="${C.action}" d="${g.favicon.latest}"/>`),
  // Square avatar on the platform paper surface; the symbol stays inside the circular crop.
  "steps-avatar.svg": svg(512, 512, "STEPS", `<rect width="512" height="512" fill="${C.paper}"/><g transform="translate(48 48) scale(13)">${symbol(C.ink, C.action)}</g>`),
};
// Social preview 1200x630 on the paper surface. Every glyph is an outline; no font is referenced.
const t = (id, x, baseline, fill) => `<path fill="${fill}" transform="translate(${x} ${baseline})" d="${text[id].d}"/>`;
files["steps-social.svg"] = svg(1200, 630, "STEPS. Build on every step.", [
  `<rect width="1200" height="630" fill="${C.paper}"/>`,
  `<g transform="translate(80 72) scale(1.5555)">${lockup(C.ink, C.action, C.ink)}</g>`,
  t("slogan", 76, 300, C.ink),
  t("about", 80, 372, C.secondary),
  t("about2", 80, 420, C.secondary),
  `<path fill="${C.border}" d="M80 506H1120V507H80Z"/>`,
  t("expanded", 80, 560, C.ink),
  t("handle", 1120 - text.handle.width, 560, C.secondary),
  `<g transform="translate(856 116) scale(9)" opacity="1">${symbol(C.border, C.action)}</g>`,
].join(""));

for (const [name, body] of Object.entries(files)) {
  if (/<script|foreignObject|href=|url\(|@import|<text/i.test(body)) throw new Error(`${name}: active or external content`);
  writeFileSync(resolve(svgDir, name), body);
}
// Runtime copies served by the site (relative URLs from index.html).
writeFileSync(resolve(pub, "favicon.svg"), files["steps-favicon.svg"]);
writeFileSync(resolve(pub, "og.svg"), files["steps-social.svg"]);
console.log(Object.keys(files).join("\n"));
