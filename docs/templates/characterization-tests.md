# characterization-tests.md  (FILL IN — Phase 2)

> Tests that lock in CURRENT behaviour, green BEFORE any business change.

## Test DB strategy
- Chosen: (Testcontainers Postgres / other) — reason; how soft‑delete SQL fidelity is preserved.

## Tests
| ID | File::test | Locks in | Result (date) |
|---|---|---|---|
| C‑01 | | soft‑delete hides not removes | |
| C‑02 | | `@SQLRestriction` filters reads | |
| C‑03 | | PATCH partial update | |
| C‑04 | | create + list | |
| C‑05 | | auth gate | |

## How to run
```
(command, e.g. mvn test  or  docker compose run ...)
```

## Evidence
- (paste summarized green output / counts)
