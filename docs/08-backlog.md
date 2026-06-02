# 08 — Phased Backlog (gated build order)

Execute in order. **Stop at each gate (🚦) for human approval.** Each story notes the spec it satisfies and its "done when".

---
## Phase 0 — Archaeology & baseline doc (no code)
- **0.1** Produce `artifacts/repo-map.md` from the real tree (use `docs/templates/repo-map.md`). Include every controller, endpoint, entity, repository, template, config file.
- **0.2** Verify `docs/02-repo-baseline.md` against the source; start `artifacts/as-is-behaviour.md`, correcting anything inaccurate. Pay special attention to: the Delete control markup in `assets.html`, the inline PATCH JS, and whether REST `DELETE /assets/{id}` is referenced anywhere.
- **0.3** List archaeology questions you can't answer from code.

**Done when:** repo‑map matches reality; open questions captured. **No Docker, no business code yet.**
🚦 **Gate 0 — human approval.**

---
## Phase 1 — Dockerize & establish runnable baseline
- **1.1** Add `Dockerfile`, `docker-compose.yml`, `.dockerignore` per `docs/05`. (DOCK‑01..06)
- **1.2** `docker compose up --build`; confirm app reachable at `/auth/login`, DB private, login works, dashboard lists assets.
- **1.3** Confirm `docker compose down -v` resets the DB.
- **1.4** Record startup/reset steps and smoke results in `artifacts/regression-result.md` (baseline section).

**Done when:** EB‑01..EB‑04 demonstrably work in containers; T‑01, T‑02, T‑09 pass; no host Postgres needed. **No business logic changed.**
🚦 **Gate 1 — human approval.**

---
## Phase 2 — Characterize current behaviour
- **2.1** Create `src/test` and write C‑01..C‑05 (`docs/06` §2). Decide test DB strategy (Testcontainers preferred) and record it.
- **2.2** All characterization tests green against **unchanged** logic.
- **2.3** Fill `artifacts/characterization-tests.md`; finalize `as-is-behaviour.md`.

**Done when:** C‑01..C‑05 pass on current code; documented. This is the safety net for everything that follows.
🚦 **Gate 2 — human approval.**

---
## Phase 3 — Impact map (plan the change, no business code)
- **3.1** Produce `artifacts/impact-map.md`: exact new files (`DecommissionRequest`, `DecommissionStatus`, repository, service, controller/templates) and exact edits to existing files (which template, which controller method).
- **3.2** Decide and record: association style (`docs/04` §3); the fate of REST `DELETE /assets/{id}` (gate vs leave + label); how the pending badge is computed.

**Done when:** every file to be created/edited is listed with a one‑line reason; open decisions resolved.
🚦 **Gate 3 — human approval.**

---
## Phase 4 — Data & service layer
- **4.1** Add `DecommissionRequest` entity + `DecommissionStatus` enum (`docs/04`). Confirm `ddl-auto=update` creates the table; paste the DDL into `implementation-notes.md`.
- **4.2** Add repository methods (`existsByAssetIdAndStatus`, `findByStatus`, history finder).
- **4.3** Add a `DecommissionService` with: `request(assetId, reason, requester)` (guards V‑01/04/05), `approve(requestId, approver, comment)` (reuses soft‑delete, FA‑05), `reject(requestId, approver, comment)` (FA‑06).
- **4.4** Write N‑01..N‑07 service/repo tests; green.

**Done when:** service enforces FA‑01/02/05/06/07/08 and V‑01..V‑06; new tests pass; characterization tests still green.
🚦 **Gate 4 — human approval.**

---
## Phase 5 — UI wiring
- **5.1** Change the dashboard Delete control to **Request Decommission** with a required reason input (UI‑01/02). Route it to the new request flow instead of `GET /assets-ui/delete/{id}`.
- **5.2** Show a pending badge on assets with an open request (UI‑03, FA‑03).
- **5.3** Add an approver view listing pending requests with asset/requester/reason/date and approve/reject actions + comment (UI‑04/05). New POST forms need no CSRF token (CSRF disabled).
- **5.4** Add confirmation messages (UI‑06). Add N‑08 (dashboard badge) coverage.

**Done when:** UI‑01..UI‑06 satisfied using existing Thymeleaf/styling; no redesign; PATCH inline edit still works.
🚦 **Gate 5 — human approval.**

---
## Phase 6 — History & loose ends
- **6.1** Surface request/decision history (FA‑09), including for approved (now soft‑deleted) assets.
- **6.2** Resolve the REST `DELETE /assets/{id}` decision from Phase 3 in code; document it.

**Done when:** FA‑09 visible; second delete path handled and documented.
🚦 **Gate 6 — human approval.**

---
## Phase 7 — Regression & write‑up
- **7.1** Run the full T‑01..T‑09 checklist; capture pass/fail in `artifacts/regression-result.md`.
- **7.2** Record a before/after demo: same "delete an asset" scenario showing old (immediate soft‑delete) vs new (request → approve/reject).
- **7.3** Finalize all six artifacts; list known limitations (single‑user/no RBAC, CSRF disabled, ddl‑auto schema).

**Done when:** G‑1..G‑9 met; all tests green; artifacts complete and coherent.
🚦 **Gate 7 — final review.**
