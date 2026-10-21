# STEPS final interface review

STEPS is a public-project workspace carried by a warm paper surface, precise ink typography and a vermillion next step. Project sequence and complete selected output remain the principal workspace surfaces. The slogan belongs to entry and the social card.

The review applies the pinned Better Interface workflow and the core principles of accessibility, layout, writing, typography, colors and UI. No unrelated redesign or protocol change was made. The final CSS and component source is described in [DESIGN.md](../../../DESIGN.md); the original geometric mark and its variants in [brand/README.md](../../../brand/README.md). Retained source/license notices are under `frontend/docs/licenses/`.

## Findings and corrections

| Finding and source | Observation | Correction and evidence |
| --- | --- | --- |
| Layout: fractional-height sequence clipping, `frontend/src/styles.css:97` | WebKit's scrollport rounded down a 116.140625px button and clipped 0.140625px. The unchanged full-visibility assertion measured 0.998789. | Added a 1px bottom inset to the rail. The same button now has intersection ratio 1.0. Exact before/after geometry is in `webkit-rail-{before,after}.json`; full matrix repeats the original assertion. |
| Test timing: keyboard entry, `frontend/tests/e2e/w1.spec.ts:285` | A Tab event could precede React mounting the first link. | Await attachment of the skip link, then press Tab and retain the original focused-link, visible-ring, dialog and focus-return assertions. |
| Recovery coverage: `frontend/src/ui/recovery.ts:4`, `frontend/tests/unit/recovery.test.tsx:16`, `frontend/tests/integration/browser-chain.mjs:498` | The existing failed-row retry repair lacked a direct regression. | Added rendered unit cases for reverted/replaced rows, unknown blocking, preserved same-nonce/different-hash journal history and explicit consent. Added real reverted/dropped/replaced transactions after an authenticated local refusal, with purchase counts checked before and after consent. No failure/unknown distinction was relaxed. |
| Evidence/branding: root README and current guides | Historical manifests no longer identified the final branded tree; current guides still named the preceding platform. | STEPS/Stepstoke guide, portable asset inventory, current acceptance index, protected-core comparison and separate runtime/test/assets/export/doc hashes. Historical evidence recovered and indexed by exact bytes. |

Initial failures remain under `attempts/`: the first browser run's keyboard/rail failures; a subsequent run that overlapped the rebuild and requested stale hashed assets; local regression setup races (receipt availability and wallet reconnection); supplemental probe selector/reset synchronization failures, and two WebKit test timeouts during concurrent validation. The complete matrix was then rerun with one worker and unchanged per-test timeouts. They do not count as final passes. Assertions were preserved; no diagnostic exclusion was broadened. The exact existing WebKit sandbox-denial exception and exact intentional HTTP 503 diagnostic remain recorded separately from unexpected console errors.

## Six-domain coverage

| Domain | Source and rendered coverage | Limits |
| --- | --- | --- |
| Accessibility | Semantic STEPS home name; decorative outlined SVGs; skip link and visible focus; labelled fields; named details/summary; sheet trap/Escape/restoration and background inertness; named table scroll regions; labelled states independent of color. Full browser matrix and rendered review exercise keyboard flows. | No physical screen reader, voice input or hardware touch audit. Native 200% browser zoom is not independently measured. |
| Layout | First-screen entry action measured at 320/390/1440. Four routes at 320/390/768/1440 in Chromium/WebKit. Long history selection/scrolling, long prose/IDs, wallet/funding/preparation and complete output checks; host overflow zero. | Arbitrary third-party artifact layout is isolated and outside platform layout guarantees. |
| Writing | STEPS is primary; Stepstoke expanded; five-word slogan at entry; verb-labelled actions; explicit demo/local/disabled public deployment; approval and purchase remain separate. Current docs/showcase are English. Protocol identifiers, historical records and authenticated project outputs retain original names. | No new locale or independent copy review. |
| Typography | Existing six-step 13/16/20/24/28/36px scale, system sans and identifier mono. Input text 16px at phone widths. Long content wraps; critical values remain reachable. STEPS wordmark is custom outlines; social copy uses licensed local outlines. | Installed system fallback faces vary. No external font service. |
| Colors | Existing paper/ink/vermillion semantic tokens. `contrast.json` computes named source pairs; taste@1 samples rendered entry text. State labels accompany color. Primary, mono, reversed and small marks rendered in both engines. | Solid token pairs do not establish every disabled/translucent combination or authenticated artifact contrast. Reversed assets do not introduce a dark app theme. |
| UI | Eight production component families retained. Hover/focus/disabled/loading/error/unknown/refused/binding/verified states exercised by browser and actual local-contract suites; reduced motion measured. Actual downloads and selected-vs-latest semantics checked. | No animation-panel 10% replay: the app has restrained color transitions and no staged animation. Public deployment/live worker compatibility remain NOT_RUN. |

## Evidence and limitations

`taste.json` records all 16 measured checks on the final export, with root screenshots at 320/390/1440 inspected locally. The product and main action are on the first 390px screen. `rendered-review-{chromium,webkit}.json` and `extended-layout.json` record supplemental geometry/focus checks; their screenshots cover workspace, long rail, entry and funding. `brand-check.json` records PNG dimensions and self-contained SVG checks, with small/mono/reversed specimens inspected in both engines. Brand assets, favicon, official X href, metadata and gateway paths also have browser assertions.

These are worker observations, not an independent accessibility, security or production-readiness certification. Functional and browser-runtime outcomes are recorded separately in the [acceptance index](README.md). No live IMD purchase, public deployment, hosting or X publishing occurred.
