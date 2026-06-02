# implementation-notes.md  (FILL IN — Phase 4‑6)

## Key design choices
- Reuse of soft‑delete on approval (how exactly):
- Association style + handling of soft‑deleted assets in history:
- Pending derivation:
- Identity capture (Authentication#getName):

## Generated schema
```sql
-- paste CREATE TABLE decommission_requests (from Hibernate DDL log or \d)
```

## Deliberately NOT changed
- (e.g. Asset entity structure, package layout, dependency versions, CSRF setting)

## Known limitations (by design / scope)
- Single in‑memory user, no RBAC → approver = any authenticated user
- CSRF disabled (pre‑existing)
- Schema via ddl‑auto=update (no migration tool)
