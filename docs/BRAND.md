# STEPS brand guide

This page records the brand as it is integrated in this tree. The source guide and the rebuild tools live in [`brand/README.md`](../brand/README.md), and the shared geometry is in [`frontend/src/brand/geometry.json`](../frontend/src/brand/geometry.json). The two guides agree. If they ever differ, the committed geometry and SVG bytes are authoritative.

| Item | Value |
| --- | --- |
| Display name / wordmark | **STEPS** |
| Expanded brand | **Stepstoke** (used in the footer "STEPS by Stepstoke", the share card and the meta description) |
| Slogan | **Build on every step.** (five words, the only slogan) |
| Official X | [https://x.com/stepstoke](https://x.com/stepstoke), handle **@stepstoke**. It is display-only: the site and this delivery never post to it or modify it |
| Description (`SITE_DESCRIPTION`) | "Build public projects through successive contributions: propose work, fund execution, inspect outputs, and continue or fork accepted results." |

## What STEPS says

STEPS lets people and agents build public projects through successive contributions. Each accepted output becomes a step that anyone can inspect, continue or fork.

The slogan says one thing: work is built on accepted earlier work. The brand promises no returns, no outcome, no quality, and nothing about being "fully onchain". Use the slogan at entry points (the `#/` heading, the page title, the share card). It does not go in the project workspace, and it should not be repeated beside the wordmark everywhere.

## Chosen direction: Joined Steps

Three offset treads join into a compact, stepped **S**:

- the two **ink** treads stand for earlier accepted contributions;
- the **vermillion** tread is the next step.

The shapes have rounded outer turns and square inner joints, matching the warm-paper, precise Open Workshop interface. The custom five-letter wordmark uses the same 5-unit stems and rounded S terminals. It is drawn as paths, not set in a font. The direction is original geometry and avoids growth charts, coins/tokens and robots.

Two alternatives were considered and rejected. They are recorded for context only; neither is a pending choice:

1. **Open seam:** offset page corners showing an unfinished joint. It read clearly as continuation but looked too much like a file icon.
2. **Shared margin:** interlocking marginal marks. It said "collaboration" but lost legibility at 16 px.

## Symbol, wordmark and lockup

| Element | Geometry | Use |
| --- | --- | --- |
| Symbol | 32×32 grid, 6-unit treads, 6-unit-radius outer corners | App avatar, footer mark (20 px), standalone placements ≥ 20 px |
| Small symbol / favicon | Redrawn on a 16×16 grid: 3-unit treads, 1-unit joints, paper tile | 16 px and 32 px favicons, any placement under 20 px |
| Wordmark | 106×24, 24-unit cap height, 5-unit stems | Only next to the symbol, or where the symbol is already shown nearby |
| Horizontal lockup | 151×36. Symbol at 1.5× (0–33), wordmark starting at x = 45, vertically centred | Site header, documents, partner placements |

**Clear space.** Keep at least 6 lockup units clear on every side, which is one-sixth of the lockup height. For the standalone symbol, keep one tread width (6 of 32 units). The lockup SVG's viewBox is tight to the artwork, so add this space outside it.

**Minimum sizes.**

- Lockup: 24 px high (101 px wide) on screen. This is the header size at 320 px viewports; above 360 px the header uses 28 px (about 117 px wide). Standalone lockups should be at least 100 px wide.
- Symbol: 20 px.
- Below 20 px, use the dedicated favicon drawing, not a scaled-down symbol.

**Do not:**

- stretch, rotate, recolour per tread, or add outlines, gradients or shadows;
- put the slogan inside the lockup;
- place the mark over project artwork;
- set "STEPS" in a typeface as a substitute for the outlined wordmark in portable assets.

In the UI, keep the semantic text name: the header link is announced as "STEPS home", and the decorative SVGs are `aria-hidden`.

## Colour and variants

The palette is the Open Workshop palette:

| Role | Colour |
| --- | --- |
| Ink | `#22231F` |
| Vermillion action | `#C1452A` |
| Paper | `#F6F5F1` |
| White | `#FFFFFF` |
| Secondary (share card only) | `#666961` |
| Border (share card only) | `#DDDCD4` |

| Variant | Colours | Background |
| --- | --- | --- |
| Primary | Ink plus vermillion next tread | Transparent. Use on paper or white |
| One-colour (mono) | Ink only | Transparent. For print, stamps and single-colour reproduction |
| Reversed | White plus vermillion next tread | Transparent. Use only on solid ink in external placements. The site has no dark theme and this delivery adds none |

## Asset inventory

Every SVG is self-contained: explicit width, height and viewBox, a `<title>`, and paths only. Each one was checked for the absence of `<script>`, `foreignObject`, links/`href`, `<text>`, external fonts and remote URLs (the only URL is the SVG namespace). PNGs were rasterised locally from these SVGs. The file sizes and SHA-256 values in [`assets-sha256.json`](validation/steps-brand-v1/assets-sha256.json) are part of the tested-tree seal.

| Path | Pixels / viewBox | Bytes | Background | Purpose |
| --- | --- | ---: | --- | --- |
| `brand/svg/steps-lockup.svg` | 151×36 | 722 | transparent | Primary lockup |
| `brand/svg/steps-lockup-mono.svg` | 151×36 | 722 | transparent | One-colour lockup |
| `brand/svg/steps-lockup-reversed.svg` | 151×36 | 722 | transparent | Reversed lockup |
| `brand/svg/steps-symbol.svg` | 32×32 | 293 | transparent | Primary symbol |
| `brand/svg/steps-symbol-mono.svg` | 32×32 | 317 | transparent | One-colour symbol |
| `brand/svg/steps-symbol-reversed.svg` | 32×32 | 313 | transparent | Reversed symbol |
| `brand/svg/steps-wordmark.svg` | 106×24 | 499 | transparent | Outlined wordmark |
| `brand/svg/steps-wordmark-reversed.svg` | 106×24 | 499 | transparent | Reversed wordmark |
| `brand/svg/steps-favicon.svg` (= `frontend/public/favicon.svg`) | 16×16 | 374 | paper tile | Small-size symbol / favicon |
| `brand/svg/steps-avatar.svg` | 512×512 | 376 | paper | Editable square avatar |
| `brand/svg/steps-social.svg` (= `frontend/public/og.svg`) | 1200×630 | 48,154 | paper | Editable share-card source, text outlined |
| `brand/png/steps-avatar-512.png` | 512×512 | 2,497 | paper | Square avatar raster |
| `brand/png/favicon-16.png`, `favicon-32.png` | 16×16, 32×32 | 293, 495 | paper tile, transparent corners | PNG favicons |
| `brand/png/apple-touch-icon.png` | 180×180 | 2,842 | paper tile, transparent corners | Touch icon |
| `brand/png/og.png` (= `frontend/public/og.png`) | 1200×630 | 18,537 | paper | Social preview raster |
| `brand/png/steps-lockup-604.png` | 604×144 | 2,752 | transparent | Raster lockup for raster-only tools |

Runtime copies in `frontend/public/` (`favicon.svg`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `og.svg`, `og.png`) are byte-identical to the brand files above. Vite copies them into `dist/`.

`frontend/index.html` wires the following:

- the title "STEPS · Build on every step";
- the description;
- `application-name` and `og:site_name` set to STEPS;
- OG and Twitter title, description, image and image alt;
- `twitter:card=summary_large_image` and `twitter:site=@stepstoke`;
- the SVG and PNG favicons and the touch icon.

Image URLs are **relative** (`./og.png`). No production domain or canonical URL has been invented. Platforms that need absolute image URLs will not show the card until a host is known; this is open issue 3 in the [README](../README.md#open-issues).

## Licences

- **STEPS marks and artwork** (`brand/svg`, `brand/png`, `geometry.json`) are original work in this repository. They ship under the repository's [MIT LICENSE](../LICENSE), whose copyright line still names "CTO Relay Station contributors". No trademark clearance, registration or separate brand-use policy exists. The requester should decide one before public launch.
- **Wordmark letters** are custom paths, so no font licence applies to them.
- **Share-card copy** (slogan, two supporting lines, "Stepstoke", "@stepstoke on X") is outlined from locally installed **Liberation Sans 2.1.5** Regular and Bold, licensed under the **SIL Open Font License 1.1**. The licence text is in [`brand/licenses/Liberation-Fonts-OFL.txt`](../brand/licenses/Liberation-Fonts-OFL.txt), and the SHA-256 of each font file used is in [`brand/source/font-provenance.json`](../brand/source/font-provenance.json). No font file is shipped and no font is fetched at runtime.
- **Interface text** uses the system stack (Arial / Helvetica / sans-serif; Courier New / monospace for identifiers). There is no web font and no CDN.

## Rebuild the assets

```sh
node brand/tools/build-brand.mjs            # SVGs from geometry, no dependencies
npm ci --prefix frontend && npm run test:e2e:install --prefix frontend
node brand/tools/rasterize.mjs              # PNGs via local Playwright Chromium
```

`brand/tools/outline-text.mjs` is needed only if the share-card copy changes. It takes `opentype.js@1.3.4` from `OPENTYPE_DIR`, installed outside the repository. Any asset change alters the runtime and asset hashes. After one:

1. rebuild the site;
2. rerun the affected browser and brand checks;
3. run `python3 frontend/scripts/seal-steps.py capture` only after those reruns pass.

## Where the brand appears in the product

| Surface | Implementation |
| --- | --- |
| Header | `BrandLockup` in a link named "STEPS home" (`frontend/src/App.tsx`) |
| Entry page `#/` | Heading "Build on every step." with a one-sentence explanation. The demo/local entry follows directly |
| Footer | Symbol, "STEPS by Stepstoke", "Platform components", "@stepstoke on X" (new tab, `noopener noreferrer`, labelled as opening a new tab) |
| Showcase `#/showcase` | "Brand marks" disclosure with the lockup and the 32 px and 16 px symbols |
| Config | `SITE_NAME`, `SITE_EXPANDED_NAME`, `SITE_X_URL`, `SITE_SLOGAN`, `SITE_DESCRIPTION` in `frontend/src/config.ts`. The Coinbase wallet `appName` is `SITE_NAME` |
| Not rebranded | Protocol, package, CLI and policy identifiers; authenticated outputs; fixture artwork; historical records (see the [README](../README.md#names-that-intentionally-still-say-cto-relay)) |
