# 07 — Brownfield Workflow and Evidence Artifacts

This is **how** the work is done. In greenfield you can build then test; in brownfield you must **understand and characterize first**, because the cost of the engagement is hidden regressions, not missing features.

## 1. The fixed order
```
archaeology  ->  Docker baseline  ->  characterization  ->  impact map  ->  narrow change  ->  regression
   (know)          (reproduce)         (lock current)        (plan)         (do)              (prove)
```
You may not skip left‑to‑right. You may loop back (e.g. archaeology corrects the baseline doc), but you do not write business logic before characterization tests are green.

## 2. Principles
- **Smallest change that satisfies the spec.** Prefer adding a new class/template over editing many existing ones.
- **Reuse over rebuild.** Especially the soft‑delete mechanism (`docs/02` §5, `CLAUDE.md` §3).
- **One concern per commit**, with a message tying it to a requirement ID.
- **Evidence is a deliverable**, not a byproduct. If it isn't in an artifact, it didn't happen.
- **Surface, don't swallow, surprises.** If the code contradicts the spec's account of *current* behaviour, fix the as‑is doc and flag it.

## 3. The six evidence artifacts
Copy each skeleton from `docs/templates/` into an `artifacts/` folder at the repo root and keep them current. They are the audit trail the reviewer reads.

| Artifact | Produced in | Purpose |
|---|---|---|
| `repo-map.md` | Phase 0 | Real file/module/endpoint inventory from the actual tree. |
| `as-is-behaviour.md` | Phase 0/2 | Current add/update/decommission behaviour, verified — corrects `docs/02` if needed. |
| `characterization-tests.md` | Phase 2 | The pre‑change tests/checks and their green results. |
| `impact-map.md` | Phase 3 | Exact files/behaviours the change will touch, incl. the two‑delete‑path decision. |
| `implementation-notes.md` | Phase 4‑6 | Key design choices, association style, schema DDL, what was deliberately *not* changed. |
| `regression-result.md` | Phase 7 | Final T‑01..T‑09 results, before/after demo, known limitations. |

## 4. Phase gates
Each phase in `docs/08-backlog.md` ends with: run the checks → update the relevant artifact(s) → post a short summary (changed / verified / open / next) → **stop for human approval.** Do not continue unprompted.

A good phase summary answers:
1. What did I change or produce?
2. What did I verify, and how (which checks, what result)?
3. What is still open or risky?
4. What is the next phase and its first action?

## 5. Definition of done (engagement)
All success criteria G‑1..G‑9 (`docs/01` §5) met; C‑ and N‑ tests green; T‑01..T‑09 recorded; the six artifacts present, current, and coherent; diffs minimal and explained.
