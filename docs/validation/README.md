# Validation evidence

[STEPS brand v1](steps-brand-v1/README.md) is the current acceptance record. Historical passes do not establish final acceptance. Its [documentation pass](steps-brand-v1/documentation/README.md) reran fresh-clone build/unit/core checks, verified the runtime/export seal and re-measured the full-source size; it changed README/docs only. [Current acceptance by evidence class](../ACCEPTANCE.md) separates fixture, local-contract and live (NOT_RUN) results.

Earlier validation is preserved by [verified historical recovery](historical/README.md), indexed by original path, exact byte count and SHA-256. Recover those paths before following old evidence links locally. Nothing in a historical log authorizes production use.

`productionDeployment:null`, `liveCompatibility:NOT_RUN`, `productionReady:false`.
