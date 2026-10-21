# STEPS brand v1: final acceptance

Fresh worker evidence for the final STEPS runtime/export. Historical acceptance is not final acceptance. `productionDeployment:null`, `liveCompatibility:NOT_RUN`, `productionReady:false`. No public deployment/hosting, live IMD purchase, funded credentials, extra order or X publishing occurred.

The requested predecessor is `d29eedf8e7d6608ed109972c179b367ac07ce91f`; accepted starting checkout `acbc8bec5765d7434c6ee831a2c51d03fc6003b5` already includes the Joined Steps identity. This delivery finishes its guide and acceptance, adds recovery regressions and corrects fractional WebKit rail clipping. Protected core/config/ABI/SDK/CLI/tests/build/dependency bytes match the pinned predecessor. Protocol/package identifiers and authenticated outputs remain unchanged.

## Results and exact evidence

[check-results.json](check-results.json) is the final status record. [evidence-sha256.json](evidence-sha256.json) indexes exact raw logs, receipts, screenshots and probe sources. Earlier failures from this run remain under `attempts/`.

| Check | Scope | Raw evidence |
| --- | --- | --- |
| Build/typecheck | Final branded production build; later rebuild has identical export bytes | `build.log`, `typecheck.log`, `rebuild.log`, `rebuild-receipt.json` |
| Frontend units | 47 passed, 5 files, no skips | `unit.log` |
| Configured browser matrix | All 37 cases in five projects; final counts in check-results | `e2e.log`, `e2e.json`, `browser/`, `platform-browser-extra/` |
| Actual local contracts | 16/16 scenarios in Chromium/WebKit desktop/mobile, 64 total | `local-summary.json`, `local-*.log`, `local/<project>/browser-chain.json` |
| Supplemental actual runner | 8/8 scenarios in Chromium and WebKit; page/console/request errors zero | `platform-*.log`, `platform-receipts/<engine>/browser-chain.json` |
| Separate runtime diagnostics | All four local journeys have zero page and unexpected console errors | `local-summary.json`, per-test `browser/` audits |
| Calldata/receipts | Per local run: 85 successful browser receipts, two dropped originals retained, fresh SDK re-encoding | `audit-*.log`, `local/<project>/trace-audit.json` |
| Core | 94 pinned files unchanged; Solidity 125/125; SDK 39/39; formatting, fixtures and release ABI/code hashes | `protected-core-sha256.json`, `forge-*.log`, `sdk-tests.log`, `fixture-integrity.log`, `release-check.log` |
| Design | Six Better Interface domains; taste 16/16 | `design-review.md`, `taste.json`, `taste.log`, `contrast.json` |
| Responsive/focus | Four routes at 320/390/768/1440; supplemental long rail/wallet/funding at 320/390/1440 in both engines | `rendered-review-*.json`, `extended-layout.json`, `screenshots/` |
| Brand | 11 portable SVGs, six PNGs; small/mono/reversed renders in both engines | `brand-check.json`, `assets-sha256.json` |
| Historical recovery | 1,309 files, 12,523,951 bytes recovered with original-path/SHA checks | `historical-recovery.log`, `../historical/original-path-sha256.json` |
| Complete source size | Final snapshot below 8 MiB; early measurement exceeded limit | `size-early.json`, `size-after-recovery.json`, `size-final.json` |

The final browser run uses one worker, the configured engine/device matrix and unchanged 45-second per-test timeouts. Three existing skips are the desktop-only long-rail case at non-desktop viewports; supplemental probes separately cover long rails at 320/390. No existing assertion or scenario was removed, weakened or additionally skipped. The keyboard test now waits for its React entry link before pressing Tab. No console/security filter was widened.

## Requirement coverage

