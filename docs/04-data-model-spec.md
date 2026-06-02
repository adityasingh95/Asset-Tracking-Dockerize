# 04 — Data Model Specification

Finalize after Phase 0 archaeology, but this is the intended shape. The guiding principle: **add one new entity; change the `Asset` entity as little as possible.**

## 1. New entity: `DecommissionRequest`

Suggested JPA mapping (package `com.nesa.interview.assettracking.model`):

```java
@Entity @Table(name = "decommission_requests") @Data
public class DecommissionRequest {
    @Id @GeneratedValue(strategy = IDENTITY) private Long id;

    private Long assetId;            // FK to assets.id (see §3 on association style)

    @Enumerated(EnumType.STRING)
    private DecommissionStatus status = DecommissionStatus.PENDING;

    @Column(nullable = false) private String reason;

    private String requestedBy;                 // Authentication#getName()
    private Instant requestedAt;

    private String decidedBy;                   // null until decided
    private Instant decidedAt;                  // null until decided
    @Column(length = 1000) private String decisionComment;
}

public enum DecommissionStatus { PENDING, APPROVED, REJECTED }
```

### Field mapping to FA‑08 (audit)

| FA‑08 element | Field |
|---|---|
| who requested | `requestedBy` |
| when requested | `requestedAt` |
| why | `reason` |
| who decided | `decidedBy` |
| when decided | `decidedAt` |
| outcome | `status` |
| decision comment | `decisionComment` |

## 2. `Asset` entity — what changes
**Nothing structural is required.** Do not add a pending flag column and do not overload `status`. "Pending" is **derived** (next section). If archaeology shows a compelling reason to add a lifecycle column, propose it in `impact-map.md` first — default is no change to `Asset`.

## 3. Association style — pick one, record it
- **Option A (recommended): store `assetId` as a plain `Long`.** Lowest blast radius; avoids interaction between a new `@ManyToOne Asset` and the `@SQLRestriction` filter (a soft‑deleted asset would otherwise become unfetchable through the association, which matters for history of approved requests).
- Option B: `@ManyToOne Asset asset`. Cleaner JPA, but be deliberate about how `@SQLRestriction` hides approved assets when displaying request history.

Whichever is chosen, **approved requests must remain viewable even though their asset is now soft‑deleted** (FA‑09). Option A makes this trivial; Option B needs care. Document the choice and its handling of soft‑deleted assets in `implementation-notes.md`.

## 4. Deriving "pending"
- An asset is *pending decommission* iff a `DecommissionRequest` with `status = PENDING` exists for its id.
- Repository support, e.g.:
  ```java
  boolean existsByAssetIdAndStatus(Long assetId, DecommissionStatus status);
  List<DecommissionRequest> findByStatus(DecommissionStatus status);   // for the approver view (PENDING)
  List<DecommissionRequest> findByAssetIdOrderByRequestedAtDesc(Long assetId); // history
  ```
- The dashboard computes the badge by checking pending requests for the listed assets (a single `findByStatus(PENDING)` → set of asset ids is cheaper than N queries).

## 5. Duplicate / state guards (V‑04, V‑05)
Before creating a request, the service must reject if:
- a `PENDING` request already exists for the asset (`existsByAssetIdAndStatus(id, PENDING)`), or
- the asset is already soft‑deleted. Note `@SQLRestriction` means a soft‑deleted asset won't be found by a normal `findById`; treat "asset not found among active assets" as "cannot request" for the UI path.

## 6. Schema generation
`ddl-auto=update` will create `decommission_requests` on startup. Acceptable for the study. In `implementation-notes.md`, paste the resulting `CREATE TABLE` (from Hibernate's logged DDL or `\d decommission_requests`) so the schema is documented. Flyway/Liquibase is **optional** and only if time allows (`CLAUDE.md` §9).

## 7. Timestamps
Use `Instant` (UTC) for `requestedAt`/`decidedAt`. Set on the server at request/decision time. Do not rely on client clocks.
