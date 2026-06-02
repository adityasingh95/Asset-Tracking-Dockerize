# WIKI_SCHEMA.md — Asset Tracking / Decommission Approval Dev Wiki

> Operating instructions for the Dev Wiki agent on this project. Read this at the
> start of every session. The agent owns `wiki/` entirely; humans read it and
> curate sources.

## Purpose
A living, LLM-maintained knowledge base for this **brownfield** engagement: wrapping
an existing Spring Boot asset-tracking app in Docker and changing immediate
soft-delete into a **decommission-approval workflow** with an audit trail. The wiki
compounds knowledge as the phased build (docs/08) progresses.

## Evidence base (immutable sources — the wiki reads, never edits)
- `docs/01..08`, `docs/templates/*` — the spec pack (*what should be true after the change*).
- `CLAUDE.md` — operating rules / constraints.
- `artifacts/*.md` — phase evidence (repo-map, as-is-behaviour, characterization-tests,
  impact-map, implementation-notes, regression-result, archaeology-questions).
- Git history / commit messages — per-phase "PR" descriptions.

(No `raw/` copy is kept; sources already live in `docs/` and `artifacts/`.)

## Page categories
- `overview.md` — product, goal, current phase, status. Always current.
- `features/` — request-decommission, approval-workflow, asset-crud, authentication,
  dockerized-runtime.
- `components/` — asset-ui-controller, asset-rest-controller, auth-controller,
  decommission-service, security-config, persistence, docker-compose-stack.
- `apis/` — assets-rest-api, assets-ui-routes, decommission-routes.
- `data-models/` — asset, decommission-request.
- `decisions/` — ADRs (see list). Append-only; supersede via `Superseded-by:`.
- `glossary.md` — domain terms.
- `onboarding.md` — synthesized new-engineer first-week guide.
- `index.md` — catalog of all pages (link + 1-line summary + status).
- `log.md` — append-only chronological operation record.

## Frontmatter (YAML on every content page)
```yaml
---
title: <page title>
status: planned | draft | current | superseded
last_updated: YYYY-MM-DD
sources: [docs/03-change-spec.md, artifacts/impact-map.md, ...]
phase: <0..7 or "n/a">
---
```
`status: planned` = the thing it documents is specced but not yet built; the page is
filled in when the code lands.

## ADRs (one page each, written when the decision is made; never rewritten)
- ADR-001 — Reuse existing `@SQLDelete` soft-delete on approval (CLAUDE.md §3).
- ADR-002 — Association style: store `assetId` as a plain `Long` (docs/04 §3).
- ADR-003 — Derive "pending" from a `PENDING` `DecommissionRequest`, not `Asset.status`.
- ADR-004 — Fate of REST `DELETE /assets/{id}` (gate vs leave) — decided Phase 3.
- ADR-005 — Test DB = Testcontainers PostgreSQL (docs/06).
- ADR-006 — Dockerization topology + study-only credentials (docs/05).
- ADR-007 — Reconstructed baseline (original source unreachable) — provenance.
Supersede an ADR by adding `Superseded-by: ADR-NNN` to its frontmatter and a note;
do not rewrite the decision body.

## Ingest workflow
1. Read the named source(s). 2. Identify affected pages (typically 5–15).
3. Surface key takeaways. 4. Update/create pages, cross-links, and glossary.
5. Update `index.md`. 6. Append a `log.md` entry. 7. **Reconcile:** if a source
contradicts a page, *describe the contradiction and the proposed fix before writing*.

## Query workflow
Read `index.md` → drill into candidate pages → answer with citations (file paths).
File durable answers (comparisons, dependency maps) back as pages.

## Lint workflow (run at each gate and on request)
Scan for: contradictions, superseded-but-unmarked claims, orphan pages (no inbound
links), key concepts missing a page, broken cross-references, missing ADRs.
**Always include a CODE-DRIFT check:** diff key wiki claims (endpoints, entity fields,
service guards) against the actual code and flag divergence. This is the main reliability
lever — without it the wiki rots.

## Phase-gate rule (project-specific, REQUIRED)
Every backlog phase in `docs/08-backlog.md` concludes with a wiki ingest of that
phase's artifacts + commit: update affected pages, update `index.md`, append a
`log.md` entry, and add a one-line "wiki updated" note to the phase summary.
**No phase is "done" until the wiki reflects it.**

## Log entry format
```
## [YYYY-MM-DD] <op> | <short description>
```
`<op>` ∈ `init | ingest | query | lint | reconcile | schema`. Greppable:
`grep "^## \[" wiki/log.md | tail -10`.
