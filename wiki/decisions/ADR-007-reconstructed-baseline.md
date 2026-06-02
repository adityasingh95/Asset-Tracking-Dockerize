---
title: "ADR-007: Reconstructed baseline (original source unreachable)"
status: current
last_updated: 2026-06-02
sources: [docs/02-repo-baseline.md, artifacts/repo-map.md, artifacts/as-is-behaviour.md]
phase: "0"
---

# ADR-007: Reconstructed baseline

**Context.** This is specified as a brownfield change to an existing app, but the original
source repo (`faizal08/asset-tracking-system`) was unreachable from this environment and the
target repo was empty.

**Decision.** Reconstruct the baseline app **faithfully from `docs/02-repo-baseline.md`** (entity,
endpoints, security, config, templates) to provide a concrete "as-is" tree to characterize and
change. Confirmed by the user before proceeding.

**Consequences.** The as-is documents reflect the reconstruction, which was built to match the
behaviour `docs/02` describes. Two items `docs/02` left open were resolved by the reconstruction
(Delete control = GET anchor with confirm; REST DELETE = unused). If the original source later
surfaces and differs, reconcile [as-is-behaviour](../../artifacts/as-is-behaviour.md) and flag it.
Phase 0 build compiles; Phase 1/2 verify runtime behaviour.
