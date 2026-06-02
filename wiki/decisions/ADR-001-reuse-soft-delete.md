---
title: "ADR-001: Reuse the existing @SQLDelete soft-delete on approval"
status: current
last_updated: 2026-06-02
sources: [CLAUDE.md, docs/02-repo-baseline.md, docs/03-change-spec.md]
phase: "0"
---

# ADR-001: Reuse the existing soft-delete on approval

**Context.** `Asset` already implements soft-delete via `@SQLDelete(UPDATE assets SET
is_deleted=true)` + `@SQLRestriction(is_deleted=false)`. "Decommission" is semantically this
operation, now gated behind approval.

**Options.** (a) Reuse the existing mechanism — approval calls `deleteById`. (b) Write a new
`UPDATE` query. (c) Switch to physical deletion.

**Decision.** (a). On approval the service calls `assetRepository.deleteById(assetId)`, letting
`@SQLDelete` set `is_deleted = true`. No new delete query; no physical deletion.

**Consequences.** Minimal blast radius; existing read-filtering and characterization tests
(C-01/C-02) keep covering the behaviour. The single most important constraint of the change
(CLAUDE.md §3). Affects [decommission-service](../components/decommission-service.md),
[approval-workflow](../features/approval-workflow.md).
