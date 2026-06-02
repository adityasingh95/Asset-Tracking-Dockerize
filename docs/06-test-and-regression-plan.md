# 06 — Test and Regression Plan

The brownfield rule: **characterization tests for current behaviour pass first, then you change code.** A regression is any characterization test that was green going red.

There is no existing `src/test` tree; create one. `spring-boot-starter-test` is already on the classpath.

## 1. Test layering

| Layer | What | Tooling |
|---|---|---|
| Smoke (Docker) | App+DB start, login page served, login works, dashboard loads | Manual checklist + optional MockMvc; documented in `regression-result.md` |
| Characterization (pre‑change) | Lock current add / list / partial‑update / soft‑delete behaviour | `@SpringBootTest` + MockMvc (or `@DataJpaTest` for repo/entity facts) |
| New behaviour | Request / reject / approve / duplicate guards / validation | Service unit tests + MockMvc for endpoints |

> DB for tests: prefer Testcontainers PostgreSQL for fidelity to the real `@SQLDelete`/`@SQLRestriction` behaviour. If Testcontainers isn't available in the environment, an embedded/H2 fallback is acceptable **only if** the soft‑delete SQL still behaves; otherwise run the soft‑delete characterization against the Compose Postgres and document it as a manual check. Record the choice in `implementation-notes.md`.

## 2. Characterization tests (must pass BEFORE business changes)

| ID | Locks in | Assertion sketch |
|---|---|---|
| C‑01 | Soft‑delete hides, not removes | After delete, asset absent from `findAll()`; row still present with `is_deleted=true` (native query / direct check). |
| C‑02 | `@SQLRestriction` filters reads | `findById` of a soft‑deleted asset returns empty. |
| C‑03 | PATCH partial update | `PATCH /assets/{id}` with only `status` changes `status` and leaves `name`/`type` intact. |
| C‑04 | Create + list | `POST /assets` then `GET /assets` includes the new asset. |
| C‑05 | Auth gate | Unauthenticated request to `/assets-ui` is redirected to login; authenticated succeeds. |

## 3. New‑behaviour tests (map to G‑/FA‑/T‑ IDs)

| ID | Maps to | Assertion sketch |
|---|---|---|
| N‑01 | FA‑01, T‑05 | Requesting decommission creates a `PENDING` request **and** the asset is still active (`findById` present, `is_deleted=false`). |
| N‑02 | FA‑02, V‑01 | Empty/whitespace reason → rejected, no request row created. |
| N‑03 | FA‑05, T‑07, G‑6 | Approve → asset `is_deleted=true` (gone from active views), request `APPROVED`, `decidedBy`/`decidedAt` set. |
| N‑04 | FA‑06, T‑06, G‑5, V‑02 | Reject → asset still active/visible, request `REJECTED`, decision metadata set. |
| N‑05 | FA‑07, T‑08, V‑05 | Second pending request for same asset → blocked. |
| N‑06 | FA‑07, V‑04 | Request against an already soft‑deleted asset → blocked. |
| N‑07 | FA‑08/09 | Audit fields persisted and history retrievable (incl. for approved → now soft‑deleted assets). |
| N‑08 | FA‑03 | Dashboard marks an asset with a pending request. |

## 4. Regression checklist (map to requirements doc T‑IDs)

| T‑ID | Check | Expected |
|---|---|---|
| T‑01 | `docker compose up --build` | app + db start |
| T‑02 | Login | `admin` logs in at `/auth/login` |
| T‑03 | Create asset | appears in dashboard |
| T‑04 | Update asset | fields update as before (PATCH unbroken) |
| T‑05 | Request decommission | pending request created; asset NOT soft‑deleted |
| T‑06 | Reject | request `REJECTED`; asset remains active |
| T‑07 | Approve | request `APPROVED`; soft‑delete occurs |
| T‑08 | Duplicate prevention | second pending blocked |
| T‑09 | DB reset | `docker compose down -v` clears DB |

## 5. Definition of done for testing
- C‑01..C‑05 committed and green **before** the first business‑logic commit.
- N‑01..N‑08 green after the change.
- The full T‑01..T‑09 checklist executed and its pass/fail recorded in `artifacts/regression-result.md`, including the before/after demonstration (same scenario, old vs new behaviour).
