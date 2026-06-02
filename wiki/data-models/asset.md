---
title: "Data Model: Asset"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/model/Asset.java, docs/02-repo-baseline.md]
phase: "0-2"
---

# Data Model: `Asset`

Table `assets`. The core entity; the change touches it as little as possible
(ideally not at all structurally — see [ADR-003](../decisions/ADR-003-derive-pending-state.md)).

| Field | Column | Notes |
|---|---|---|
| `id` | `id` | `@Id @GeneratedValue(IDENTITY)` |
| `name` | `name` | free text |
| `type` | `type` | free text |
| `status` | `status` | **free-text, UI-facing. Do NOT repurpose as a pending flag** (CLAUDE.md §8). |
| `isDeleted` | `is_deleted` | boolean, default `false`; the soft-delete flag |

## Soft-delete mechanism (the reuse point)
```java
@SQLDelete(sql = "UPDATE assets SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
```
- Any `delete`/`deleteById` is rewritten to set `is_deleted = true` — nothing is physically removed.
- Every read is silently filtered to `is_deleted = false`, so deleted assets vanish from
  lists and `findById`.
- Verified by characterization tests C-01 (hides-not-removes) and C-02 (findById filtered).
- On **approval**, the new workflow calls `deleteById` to trigger exactly this.
  → [ADR-001](../decisions/ADR-001-reuse-soft-delete.md)

## Consequence for the new feature
Because `@SQLRestriction` hides soft-deleted assets, a once-approved asset becomes
unfetchable through `Asset` finders. This is why the request entity stores `assetId` as a
plain `Long` rather than a `@ManyToOne Asset`, so request history survives approval.
→ [ADR-002](../decisions/ADR-002-association-style.md)

Related: [persistence component](../components/persistence.md) · [assets-rest-api](../apis/assets-rest-api.md)
