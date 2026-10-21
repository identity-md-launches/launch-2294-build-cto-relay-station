# STEPS documentation pass

This pass wrote the final README and docs for STEPS. It changed **only** `README.md` and `docs/**`: no runtime, test, asset, export, core or configuration file was modified. These are worker observations, not independent certification. `productionDeployment:null`, `liveCompatibility:NOT_RUN`, `productionReady:false`.

The pass started from checkout `392465f36df54a359177241d237a018604bcda8b`, which already contained the integrated STEPS frontend, brand assets and final evidence from the build step. The requested predecessor is `d29eedf8e7d6608ed109972c179b367ac07ce91f`.

## What was rerun

The README commands were run from a fresh `git clone` in a scratch directory. Absolute machine paths in the logs are replaced by `<fresh-clone>` / `<repo>`; nothing else is edited.

| Command | Result | Log |
| --- | --- | --- |
| `npm ci --prefix frontend` | PASS (registry reachable, 0 vulnerabilities reported) | — |
| `npm run typecheck --prefix frontend` | PASS | [typecheck.log](typecheck.log) |
| `npm run test:unit --prefix frontend` | PASS: 47/47 tests, 5 files. The existing optional ethers source-map warning is retained | [unit.log](unit.log) |
| `npm run build --prefix frontend` | PASS | [build.log](build.log) |
| `git status --short` after the build | Clean: the rebuilt `dist/` is byte-identical to the committed export | [git-status-after-build.log](git-status-after-build.log) |
| `python3 frontend/scripts/seal-steps.py verify` (in the clone, after rebuild) | PASS (exit 0) | [seal-verify-fresh-clone-after-rebuild.log](seal-verify-fresh-clone-after-rebuild.log) |
| `forge build` | PASS (lint notes only) | [forge-build.log](forge-build.log) |
| `forge test` | PASS: 125 passed, 0 failed, 0 skipped, 14 suites | [forge-test.log](forge-test.log) |
| `forge fmt --check` | PASS (no output) | [forge-fmt.log](forge-fmt.log) |
| `node --test test-sdk/*.test.mjs` | PASS: 39/39 | [sdk-tests.log](sdk-tests.log) |
| `node tools/check-release.mjs` | PASS: ABI and release contract code hashes MATCH | [release.log](release.log) |
| `python3 test/adversarial/check-inline-fixtures.py` | PASS | [fixtures.log](fixtures.log) |
| `node cli/relay.mjs --help` | PASS (exit 0). The banner still reads "CTO Relay Station A1", a protected identifier | [cli-help.log](cli-help.log) |
| `node frontend/scripts/static-preview.mjs` | PASS: `/preview/` and the og, favicon and touch icons serve with HTTP 200; the title is "STEPS · Build on every step" | [static-preview.log](static-preview.log) |
| `python3 -I docs/validation/historical/recover.py --out <empty dir>` | PASS: 1,309 files and 12,523,951 bytes recovered with SHA-256 checks | [historical-recovery.log](historical-recovery.log) |

Tool versions are in [environment.json](environment.json).

## Runtime hash equality

- **Manifests unchanged.** [manifest-verification.json](manifest-verification.json) shows that the five manifests named in [`../check-results.json`](../check-results.json) are unchanged: runtime source, test source, assets, `dist` and protected core.
- **Delivered tree matches.** `seal-steps.py verify` was run on the delivered working tree after every documentation edit, and it passed. Output: [seal-verify-after-docs.log](seal-verify-after-docs.log).
- **Browser and local results still apply.** No runtime byte changed after the final browser and local-contract runs, so no rerun of those suites was needed. This pass did **not** rerun them.

## Documentation hashes

[`../docs-sha256.json`](../docs-sha256.json) was regenerated after the final edit, with the same scope as before. It covers every Markdown file in:

- the root `README.md` and `DESIGN.md`;
- `brand/**`;
- `frontend/**`, excluding `node_modules`;
- `docs/**`, including the new `docs/BRAND.md` and this README. Markdown files that are raw downloaded test outputs are also listed there.

It does not list itself, and no document quotes its hash, so there is no circular reference. This pass's own logs are indexed in [sha256.json](sha256.json), which likewise excludes itself.

[`../evidence-sha256.json`](../evidence-sha256.json) is the build step's raw-evidence index. It was not rewritten and does not list this `documentation/` folder.

## Full-source size

[size-after-docs.json](size-after-docs.json) records the measurement taken after the last documentation edit. The method matches [`../size-final.json`](../size-final.json): a fresh single-commit Git repository holding every delivered file, excluding the removed `.imd` inputs and `test/scratch/`, packed with `git bundle`. The limit is 8,388,608 bytes.

The size history:

| Measurement | Bundle bytes | Result |
| --- | ---: | --- |
| Early (`size-early.json`) | 8,769,072 | FAIL |
| Build step final (`size-final.json`) | 6,796,007 | PASS |
| Before this pass's edits, reproduced | 6,795,907 | PASS |
| After this pass | see `size-after-docs.json` | PASS |

The history of the original shared repository was not measured.

## Not done in this pass

- The browser matrix, actual local-contract journeys, rendered/design probes and brand raster checks were not rerun.
- No live IMD or Intake request, public deployment, hosting or X activity took place.
- No independent review was performed.
