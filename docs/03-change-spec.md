# 03 — Change Specification (Decommission Approval)

Stable IDs are used so tests, the backlog, and the impact map can reference exact requirements. They mirror the requirements document.

## 1. Existing behaviour to preserve

| ID | Behaviour | Preservation requirement |
|---|---|---|
| EB‑01 | App starts and serves the login page. | Dockerization must not prevent startup or login. |
| EB‑02 | `admin` credentials work for local testing. | Demo credentials remain usable (or clearly overridden in Docker). |
| EB‑03 | Dashboard shows active assets. | Dashboard still loads and lists active assets. |
| EB‑04 | New assets can be registered. | Add‑asset flow still saves and displays. |
| EB‑05 | Assets can be updated, incl. partial (`PATCH /assets/{id}`). | Update/PATCH must not regress. |
| EB‑06 | Decommission uses soft‑delete semantics. | The soft‑delete action is **reused on approval**, not replaced by physical deletion. |

## 2. Functional requirements

| ID | Requirement | Detail |
|---|---|---|
| FA‑01 | **Request, not immediate decommission** | Initiating decommission creates a `PENDING` `DecommissionRequest`. The asset is **not** soft‑deleted at this point. |
| FA‑02 | **Reason required** | The requester must supply a non‑empty reason. Blank/whitespace‑only reason is rejected with a clear message; no request is created. |
| FA‑03 | **Pending state visible** | An asset with an open request shows a pending decommission indicator/badge in the dashboard. |
| FA‑04 | **Pending requests view** | An approver can see all `PENDING` requests in one place. |
| FA‑05 | **Approve** | Approval executes the existing soft‑delete (`is_deleted = true`) for the asset and marks the request `APPROVED`. |
| FA‑06 | **Reject** | Rejection leaves the asset active and visible and marks the request `REJECTED`. |
| FA‑07 | **No duplicate pending** | An asset with an existing `PENDING` request cannot get a second one. An already soft‑deleted asset cannot get a new request. |
| FA‑08 | **Audit details** | Record: requester, request timestamp, reason, decision maker, decision timestamp, decision status, decision comment. |
| FA‑09 | **History visible** | Request/decision history is visible from the pending‑requests screen or the asset area (at minimum the most recent decision). |

## 3. UI requirements

| ID | Requirement | Acceptance |
|---|---|---|
| UI‑01 | Rename the action | The dashboard's *Delete* control becomes *Request Decommission*; wording makes clear it creates a request, not a final deletion. |
| UI‑02 | Capture reason | A required reason input is presented when requesting (inline field, modal, or a small request page — implementer's choice, kept minimal). |
| UI‑03 | Show pending status | The dashboard indicates which assets are awaiting decommission approval (badge / row styling). |
| UI‑04 | Approver view | A page lists pending requests with: asset (name/type), requester, reason, requested date. |
| UI‑05 | Approve / reject | From the approver view, each request can be approved or rejected, with a decision comment (required on reject, optional on approve — implementer may make both optional but must persist whatever is entered). |
| UI‑06 | Confirmation feedback | The user sees success feedback for request created, approved, and rejected. |

> UI fidelity note: reuse the existing Thymeleaf templates and styling. No new frontend framework, no redesign (`docs/01` §4). The simplest correct UI that satisfies the acceptance criteria wins.

## 4. Validation rules

| ID | Rule |
|---|---|
| V‑01 | A reason is mandatory when requesting decommission; empty/whitespace is rejected and creates no request. (FA‑02) |
| V‑02 | A rejected request must not change asset visibility or `is_deleted`. (FA‑06) |
| V‑03 | An approved request must use the existing soft‑delete mechanism where practical. (FA‑05, EB‑06) |
| V‑04 | A soft‑deleted asset must not accept a new pending request. (FA‑07) |
| V‑05 | An asset with a pending request must not accept a duplicate pending request. (FA‑07) |
| V‑06 | Decision timestamp and decision maker are recorded for both approvals and rejections. (FA‑08) |

## 5. Behaviour transitions (reference)

```
[Active, no request]
      | Request Decommission (+reason)          -> create PENDING request   (asset stays Active)   FA-01/02
[Active, PENDING request]
      | Approve (+optional comment)              -> soft-delete asset; request APPROVED            FA-05
      | Reject  (+comment)                       -> asset stays Active; request REJECTED            FA-06
      | Request again                            -> blocked (duplicate)                             FA-07
[Soft-deleted asset]
      | Request Decommission                     -> blocked (already decommissioned)                FA-07
```

## 6. Identity capture
Requester and approver names come from the authenticated Spring Security principal (`Authentication#getName()`), which is `admin` under the current single‑user model. Store the name string; do not build a user table (out of scope).
