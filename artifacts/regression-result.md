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

## Final regression (Phase 7) — run live in Docker, 2026-06-02

Run against the **committed** `docker compose up --build` (real multi-stage build), driving the
app over HTTP. Sequential scenario so each decision has exactly one pending request.

| T‑ID | Check | Expected | Actual | Pass? |
|---|---|---|---|---|
| T‑01 | `docker compose up --build` | app+db start | Real build (Maven→jar→runtime); db **healthy** before app starts; only `8080` published, `5432/tcp` private | ✅ |
| T‑02 | login | admin logs in | `POST /auth/login` → 302 `/assets-ui`; unauth `/assets-ui` → login | ✅ |
| T‑03 | create asset | appears | `POST /assets` → asset rendered on dashboard | ✅ |
| T‑04 | update asset | PATCH unbroken | `PATCH /assets/{id}` changed only `status`; name/type intact | ✅ |
| T‑05 | request decommission | pending; not deleted | `POST .../request-decommission` → 302; asset **still active**; pending badge shown | ✅ |
| T‑06 | reject | rejected; active | reject → 302; asset **remains active**; request `REJECTED` | ✅ |
| T‑07 | approve | approved; soft‑deleted | approve → 302; asset **absent from active list** (soft‑deleted); request `APPROVED` | ✅ |
| T‑08 | duplicate prevention | blocked | 2nd request on a pending asset → no new row (still 1 pending) + error flash | ✅ |
| T‑09 | db reset | cleared | `down -v` removed `db_data`; after `up`, `GET /assets` → `[]` | ✅ |

Extra (FA‑09): the approver view's **Decision history** showed the approved (now soft‑deleted)
asset by name, with `APPROVED` and `REJECTED` badges. The retired REST `DELETE /assets/{id}`
returns **405** (no soft‑delete); the old UI `GET /assets-ui/delete/{id}` returns **404**.

## Characterization re‑run (no regressions)
- **C‑01..C‑05 green**, alongside N‑01..N‑08 and the Phase‑6 checks. Full suite (`mvn test`):
  **`Tests run: 19, Failures: 0, Errors: 0`** (Testcontainers PostgreSQL). The pre‑change safety
  net never went red.

## Before / after demo (same "decommission asset X" scenario)
- **Before (baseline):** clicking *Delete* hit `GET /assets-ui/delete/{id}` → `deleteById` →
  `@SQLDelete` set `is_deleted=true` **immediately**. Asset vanished. No reason, no approver, no
  record of who/why.
- **After (this change):** the control is *Request Decommission* and requires a **reason** →
  creates a `PENDING` `DecommissionRequest`; the asset stays active with a **pending badge**. An
  approver opens `/assets-ui/decommissions` and **approves** (executes the *same* soft‑delete and
  records `decidedBy`/`decidedAt`/comment, status `APPROVED`) or **rejects** (asset stays active,
  status `REJECTED`). Every request/decision is **audited** and visible in Decision history,
  including for approved (now soft‑deleted) assets. Duplicate/soft‑deleted requests are blocked.

## Success criteria — G‑1..G‑9
- **G‑1** ✅ Clean clone + `docker compose up --build` starts app+db; only the app port published; Postgres private.
- **G‑2** ✅ App connects to the Compose Postgres via `SPRING_DATASOURCE_*` env vars (no host install).
- **G‑3** ✅ Login, list, add, update/PATCH all work after Dockerization and after the change (T‑02..T‑04; C‑03..C‑05).
- **G‑4** ✅ Request creates a `PENDING` request and does **not** soft‑delete; empty reason rejected (T‑05; N‑01/N‑02).
- **G‑5** ✅ Reject leaves the asset active/visible; request `REJECTED` with decision metadata (T‑06; N‑04).
- **G‑6** ✅ Approve performs the existing soft‑delete; asset disappears from active views; request `APPROVED` with metadata (T‑07; N‑03).
- **G‑7** ✅ No second `PENDING` for an asset that has one; none for an already‑decommissioned asset (T‑08; N‑05/N‑06).
- **G‑8** ✅ `docker compose down -v` fully resets the study DB (T‑09).
- **G‑9** ✅ The six evidence artifacts exist, are current, and tell a coherent before/after story.

## Known limitations (by design / scope)
- **No RBAC / single user.** Security is one in‑memory `admin` with no roles, so an "approver‑only"
  screen cannot be enforced; approval = any authenticated user, and self‑approval is possible.
  Documented, not built (out of scope). Identity is captured from `Authentication#getName()`.
- **CSRF disabled** (pre‑existing). New POST forms rely on this; not re‑enabled (would be an
  unrelated breaking change).
- **Schema via `ddl-auto=update`** (no Flyway/Liquibase). Generated `decommission_requests` DDL is
  recorded in `implementation-notes.md`.
- **Reconstructed baseline.** The original source was unreachable; the as‑is app was rebuilt from
  `docs/02` (ADR‑007). Behaviour matches the spec's account; reconcile if the original surfaces.
- **Sandbox build note.** In this environment the in‑container Maven step needs the proxy CA
  trusted (handled via a locally‑tagged CA‑trusting base image; committed files unchanged). On a
  normal network `docker compose up --build` works directly.
