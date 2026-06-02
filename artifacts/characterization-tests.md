# characterization-tests.md  (Phase 2)

> Tests that lock in CURRENT behaviour, green BEFORE any business change.
> All five characterization checks (C-01..C-05) pass against the **unchanged**
> baseline logic. Verified 2026-06-02.

## Test DB strategy
- **Chosen: Testcontainers PostgreSQL (`postgres:16`).** A real Postgres is used rather
  than H2 so the entity's `@SQLDelete` (`UPDATE assets SET is_deleted = true`) and
  `@SQLRestriction("is_deleted = false")` behave exactly as in production — H2 would not
  exercise the same SQL fidelity.
- A single container is started once and reused across test classes
  (`AbstractPostgresTest`, static singleton; `@DynamicPropertySource` wires the JDBC URL).
- Repository facts (C-01/C-02) use `@DataJpaTest` + `@AutoConfigureTestDatabase(replace = NONE)`
  against the container; web facts (C-03/04/05) use `@SpringBootTest` + MockMvc with
  `spring-security-test`.

### Environment notes (sandbox Docker quirks, test-only)
Two surefire settings in `pom.xml` make Testcontainers work against this sandbox's Docker
Engine 29; neither changes application code or runtime behaviour:
- `-Dapi.version=1.44` — Docker Engine 29 rejects docker-java's default API (1.32); pinning
  to 1.44 lets it negotiate (observed: API 1.54).
- `TESTCONTAINERS_RYUK_DISABLED=true` — avoids a rate-limited Docker Hub pull of the Ryuk
  reaper image; the singleton container is reaped on JVM exit (and pruned manually here).

## Tests
| ID | File::test | Locks in | Result (2026-06-02) |
|---|---|---|---|
| C-01 | `AssetSoftDeleteCharacterizationTest::c01_softDelete_hidesButDoesNotRemoveRow` | soft-delete hides but does not remove the row (`findAll` excludes it; native query finds the row with `is_deleted=true`) | ✅ PASS |
| C-02 | `AssetSoftDeleteCharacterizationTest::c02_sqlRestriction_filtersFindById` | `@SQLRestriction` filters `findById` of a soft-deleted asset → empty | ✅ PASS |
| C-03 | `AssetEndpointCharacterizationTest::c03_patch_partialUpdate_changesOnlyProvidedField` | `PATCH /assets/{id}` with only `status` changes `status`, leaves `name`/`type` intact | ✅ PASS |
| C-04 | `AssetEndpointCharacterizationTest::c04_create_thenList_includesNewAsset` | `POST /assets` then `GET /assets` includes the new asset | ✅ PASS |
| C-05 | `AssetEndpointCharacterizationTest::c05_authGate_unauthenticatedDashboardRedirectsToLogin` | unauthenticated `/assets-ui` → redirect to `/auth/login` | ✅ PASS |
| C-05 | `AssetEndpointCharacterizationTest::c05_authGate_authenticatedDashboardSucceeds` | authenticated `/assets-ui` → 200, renders dashboard | ✅ PASS |

## How to run
```
# Docker daemon must be running.
mvn test
# (surefire injects api.version=1.44 and TESTCONTAINERS_RYUK_DISABLED=true automatically)
```

## Evidence
```
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0 -- AssetSoftDeleteCharacterizationTest
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- AssetEndpointCharacterizationTest
Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```
These are the safety net: any of C-01..C-05 going red after a business change is a regression.
