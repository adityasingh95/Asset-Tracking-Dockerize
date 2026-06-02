---
title: "Feature: Asset CRUD"
status: current
last_updated: 2026-06-02
sources: [artifacts/as-is-behaviour.md, artifacts/repo-map.md]
phase: "0-2"
---

# Feature: Asset CRUD

The pre-existing capability: register, list, view, and update assets. **Must not regress**
through the decommission change (EB-03/04/05).

- **List active assets** — dashboard `GET /assets-ui` and REST `GET /assets` call `findAll()`;
  `@SQLRestriction` filters out soft-deleted assets. (C-02)
- **Add asset** — dashboard form `POST /assets-ui/add` (or REST `POST /assets`) → `save`. (C-04)
- **View** — `GET /assets/{id}` (JSON) / `GET /assets-ui/edit/{id}` (page).
- **Update (partial)** — inline edit on the dashboard issues `PATCH /assets/{id}` with a JSON
  map; only provided keys (`name`/`type`/`status`) change. (C-03) **Regression-critical.**
- **Delete (current)** — `GET /assets-ui/delete/{id}` → `deleteById` → soft-delete. This is the
  control being replaced by [request-decommission](request-decommission.md).

Components: [asset-ui-controller](../components/asset-ui-controller.md) ·
[asset-rest-controller](../components/asset-rest-controller.md).
APIs: [assets-rest-api](../apis/assets-rest-api.md) · [assets-ui-routes](../apis/assets-ui-routes.md).
