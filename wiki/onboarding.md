---
title: Onboarding — New Engineer Guide
status: current
last_updated: 2026-06-02
sources: [docs/01-overview-and-goals.md, docs/05-dockerization-spec.md, docs/06-test-and-regression-plan.md, artifacts/regression-result.md]
phase: "0-2"
---

# Onboarding — first hour

## What you're working on
A Spring Boot asset tracker (Thymeleaf UI + REST + PostgreSQL). We're making **one** brownfield
change: *Delete* becomes a **request → approve/reject** workflow that reuses the existing
soft-delete. Read [overview](overview.md) first, then the [glossary](glossary.md).

## Run it locally
```bash
docker compose up --build        # app on http://localhost:8080/auth/login  (admin / admin123)
docker compose down              # stop, keep data
docker compose down -v           # full reset (clears db_data volume)
```
Postgres is private to the Compose network; only the app's 8080 is published.
(Behind a TLS-intercepting proxy? See the sandbox addendum in
[ADR-006](decisions/ADR-006-dockerization.md).)

## Run the tests
```bash
mvn test    # needs a running Docker daemon (Testcontainers PostgreSQL)
```
Characterization tests C-01..C-05 lock in current behaviour; new-behaviour tests N-01..N-08
arrive in Phase 4+. See [ADR-005](decisions/ADR-005-test-db-testcontainers.md).

## The map
- Code entry points: [asset-ui-controller](components/asset-ui-controller.md) (dashboard, the
  change target), [asset-rest-controller](components/asset-rest-controller.md) (JSON + PATCH),
  [security-config](components/security-config.md).
- Data: [asset](data-models/asset.md) (+ soft-delete), [decommission-request](data-models/decommission-request.md) (new).
- The change: [request-decommission](features/request-decommission.md) +
  [approval-workflow](features/approval-workflow.md), logic in
  [decommission-service](components/decommission-service.md).

## Rules of the road
Reuse soft-delete ([ADR-001](decisions/ADR-001-reuse-soft-delete.md)); don't overload
`Asset.status` ([ADR-003](decisions/ADR-003-derive-pending-state.md)); minimal diffs;
no RBAC / no CSRF re-enable; stop at each phase gate. Full rules in `CLAUDE.md`.

## How this wiki is maintained
By the Dev Wiki agent per [WIKI_SCHEMA.md](WIKI_SCHEMA.md). Every phase ends with a wiki
update + a [log](log.md) entry. To check recent activity: `grep "^## \[" wiki/log.md | tail`.
