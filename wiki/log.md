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
