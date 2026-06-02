# 00 — Glossary

## Domain terms

| Term | Definition |
|---|---|
| **Asset** | A corporate hardware record (laptop, server, mobile device). Fields today: `id`, `name`, `type`, `status`, `is_deleted`. |
| **Active asset** | An asset whose `is_deleted = false`. Only active assets are visible in the UI and API (enforced by `@SQLRestriction`). |
| **Decommission** | Retiring an asset from active use. In this codebase decommission is implemented as **soft‑delete**, not physical deletion. |
| **Soft‑delete** | Setting `is_deleted = true` so the row stays in the database but disappears from all queries. Implemented via Hibernate `@SQLDelete` + `@SQLRestriction` on the `Asset` entity. |
| **Decommission request** | NEW. A record capturing an intent to decommission an asset, awaiting a decision. The unit of work this change introduces. |
| **Approver** | An authenticated user who decides pending requests. With the current single‑user security model this is the `admin` user. |
| **Requester** | The authenticated user who initiated a decommission request. |

## Request lifecycle terms

| Term | Definition |
|---|---|
| **PENDING** | A request has been created and is awaiting a decision. The asset remains active. |
| **APPROVED** | An approver accepted the request; the existing soft‑delete has been executed. Terminal. |
| **REJECTED** | An approver declined the request; the asset remains active and visible. Terminal. |
| **Pending badge** | A UI indicator on an asset that has an open (`PENDING`) request. Derived, not stored on the asset. |

## Study / process terms

| Term | Definition |
|---|---|
| **Brownfield** | Changing an existing, running codebase rather than building new. The defining constraint is preserving current behaviour. |
| **Repo archaeology** | Reading the existing code to establish what is actually true before changing it. |
| **Characterization test** | A test written to lock in *current* behaviour before a change, so any regression is caught. |
| **Impact map** | The explicit list of files and behaviours a change will touch, written before the change. |
| **Regression result** | The final pass/fail evidence that preserved behaviours still work and new behaviours work. |
| **Evidence artifact** | One of the six markdown files (`docs/07` §3) the agent must produce as the auditable record of the work. |
