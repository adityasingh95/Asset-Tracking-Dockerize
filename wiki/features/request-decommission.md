---
title: "Feature: Request Decommission"
status: current
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/01-overview-and-goals.md]
phase: 5
---

# Feature: Request Decommission

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
**Implemented (Phase 4 service + Phase 5 UI).** Live-verified: request→pending badge, blank reason rejected, duplicate blocked, approver view, approve→soft-delete, old UI delete route retired (404). Tests N-01..N-08 green.

Related: [approval-workflow](approval-workflow.md) · [decommission-service](../components/decommission-service.md) ·
[decommission-routes](../apis/decommission-routes.md).
