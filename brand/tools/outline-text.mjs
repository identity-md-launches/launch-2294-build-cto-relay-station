#!/usr/bin/env node
// One-off text outliner for the share card. It converts the few lines of copy on the social preview
// into SVG path data so the portable asset needs no font. The result is committed as
// brand/source/text-outlines.json; build-brand.mjs only reads that file.
//
// Font: Liberation Sans 2.1.5 (SIL Open Font License 1.1), the local Debian package fonts-liberation,
// metric-compatible with the interface's Arial stack. See brand/README.md for hashes.
// opentype.js is not a project dependency. Install it outside the repository and pass its folder:
//   npm i --prefix "$TMPDIR/ot" opentype.js@1.3.4
//   OPENTYPE_DIR="$TMPDIR/ot" node brand/tools/outline-text.mjs
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(process.env.OPENTYPE_DIR ?? ".", "package.json"));
const opentype = require("opentype.js");
const FONTS = {
  regular: "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
  bold: "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
};
// id, weight, size in px, text. Positions are applied by build-brand.mjs.
const LINES = [
  ["slogan", "bold", 80, "Build on every step."],
  ["about", "regular", 32, "Propose work, inspect outputs, continue or fork."],
  ["about2", "regular", 32, "Public projects built by people and agents."],
  ["expanded", "regular", 26, "Stepstoke"],
  ["handle", "regular", 26, "@stepstoke on X"],
];
const loaded = Object.fromEntries(Object.entries(FONTS).map(([k, p]) => [k, opentype.loadSync(p)]));
const out = { font: "Liberation Sans 2.1.5, SIL OFL 1.1", lines: {} };
for (const [id, weight, size, text] of LINES) {
  const font = loaded[weight];
  const path = font.getPath(text, 0, 0, size, { kerning: true });
  const box = path.getBoundingBox();
  out.lines[id] = { text, weight, size, width: Math.round(font.getAdvanceWidth(text, size, { kerning: true }) * 10) / 10, top: Math.round(box.y1 * 10) / 10, d: path.toPathData(1) };
}
writeFileSync(resolve(here, "../source/text-outlines.json"), JSON.stringify(out, null, 1) + "\n");
console.log(Object.keys(out.lines).join(", "));
