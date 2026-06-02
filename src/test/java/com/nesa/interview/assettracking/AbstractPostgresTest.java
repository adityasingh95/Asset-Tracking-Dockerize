package com.nesa.interview.assettracking;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Shared singleton PostgreSQL container for all integration tests.
 *
 * <p>A real Postgres (not H2) is used so the entity's {@code @SQLDelete}
 * (UPDATE ... SET is_deleted = true) and {@code @SQLRestriction} behaviour is
 * exercised exactly as it runs in production. The container is started once and
 * reused across test classes (static, never stopped — the JVM tears it down).
 */
public abstract class AbstractPostgresTest {

    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16")
                    .withDatabaseName("asset_db");

    static {
        POSTGRES.start();
    }

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    }
}
