---
title: "Data Model: DecommissionRequest"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/model/DecommissionRequest.java, docs/04-data-model-spec.md, artifacts/implementation-notes.md]
phase: 4
---

# Data Model: `DecommissionRequest`

New entity, table `decommission_requests`, created by `ddl-auto=update` on startup
(generated DDL captured in [implementation-notes](../../artifacts/implementation-notes.md)).
Built in Phase 4; covered by tests N-01..N-07.

## Shape (as built — docs/04 §1)
| Field | Type | Notes |
|---|---|---|
| `id` | `Long` | `@Id @GeneratedValue(IDENTITY)` |
| `assetId` | `Long` | plain FK value to `assets.id` (not a JPA association) → [ADR-002](../decisions/ADR-002-association-style.md) |
| `status` | `DecommissionStatus` | `@Enumerated(STRING)`, default `PENDING` |
| `reason` | `String` | `@Column(nullable=false)`; non-empty enforced in service (V-01) |
| `requestedBy` | `String` | `Authentication#getName()` |
| `requestedAt` | `Instant` | server UTC at request time |
| `decidedBy` | `String` | null until decided |
| `decidedAt` | `Instant` | null until decided |
| `decisionComment` | `String` | `@Column(length=1000)` |

`enum DecommissionStatus { PENDING, APPROVED, REJECTED }`

## Audit mapping (FA-08)
who requested→`requestedBy`, when→`requestedAt`, why→`reason`, who decided→`decidedBy`,
when decided→`decidedAt`, outcome→`status`, comment→`decisionComment`.

## Repository finders (planned)
- `boolean existsByAssetIdAndStatus(Long assetId, DecommissionStatus status)` — duplicate guard (V-05).
- `List<DecommissionRequest> findByStatus(DecommissionStatus status)` — approver/pending view.
- `List<DecommissionRequest> findByAssetIdOrderByRequestedAtDesc(Long assetId)` — history (FA-09).

## Guards (service-enforced, V-04/V-05)
A new request is rejected if a `PENDING` request already exists for the asset, or the asset
is already soft-deleted (treated as "not found among active assets").

Related: [approval-workflow feature](../features/approval-workflow.md) ·
[decommission-service component](../components/decommission-service.md) ·
[decommission-routes api](../apis/decommission-routes.md)
