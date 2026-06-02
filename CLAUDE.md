# CLAUDE.md — Operating Rules for the Asset Decommission Approval Change

These rules apply to every action in this repository for the duration of this engagement. They exist because this is a **brownfield** change: the risk is not "can we build it" but "can we change it without breaking what works."

## 1. Read before you write
Before any code change, read `docs/01`, `docs/02`, and `docs/07`. Before each phase, read that phase in `docs/08-backlog.md`.

## 2. Characterize before you change
You may not modify business logic until the current behaviour is captured as a passing, repeatable check. The order is fixed: **Docker baseline → characterization tests → impact map → change → regression**. See `docs/06` and `docs/07`.

## 3. Reuse the existing soft‑delete; never replace it
The `Asset` entity uses `@SQLDelete(sql = "UPDATE assets SET is_deleted = true WHERE id = ?")` and `@SQLRestriction("is_deleted = false")`. "Decommission" *is* this mechanism. On **approval**, trigger it (e.g. `assetRepository.deleteById(id)`); do not write a new delete query, and do not switch to physical deletion.

## 4. Minimal diffs only
Do not: rename packages or classes, reformat or re‑indent files you are not changing, reorder imports wholesale, bump Spring Boot / dependency versions, change the build tool, or add libraries beyond what the change strictly needs. If a tempting cleanup is unrelated to the task, note it in `implementation-notes.md` and leave it.

## 5. Know the two delete entry points
There are two: the UI button calls `GET /assets-ui/delete/{id}` (`AssetUIController`), and there is also a REST `DELETE /assets/{id}` (`AssetController`). The **UI path is the one the dashboard uses** and the primary target of this change. Decide and document what happens to the REST `DELETE` (gate it through approval, or leave it and label it out of the UI flow) in `impact-map.md`. Do not silently leave a second, ungated path to soft‑delete without saying so.

## 6. Respect the existing security model
Security is a single in‑memory user (`admin`) configured in `application.properties`; there are **no roles** and `.anyRequest().authenticated()` is the only rule. Do not invent a role hierarchy (out of scope). Approval is "any authenticated user" for now; document this limitation rather than building RBAC. The requester/approver identity comes from the Spring Security principal (`Authentication#getName()`).

## 7. CSRF is disabled
`SecurityConfig` calls `csrf.disable()`. New POST forms therefore need no CSRF token. Do not re‑enable CSRF as part of this change (it would be an unrelated, breaking modification); note it as a known limitation if relevant.

## 8. Don't overload `Asset.status`
`Asset` already has a free‑text `status` field used by the UI. Do not repurpose it as the pending‑approval flag. Derive "pending decommission" from the existence of a `PENDING` `DecommissionRequest` for that asset. See `docs/04`.

## 9. Schema changes
`spring.jpa.hibernate.ddl-auto=update` will create the new table automatically. That is acceptable for this study. Document the resulting schema in `implementation-notes.md`. A SQL/Flyway migration is optional and only if time allows — do not add migration tooling unless asked.

## 10. Tests
There is currently **no test source tree**, though `spring-boot-starter-test` is on the classpath. Create tests under `src/test/java`. Characterization tests must pass against the *unchanged* logic first. Keep tests runnable inside the Docker/Maven flow.

## 11. Where things live
- Specs you were given: `docs/` (read‑only — do not edit the spec pack).
- Evidence you produce: copy each `docs/templates/*.md` into `artifacts/` at the repo root and fill it in. Keep them current as you work.
- Docker files: repo root (`Dockerfile`, `docker-compose.yml`, `.dockerignore`).

## 12. Phase gates
At the end of every phase in `docs/08-backlog.md`: run the checks, write/update the relevant artifact, post a short summary (what changed, what was verified, what's open), and **stop for human approval**. Do not roll into the next phase unprompted.

## 13. Secrets
`application.properties` contains a real local DB password. Do not propagate it into Docker files or commits; use Compose environment variables with study‑only credentials (`docs/05`). Do not print secrets in summaries.

## 14. When the spec and the code disagree
The code wins on *what is true today*; the spec wins on *what should be true after the change*. If you find a conflict about current behaviour, correct `artifacts/as-is-behaviour.md` and flag it in your phase summary — don't quietly code around it.
