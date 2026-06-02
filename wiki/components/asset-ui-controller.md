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
| GET | `/assets-ui/delete/{id}` | **Soft-delete now; to be re-routed to the request flow (Phase 5).** |

Depends on [persistence](persistence.md) (`AssetRepository`). The delete control in
`assets.html` is a GET anchor with a `confirm()` dialog. In Phase 5 this becomes
*Request Decommission* (reason input) routed to the new flow rather than `deleteById`.

Related: [asset-crud feature](../features/asset-crud.md) · [assets-ui-routes](../apis/assets-ui-routes.md).
