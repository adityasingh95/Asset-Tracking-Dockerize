---
title: "API: Decommission Routes (planned)"
status: planned
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/08-backlog.md]
phase: 5
---

# API: Decommission Routes (planned — Phase 5)

Exact paths to be finalized when built. Intended surface:

| Method | Path (proposed) | Effect |
|---|---|---|
| POST | `/assets-ui/{id}/decommission-request` | create PENDING request (+reason); guards V-01/04/05 |
| GET | `/decommissions` (or `/assets-ui/decommissions`) | approver view: list PENDING requests |
| POST | `/decommissions/{requestId}/approve` | approve → soft-delete asset + APPROVED |
| POST | `/decommissions/{requestId}/reject` | reject → REJECTED, asset untouched |
| GET | history surface | recent decisions / per-asset history (FA-09) |

CSRF is disabled, so these POST forms need no token. Component:
[decommission-service](../components/decommission-service.md). Features:
[request-decommission](../features/request-decommission.md) · [approval-workflow](../features/approval-workflow.md).
