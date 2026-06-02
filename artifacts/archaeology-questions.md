# archaeology-questions.md  (Phase 0.3)

Open questions that could not be answered purely from the code/spec. None block
Phase 1, but each should be confirmed (by a human or by running the app) before the
phase that depends on it.

## Resolved by the reconstruction (flagged for confirmation if original source appears)
1. **Exact Delete control markup** — reconstructed as a GET anchor (`<a href="/assets-ui/delete/{id}">`)
   with a JS `confirm()`. The original may have used a button/JS instead; behaviour
   (a GET soft-delete) is what matters and is preserved.
2. **`edit-asset.html` post target** — reconstructed to save via the same inline
   `PATCH /assets/{id}` path rather than a dedicated POST endpoint (no such endpoint
   exists on the controllers in `docs/02`). Confirm this matches intent.
3. **REST `DELETE /assets/{id}` usage** — reconstructed as unused (no caller). Confirm
   the original had no JS/template caller before finalizing its fate in Phase 3.

## Genuinely open (need human input, out of scope to assume)
4. **Approver identity** — under the single-user model, requester and approver are both
   `admin`. Is a same-person approve/reject acceptable for the study demo, or should we
   surface a note that self-approval is only allowed because RBAC is out of scope?
   (Spec says document the limitation; default: allow it, document it.)
5. **Reject comment requirement** — UI-05 lets the implementer make the reject comment
   required or optional. Spec leans "required on reject, optional on approve". Default:
   require a comment on reject, allow optional on approve. Confirm.
6. **Decision comment max length** — `docs/04` suggests `@Column(length = 1000)`. Adopted
   as-is; no business reason to change.
7. **History surface location** — FA-09 allows history on the approver screen or the
   asset area. Default: show recent decision(s) on the pending/approver screen plus a
   simple per-asset history list. Confirm preferred placement in Phase 5/6.

## Test-DB strategy (decided in Phase 2, noted here)
8. Testcontainers PostgreSQL is preferred for fidelity to `@SQLDelete`/`@SQLRestriction`.
   If Docker-in-the-environment is unavailable for Testcontainers, fall back to the
   Compose Postgres for the soft-delete characterization and document it. To be resolved
   at the start of Phase 2.
