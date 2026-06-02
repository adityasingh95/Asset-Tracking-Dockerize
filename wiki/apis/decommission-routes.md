---
title: "API: Decommission Routes"
status: current
last_updated: 2026-06-02
sources: [docs/03-change-spec.md, docs/08-backlog.md]
phase: 5
---

# API: Decommission Routes

Routes as built (Phase 5):

| Method | Path (proposed) | Effect |
|---|---|---|
| POST | `/assets-ui/{assetId}/request-decommission` | create PENDING request (+`reason`); guards V-01/04/05 |
| GET | `/assets-ui/decommissions` | approver view: list PENDING requests + asset details |
| POST | `/assets-ui/decommissions/{requestId}/approve` | approve → soft-delete asset + APPROVED (+optional `comment`) |
| POST | `/assets-ui/decommissions/{requestId}/reject` | reject → REJECTED, asset untouched (+`comment`) |

The approver view also renders a **Decision history** table (APPROVED/REJECTED), with asset
names resolved including soft-deleted assets (FA-09).


CSRF is disabled, so these POST forms need no token. Component:
[decommission-service](../components/decommission-service.md) · [decommission-ui-controller](../components/decommission-ui-controller.md). Features:
[request-decommission](../features/request-decommission.md) · [approval-workflow](../features/approval-workflow.md).
