---
title: "ADR-006: Dockerization topology & study-only credentials"
status: current
last_updated: 2026-06-02
sources: [docs/05-dockerization-spec.md, Dockerfile, docker-compose.yml, artifacts/regression-result.md]
phase: 1
---

# ADR-006: Dockerization topology

**Decision.** Multi-stage Dockerfile (Maven build → `eclipse-temurin:17-jre` runtime).
Compose runs `app` (only 8080 published) + `db` (`postgres:16`, **private**, healthcheck,
`db_data` volume); app waits on `db: service_healthy`. Datasource via `SPRING_DATASOURCE_*`
env vars with study-only credentials; the real local DB password is never propagated (CLAUDE.md §13).

**Consequences.** Reproducible from a clean clone; `down -v` fully resets. Verified live (Phase 1).

**Sandbox addendum (not part of the deliverable).** This environment's TLS-intercepting proxy CA
isn't trusted by the stock `maven` image, breaking in-container Maven downloads. Worked around by
building a locally-tagged CA-trusting `maven:3.9-eclipse-temurin-17` base image (imports the host
CA bundle); committed Docker files unchanged. With it, `docker compose up --build` runs the real
Dockerfile end-to-end. See [regression-result](../../artifacts/regression-result.md).
Feature: [dockerized-runtime](../features/dockerized-runtime.md).
