# 01 — Overview and Goals

## 1. What this is
A demonstration of **disciplined, spec‑driven brownfield development** with Claude Code. We take an existing, working Spring Boot asset‑tracking app and make exactly one business change — turning an immediate, irreversible‑feeling delete into a reviewed approval workflow — having first wrapped the app in Docker so the whole study is reproducible.

The greenfield companion to this study built a new app from a spec pack. This study answers the harder, more common real‑world question: **can an agent safely change software it didn't write?**

## 2. The change
**Before:** a user clicks *Delete* on an asset → the asset is soft‑deleted immediately (`is_deleted = true`) and vanishes from the UI. No review, no record of who or why.

**After:**
- *Delete* becomes *Request Decommission* and requires a **reason**.
- A **pending request** is created; the asset stays active and shows a **pending** indicator.
- An **approver** sees pending requests and **approves** (executes the existing soft‑delete) or **rejects** (asset stays active).
- Every request and decision is **audited**: who, why, who decided, when, outcome, comment.

## 3. Goals
1. Run the existing app + PostgreSQL entirely in Docker Compose, with no local Postgres and no hardcoded local credentials.
2. Establish a reproducible **baseline** of current behaviour, captured as checks/tests, before any business change.
3. Implement the decommission‑approval workflow as a **narrow, well‑evidenced** change that **reuses** the existing soft‑delete mechanism.
4. Prove that all preserved behaviours (login, list, add, update/PATCH, soft‑delete‑on‑approval) still work.
5. Produce the six brownfield evidence artifacts (`docs/07` §3).

## 4. Non‑goals (out of scope)
Production hardening of auth/authorization; cloud / Kubernetes / CI‑CD / production DB; new frontend framework or redesign; multi‑tenant, SSO, role hierarchy, or email notifications; bulk import/export, barcodes, QR, analytics; replacing PostgreSQL.

## 5. Success criteria
The engagement is successful when **all** of the following hold:

- **G‑1** App starts from a clean clone via `docker compose up --build`; only the app port is published; Postgres is private to the Compose network.
- **G‑2** App connects to the Compose‑managed Postgres (not a host install), using env‑var configuration.
- **G‑3** Baseline flows still work after Dockerization *and* after the change: login, list active assets, add asset, update/partial‑update asset.
- **G‑4** Requesting decommission creates a `PENDING` request and does **not** soft‑delete the asset; an empty reason is rejected.
- **G‑5** Rejecting a request leaves the asset active and visible; the request is marked `REJECTED` with decision metadata.
- **G‑6** Approving a request performs the existing soft‑delete (`is_deleted = true`), the asset disappears from active views, and the request is marked `APPROVED` with decision metadata.
- **G‑7** A second `PENDING` request cannot be created for an asset that already has one, nor for an already‑decommissioned asset.
- **G‑8** `docker compose down -v` fully resets the study database.
- **G‑9** The six evidence artifacts exist, are current, and tell a coherent before/after story.

## 6. How we will work
Strictly in the order defined by `docs/07-brownfield-workflow.md`, executing the phases in `docs/08-backlog.md`, stopping at each phase gate for human approval. Rules of engagement are in `CLAUDE.md`.
