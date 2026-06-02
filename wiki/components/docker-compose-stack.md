---
title: "Component: Docker Compose Stack"
status: current
last_updated: 2026-06-02
sources: [Dockerfile, docker-compose.yml, .dockerignore, docs/05-dockerization-spec.md]
phase: 1
---

# Component: Docker Compose Stack

- **`Dockerfile`** — multi-stage: `maven:3.9-eclipse-temurin-17` (build, `dependency:go-offline`
  then `package`) → `eclipse-temurin:17-jre` (runtime, copies `asset-tracking-0.0.1-SNAPSHOT.jar`),
  `EXPOSE 8080`.
- **`docker-compose.yml`** — `app` (build `.`, port 8080, datasource env vars,
  `depends_on db service_healthy`) + `db` (`postgres:16`, no published port, `db_data` volume,
  `pg_isready` healthcheck). `volumes: db_data`.
- **`.dockerignore`** — excludes `target/`, `.git/`, `.idea/`, `*.iml`, `artifacts/`, `docs/`, `.env`.

Credentials are study-only via `${DB_USER:-asset_app}` / `${DB_PASSWORD:-change_me_study_only}`.
→ [ADR-006](../decisions/ADR-006-dockerization.md). Feature: [dockerized-runtime](../features/dockerized-runtime.md).
