---
title: "Component: DecommissionUIController"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/DecommissionUIController.java]
phase: 5
---

# Component: `DecommissionUIController`

Thin `@Controller` wiring the dashboard + approver UI to [decommission-service](decommission-service.md).
Identity comes from the Spring Security `Authentication`; CSRF is disabled so POST forms need no token.

| Method | Path | Effect |
|---|---|---|
| POST | `/assets-ui/{assetId}/request-decommission` | `service.request(...)`; flash success/error; redirect `/assets-ui` |
| GET | `/assets-ui/decommissions` | render `decommissions.html`: pending list + `assetsById` map |
| POST | `/assets-ui/decommissions/{requestId}/approve` | `service.approve(...)`; flash; redirect to approver view |
| POST | `/assets-ui/decommissions/{requestId}/reject` | `service.reject(...)`; flash; redirect to approver view |

Guard violations (`IllegalArgumentException`) become error flash messages (UI-06). Templates:
`assets.html` (request control + pending badge), `decommissions.html` (approver view). APIs:
[decommission-routes](../apis/decommission-routes.md).
