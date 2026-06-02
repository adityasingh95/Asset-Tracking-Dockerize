# 05 — Dockerization Specification

Goal: run the app **and** its PostgreSQL entirely in Docker Compose, from a clean clone, with no local Postgres and no hardcoded local credentials. This is Phase 1 and must be working (baseline green) before any business change.

## 1. Requirements

| ID | Requirement | Acceptance |
|---|---|---|
| DOCK‑01 | Java‑17‑compatible build + runtime image | Image builds from a clean clone. |
| DOCK‑02 | Compose with `app` + `db` services | `docker compose up --build` starts both. |
| DOCK‑03 | Postgres private to the Compose network | Only the app port is published to the host. |
| DOCK‑04 | Datasource via environment variables | No host Postgres / no hardcoded local creds needed to run. |
| DOCK‑05 | DB healthcheck + app waits for DB | App starts after DB is ready (no startup race). |
| DOCK‑06 | Documented reset | `docker compose down -v` clears the study DB. |

## 2. Dockerfile (multi‑stage, reference)
Place at repo root. Pin to the project's Java 17.

```dockerfile
# ---- build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -e -DskipTests package

# ---- runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/asset-tracking-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```
- Verify the jar name against `pom.xml` (`asset-tracking`, `0.0.1-SNAPSHOT`) during the build; adjust if the agent changes the artifact id (it should not).
- Add a `.dockerignore` (at minimum: `target/`, `.git/`, `.idea/`, `*.iml`).

## 3. docker-compose.yml (reference)

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: asset_db
      POSTGRES_USER: ${DB_USER:-asset_app}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-change_me_study_only}
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-asset_app} -d asset_db"]
      interval: 5s
      timeout: 3s
      retries: 10
    # NOTE: no "ports:" — DB stays private to the Compose network (DOCK-03)

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy        # DOCK-05
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/asset_db
      SPRING_DATASOURCE_USERNAME: ${DB_USER:-asset_app}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD:-change_me_study_only}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    ports:
      - "8080:8080"                        # only the app is published

volumes:
  db_data:
```

## 4. Configuration externalization (DOCK‑04)
- Spring Boot maps the `SPRING_DATASOURCE_URL` / `_USERNAME` / `_PASSWORD` env vars onto the corresponding properties automatically (relaxed binding). No code change is needed to read them.
- Leave `application.properties` defaults for *local* dev if desired, but the **Docker run must not depend on them** — Compose env vars take precedence.
- **Do not** copy the real password from `application.properties` into any Docker file or commit (`CLAUDE.md` §13). Use study‑only credentials, optionally supplied via a git‑ignored `.env`.

## 5. Reset & lifecycle (DOCK‑06)
- Start: `docker compose up --build`
- Stop (keep data): `docker compose down`
- **Full reset (clear DB): `docker compose down -v`** — removes the `db_data` volume.

## 6. Acceptance for Phase 1
A clean clone + `docker compose up --build` brings up both services; the app becomes reachable at `http://localhost:8080/auth/login`; login with `admin`/`admin123` works; the dashboard lists assets; `docker compose down -v` followed by `up` starts from an empty DB. Capture this in `artifacts/docker-baseline.md` (skeleton: none required — fold it into `characterization-tests.md` or add a short note) and reference it from `regression-result.md`.
