---
title: "Component: DecommissionService"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/service/DecommissionService.java, docs/03-change-spec.md, docs/04-data-model-spec.md]
phase: 4
---

# Component: `DecommissionService`

New `@Service` holding all decommission business rules (the smallest-change home for the
logic). Built and tested in Phase 4 (N-01..N-07 green). All methods `@Transactional`.

## API (as built)
- `request(assetId, reason, requester)` — guards V-01 (non-empty reason), V-04 (asset must be an
  active asset — a soft-deleted one is absent from `findById`), V-05 (no existing PENDING);
  creates a `PENDING` request. Throws `IllegalArgumentException` on any guard violation.
- `approve(requestId, approver, comment)` — sets `APPROVED` + decision metadata, then calls
  `assetRepository.deleteById(assetId)` to **reuse the existing soft-delete** (FA-05).
  → [ADR-001](../decisions/ADR-001-reuse-soft-delete.md)
- `reject(requestId, approver, comment)` — sets `REJECTED` + decision metadata; asset untouched (FA-06).
- `pendingRequests()` — `findByStatus(PENDING)` for the approver view (FA-04).
- `historyForAsset(assetId)` — newest-first history, survives soft-delete (FA-09).

Only a `PENDING` request can be decided (re-decision is rejected). Tests N-01..N-07 cover these.
Depends on
[persistence](persistence.md) + [decommission-request model](../data-models/decommission-request.md).
Drives [request-decommission](../features/request-decommission.md) and
[approval-workflow](../features/approval-workflow.md).
