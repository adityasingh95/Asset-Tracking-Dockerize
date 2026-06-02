---
title: Product Overview
status: current
last_updated: 2026-06-02
sources: [docs/01-overview-and-goals.md, docs/03-change-spec.md, CLAUDE.md, artifacts/repo-map.md]
phase: "0-2"
---

# Asset Tracking System — Decommission Approval

## What it is
A server-rendered **Spring Boot 3.2.3 / Java 17** asset-tracking web app (Thymeleaf UI +
JSON REST API, PostgreSQL via JPA). This engagement is a disciplined **brownfield** change:
take the existing, working app, wrap it in Docker for reproducibility, then make **one
focused business change** and prove nothing else regressed.

## The change in one sentence
Today clicking *Delete* immediately soft-deletes an asset; after the change it instead
creates a **pending decommission request** that an approver must **approve** (which performs
the *existing* soft-delete) or **reject** (asset untouched), with a full audit trail.

## Core invariants (constraints that shape everything)
- **Reuse, don't replace** the existing soft-delete (`@SQLDelete`/`@SQLRestriction` on
  `Asset`). Approval triggers `assetRepository.deleteById(id)`. → [ADR-001](decisions/ADR-001-reuse-soft-delete.md)
- **Don't overload `Asset.status`**; "pending" is *derived* from a `PENDING` request.
  → [ADR-003](decisions/ADR-003-derive-pending-state.md)
- **Minimal diffs**, prefer new classes/templates over editing many files.
- **Single in-memory `admin` user, no roles, CSRF disabled** — approval = any authenticated
  user (documented limitation, not RBAC). See [authentication](features/authentication.md).
- **Characterize before you change** — behaviour locked as passing tests before edits.

## Current state (phase tracker)
| Phase | Title | Status |
|---|---|---|
| 0 | Archaeology & baseline doc | ✅ done |
| 1 | Dockerize & runnable baseline | ✅ done |
| 2 | Characterize current behaviour | ✅ done (C-01..C-05 green) |
| 3 | Impact map | ✅ done |
| 4 | Data & service layer | ✅ done (N-01..N-07 green) |
| 5 | UI wiring | ✅ done (N-08 green; live-verified) |
| 6 | History & loose ends | ✅ done |
| 7 | Regression & write-up | ▶ next |

> Provenance note: the original source repo (`faizal08/asset-tracking-system`) was
> unreachable, so the baseline was **reconstructed** faithfully from `docs/02`.
> See [ADR-007](decisions/ADR-007-reconstructed-baseline.md).

## Key pages
- Features: [asset-crud](features/asset-crud.md) · [authentication](features/authentication.md) ·
  [dockerized-runtime](features/dockerized-runtime.md) ·
  [request-decommission](features/request-decommission.md) ·
  [approval-workflow](features/approval-workflow.md)
- Data models: [asset](data-models/asset.md) · [decommission-request](data-models/decommission-request.md) (planned)
- APIs: [assets-rest-api](apis/assets-rest-api.md) · [assets-ui-routes](apis/assets-ui-routes.md) ·
  [decommission-routes](apis/decommission-routes.md)
- [Glossary](glossary.md) · [Onboarding](onboarding.md) · [Index](index.md) · [Log](log.md)
