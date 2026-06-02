# Requirements Traceability Matrix

> Every requirement ID from the spec pack mapped to the **evidence** that it is met: the code
> that implements it, the automated test that proves it, the artifact that documents it, and/or
> the live check that demonstrates it. This is the single page a reviewer reads to confirm done.
>
> Verified 2026-06-02. Test suite: **19 tests, 0 failures, 0 errors** (`artifacts/test-run.log`).
> Live regression: **T-01..T-09 all pass** (`artifacts/regression-result.md`).
> Screenshots of the running app: `artifacts/screenshots/`.

## Legend
- **Code** = implementing source file. **Test** = automated test (Cxx/Nxx + method).
- **Live** = manual/scripted check against the running app. **Doc** = artifact section.
- Status: ✅ met.

---

## Success criteria (G-1..G-9) — the engagement-level bar
| ID | Requirement | Evidence | Status |
|---|---|---|---|
| G-1 | Clean clone + `docker compose up --build`; only app port published; Postgres private | Live T-01; `docker-compose.yml` (no db `ports:`); `regression-result.md` | ✅ |
| G-2 | App uses Compose-managed Postgres via env vars (no host install) | `docker-compose.yml` `SPRING_DATASOURCE_*`; app log "HikariPool connected"; Live T-01 | ✅ |
| G-3 | Login, list, add, update/PATCH still work after Docker + change | Live T-02/03/04; Tests C-03/C-04/C-05 | ✅ |
| G-4 | Request creates PENDING, does not soft-delete; empty reason rejected | Tests N-01, N-02; Live T-05; `DecommissionService.request` | ✅ |
| G-5 | Reject leaves asset active; request REJECTED + metadata | Test N-04; Live T-06; `DecommissionService.reject` | ✅ |
| G-6 | Approve performs existing soft-delete; asset gone; request APPROVED + metadata | Test N-03; Live T-07; `DecommissionService.approve` | ✅ |
| G-7 | No second PENDING; none for soft-deleted asset | Tests N-05, N-06; Live T-08 | ✅ |
| G-8 | `docker compose down -v` resets the DB | Live T-09; `regression-result.md` | ✅ |
| G-9 | Six evidence artifacts current + coherent | `artifacts/` (this file + 6) | ✅ |

## Existing behaviour preserved (EB-01..06)
| ID | Behaviour | Evidence | Status |
|---|---|---|---|
| EB-01 | App starts and serves login | Live T-01/T-02; Docker baseline | ✅ |
| EB-02 | `admin` credentials work | Live T-02; `SecurityConfig` / `application.properties` | ✅ |
| EB-03 | Dashboard shows active assets | Live T-03; Test C-04/C-02 | ✅ |
| EB-04 | New assets can be registered | Live T-03; Test C-04 | ✅ |
| EB-05 | Update incl. partial PATCH not regressed | Test C-03; Live T-04; PATCH handler + inline JS untouched | ✅ |
| EB-06 | Decommission uses soft-delete (reused on approval) | Test N-03/C-01; `approve()` → `deleteById` → `@SQLDelete` | ✅ |

## Functional requirements (FA-01..09)
| ID | Requirement | Code | Test / Live | Status |
|---|---|---|---|---|
| FA-01 | Request, not immediate decommission | `DecommissionService.request` | N-01 / T-05 | ✅ |
| FA-02 | Reason required | `request` (V-01 guard) | N-02; `requestEndpoint_blankReason...` / live | ✅ |
| FA-03 | Pending state visible (badge) | `AssetUIController` `pendingAssetIds` + `assets.html` | N-08 / screenshot 02 | ✅ |
| FA-04 | Pending requests view | `DecommissionUIController.pending` + `decommissions.html` | `approverView_loads` / screenshot 03 | ✅ |
| FA-05 | Approve executes soft-delete + APPROVED | `approve()` | N-03 / T-07 | ✅ |
| FA-06 | Reject leaves active + REJECTED | `reject()` | N-04 / T-06 | ✅ |
| FA-07 | No duplicate pending / none for decommissioned | `request` guards | N-05, N-06 / T-08 | ✅ |
| FA-08 | Audit details (who/when/why/decider/outcome/comment) | `DecommissionRequest` fields | N-07 | ✅ |
| FA-09 | History visible incl. approved (soft-deleted) | `decisionHistory()` + `findSummariesIncludingDeleted` | N-07, `decisionHistory_showsApprovedRequest_forSoftDeletedAsset` / screenshot 03 | ✅ |

