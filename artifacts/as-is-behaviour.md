# as-is-behaviour.md  (Phase 0/2)

> Current behaviour of the reconstructed baseline. **Finalized in Phase 2** — every
> item below is now backed by a passing characterization test (C-01..C-05, see
> `characterization-tests.md`) and/or the Phase 1 Docker smoke run
> (see `regression-result.md`).

## Login
- `GET /auth/login` serves `login.html` (permitAll). The form `POST`s to `/auth/login`
  (Spring Security `formLogin` processing URL).
- Credentials: `admin` / `admin123` (single in-memory user from `application.properties`).
- On success → redirect to `/assets-ui`. On failure → `/auth/login?error`. Logout via
  `POST /auth/logout` → `/auth/login?logout`.
- Verified: Phase 1 Docker smoke (302→/assets-ui) and C-05 (auth gate).

## View assets (dashboard)
- `GET /assets-ui` calls `assetRepository.findAll()` and renders `assets.html`.
- `@SQLRestriction("is_deleted = false")` is applied to every `Asset` read, so
  soft-deleted assets never appear in the list (no explicit `WHERE is_deleted=false`
  in application code — it is enforced at the ORM level).
- Verified: C-02 (soft-deleted assets excluded from reads).

## Add asset
- The dashboard "Register a new asset" form `POST`s to `/assets-ui/add`
  (`@ModelAttribute Asset`), which calls `assetRepository.save(...)` and redirects to
  `/assets-ui`. The new asset then appears in the active list.
- Verified: C-04 (create+list) and Phase 1 smoke (dashboard renders the new asset).

## Update asset (incl. partial PATCH)
- Inline edit: the dashboard makes the `name`/`type`/`status` cells `contenteditable`,
  then `saveEdit(id)` issues `fetch('/assets/{id}', { method: 'PATCH', ... })` with a
  JSON body.
- `AssetController.patchAsset` reads a `Map<String,Object>` and only updates the keys
  present (`name`, `type`, `status`), leaving the others intact → genuine partial update.
- Verified: C-03 (PATCH changes only the provided field).

## Delete / decommission (current)
- Control in `assets.html`: an anchor `<a class="btn-delete" href="/assets-ui/delete/{id}">Delete</a>`
  with a JS `confirm()` guard. It is a **link (GET)**, not a POST form.
- Endpoint hit: `GET /assets-ui/delete/{id}` → `AssetUIController.deleteAsset` →
  `assetRepository.deleteById(id)`.
- Mechanism: `@SQLDelete` rewrites the delete to `UPDATE assets SET is_deleted=true WHERE id=?`.
  The row remains in the table; `@SQLRestriction` then hides it from all subsequent reads.
  **No approval, no reason, no audit record.** ← this is what the change replaces.
- Anything calling REST `DELETE /assets/{id}`? **No.** No template or JS in the
  reconstructed tree references `DELETE /assets/{id}`; it is an unused second soft-delete
  path that exists only on the REST controller. Its fate is decided in Phase 3
  (`impact-map.md`) per CLAUDE.md §5.

## Security model (verified by reading config)
- `SecurityConfig`: `csrf.disable()`; `/auth/**` and `/asset_tracking_loginpage.png`
  are `permitAll`; `anyRequest().authenticated()`. Single user `admin`, **no roles**.
- Implication: an "approver-only" screen cannot be role-enforced today; approval =
  any authenticated user. Documented as a known limitation, not addressed (out of scope).

## Corrections to docs/02
- None material. `docs/02` matches the reconstructed code. Two items it explicitly left
  open are now resolved by the reconstruction and recorded above:
  - Delete control markup: a GET anchor link with a `confirm()` dialog (not a POST form).
  - REST `DELETE /assets/{id}` is **not** referenced by any template/JS (effectively unused).
- Caveat: because the baseline was reconstructed from the spec rather than recovered
  from the original repo, these two resolutions reflect the reconstruction's choices,
  which were made to match the behaviour `docs/02` describes. If the original source
  becomes available and differs, this section should be reconciled.