| Requirement | Implementation/check |
| --- | --- |
| Finished original identity | Joined Steps stepped S and custom outlined STEPS; five-word “Build on every step.”; two alternatives/rationale in `brand/README.md` |
| Portable assets | Primary/mono/reversed transparent vectors, small symbol, avatar512, favicon16/32, touch180, social1200×630 PNG plus editable SVG; dimensions and forbidden SVG content checked |
| Product integration | STEPS header/home accessible name, SITE_NAME/DESCRIPTION, Coinbase appName, Stepstoke footer, entry/empty copy, title/icons/OG/Twitter and confirmed X href |
| Static/gateway export | Relative asset URLs, hash routes, actual export tested under `/preview/` and `/gateway/`; no invented canonical domain/CDN |
| Open Workshop | Eight production component families retained; root DESIGN.md covers tokens, local type, layout and states; no dark application theme |
| Six functions | Actual two-account create/propose/explicit fund/read/continue/historical fork, HTML→PNG→HTML, Markdown and historical-child open+continue |
| History/provenance/files | Selected-vs-latest, retained witnesses, exact downloads, safe basenames, sandboxed HTML, sanitized Markdown and hostile/broken/unavailable/oversized files checked |
| Retry/journal regression | Rendered tests and actual reverted/replaced rows after authenticated refusal; unknown blocks; same-nonce/different-hash journal history survives; no purchase before separate approval and explicit consent |
| Failure/approval rules | Missing callback remains pending, status2/unknown failure freezes, price/maxFee/exact allowance and binding-without-repurchase checks retained |
| Responsive/keyboard | Main action on first 390px screen, 320/390/1440 reflow, long rail, wallet/funding, focus trapping/restoration, input16px and reduced motion |
| Exact bytes and budget | Separate runtime/test/assets/export manifests, final rebuild receipt and doc hashes; verified historical recovery; current evidence remains readable |

## Reproduce

From the repository root, provision Node ≥22, locked frontend packages, Foundry/solc0.8.26 and Chromium/WebKit externally. Root README covers install/preview/rebuild. Optional `PLAYWRIGHT_BROWSERS_PATH`, `W1_CHROMIUM_EXECUTABLE`, `W1_WEBKIT_EXECUTABLE` select external runtimes. The existing Ubuntu WebKit helper extracts missing libraries into `/tmp`. Tool versions are in `tool-versions.log`.

```sh
npm ci --prefix frontend
npm run typecheck --prefix frontend
npm run test:unit --prefix frontend
npm run build --prefix frontend
W1_E2E_REPORT=../docs/validation/steps-brand-v1/e2e.json W1_E2E_AUDIT=../docs/validation/steps-brand-v1/browser npm run test:e2e --prefix frontend -- --workers=1
```

Run actual local journeys sequentially. Use `--browser chromium|webkit`, add `--mobile` for phones, and give each a distinct `--out` directory:

```sh
node frontend/tests/integration/browser-chain.mjs --browser chromium --group all --out docs/validation/steps-brand-v1/local/chromium
node frontend/scripts/audit-local-evidence.mjs docs/validation/steps-brand-v1/local/chromium
python3 frontend/scripts/seal-steps.py verify
```

The seal verifies exact source/test/assets/export bytes and protected predecessor files. `capture` is only for a newly retested tree, never a replacement for tests. The pinned taste probe is a removed assignment input; its actual result/log and screenshots remain here. Current evidence indexing excludes itself to avoid circular hashes; documentation is hashed separately.

## Limits and retained failures

Worker checks are not independent certification. Local journeys use disposable unlocked Anvil accounts, actual A1 contracts, MockToken/MockIntake and test-delivered callbacks. Public-network compatibility, real AI execution, callback/retention/Git liveness, native Safari/iOS hardware, real wallet applications/passkeys, screen readers and independent final-frontend review remain NOT_RUN. Coinbase app display wiring is source-verified; no real passkey flow is claimed. Relative OG URLs await a known host where absolute URLs are required.

`attempts/` retains the receipt-read/reconnect setup failures, initial keyboard/rail failures, build-overlap stale-asset failure, the WebKit timeout run and supplemental probe setup failures. The existing optional ethers source-map warning is retained; its protected vendor source is unchanged. Only the current reports count as final acceptance.

[Historical recovery](../historical/README.md) preserves failed logs, receipts and artifacts by immutable predecessor references plus a local lossless archive for six accepted-checkout additions. No core source, tests or authenticated fixture was deleted for size. Current final evidence stays directly readable.
