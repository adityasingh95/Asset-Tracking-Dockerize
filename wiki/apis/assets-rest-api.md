---
title: "API: Assets REST"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/AssetController.java]
phase: "0-2"
---

# API: Assets REST (`/assets`)

JSON, requires authentication.

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/assets` | — | `[Asset]` (active only) |
| POST | `/assets` | `Asset` JSON | created `Asset` |
| GET | `/assets/{id}` | — | `Asset` or 404 |
| PATCH | `/assets/{id}` | partial map of `name`/`type`/`status` | updated `Asset` |
| DELETE | `/assets/{id}` | — | 204; soft-deletes (second delete path → [ADR-004](../decisions/ADR-004-rest-delete-fate.md)) |

`Asset` JSON: `{id, name, type, status, deleted}`. Component:
[asset-rest-controller](../components/asset-rest-controller.md).
