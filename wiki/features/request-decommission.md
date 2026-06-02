---
title: "Feature: Request Decommission (planned)"
status: planned
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/01-overview-and-goals.md]
phase: 5
---

# Feature: Request Decommission (planned — Phases 4/5)

Replaces the immediate-delete control. Requesting decommission creates a `PENDING`
[DecommissionRequest](../data-models/decommission-request.md); the asset is **not**
soft-deleted at this point and shows a pending badge.

## Acceptance (target)
- FA-01 — creates a `PENDING` request; asset stays active.
- FA-02 / V-01 — **reason required**; blank/whitespace rejected, no request created.
- FA-03 / UI-03 — asset with an open request shows a pending indicator on the dashboard.
- FA-07 / V-04,V-05 — no duplicate pending; no request for an already soft-deleted asset.
- UI-01/02 — the dashboard *Delete* control becomes *Request Decommission* with a reason input.

## Status
Not yet implemented. Service guards land in Phase 4; UI wiring in Phase 5.

Related: [approval-workflow](approval-workflow.md) · [decommission-service](../components/decommission-service.md) ·
[decommission-routes](../apis/decommission-routes.md).
