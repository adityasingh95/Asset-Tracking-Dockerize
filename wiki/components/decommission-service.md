---
title: "Component: DecommissionService (planned)"
status: planned
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/04-data-model-spec.md, docs/08-backlog.md]
phase: 4
---

# Component: `DecommissionService` (planned — Phase 4)

New service holding all decommission business rules (the smallest-change home for the logic).

## Intended API
- `request(assetId, reason, requester)` — guards V-01 (non-empty reason), V-04 (asset not
  already soft-deleted), V-05 (no existing PENDING); creates a `PENDING` request.
- `approve(requestId, approver, comment)` — sets `APPROVED` + decision metadata, then calls
  `assetRepository.deleteById(assetId)` to **reuse the existing soft-delete** (FA-05).
  → [ADR-001](../decisions/ADR-001-reuse-soft-delete.md)
- `reject(requestId, approver, comment)` — sets `REJECTED` + decision metadata; asset untouched (FA-06).

Tests N-01..N-07 cover these (Phase 4). Depends on
[persistence](persistence.md) + [decommission-request model](../data-models/decommission-request.md).
Drives [request-decommission](../features/request-decommission.md) and
[approval-workflow](../features/approval-workflow.md).
