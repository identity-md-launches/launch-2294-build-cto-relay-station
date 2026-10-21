# STEPS frontend

STEPS by Stepstoke uses the English Open Workshop interface and the delivered A1 browser SDK. See the root [README](../README.md) for installation, preview, rebuild and local-contract commands; [DESIGN.md](../DESIGN.md) for the eight component families; [brand guide](../brand/README.md) for portable assets.

```sh
npm ci --prefix frontend
npm run typecheck --prefix frontend
npm run test:unit --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

Run from the repository root. The build emits `dist/` with relative assets and hash routes. `node frontend/scripts/static-preview.mjs` serves `/preview/` as a gateway subpath. The committed export needs only a static server.

All `tests/e2e/*.spec.ts` assertions run in the configured Chromium desktop/mobile/320 and WebKit desktop/mobile matrix. `tests/integration/browser-chain.mjs --browser chromium|webkit [--mobile] --out docs/validation/steps-brand-v1/local/<engine>` runs the complete two-account actual local-contract journeys. Run local suites sequentially because they use fixed loopback ports. `tests/integration/platform-chain.mjs [--webkit]` checks supplemental production component flows. Install locked Playwright Chromium and WebKit externally; optional `W1_CHROMIUM_EXECUTABLE`, `W1_WEBKIT_EXECUTABLE`, `PLAYWRIGHT_BROWSERS_PATH` select test runtimes. The Ubuntu helper `scripts/prepare-webkit.sh /tmp/steps-webkit` extracts missing system libraries outside the repository without system installation.

For current raw results and exact bytes, see [STEPS acceptance](../docs/validation/steps-brand-v1/README.md). Earlier W1/PLATFORM-UX-V1 results are [historical](../docs/validation/historical/README.md), not final acceptance. System Arial/Helvetica and Courier New are the disclosed local fallbacks; no runtime fonts or CDN are requested.

Public operations remain disabled: `productionDeployment:null`, `liveCompatibility:NOT_RUN`, `productionReady:false`. Demo signatures are simulated; actual local tests use disposable Anvil, MockToken and MockIntake. No funded public wallet or key is required.