## UI requirements (UI-01..06)
| ID | Requirement | Evidence | Status |
|---|---|---|---|
| UI-01 | *Delete* → *Request Decommission* | `assets.html`; screenshot 02 | ✅ |
| UI-02 | Capture reason (required input) | `assets.html` reason input; N-02 | ✅ |
| UI-03 | Show pending status (badge/row style) | `assets.html` badge + `row-pending`; N-08; screenshot 02 | ✅ |
| UI-04 | Approver view (asset/requester/reason/date) | `decommissions.html`; screenshot 03 | ✅ |
| UI-05 | Approve/reject with comment | `DecommissionUIController` approve/reject; `decommissions.html` | ✅ |
| UI-06 | Confirmation feedback | flash messages in both templates; live (created/approved/rejected) | ✅ |

## Validation rules (V-01..06)
| ID | Rule | Evidence | Status |
|---|---|---|---|
| V-01 | Reason mandatory; empty creates no request | N-02; `request` blank check | ✅ |
| V-02 | Reject doesn't change visibility/is_deleted | N-04 / T-06 | ✅ |
| V-03 | Approve uses existing soft-delete | N-03; `approve()` → `deleteById` | ✅ |
| V-04 | Soft-deleted asset can't get a new request | N-06 | ✅ |
| V-05 | No duplicate pending | N-05 / T-08 | ✅ |
| V-06 | Decision timestamp + maker recorded (both outcomes) | N-03, N-04 | ✅ |

## Dockerization (DOCK-01..06)
| ID | Requirement | Evidence | Status |
|---|---|---|---|
| DOCK-01 | Java-17 build+runtime image | `Dockerfile` (multi-stage) | ✅ |
| DOCK-02 | Compose with app + db | `docker-compose.yml`; Live T-01 | ✅ |
| DOCK-03 | Postgres private to network | `docker-compose.yml` (no db `ports:`); live `5432` not host-reachable | ✅ |
| DOCK-04 | Datasource via env vars | `SPRING_DATASOURCE_*`; no hardcoded local creds | ✅ |
| DOCK-05 | DB healthcheck + app waits | `db.healthcheck` + `depends_on: service_healthy`; live "db Healthy → app Started" | ✅ |
| DOCK-06 | Documented reset | `down -v`; T-09; `regression-result.md` | ✅ |

## Regression checklist (T-01..T-09)
All pass live in Docker — see `artifacts/regression-result.md` for the full table with actuals.

## Test inventory (C-01..05, N-01..08 + Phase-6 checks)
Full list and green results in `artifacts/test-run.log` and `artifacts/characterization-tests.md`.
Characterization (C) tests passed **before** the change and remained green after (no regressions).

---

## How to reproduce this evidence
```bash
git clone -b claude/jolly-albattani-ZVz7K https://github.com/adityasingh95/Asset-Tracking-Dockerize.git
cd Asset-Tracking-Dockerize
mvn test                    # 19 tests green (Testcontainers Postgres; needs Docker)
docker compose up --build   # then exercise the flow at http://localhost:8080 (admin/admin123)
docker compose down -v      # reset
```

## Evidence index
- `artifacts/repo-map.md` — what the code is.
- `artifacts/as-is-behaviour.md` — verified current behaviour (before).
- `artifacts/characterization-tests.md` — pre-change safety net (C-01..05).
- `artifacts/impact-map.md` — planned change + decisions.
- `artifacts/implementation-notes.md` — design choices, generated DDL, what was NOT changed.
- `artifacts/regression-result.md` — T-01..T-09, before/after demo, G-1..G-9, limitations.
- `artifacts/requirements-traceability.md` — **this file** (requirement → evidence map).
- `artifacts/test-run.log` — captured green test run.
- `artifacts/screenshots/` — the running app (login, dashboard+badge, approver+history).
- `wiki/` — living knowledge base (overview, ADRs, components) with per-phase log + code-drift lint.
- Git history — one concern per commit, each tied to phase/requirement IDs.
