---
title: "ADR-004: Fate of REST DELETE /assets/{id}"
status: proposed
last_updated: 2026-06-02
sources: [CLAUDE.md, docs/02-repo-baseline.md, docs/08-backlog.md]
phase: 3
---

# ADR-004: Fate of the second delete path (REST `DELETE /assets/{id}`)

**Context.** Two soft-delete entry points exist: `GET /assets-ui/delete/{id}` (UI, the primary
change target) and REST `DELETE /assets/{id}`. The UI button uses the first; the REST DELETE is
**not referenced** by any template/JS (confirmed in as-is archaeology). CLAUDE.md §5 forbids
silently leaving a second ungated path to soft-delete.

**Options.** (1) Gate the REST DELETE through the approval flow too. (2) Leave it but clearly
label it as out of the UI flow / disable it. (3) Remove it.

**Status: PROPOSED — to be finalized in Phase 3 (impact-map).** Leading option: **(1/2 hybrid)**
neutralize the ungated path — either return 405/redirect it into the request flow, or document
it as disabled — so approval cannot be bypassed. Final decision and rationale recorded here and
in [impact-map](../../artifacts/impact-map.md) at Gate 3.

**Consequences (pending).** Ensures there is no un-audited bypass of the approval workflow.
Affects [asset-rest-controller](../components/asset-rest-controller.md), [assets-rest-api](../apis/assets-rest-api.md).
