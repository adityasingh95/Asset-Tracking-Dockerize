---
title: "ADR-002: Store assetId as a plain Long (not a JPA association)"
status: current
last_updated: 2026-06-02
sources: [docs/04-data-model-spec.md]
phase: "0"
---

# ADR-002: Association style — plain `Long assetId`

**Context.** `DecommissionRequest` must reference an asset, and history of *approved*
requests must remain viewable even though the asset is then soft-deleted (FA-09).

**Options.** (A) Store `assetId` as a plain `Long`. (B) `@ManyToOne Asset asset`.

**Decision.** (A). Lowest blast radius and avoids `@SQLRestriction` making a soft-deleted
asset unfetchable through the association (which would break approved-request history).

**Consequences.** History survives approval trivially. The dashboard computes the pending
badge from a single `findByStatus(PENDING)` → set of asset ids. To show an asset's name/type
on history of an approved (now hidden) asset, fetch deliberately (e.g. a native/unrestricted
query) if needed. Confirmed default; revisit only if a compelling reason appears (record here).
Affects [decommission-request model](../data-models/decommission-request.md).
