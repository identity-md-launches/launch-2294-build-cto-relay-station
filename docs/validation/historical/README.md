# Historical validation: byte-exact recovery

These are earlier results, including failures, not acceptance of the final STEPS runtime. The 1,309 original evidence files are preserved in [original-path-sha256.json](original-path-sha256.json). Each has its original repository path, size, SHA-256 and recovery source.

1,303 files were downloaded and byte-verified against the immutable public predecessor `d29eedf8e7d6608ed109972c179b367ac07ce91f`. Their original paths are available under [that exact tree](https://github.com/identity-md-launches/launch-2294-build-cto-relay-station/tree/d29eedf8e7d6608ed109972c179b367ac07ce91f/docs/validation). Six additional brand browser records from the accepted starting checkout are retained in `accepted-brand-additions.tar.xz`; its SHA is in the index. They are preliminary evidence only.

Recover every original path without changing the delivery:

```sh
python3 docs/validation/historical/recover.py --out /tmp/steps-history
# or supply a previously downloaded immutable GitHub tar.gz:
python3 docs/validation/historical/recover.py --predecessor-tar /tmp/steps-predecessor.tar.gz --out /tmp/steps-history-offline
```

The destination must be empty. The script authenticates all file bytes against the index, including failed/interrupted logs, raw receipts and downloaded artifacts; it does not execute recovered content. Recovered historical relative links work within that tree. No failed log, test, core source or authenticated file was silently deleted to meet the budget. Core tests, source fixtures and required SDK dependency archives remain ordinary delivered files.

The early source snapshot was already over 8 MiB. Immutable recovery avoids storing a second complete copy of public historical screenshots/receipts while keeping current final evidence directly readable. [Recovery receipt](../steps-brand-v1/historical-recovery.log) records this run's complete extraction and byte check. Current final evidence is [steps-brand-v1](../steps-brand-v1/README.md).
