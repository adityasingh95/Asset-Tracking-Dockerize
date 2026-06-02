# implementation-notes.md  (Phase 4-6)

## Key design choices
- **Reuse of soft-delete on approval (how exactly).** `DecommissionService.approve(...)` marks
  the request `APPROVED` (+ `decidedBy`/`decidedAt`/`decisionComment`), then calls
  `assetRepository.deleteById(req.getAssetId())`. Spring Data's `deleteById` loads the (active)
  asset and issues a delete, which the entity's `@SQLDelete` rewrites to
  `UPDATE assets SET is_deleted = true WHERE id = ?`. **No new delete query, no physical
  deletion** (ADR-001 / FA-05 / EB-06). Verified by N-03.
- **Association style + soft-deleted assets in history.** `DecommissionRequest.assetId` is a plain
  `Long`, not a `@ManyToOne Asset` (ADR-002). A `@ManyToOne` would be hidden by the asset's
  `@SQLRestriction` once approved (soft-deleted), breaking history. With a plain `Long`, the
  request row and its full audit trail survive approval. Verified by N-07.
- **Pending derivation.** No flag is stored on `Asset`. "Pending" is derived from the existence of
  a `DecommissionRequest` with `status = PENDING` for the asset id
  (`existsByAssetIdAndStatus`), and the dashboard badge (Phase 5) uses one
  `findByStatus(PENDING)` → set of asset ids (ADR-003).
- **Guards.** `request(...)` enforces V-01 (blank/whitespace reason rejected, no row created —
  N-02), V-04 (no request for a non-active/soft-deleted asset; `@SQLRestriction` makes a
  soft-deleted asset absent from `findById` — N-06), V-05 (no duplicate PENDING — N-05).
  Decisions are only allowed on a PENDING request (`loadPending` guards re-decision).
- **Identity capture.** `requestedBy`/`decidedBy` are stored as the principal name string; the
  controllers (Phase 5) will pass `Authentication#getName()`. No user table (out of scope).
- **Error signalling.** Guard violations throw `IllegalArgumentException` with a human-readable
  message; the UI layer (Phase 5) will surface these as flash messages. No custom exception type
  was added (kept minimal).
- **Timestamps.** `Instant` (UTC), set server-side at request/decision time (docs/04 §7).

## Generated schema (`ddl-auto=update`, captured from a live run against postgres:16)
```sql
CREATE TABLE public.decommission_requests (
    id bigint NOT NULL,
    asset_id bigint,
    decided_at timestamp(6) with time zone,
    decided_by character varying(255),
    decision_comment character varying(1000),
    reason character varying(255) NOT NULL,
    requested_at timestamp(6) with time zone,
    requested_by character varying(255),
    status character varying(255),
    CONSTRAINT decommission_requests_status_check
        CHECK (((status)::text = ANY ((ARRAY['PENDING','APPROVED','REJECTED'])::text[])))
);
-- IDENTITY mapping -> sequence-backed default:
CREATE SEQUENCE public.decommission_requests_id_seq START WITH 1 INCREMENT BY 1
    NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.decommission_requests_id_seq OWNED BY public.decommission_requests.id;
ALTER TABLE ONLY public.decommission_requests
    ALTER COLUMN id SET DEFAULT nextval('public.decommission_requests_id_seq'::regclass);
ALTER TABLE ONLY public.decommission_requests
    ADD CONSTRAINT decommission_requests_pkey PRIMARY KEY (id);
```
Notes: `status` stored as `varchar` with a `CHECK` constraint (from `@Enumerated(STRING)`);
`reason` is `NOT NULL`; `decision_comment` is `varchar(1000)`; timestamps are
`timestamp with time zone` (from `Instant`). The `assets` table is **unchanged** (no structural
change to `Asset`).

## Deliberately NOT changed
- `Asset` entity structure (no pending flag column; `status` not repurposed).
- Package layout, class names, formatting of untouched files.
- Spring Boot / dependency **versions** (only test-scoped deps were added in Phase 2).
- CSRF setting (`csrf.disable()` left as-is).
- The inline PATCH edit JS / `PATCH /assets/{id}` handler.

## Known limitations (by design / scope)
- Single in-memory user, no RBAC → approver = any authenticated user (self-approval possible).
- CSRF disabled (pre-existing); new POST forms (Phase 5) rely on this.
- Schema via `ddl-auto=update` (no Flyway/Liquibase migration tool — optional, not added).

## Phase 6 (done)
- **REST `DELETE /assets/{id}` neutralized → 405** (ADR-004). The handler no longer touches the
  repository; it returns `405 Method Not Allowed` with a message pointing at the request flow.
  The endpoint is kept (URL contract) but is no longer a soft-delete bypass. Verified by test
  `restDelete_isDisabled_returns405_andDoesNotSoftDelete`. (The UI `GET /assets-ui/delete/{id}`
  route was already removed in Phase 5.) Net: **no ungated path to soft-delete remains.**
- **History surfaced (FA-09).** The approver view (`/assets-ui/decommissions`) now shows a
  "Decision history" table of APPROVED/REJECTED requests. Asset name/type for approved (now
  soft-deleted) assets is resolved via `AssetRepository.findSummariesIncludingDeleted` — a
  **native** query that bypasses `@SQLRestriction` (an entity-level filter not applied to native
  SQL), so retired assets remain visible in history. Verified by
  `decisionHistory_showsApprovedRequest_forSoftDeletedAsset`. No new column on `Asset`.
