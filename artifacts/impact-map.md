# impact-map.md  (Phase 3)

> Exactly what the change touches. Written BEFORE any business code. Each file has a
> one-line reason. Open decisions are resolved at the bottom.

## Guiding principle
Smallest change that satisfies the spec: **add new classes/templates; edit as few existing
files as possible.** All new logic lives in a `DecommissionService`; existing controllers gain
only thin wiring. No change to the `Asset` entity (pending is derived — ADR-003).

## New files
| File | Purpose | Spec |
|---|---|---|
| `model/DecommissionRequest.java` | Request entity: `id, assetId(Long), status, reason, requestedBy, requestedAt, decidedBy, decidedAt, decisionComment` | docs/04 §1; FA-08 |
| `model/DecommissionStatus.java` | Enum `PENDING, APPROVED, REJECTED` | docs/04 §1 |
| `repository/DecommissionRequestRepository.java` | `existsByAssetIdAndStatus`, `findByStatus`, `findByAssetIdOrderByRequestedAtDesc` | docs/04 §4; V-05; FA-04/09 |
| `service/DecommissionService.java` | `request/approve/reject` with all guards; reuses soft-delete on approve | FA-01/02/05/06/07; V-01..V-06 |
| `controller/DecommissionUIController.java` | UI endpoints: create request, approver list, approve, reject, history | FA-04/05/06/09; UI-04/05 |
| `templates/decommissions.html` | Approver view: pending list + approve/reject forms (+comment); recent history | UI-04/05/06; FA-09 |

> Decision-capture for the *request* action (UI-02) is added inline to the existing
> `assets.html` (a small reason input per row), so no separate request page/template is needed.

## Edited files
| File | Edit | Why / Spec |
|---|---|---|
| `templates/assets.html` | Replace the *Delete* anchor with a *Request Decommission* control + required reason input (per row); show a **pending badge** on rows with an open request; add success/flash message area | UI-01/02/03/06; FA-03 |
| `controller/AssetUIController.java` | Inject `DecommissionService`; on `GET /assets-ui` pass the set of pending asset-ids (for the badge); **remove/neutralize** `GET /assets-ui/delete/{id}` so the UI no longer soft-deletes directly (route the new POST request flow instead) | FA-01/03; UI-01 |
| `controller/AssetController.java` | Gate/neutralize REST `DELETE /assets/{id}` so it cannot bypass approval (see decision) | CLAUDE.md §5; FA-07 |
| `pom.xml` | (already done in Phase 2) test deps — no further runtime deps needed | — |

> Note: the dashboard model already exposes `assets`; we add a `pendingAssetIds` attribute and
> (optionally) a `requests`/flash attribute. The inline PATCH edit JS is **not touched** (EB-05).

## Test files (Phase 4/5)
| File | Covers |
|---|---|
| `DecommissionServiceTest` (or `@SpringBootTest`) | N-01..N-07 (request/reject/approve/duplicate/soft-deleted/audit-history) |
| extend `AssetEndpointCharacterizationTest` or new UI test | N-08 (dashboard pending badge) |

## Decisions (resolved)
- **Association style → plain `Long assetId`.** Avoids `@SQLRestriction` making an approved
  (soft-deleted) asset unfetchable through a `@ManyToOne`, which would break approved-request
  history (FA-09). → [ADR-002].
- **Pending-badge computation → one query.** `findByStatus(PENDING)` → collect `assetId`s into a
  `Set<Long>`; the template marks a row if its id is in the set. Single query for the whole list
  (not N). → [ADR-003].
- **REST `DELETE /assets/{id}` fate → NEUTRALIZE the ungated path (finalize [ADR-004]).**
  The UI never used it (as-is archaeology). Leaving it would be a second, **un-audited** path to
  soft-delete that bypasses approval — explicitly disallowed by CLAUDE.md §5 and contrary to
  FA-07's intent. **Decision:** make `DELETE /assets/{id}` no longer perform a soft-delete —
  return `405 Method Not Allowed` (or `409`/redirect into the request flow) with a short message
  pointing at the decommission-request flow. We do **not** physically remove the endpoint
  (minimal-diff; avoids breaking any external caller's URL contract), but it stops being a
  soft-delete bypass. Recorded in [ADR-004] and `implementation-notes.md` when coded.

## Behaviours touched / at risk (regression watch)
- **EB-05 (PATCH inline edit)** — must NOT regress; we don't touch the PATCH handler or its JS. (C-03)
- **EB-03 (dashboard lists active assets)** — we add a badge attribute; list query unchanged. (C-04/C-02)
- **EB-06 (soft-delete semantics)** — approval must call `deleteById` (reuse), not a new query. (C-01)
- **EB-01/02 (startup/login)** — unaffected; no security/config change. (C-05)
- **The two delete paths** — UI delete route retired in favor of the request flow; REST DELETE
  neutralized. After this, there is **no** ungated soft-delete path.
