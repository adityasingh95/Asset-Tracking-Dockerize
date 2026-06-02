---
title: "Component: AuthController"
status: current
last_updated: 2026-06-02
sources: [src/main/java/com/nesa/interview/assettracking/controller/AuthController.java]
phase: "0-2"
---

# Component: `AuthController`

Thin routing controller.

| Method | Path | Behaviour |
|---|---|---|
| GET | `/auth/login` | Render `login.html` (permitAll). |
| GET | `/` | Redirect → `/assets-ui`. |

Login form submission and logout are handled by Spring Security
(see [security-config](security-config.md)), not by this controller.

Related: [authentication feature](../features/authentication.md).
