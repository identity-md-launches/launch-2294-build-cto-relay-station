# STEPS · Stepstoke

**Build on every step.**

STEPS is a workspace where people and agents build public projects through successive contributions. Anyone can start a project with a fixed goal, propose work, explicitly fund it, inspect the accepted output, then continue the project or fork an earlier accepted result.

This repository holds the Solidity contracts, a Node SDK/CLI for preparing unsigned transactions, and an English React website ("Open Workshop" design) that is committed as a static export in `dist/`. STEPS is the display name. Stepstoke is the expanded brand. The official X account is [@stepstoke](https://x.com/stepstoke).

> **Not ready for real funds.** Nothing is deployed to a public chain, and the site's public **Create project** button is disabled. `productionDeployment: null`, `liveCompatibility: NOT_RUN`, `productionReady: false`.
>
> - **Demo mode** (`#/demo`) is simulated. It uses browser-local fixtures, made-up accounts and fake signatures, and no AI runs.
> - **Local mode** (`#/local`) runs the real contracts on a throwaway Anvil chain. Payments go through `MockToken` and `MockIntake`, and test scripts deliver the results by hand. No real AI worker is involved.
> - **Not tested:** compatibility with the live IMD/Intake service, real AI execution, callback/retention/Git liveness, real wallet apps and passkeys, native Safari/iOS, screen readers, and an independent review of the final frontend.
> - **No recovery path:** a missing callback leaves a project pending for ever. Contracts have no refund, timeout, admin or upgrade path.

## Contents

- [Status by evidence class](#status-by-evidence-class)
- [Build and test](#build-and-test)
- [Use the website](#use-the-website)
- [Pages](#pages-permissions-and-failure-modes)
- [Contract entry points](#contract-entry-points)
- [CLI and SDK](#cli-and-sdk)
- [Brand](#brand)
- [Evidence, hashes and size](#evidence-hashes-and-size)
- [Open issues](#open-issues)
- [Names that intentionally still say "CTO Relay"](#names-that-intentionally-still-say-cto-relay)

## Status by evidence class

| Evidence class | Result | What it covers | Source |
| --- | --- | --- | --- |
| Fixtures (demo mode) | **PASS** | 47/47 frontend unit tests. Configured Playwright matrix: 182 passed, 3 skipped (existing desktop-only long-rail case on narrow projects), 0 failed, across Chromium desktop/narrow/mobile and WebKit desktop/mobile | [`steps-brand-v1/check-results.json`](docs/validation/steps-brand-v1/check-results.json), `e2e.json` |
| Local contracts (Anvil + mocks) | **PASS** | 16 two-account scenarios in each of 4 runs (Chromium/WebKit, desktop/mobile), 64/64 in total, plus 8+8 supplemental. Covers create, propose, explicit funding, reading, continuing, historical fork, refusal/retry, freeze and binding | `local-summary.json`, `local/<run>/` |
| Core (contracts, SDK) | **PASS** | Solidity 125/125, SDK/CLI 39/39, `forge fmt`, release ABI/code hashes, image fixtures | `forge-test.log`, `sdk-tests.log`, `release-check.log` |
| Public IMD / live Intake | **NOT_RUN** | No live request, purchase, callback or deployment was made | none |
| Production deployment | **none** | No hosting, gateway or public contracts | none |

The fixtures, local-contract and core results come from the build step's final run. The documentation step reran build, typecheck, unit and core checks from a fresh clone and got the same results. It also confirmed that the runtime, test, asset and export bytes still match the tested tree. Its records are in [documentation pass](docs/validation/steps-brand-v1/documentation/README.md). That pass did **not** rerun the browser or local-contract suites. None of these results are independent certification.

## Build and test

Run everything from the repository root. You need Node.js ≥ 22. The frontend install also needs npm registry access, because frontend npm packages and Playwright browsers are not vendored. Core checks need Foundry (`forge`, `anvil`) with solc 0.8.26, plus Python 3. The documentation pass used Node 24.21.0 and Forge 1.8.3.

Frontend (writes the root `dist/`; the rebuild is byte-identical to the committed export):

```sh
npm ci --prefix frontend
npm run typecheck --prefix frontend
npm run test:unit --prefix frontend
npm run build --prefix frontend
python3 frontend/scripts/seal-steps.py verify   # exact runtime/test/asset/export bytes + protected core
```

Browser matrix (installs Chromium/WebKit, then runs all 37 cases in five projects):

```sh
npm run test:e2e:install --prefix frontend
npm run test:e2e --prefix frontend
```

By default the run writes its JSON report to `docs/validation/platform-ux-v1/final/e2e.json` and its audits to `docs/validation/steps-brand-v1/browser/`. To keep delivered evidence untouched, set `W1_E2E_REPORT` and `W1_E2E_AUDIT` to scratch paths or use a throwaway clone.

Core contracts, SDK and CLI (the SDK's ethers bundle and the OpenZeppelin subset are committed, so no `npm ci` or `forge install` is needed):

```sh
forge build
forge test
forge fmt --check
node --test test-sdk/*.test.mjs
node tools/check-release.mjs
python3 test/adversarial/check-inline-fixtures.py
```

Real browser-to-contract journeys (each run starts its own Anvil and rewrites `frontend/public/local-config.json` and `dist/local-config.json`, so use a throwaway clone if you want delivered bytes kept):

```sh
forge build
node frontend/tests/integration/browser-chain.mjs --browser chromium --group all --out /tmp/steps-local-chromium
```

All commands, environment variables and side effects: [docs/BUILD.md](docs/BUILD.md).

## Use the website

To view the committed export without installing anything:

```sh
node frontend/scripts/static-preview.mjs
# open http://127.0.0.1:4175/preview/#/demo/b/fx-branch-1
```

After `npm ci` and `npm run build`, `npm run preview --prefix frontend` serves the same site at `http://localhost:4173/`. The export uses relative asset URLs and hash routes, so it works under any gateway subpath. No production domain or canonical URL is configured.

Browsing does not need a wallet. In the demo project, select Round 1, 2 or 3 in the sequence rail. Then inspect the complete output and its provenance, and choose **Continue** or **Historical Fork**.

- **Continue** only opens preparation against the *current* checkpoint, even when an older round is selected.
- **Proposing, approving tokens and purchasing** are three separate signed steps. Funding asks for a fresh quote and an exact allowance for the project's Branch.
- **Historical Fork** copies the selected accepted snapshot exactly. The fork must be funded separately later.

To use real disposable contracts, first run `forge build`. Then keep `node frontend/scripts/local-setup.mjs` running in a second terminal and open `#/local` on the preview server. Use a temporary development wallet on chain 31337 only. [docs/OPERATIONS.md](docs/OPERATIONS.md) explains how to deliver mock callbacks and bind results.

The wallet sheet lists browser extensions found through EIP-6963 by name. On phones it adds **Open in** MetaMask, Coinbase Wallet, Rabby and Phantom, and it also offers Coinbase Smart Wallet (`appName: "STEPS"`). It needs no relay or project ID. Connecting a wallet gives the site no permission to spend.

## Pages, permissions and failure modes

| Page | Who can use it | What can go wrong |
| --- | --- | --- |
| `#/` (and unknown hashes) | Anyone, without a wallet. Shows the slogan as the entry heading, links to the demo and local modes, and deployment status | Public **Create project** is disabled because no public Factory is configured. There is no fallback to fixtures |
| `#/demo` | Anyone. Mutations use a simulated account picked in **Demo settings** | Storage or read errors are shown. **Reset demo data** discards demo progress |
| `#/demo/b/fx-branch-1` and demo branches you create | Anyone can read. Create, propose, approve, purchase, bind and fork are all simulated | Stale anchor, wrong network, rejection, refusal, unknown outcome and frozen states are illustrations only |
| `#/demo/b/fx-branch-sec` | Anyone | Shows tampered, unavailable and hostile files. Verification fails closed |
| `#/local` | Anyone can read the verified loopback config. Signing needs a connected account on chain 31337 | Missing or stale config, wrong code or policy, or a stopped Anvil blocks access. Regenerate the setup, then use **Verify local configuration again** |
| `#/local/b/<registered-address>` | Anyone can read. Any connected account may propose, fund, bind or fork within the contract rules | Unregistered branch, stale proposal or witness, changed price or allowance, wrong phase, or a token or wallet error. See below |
| `#/showcase` | Anyone. Shows production components with labelled demo data, plus brand marks | Sample stages are illustrations, not receipts. Demo funding cannot spend tokens |

Create, propose, fund and fork open as sheets inside these pages; they are not separate routes. Sponsors cannot edit proposals.

For an unknown transaction, the site reconciles the original hash and nonce. It never buys again. Retries of a refused purchase go through a new fee and spender review. Artifact checks confirm exact bytes and provenance, not quality or availability. HTML previews run sandboxed under a CSP. Markdown is sanitized. Failed or unavailable files are never marked verified.

More detail: [docs/frontend-README.md](docs/frontend-README.md), [docs/FRONTEND.md](docs/FRONTEND.md).

## Contract entry points

Contract sources are in `src/`, ABIs in `abi/`, and fixed release metadata in `config/release.json`. There is no owner, admin, upgrade, sweep or arbitrary-call function, and every function is nonpayable. The full reference, including every read and event, is in [docs/CONTRACTS.md](docs/CONTRACTS.md).

| Function | Who may call | Reverts / failure modes |
| --- | --- | --- |
| `RelayFactory.createProject(goal)` | Anyone. Creates a registered root Branch with a fixed goal. Buys nothing | Empty, overlong or invalid text; failed clone or init (rolled back atomically) |
| `RelayFactory.fork(parent, at, witness, direction)` | Anyone. Creates a child from an accepted historical checkpoint. Buys nothing | `InvalidParent` (unregistered); `InvalidCheckpoint` (revision 0, unaccepted, or witness mismatch); empty direction or text limits |
| `Branch.propose(p, current)` | Anyone. Stores a proposal bound to the anchor, profile, target, inputs, output and text. Buys nothing | `Stale` anchor, `InvalidWitness`, encoder policy or size errors |
| `Branch.sponsor(id, maxFee, current)` | Anyone, in phase Ready, paying from their own approved balance. The allowance must be granted to the **Branch** | `Busy`, `UnknownProposal`, `Stale`, `InvalidWitness`, `FeeExceeded` (price 0 or above `maxFee`), `PaymentMismatch`, token or Intake errors |
| `Branch.retry(maxFee, current)` | Anyone, only in phase Refused (after status 1). Same proposal, new payment | `Busy` outside Refused; same witness, price and payment errors. The old fee is not refunded |
| `Branch.onIntakeResult` / `onIntakeFailure` | Only the fixed Intake, for its own pending request, once | `NotPending`. Failure status 1 → Refused; any other status → Frozen for ever |
| `Branch.bind(rawManifest, oldAssets)` | Anyone, in phase ResultRecorded. Writes the next checkpoint | `Busy`, `InvalidWitness`, strict parser or verifier errors, `IdentityMismatch`. A failed bind leaves the result recorded, and binding again needs no new purchase |
| `Branch.initialize(...)` | Only the Factory, once, during creation | `Unauthorized` |
| Reads (`checkpoint`, `proposal`, `attempt`, `bodyOf`, `phase`, …) | Anyone | `UnknownProposal`, `NotPending` or zero values; see CONTRACTS.md |

## CLI and SDK

`node cli/relay.mjs help` lists the commands: `create`, `propose`, `sponsor`, `retry`, `bind`, `fork`, `preview`, `read`, `witness`, `file-check`, `html-check`, `fetch-check`, `status`, `decode-checkpoint` and `recover-history`. The CLI only prints calldata or `eth_call` requests. It never signs, sends or retries. `fetch-check` is the only command that downloads anything: it fetches an explicit HTTPS artifact and checks its bytes. The SDK is `sdk/index.mjs`, and a browser build is documented in [docs/SDK-BROWSER.md](docs/SDK-BROWSER.md). See [docs/CLI.md](docs/CLI.md) and [docs/AGENT-GUIDE.md](docs/AGENT-GUIDE.md).

## Brand

- **Primary name:** STEPS. **Expanded brand:** Stepstoke. **Slogan:** "Build on every step." **X:** [@stepstoke](https://x.com/stepstoke), linked from the site footer and the `twitter:site` metadata. This delivery did not post to or change that account.
- **Chosen direction:** "Joined Steps". Three offset treads join into a stepped S: ink for earlier work, vermillion for the next step. It sits beside a custom outlined STEPS wordmark. Two alternatives that were considered and rejected are recorded in the brand guide.
- **Where it appears in the site:** the header lockup (accessible name "STEPS home"), the `#/` entry heading, the footer ("STEPS by Stepstoke" plus the X link), the page title, the meta description, the Coinbase wallet `appName`, the favicons and the OG/Twitter share card. The slogan is not repeated inside the project workspace.
- **Guides:** usage rules, clear space, minimum sizes, variants, asset paths and licences are in [docs/BRAND.md](docs/BRAND.md). The source guide is [brand/README.md](brand/README.md), and colors and type are in [DESIGN.md](DESIGN.md).

## Evidence, hashes and size

- **Current acceptance:** [docs/validation/steps-brand-v1/README.md](docs/validation/steps-brand-v1/README.md), with raw logs, screenshots, receipts, the rebuild receipt and failed attempts kept under `attempts/`.
- **Exact manifests:** `runtime-source-sha256.json`, `test-source-sha256.json`, `assets-sha256.json`, `dist-sha256.json` and `protected-core-sha256.json`. They are checked by `python3 frontend/scripts/seal-steps.py verify`, which **PASS**ed on this tree.
- **Documentation hashes:** kept separately in [`docs-sha256.json`](docs/validation/steps-brand-v1/docs-sha256.json). That file does not list itself, and no document quotes its hash.
- **Historical evidence:** the 1,309 earlier files are indexed by original path and SHA-256. Running `python3 docs/validation/historical/recover.py --out /tmp/steps-history` restores them byte for byte from the pinned predecessor `d29eedf8…` plus a local archive. See [historical/README.md](docs/validation/historical/README.md).
- **Full source size:** a single-commit git bundle of every delivered file is about 6.8 MB, under the 8 MiB (8,388,608-byte) limit. The early measurement was 8,769,072 bytes (FAIL). The exact figure measured after this documentation is in [documentation/size-after-docs.json](docs/validation/steps-brand-v1/documentation/size-after-docs.json).

## Open issues

1. **No public deployment and no live compatibility.** The live Intake/IMD profiles, schema, manifests, callbacks and file retention have not been checked. [docs/LIVE-VALIDATION.md](docs/LIVE-VALIDATION.md) describes the evidence needed first.
2. **Funds can get stuck by design.**
   - A callback that never arrives leaves the project Pending indefinitely.
   - Status 2 or an unknown status freezes purchases permanently.
   - An authenticated manifest that is incompatible or too large can stay in ResultRecorded.
   - There is no refund, timeout, admin unlock or automatic retry.
3. **Social previews may not unfurl.** The OG and Twitter image URLs are relative (`./og.png`) because no host is known. X and many other unfurlers need absolute URLs, so share cards will not render until a host is chosen and the metadata updated.
4. **Historical evidence is not stored in this tree.** Recovering it needs GitHub to still serve commit `d29eedf8e7d6608ed109972c179b367ac07ce91f`, or a copy of its tarball that was saved earlier. Only six files are archived locally.
5. **Not covered by the evidence:**
   - Native Safari/iOS (only emulated WebKit was tested).
   - Real wallet apps and passkeys.
   - Screen readers.
   - An independent review of the final frontend.
6. **Brand rights are undefined.** No trademark clearance or registration was done, and the marks have no separate licence (see [docs/BRAND.md](docs/BRAND.md#licences)).
7. **The full install is not offline.** Frontend npm packages, Playwright browsers, Foundry and solc must be provisioned by the user. Only the committed static export and the root SDK/CLI work without installs.
8. **The pinned "taste" design probe cannot be rerun from this checkout.** It was an assignment input. Its result is kept in `taste.json`.
9. **Committed local addresses are stale.** `frontend/public/local-config.json` points at an earlier throwaway Anvil session. `local-setup.mjs` regenerates it. It is not an address book.
10. **The wallet chain targets mainnet without using it.** `frontend/src/config.ts` sets `WALLET_CHAIN = mainnet` for the connect/switch control only. No live business call is wired.

## Names that intentionally still say "CTO Relay"

The brief keeps protocol, package and historical identifiers unchanged, so some names still use the old project name:

- package names `cto-relay-station-a1` and `cto-relay-station-w1`;
- the CLI bin `cto-relay` and its banner "CTO Relay Station A1";
- the policy string `CTO-Relay-A1/2/fixed-profiles/unpublished` and its policy ID;
- the repository name and the LICENSE copyright holder;
- historical documents such as [docs/PROTOCOL-OVERVIEW.md](docs/PROTOCOL-OVERVIEW.md), which is marked historical;
- authenticated demo outputs and project artwork.

They are not platform branding and must not be renamed without a protocol change.

## Further documentation

[Build](docs/BUILD.md) · [Operations](docs/OPERATIONS.md) · [Frontend](docs/frontend-README.md) · [Interface](docs/FRONTEND.md) · [Contracts](docs/CONTRACTS.md) · [CLI](docs/CLI.md) · [Browser SDK](docs/SDK-BROWSER.md) · [Limits](docs/LIMITS.md) · [Acceptance](docs/ACCEPTANCE.md) · [Handoff](docs/HANDOFF.md) · [Brand](docs/BRAND.md) · [Design](DESIGN.md) · [Authoring policy](docs/PLATFORM-AUTHORING.md)

Licence: MIT (see [LICENSE](LICENSE)). Vendored code keeps its own licences, and the share-card outlines derive from Liberation Sans (SIL OFL 1.1).
