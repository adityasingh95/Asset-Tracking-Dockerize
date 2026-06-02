---
title: "Feature: Authentication & Security Model"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/config/SecurityConfig.java, docs/02-repo-baseline.md, CLAUDE.md]
phase: "0-2"
---

# Feature: Authentication & Security Model

- **Single in-memory user** `admin` / `admin123` from `application.properties`. **No roles.**
- Filter chain: `/auth/**` and `/asset_tracking_loginpage.png` are `permitAll`;
  `anyRequest().authenticated()`. Form login at `/auth/login` → success `/assets-ui`;
  logout `/auth/logout` → `/auth/login?logout`.
- **CSRF disabled** (`csrf.disable()`) → new POST forms need no token (CLAUDE.md §7).
  Not re-enabled by this change (would be an unrelated breaking modification).
- Verified by C-05 (unauth `/assets-ui` → login redirect; authed → 200) and Phase 1 smoke.

## Implication for approval (important limitation)
There are no roles, so an "approver-only" screen **cannot be enforced**. Approval = *any
authenticated user*; under the single-user model the requester and approver are both `admin`
(self-approval is possible). This is a documented limitation, **not** something we fix
(RBAC is out of scope). Identity for audit comes from `Authentication#getName()`.

Component: [security-config](../components/security-config.md) ·
[auth-controller](../components/auth-controller.md).
