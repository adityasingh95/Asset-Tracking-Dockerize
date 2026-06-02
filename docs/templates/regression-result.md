# regression-result.md  (FILL IN — Phase 1 baseline + Phase 7 final)

## Baseline (Phase 1, in Docker)
| Check | Command/steps | Result |
|---|---|---|
| Build+up | docker compose up --build | |
| Login | admin @ /auth/login | |
| List | dashboard shows active assets | |
| Reset | docker compose down -v | |

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
