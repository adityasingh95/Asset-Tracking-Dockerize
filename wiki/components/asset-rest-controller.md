---
title: "Component: AssetController (REST)"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/AssetController.java]
phase: "0-2"
---

# Component: `AssetController` (`/assets`, `@RestController`)

JSON API over `AssetRepository`.

| Method | Path | Behaviour |
|---|---|---|
| GET | `/assets` | `findAll` (active only). |
| POST | `/assets` | Create from JSON body. |
| GET | `/assets/{id}` | Fetch by id (404 if absent/soft-deleted). |
| PATCH | `/assets/{id}` | **Partial update** of `name`/`type`/`status` from a JSON map. Drives dashboard inline edit. Regression-critical (C-03). |
| DELETE | `/assets/{id}` | **Neutralized (Phase 6): returns 405**, no longer soft-deletes (ADR-004). Kept for URL contract. |

Depends on [persistence](persistence.md). Related: [assets-rest-api](../apis/assets-rest-api.md) ·
[asset-crud feature](../features/asset-crud.md).
