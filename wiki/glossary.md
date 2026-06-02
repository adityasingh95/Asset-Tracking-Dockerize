---
title: Glossary
status: current
last_updated: 2026-06-02
sources: [docs/00-glossary.md, docs/03-change-spec.md, docs/04-data-model-spec.md]
phase: "0-2"
---

# Glossary

- **Asset** — the tracked entity (`assets` table): `id`, `name`, `type`, `status`,
  `is_deleted`. See [data-models/asset](data-models/asset.md).
- **Soft-delete** — marking a row `is_deleted = true` instead of physically removing it.
  Implemented on `Asset` via `@SQLDelete` (rewrites delete → `UPDATE ... is_deleted=true`).
- **`@SQLRestriction`** — Hibernate filter (`is_deleted = false`) silently applied to every
  `Asset` read, so soft-deleted assets never appear in lists/finders.
- **Decommission** — the act of retiring an asset. In this system it *is* the existing
  soft-delete, now gated behind approval. → [ADR-001](decisions/ADR-001-reuse-soft-delete.md)
- **Decommission request** — a record asking that an asset be decommissioned; carries the
  audit trail. States: `PENDING → APPROVED | REJECTED`.
  See [data-models/decommission-request](data-models/decommission-request.md) (planned).
- **Pending (decommission)** — *derived* state: an asset has an open request iff a
  `DecommissionRequest` with `status = PENDING` exists for its id. Not a column on `Asset`.
  → [ADR-003](decisions/ADR-003-derive-pending-state.md)
- **Requester** — the authenticated principal (`Authentication#getName()`) who asked for
  decommission. Under the single-user model this is `admin`.
- **Approver** — the authenticated principal who approved/rejected. Same single-user caveat.
- **Reason** — mandatory non-empty text the requester supplies (validation V-01 / FA-02).
- **Decision comment** — optional/required text recorded with an approve/reject decision.
- **Characterization test** — a test that locks in *current* behaviour before any change;
  going red after a change signals a regression. See [characterization-tests artifact](../artifacts/characterization-tests.md).
- **Two delete paths** — `GET /assets-ui/delete/{id}` (UI, primary target) and REST
  `DELETE /assets/{id}` (second path). → [ADR-004](decisions/ADR-004-rest-delete-fate.md)
- **ddl-auto=update** — Hibernate auto-creates/updates schema on startup; used for this study.
