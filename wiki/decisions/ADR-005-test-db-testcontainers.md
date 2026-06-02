---
title: "ADR-005: Test DB = Testcontainers PostgreSQL"
status: current
last_updated: 2026-06-02
sources: [docs/06-test-and-regression-plan.md, artifacts/characterization-tests.md, pom.xml]
phase: 2
---

# ADR-005: Test database strategy

**Context.** Characterization tests must faithfully exercise `@SQLDelete`/`@SQLRestriction`.
H2 would not reproduce the same SQL behaviour.

**Decision.** Use **Testcontainers PostgreSQL (`postgres:16`)**, one shared singleton container
reused across test classes (`AbstractPostgresTest`). `@DataJpaTest` (replace=NONE) for repo
facts; `@SpringBootTest`+MockMvc for web facts.

**Consequences.** True fidelity to production soft-delete SQL. Two test-only surefire settings
were needed for this sandbox's Docker Engine 29: `api.version=1.44` (docker-java negotiation) and
`TESTCONTAINERS_RYUK_DISABLED=true` (avoid a rate-limited Hub pull). Neither affects app
code/runtime. C-01..C-05 green. See [characterization-tests](../../artifacts/characterization-tests.md).
