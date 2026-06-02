---
title: "Feature: Dockerized Runtime"
status: current
last_updated: 2026-06-02
sources: [Dockerfile, docker-compose.yml, docs/05-dockerization-spec.md, artifacts/regression-result.md]
phase: 1
---

# Feature: Dockerized Runtime

The whole study runs in Docker Compose — no host Postgres, no hardcoded local credentials.

- **`app`** — multi-stage build (Maven → `eclipse-temurin:17-jre`), runs
  `asset-tracking-0.0.1-SNAPSHOT.jar`; only port **8080** published.
- **`db`** — `postgres:16`, **private** to the Compose network (no `ports:`); named volume
  `db_data`; healthcheck via `pg_isready`. App `depends_on: db: service_healthy` (no startup race).
- **Config externalized** — `SPRING_DATASOURCE_URL/_USERNAME/_PASSWORD` env vars (relaxed
  binding); study-only credentials, the real local DB password is never propagated (CLAUDE.md §13).
- **Lifecycle** — `docker compose up --build` (start) · `down` (keep data) · **`down -v`** (full reset).

Verified live (Phase 1): db-healthy gate, app↔db connection, login→`/assets-ui`, REST
create, PATCH, db private on `5432/tcp`, `down -v` reset → empty DB.

> Sandbox note: this environment's TLS-intercepting proxy isn't trusted by the stock `maven`
> image, so the in-container Maven download needed a local CA-trust base image (committed
> files unchanged). Resolved and documented in
> [regression-result](../../artifacts/regression-result.md) and
> [ADR-006](../decisions/ADR-006-dockerization.md).

Component: [docker-compose-stack](../components/docker-compose-stack.md).
