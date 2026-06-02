---
title: "Feature: Approval Workflow (planned)"
status: planned
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/04-data-model-spec.md]
phase: 5
---

# Feature: Approval Workflow (planned — Phases 4/5)

An approver views pending requests and decides each one, with a full audit trail.

## Acceptance (target)
- FA-04 / UI-04 — a page lists all `PENDING` requests with asset (name/type), requester,
  reason, requested date.
- FA-05 — **Approve** executes the existing soft-delete (`is_deleted = true`) and marks the
  request `APPROVED`. → [ADR-001](../decisions/ADR-001-reuse-soft-delete.md)
- FA-06 / V-02 — **Reject** leaves the asset active/visible and marks the request `REJECTED`.
- FA-08 / V-06 — record `decidedBy`, `decidedAt`, `status`, `decisionComment` for both outcomes.
- FA-09 — request/decision history visible, **including for approved (now soft-deleted) assets**.
- UI-05/06 — approve/reject actions with a decision comment; success feedback for
  created/approved/rejected.

## State transitions
```
[Active, no request] --request(+reason)--> [PENDING]   (asset stays active)
[PENDING] --approve(+comment)--> APPROVED  (asset soft-deleted)
[PENDING] --reject(+comment)---> REJECTED  (asset stays active)
[PENDING] --request again------> blocked (duplicate)
[Soft-deleted asset] --request--> blocked (already decommissioned)
```

## Status
- **Service layer landed in Phase 4** (DecommissionService, N-01..N-07 green); user-facing UI wiring is Phase 5.
Not yet implemented. Service `approve`/`reject` in Phase 4; approver UI in Phase 5;
history in Phase 6.

Related: [request-decommission](request-decommission.md) · [decommission-service](../components/decommission-service.md).
