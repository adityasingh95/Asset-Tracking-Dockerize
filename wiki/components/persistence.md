---
title: "Component: Persistence (JPA)"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/repository/AssetRepository.java, src/main/resources/application.properties]
phase: "0-2"
---

# Component: Persistence (JPA / PostgreSQL)

- **`AssetRepository extends JpaRepository<Asset, Long>`** — no custom methods today.
  `deleteById` triggers the entity's `@SQLDelete` soft-delete.
- Schema via `spring.jpa.hibernate.ddl-auto=update` (auto-creates tables; acceptable for the study).
- Datasource is local-dev default in `application.properties`, overridden by
  `SPRING_DATASOURCE_*` env vars in Docker.

## DecommissionRequestRepository (Phase 4 — built)
`DecommissionRequestRepository extends JpaRepository<DecommissionRequest, Long>` with
`existsByAssetIdAndStatus` (V-05 duplicate guard), `findByStatus` (approver view, FA-04),
`findByAssetIdOrderByRequestedAtDesc` (history, FA-09). See
[decommission-request data model](../data-models/decommission-request.md).

Related: [asset data model](../data-models/asset.md).
