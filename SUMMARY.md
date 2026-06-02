# Asset Decommission Approval — Engagement Summary

**A 2-page record of what Claude did, how it was built, and where to look for detail.**

Branch: `claude/jolly-albattani-ZVz7K` · Stack: Spring Boot 3.2.3 / Java 17 / PostgreSQL ·
Status: **complete** — 19 tests green, T‑01..T‑09 pass live, G‑1..G‑9 met.

---

## 1. What was done

A disciplined **brownfield** change to an existing asset‑tracking app: turn an immediate,
unrecorded *Delete* into a reviewed **decommission‑approval workflow**, after first wrapping the
app in Docker for reproducibility — and prove nothing else broke.

**The change in one sentence:** clicking *Delete* used to soft‑delete an asset instantly; now it
creates a **pending decommission request** (with a required reason) that an approver must
**approve** (which performs the *existing* soft‑delete) or **reject** (asset stays active), with a
full audit trail and visible history.

**Delivered:**
- A new `DecommissionRequest` entity + `DecommissionService` (request / approve / reject) enforcing
  all guards (reason required, no duplicate pending, no request for an already‑deleted asset).
- An approver UI (`/assets-ui/decommissions`) and a dashboard *Request Decommission* control with a
  pending badge; full audit/history, including for approved (now soft‑deleted) assets.
- The app + a **private** PostgreSQL running in Docker Compose from a clean clone.
- Both pre‑existing soft‑delete back‑doors closed (UI delete route removed → 404; REST
  `DELETE /assets/{id}` neutralized → 405) so approval can't be bypassed.

**Key constraint honoured:** the `Asset` entity was **not changed structurally**. Approval *reuses*
the existing `@SQLDelete` soft‑delete (`deleteById`), never a new delete path. "Pending" is derived
from a `PENDING` request, not a new column. Minimal diffs throughout.

> Provenance note: the original source repo was unreachable, so the as‑is app was **reconstructed
> faithfully from `docs/02`** (confirmed with you up front) to give a real tree to characterize and
> change. Recorded as ADR‑007.

→ *Detail:* `docs/01-overview-and-goals.md`, `docs/03-change-spec.md`, `wiki/overview.md`.

---

## 2. How it was built — the method

A **spec‑driven, gated brownfield workflow** in a fixed order, stopping for human approval at each
phase. The governing rule: *no business logic changes until current behaviour is locked as passing
tests.*

```
archaeology → Docker baseline → characterization → impact map → narrow change → regression
   (know)        (reproduce)       (lock current)      (plan)        (do)          (prove)
```

| Phase | What happened | Gate evidence |
|---|---|---|
| 0 | Repo archaeology — mapped the real tree, verified the spec, surfaced the two delete paths | `repo-map.md`, `as-is-behaviour.md` |
| 1 | Dockerized app + private Postgres (healthcheck, env‑var config, `down -v` reset) | `regression-result.md` (baseline) |
| 2 | **Characterization tests C‑01..C‑05 green on UNCHANGED code** (Testcontainers Postgres) | `characterization-tests.md` |
| 3 | Impact map — exact new/edited files + 3 decisions, before any code | `impact-map.md` |
| 4 | Data + service layer; tests N‑01..N‑07; captured generated DDL | `implementation-notes.md` |
| 5 | UI wiring (request control, badge, approver view); test N‑08; live‑verified | `regression-result.md` |
| 6 | History surface (FA‑09) + closed the second delete path | `implementation-notes.md` |
| 7 | Full live regression T‑01..T‑09; before/after demo; G‑1..G‑9 | `regression-result.md` |

**Five rules that kept it safe:** (1) read before you write, (2) characterize before you change,
(3) reuse don't replace, (4) minimal diffs, (5) phase gates with human approval.

**Tests as the contract:** 19 tests total — characterization (C‑01..05) locked current behaviour
*before* the change and stayed green; new‑behaviour tests (N‑01..08) + REST‑405 + history checks
proved the new behaviour. Real PostgreSQL via **Testcontainers** for true `@SQLDelete` fidelity.

**A living audit layer:** a separate **Dev Wiki** agent maintained `wiki/` (31 pages, 7 ADRs) —
updated at every phase gate with a **code‑drift lint** that greps the real source. It documents the
code but never edits it; every page cites its source.

→ *Detail:* `docs/07-brownfield-workflow.md`, `docs/08-backlog.md`, `wiki/WIKI_SCHEMA.md`,
`wiki/log.md`, `CLAUDE.md` (operating rules).

---

## 3. Evidence & traceability

Every requirement ID (G / EB / FA / V / UI / DOCK / T / and the C/N tests) is mapped to the code,
test, live check, and doc that satisfies it — all ✅.

- **`artifacts/requirements-traceability.md`** — the one‑page requirement→evidence matrix.
- **`artifacts/regression-result.md`** — T‑01..T‑09 results, before/after demo, G‑1..G‑9, limitations.
- **`artifacts/test-run.log`** — captured green run (19 tests, 0 fail/0 error) + test names.
- **`artifacts/screenshots/`** — the live app (login, dashboard + pending badge, approver + history).

---

## 4. Where everything lives (artifact index)

| Looking for… | Go to |
|---|---|
| What the app is / the goal | `docs/01`, `wiki/overview.md` |
| Operating rules / constraints | `CLAUDE.md` |
| Current (as‑is) behaviour | `artifacts/as-is-behaviour.md`, `wiki/` (components, data‑models) |
| Why a decision was made (ADRs) | `wiki/decisions/ADR-001..007` |
| What changed and why | `artifacts/impact-map.md`, `artifacts/implementation-notes.md` |
| Proof it works | `artifacts/regression-result.md`, `artifacts/requirements-traceability.md`, `artifacts/test-run.log` |
| How to run / test it | `docs/05`, this file §5 |
| The narrative deck | `presentation/Brownfield-Run-Asset-Decommission.pptx` |

---

## 5. Run & test it

```bash
git clone -b claude/jolly-albattani-ZVz7K \
  https://github.com/adityasingh95/Asset-Tracking-Dockerize.git
cd Asset-Tracking-Dockerize

docker compose up --build      # http://localhost:8080/auth/login  (admin / admin123)
mvn test                       # 19 tests; needs Docker (Testcontainers PostgreSQL)
docker compose down -v         # full reset
```

## Known limitations (by design / scope)
Single in‑memory user, no RBAC (approval = any authenticated user; self‑approval possible) ·
CSRF disabled (pre‑existing) · schema via `ddl-auto=update` (DDL documented, no migration tool) ·
reconstructed baseline (ADR‑007). The sandbox‑only Docker CA / Testcontainers tweaks never touched
the committed deliverable.
