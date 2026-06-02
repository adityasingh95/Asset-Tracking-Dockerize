---
title: "API: Assets UI Routes"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/AssetUIController.java, src/main/java/com/nesa/interview/assettracking/controller/AuthController.java]
phase: "0-2"
---

# API: UI Routes (Thymeleaf)

| Method | Path | View / Effect |
|---|---|---|
| GET | `/auth/login` | `login.html` |
| GET | `/` | redirect → `/assets-ui` |
| GET | `/assets-ui` | `assets.html` (list + add form) |
| POST | `/assets-ui/add` | save → redirect |
| GET | `/assets-ui/edit/{id}` | `edit-asset.html` |
| GET | `/assets-ui/delete/{id}` | soft-delete → redirect *(to be re-routed Phase 5)* |

Planned (Phase 5): the delete route is replaced by a *Request Decommission* POST flow, and
an approver view is added — see [decommission-routes](decommission-routes.md).
Components: [asset-ui-controller](../components/asset-ui-controller.md) ·
[auth-controller](../components/auth-controller.md).
