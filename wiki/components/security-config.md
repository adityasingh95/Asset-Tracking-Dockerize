---
title: "Component: SecurityConfig"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/config/SecurityConfig.java]
phase: "0-2"
---

# Component: `SecurityConfig`

Single `SecurityFilterChain` bean.

- `csrf.disable()` — no CSRF tokens; new POST forms need none (CLAUDE.md §7).
- `authorizeHttpRequests`: `/auth/**`, `/asset_tracking_loginpage.png` → `permitAll`;
  `anyRequest().authenticated()`.
- `formLogin`: loginPage `/auth/login`, processing `/auth/login`, success `/assets-ui`.
- `logout`: `/auth/logout` → `/auth/login?logout`.
- User: single in-memory `admin` from `application.properties` (`spring.security.user.*`). No roles.

**Do not** add roles/RBAC or re-enable CSRF as part of the change (out of scope / breaking).
Related: [authentication feature](../features/authentication.md).
