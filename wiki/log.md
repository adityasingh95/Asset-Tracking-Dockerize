# Wiki Operation Log

Append-only. Greppable: `grep "^## \[" wiki/log.md | tail -10`.

## [2026-06-02] init | Bootstrapped Dev Wiki (schema + structure) per devwiki.md, approved by user.
Created WIKI_SCHEMA.md, index.md, log.md, overview.md, glossary.md, onboarding.md.

## [2026-06-02] ingest | Phase 0 (archaeology/baseline) — docs/02, artifacts/repo-map.md, artifacts/as-is-behaviour.md.
Created data-models/asset, components/{asset-ui-controller, asset-rest-controller, auth-controller,
security-config, persistence}, apis/{assets-rest-api, assets-ui-routes}, features/{asset-crud,
authentication}. ADR-007 (reconstructed baseline). Recorded the two-delete-paths fact.

## [2026-06-02] ingest | Phase 1 (dockerize) — Dockerfile, docker-compose.yml, docs/05, artifacts/regression-result.md.
Created features/dockerized-runtime, components/docker-compose-stack, ADR-006. Noted sandbox CA workaround.

## [2026-06-02] ingest | Phase 2 (characterization) — src/test/*, docs/06, artifacts/characterization-tests.md.
Created ADR-005 (Testcontainers). Marked as-is behaviours verified by C-01..C-05. Seeded planned
pages for the upcoming change: features/{request-decommission, approval-workflow},
components/decommission-service, data-models/decommission-request, apis/decommission-routes,
ADR-001/002/003 (decided design), ADR-004 (proposed, fate of REST DELETE — finalize Phase 3).

## [2026-06-02] lint | Bootstrap code-drift check.
Verified wiki claims against code: Asset fields & @SQLDelete/@SQLRestriction (match), endpoint
tables for AssetController/AssetUIController/AuthController (match), SecurityConfig rules (match),
Dockerfile/compose topology (match). No drift. Planned pages correctly flagged not-yet-built.

## [2026-06-02] ingest | Phase 3 (impact map) — artifacts/impact-map.md.
Finalized ADR-004: neutralize REST DELETE /assets/{id} (405), retire UI delete route — no ungated
soft-delete path remains. Confirmed ADR-002 (plain Long assetId) and ADR-003 (pending badge via one
findByStatus(PENDING) query). Listed exact new files (DecommissionRequest, DecommissionStatus,
repository, service, DecommissionUIController, decommissions.html) and edits (assets.html,
AssetUIController, AssetController). Updated index + overview phase tracker.

## [2026-06-02] lint | Phase 3 code-drift check.
No new code yet (impact map only). Planned pages still correctly flagged planned; ADR-004 moved
proposed→current with the recorded decision. Links clean.

## [2026-06-02] ingest | Phase 4 (data & service) — DecommissionRequest, DecommissionStatus, repository, DecommissionService, artifacts/implementation-notes.md.
Flipped decommission-request (data model) and decommission-service (component) planned→current.
Updated persistence (repository built), index, overview tracker. Captured generated DDL for
decommission_requests in implementation-notes. Asset entity unchanged.

## [2026-06-02] lint | Phase 4 code-drift check.
Verified: entity fields ↔ DecommissionRequest.java (id, assetId, status, reason, requestedBy/At,
decidedBy/At, decisionComment) — match. Service API ↔ DecommissionService.java (request/approve/
reject/pendingRequests/historyForAsset) — match. Repository finders ↔ code — match. Generated DDL
matches the entity. Tests: 13 green (C-01..05, N-01..07). features/{request-decommission,
approval-workflow} correctly still 'planned' (UI not wired). Links clean.

## [2026-06-02] ingest | Phase 5 (UI wiring) — DecommissionUIController, decommissions.html, assets.html, AssetUIController.
Added approver UI + dashboard request control + pending badge + flash messages. Removed the old
GET /assets-ui/delete/{id} route (now 404). New component page decommission-ui-controller; flipped
features/{request-decommission, approval-workflow}, apis/decommission-routes planned→current with
real paths. Updated asset-ui-controller, assets-ui-routes, index, overview.

## [2026-06-02] lint | Phase 5 code-drift + live check.
Routes ↔ DecommissionUIController.java (request/approve/reject/list) — match. Templates render under
MockMvc (n08 + approverView). Live smoke (jar+postgres): request→302+badge, blank reason rejected,
duplicate blocked with flash, approver view lists reason, approve→asset soft-deleted, old delete
route → 404. Tests: 17 green (C-01..05, N-01..08). Links clean.

## [2026-06-02] ingest | Phase 6 (history & loose ends) — AssetController, AssetRepository, DecommissionService, decommissions.html, artifacts/implementation-notes.md.
Neutralized REST DELETE /assets/{id} → 405 (ADR-004 fully realized; no ungated soft-delete path
remains). Added decision-history table to the approver view; asset names for approved/soft-deleted
assets resolved via native findSummariesIncludingDeleted (bypasses @SQLRestriction). Updated
asset-rest-controller, assets-rest-api, decommission-routes pages + overview tracker.

## [2026-06-02] lint | Phase 6 code-drift check.
DELETE handler ↔ AssetController.java returns 405 (no repo call) — match. History finder + native
summary query ↔ code — match. Tests: 19 green (C-01..05, N-01..08, REST-405, history-FA09). Links clean.

## [2026-06-02] ingest | Phase 7 (regression & write-up) — artifacts/regression-result.md.
Ran T-01..T-09 live against the committed docker compose up --build: all pass. Recorded before/after
demo and G-1..G-9 (all met). Finalized regression-result + all six artifacts. Overview marked
engagement complete.

## [2026-06-02] lint | Phase 7 final code-drift check.
Full sweep below — all wiki claims reconciled against code; no drift. Engagement coherent.
Sweep result: all checks OK. (One scripted check string-matched the explanatory comment in
AssetUIController and looked like drift; manually + live confirmed there is NO delete @GetMapping —
the route is removed and returns 404. No real drift.)

## [2026-06-02] ingest | Evidence package — requirements-traceability.md, test-run.log, screenshots/.
Added a requirement→evidence matrix covering G-1..9, EB, FA, V, UI, DOCK, T, C/N IDs (all ✅),
a captured green test run (19/19), and screenshots of the live app (login, dashboard+badge,
approver+history). Reproduction steps included.
