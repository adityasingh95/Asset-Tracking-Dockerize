# as-is-behaviour.md  (FILL IN — Phase 0/2)

> Current behaviour, **verified by running it**. Correct `docs/02` here if it was wrong.

## Login
- Steps, URL, result:

## View assets (dashboard)
- What loads, what's filtered (note `@SQLRestriction`):

## Add asset
- Form → endpoint → persistence → result:

## Update asset (incl. partial PATCH)
- Inline edit JS → `PATCH /assets/{id}` → effect:

## Delete / decommission (current)
- Control in `assets.html`: (link/button/JS?)
- Endpoint hit: `GET /assets-ui/delete/{id}` (confirm)
- Mechanism: `@SQLDelete` sets `is_deleted=true`; row remains; `@SQLRestriction` hides it
- Anything calling REST `DELETE /assets/{id}`? (yes/no — evidence)

## Security model (verified)
- Single user `admin`; no roles; CSRF disabled. Confirm.

## Corrections to docs/02
- (list any inaccuracies found)
