---
title: Wiki Index
status: current
last_updated: 2026-06-02
phase: "0-2"
---

# Wiki Index

Catalog of all pages. `status`: current / draft / planned / proposed / superseded.

## Top-level
| Page | Summary | Status |
|---|---|---|
| [overview](overview.md) | Product, the change, phase tracker | current |
| [glossary](glossary.md) | Domain terms | current |
| [onboarding](onboarding.md) | New-engineer first-hour guide | current |
| [WIKI_SCHEMA](WIKI_SCHEMA.md) | How this wiki is structured/maintained | current |
| [log](log.md) | Chronological operation record | current |

## Features
| Page | Summary | Status |
|---|---|---|
| [asset-crud](features/asset-crud.md) | List/add/view/update assets | current |
| [authentication](features/authentication.md) | Single-user security model | current |
| [dockerized-runtime](features/dockerized-runtime.md) | Compose app+db, lifecycle | current |
| [request-decommission](features/request-decommission.md) | Create pending request (+reason) | planned |
| [approval-workflow](features/approval-workflow.md) | Approve/reject + audit | planned |

## Components
| Page | Summary | Status |
|---|---|---|
| [asset-ui-controller](components/asset-ui-controller.md) | `/assets-ui` dashboard; change target | current |
| [asset-rest-controller](components/asset-rest-controller.md) | `/assets` JSON + PATCH + DELETE | current |
| [auth-controller](components/auth-controller.md) | login page + root redirect | current |
| [security-config](components/security-config.md) | filter chain, CSRF off, single user | current |
| [persistence](components/persistence.md) | JPA repository + ddl-auto | current |
| [docker-compose-stack](components/docker-compose-stack.md) | Dockerfile + compose | current |
| [decommission-service](components/decommission-service.md) | request/approve/reject logic | planned |

## APIs
| Page | Summary | Status |
|---|---|---|
| [assets-rest-api](apis/assets-rest-api.md) | `/assets` endpoints | current |
| [assets-ui-routes](apis/assets-ui-routes.md) | Thymeleaf routes | current |
| [decommission-routes](apis/decommission-routes.md) | request/approve/reject routes | planned |

## Data models
| Page | Summary | Status |
|---|---|---|
| [asset](data-models/asset.md) | `assets` + soft-delete | current |
| [decommission-request](data-models/decommission-request.md) | `decommission_requests` + audit | planned |

## Decisions (ADRs)
| Page | Summary | Status |
|---|---|---|
| [ADR-001](decisions/ADR-001-reuse-soft-delete.md) | Reuse `@SQLDelete` on approval | current |
| [ADR-002](decisions/ADR-002-association-style.md) | `assetId` as plain `Long` | current |
| [ADR-003](decisions/ADR-003-derive-pending-state.md) | Derive "pending" from PENDING request | current |
| [ADR-004](decisions/ADR-004-rest-delete-fate.md) | Fate of REST `DELETE /assets/{id}` | proposed |
| [ADR-005](decisions/ADR-005-test-db-testcontainers.md) | Testcontainers Postgres | current |
| [ADR-006](decisions/ADR-006-dockerization.md) | Dockerization topology | current |
| [ADR-007](decisions/ADR-007-reconstructed-baseline.md) | Reconstructed baseline provenance | current |
