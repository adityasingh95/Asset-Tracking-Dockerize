---
title: "Component: AssetUIController"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/AssetUIController.java]
phase: "0-2"
---

# Component: `AssetUIController` (`/assets-ui`)

Server-rendered Thymeleaf dashboard. **Primary target of the change.**

| Method | Path | Behaviour |
|---|---|---|
| GET | `/assets-ui` | List active assets + add form (`assets.html`). |
| POST | `/assets-ui/add` | Save new asset → redirect. |
| GET | `/assets-ui/edit/{id}` | Edit page (`edit-asset.html`). |

> **Phase 5:** the old `GET /assets-ui/delete/{id}` soft-delete route has been **removed**
> (now returns 404). Deletion goes through the decommission-approval flow
> ([decommission-ui-controller](decommission-ui-controller.md)). `listAssets` now also injects
> `pendingAssetIds` (from `DecommissionService.pendingRequests()`) for the dashboard badge (FA-03).

Depends on [persistence](persistence.md) (`AssetRepository`) and
[decommission-service](decommission-service.md). In `assets.html` the per-row control is now
*Request Decommission* (with a required reason input) or a **Pending decommission** badge.

Related: [asset-crud feature](../features/asset-crud.md) · [assets-ui-routes](../apis/assets-ui-routes.md).
