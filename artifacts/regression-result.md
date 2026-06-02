# regression-result.md  (FILL IN — Phase 1 baseline + Phase 7 final)

## Baseline (Phase 1, in Docker) — verified 2026-06-02

| Check | Command/steps | Result |
|---|---|---|
| Build+up | `docker compose up --build` | ✅ app + db start; db becomes **healthy** before app starts (DOCK-05 gate observed in logs). The committed multi-stage Dockerfile builds end-to-end (Maven stage downloads from Maven Central, jar copied into runtime image). See env note below. |
| Login page | `GET /auth/login` (unauth) | ✅ HTTP 200; `GET /assets-ui` unauth → 302 redirect to `/auth/login` (auth gate works). |
| Login | `POST /auth/login` admin/admin123 | ✅ 302 → `/assets-ui`; authed `GET /assets-ui` → 200. |
| List | dashboard shows active assets | ✅ created `Laptop-01` via REST, dashboard HTML renders it. |
| Create (T-03) | `POST /assets` JSON | ✅ returns `{"id":1,...,"deleted":false}`. |
| Update (T-04) | `PATCH /assets/1 {"status":"In Repair"}` | ✅ only `status` changed; `name`/`type` intact (partial update unbroken). |
| DB privacy (DOCK-03) | host `:5432` | ✅ not reachable on host; `ps` shows app `0.0.0.0:8080->8080`, db `5432/tcp` (unpublished). |
| Reset (T-09) | `docker compose down -v` then `up` | ✅ `db_data` volume removed; after restart `GET /assets` → `[]` (empty DB). |

**Environment note (in-container Maven build) — RESOLVED:** This sandbox routes egress
through a TLS-intercepting proxy whose CA the stock `maven:3.9-eclipse-temurin-17` image
does not trust, so by default the multi-stage Dockerfile's `mvn` step failed with a
PKIX/`certificate_unknown` error while downloading from Maven Central. This is an
**environment constraint, not a project defect** — the committed
`Dockerfile`/`docker-compose.yml` are unmodified and spec-faithful.

Resolution (local, non-invasive): a base image carrying the proxy CA in its JVM
truststore is built and tagged with the same name the Dockerfile references
(`maven:3.9-eclipse-temurin-17`), so the committed `FROM maven:3.9-eclipse-temurin-17`
transparently uses the trusting variant. The CA is imported from the host's
`/etc/ssl/certs/ca-certificates.crt` (the trust the host already has); no certificate or
secret is committed. With this in place, **`docker compose up --build` runs the committed
Dockerfile end-to-end** (Maven downloads from Central, jar built, runtime image assembled)
and the stack was smoke-tested live: login 302→`/assets-ui`, REST create, PATCH partial
update, db private (`5432/tcp` unpublished, app `0.0.0.0:8080`), and `down -v` reset.

For environments that already trust the proxy CA (or have open egress), no workaround is
needed — `docker compose up --build` works directly.

## Final regression (Phase 7)
| T‑ID | Check | Expected | Actual | Pass? |
|---|---|---|---|---|
| T‑01 | docker up --build | app+db start | | |
| T‑02 | login | admin logs in | | |
| T‑03 | create asset | appears | | |
| T‑04 | update asset | PATCH unbroken | | |
| T‑05 | request decommission | pending; not deleted | | |
| T‑06 | reject | rejected; active | | |
| T‑07 | approve | approved; soft‑deleted | | |
| T‑08 | duplicate prevention | blocked | | |
| T‑09 | db reset | cleared | | |

## Characterization re‑run (no regressions)
- C‑01..C‑05 still green? (yes/no + evidence)

## Before / after demo
- Scenario: "decommission asset X"
- Before: immediate soft‑delete (vanishes, no record)
- After: request → (approve|reject) → outcome + audit

## Success criteria
- G‑1..G‑9: (tick each)

## Known limitations
- …
