---
title: "ADR-004: Fate of REST DELETE /assets/{id}"
status: current
last_updated: 2026-06-02
sources: [CLAUDE.md, docs/02-repo-baseline.md, docs/08-backlog.md, artifacts/impact-map.md]
phase: 3
---

# ADR-004: Fate of the second delete path (REST `DELETE /assets/{id}`)

**Context.** Two soft-delete entry points exist: `GET /assets-ui/delete/{id}` (UI, the primary
change target) and REST `DELETE /assets/{id}`. The UI button uses the first; the REST DELETE is
**not referenced** by any template/JS (confirmed in as-is archaeology). CLAUDE.md §5 forbids
silently leaving a second ungated path to soft-delete.

**Options.** (1) Gate the REST DELETE through the approval flow too. (2) Leave it but clearly
label it as out of the UI flow / disable it. (3) Remove it.

**Decision (Phase 3).** **Neutralize the ungated path.** `DELETE /assets/{id}` will no longer
perform a soft-delete; it returns `405 Method Not Allowed` (with a short message pointing at the
decommission-request flow). The endpoint is **not** physically removed (minimal-diff; preserves
the URL contract for any external caller) but it ceases to be a soft-delete bypass. The UI delete
route (`GET /assets-ui/delete/{id}`) is likewise retired in favour of the request flow. Net: after
the change there is **no** ungated path to soft-delete. Recorded in
[impact-map](../../artifacts/impact-map.md); implementation note to follow in Phase 6.

**Consequences.** Approval cannot be bypassed (supports FA-07). A client that previously called
`DELETE /assets/{id}` now gets 405 instead of a silent soft-delete — acceptable since no
template/JS used it. Affects [asset-rest-controller](../components/asset-rest-controller.md),
[assets-rest-api](../apis/assets-rest-api.md).
