# Current acceptance

**Local scope only.** `productionDeployment:null`, `liveCompatibility:NOT_RUN`, `productionReady:false`.

The current acceptance record for the STEPS-branded tree is [steps-brand-v1](validation/steps-brand-v1/README.md). Its status file is [check-results.json](validation/steps-brand-v1/check-results.json), and its raw logs, screenshots and receipts are indexed in [evidence-sha256.json](validation/steps-brand-v1/evidence-sha256.json). Historical passes, including the earlier 175-pass PLATFORM-UX-V1 run, are not final acceptance.

## Results by evidence class

| Class | Result | Basis |
| --- | --- | --- |
| Fixtures (demo mode, simulated) | **PASS** | Unit 47/47. Playwright 182 passed, 3 existing desktop-only skips, 0 failed, in five projects |
| Actual local contracts (Anvil, MockToken/MockIntake, unlocked test accounts) | **PASS** | 16/16 scenarios in each Chromium/WebKit desktop/mobile run (64/64), plus supplemental 8/8 per engine. Zero page errors and zero unexpected console errors. 85 audited receipts per run |
| Core | **PASS** | Solidity 125/125, SDK 39/39, `forge fmt`, fixture integrity, release ABI/code hashes. The 94 protected predecessor files are byte-identical |
| Public IMD / live Intake | **NOT_RUN** | No live purchase, callback, manifest or deployment |
| Real wallet apps, passkeys, native Safari/iOS, screen readers | **NOT_RUN** | Only emulated browsers |
| Independent review of the final frontend | **NOT_RUN** | Worker evidence only |

Fixture mode uses simulated state. Local mode submits real SDK-prepared transactions to disposable contracts. Neither proves a real worker, live manifest or callback liveness, native wallet compatibility, external Git delivery or production readiness.

## Documentation pass

The [documentation pass](validation/steps-brand-v1/documentation/README.md) changed only README and docs. It did the following:

- reran install, typecheck, unit, build and the core checks from a fresh clone;
- confirmed the rebuilt export is byte-identical;
- confirmed `seal-steps.py verify` passes;
- recovered all 1,309 historical files;
- re-measured the full-source size.

It did not rerun the browser matrix or the local-contract journeys. Those results belong to the build step and remain valid only because the runtime, test, asset and export bytes still match their captured manifests.

## Retained failures and history

This run's failed attempts are under [`validation/steps-brand-v1/attempts/`](validation/steps-brand-v1/):

- receipt/reconnect setup failures;
- initial keyboard and rail failures;
- a build-overlap stale asset;
- WebKit timeouts;
- probe setup failures.

Earlier records, including WebKit RPC diagnostics, integration acceptance, review-fixes and the PLATFORM-UX-V1 matrix, are preserved in two ways:

- by original path at the immutable predecessor [`d29eedf8…/docs/validation`](https://github.com/identity-md-launches/launch-2294-build-cto-relay-station/tree/d29eedf8e7d6608ed109972c179b367ac07ce91f/docs/validation);
- by the byte-verified [historical recovery index](validation/historical/README.md).

The earlier [requirement matrix](https://github.com/identity-md-launches/launch-2294-build-cto-relay-station/blob/d29eedf8e7d6608ed109972c179b367ac07ce91f/docs/validation/platform-ux-v1/documentation/README.md) and [open issues](https://github.com/identity-md-launches/launch-2294-build-cto-relay-station/blob/d29eedf8e7d6608ed109972c179b367ac07ce91f/docs/validation/platform-ux-v1/documentation/open-issues.md) are historical. The current open issues are in the [README](../README.md#open-issues).

Core local regressions pass. Finite manifest limits and missing callbacks remain liveness risks, with no privileged recovery. No local PASS clears a live gate.
