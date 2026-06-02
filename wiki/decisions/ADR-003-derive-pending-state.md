---
title: "ADR-003: Derive 'pending' from a PENDING request, not Asset.status"
status: current
last_updated: 2026-06-02
sources: [CLAUDE.md, docs/04-data-model-spec.md]
phase: "0"
---

# ADR-003: Derive "pending decommission" state

**Context.** The UI must indicate assets awaiting approval. `Asset.status` is an existing
free-text field used by the UI.

**Options.** (a) Repurpose `Asset.status` as a pending flag. (b) Add a new column to `Asset`.
(c) Derive it from the existence of a `PENDING` `DecommissionRequest`.

**Decision.** (c). An asset is *pending* iff a `DecommissionRequest` with `status = PENDING`
exists for its id. No structural change to `Asset`; `status` is left alone (CLAUDE.md §8).

**Consequences.** No `Asset` schema change. Dashboard computes the badge from
`findByStatus(PENDING)` → asset-id set (one query, not N). Affects
[request-decommission](../features/request-decommission.md), [asset model](../data-models/asset.md).
