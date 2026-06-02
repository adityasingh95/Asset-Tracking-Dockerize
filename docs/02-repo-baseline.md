# 02 — Repository Baseline (as‑is)

This describes the existing application **as it actually is**, grounded by reading the source. Treat it as ground truth but verify during Phase 0 archaeology; correct `artifacts/as-is-behaviour.md` if anything here is wrong.

## 1. Identity and stack

| Item | Value |
|---|---|
| Repo | `faizal08/asset-tracking-system` |
| Base package | `com.nesa.interview.assettracking` |
| Framework | Spring Boot **3.2.3** (parent), Java **17** |
| Modules | `spring-boot-starter-web`, `-thymeleaf`, `-security`, `-data-jpa`, `postgresql` (runtime), `lombok`, `-test` |
| Build | Maven (`spring-boot-maven-plugin`); artifact `asset-tracking-0.0.1-SNAPSHOT` |
| DB | PostgreSQL, schema via `ddl-auto=update` |
| UI | Server‑rendered Thymeleaf + vanilla JS (glassmorphism CSS) |

## 2. File map (source tree)

```
src/main/java/com/nesa/interview/assettracking/
  AssetTrackingApplication.java        // @SpringBootApplication entry point
  config/SecurityConfig.java           // Spring Security filter chain
  controller/
    AssetController.java               // @RestController  /assets        (JSON API)
    AssetUIController.java             // @Controller      /assets-ui     (Thymeleaf)
    AuthController.java                // @Controller      /auth/login, /
  model/Asset.java                     // @Entity assets
  repository/AssetRepository.java      // JpaRepository<Asset, Long>
src/main/resources/
  application.properties               // DB + security + JPA config
  templates/assets.html                // dashboard: list + add form + inline edit/PATCH JS
  templates/edit-asset.html            // edit page
  templates/login.html                 // login page
  static/*.png                         // screenshots + login image
pom.xml
(no src/test tree exists yet)
```

## 3. The `Asset` entity (the core of the change)

```java
@Entity @Table(name = "assets") @Data
@SQLDelete(sql = "UPDATE assets SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class Asset {
    @Id @GeneratedValue(strategy = IDENTITY) private Long id;
    private String name;
    private String type;
    private String status;            // free‑text; used by the UI
    @Column(name = "is_deleted") private boolean isDeleted = false;
}
```

Key facts:
- **Soft‑delete is built into the entity.** Any `delete`/`deleteById` on `Asset` is rewritten by `@SQLDelete` to `UPDATE assets SET is_deleted = true`. Nothing is physically removed.
- **`@SQLRestriction("is_deleted = false")`** silently filters every read so deleted assets never appear in list/find queries or the UI.
- `status` is a general free‑text field. **Do not** repurpose it as the pending flag (`CLAUDE.md` §8).

## 4. Endpoints

| Method | Path | Class | Behaviour |
|---|---|---|---|
| GET | `/auth/login` | AuthController | Login page (Thymeleaf). |
| GET | `/` | AuthController | Redirect → `/assets-ui`. |
| GET | `/assets-ui` | AssetUIController | Dashboard: lists active assets + add form. |
| POST | `/assets-ui/add` | AssetUIController | Saves a new asset, redirect back. |
| GET | `/assets-ui/edit/{id}` | AssetUIController | Edit page. |
| **GET** | **`/assets-ui/delete/{id}`** | **AssetUIController** | **The UI "Delete" — calls `repository.deleteById(id)` → soft‑delete. This is the primary change target.** |
| GET | `/assets` | AssetController | JSON list (`findAll`). |
| POST | `/assets` | AssetController | Create from JSON body. |
| GET | `/assets/{id}` | AssetController | JSON fetch by id. |
| PATCH | `/assets/{id}` | AssetController | **Partial update** of `name`/`type`/`status` from a JSON map. Used by the dashboard's inline edit JS. Must not regress. |
| **DELETE** | **`/assets/{id}`** | **AssetController** | REST soft‑delete (also triggers `@SQLDelete`). **Second delete path — see `CLAUDE.md` §5.** |

> ⚠️ **Two delete paths exist** (`GET /assets-ui/delete/{id}` and `DELETE /assets/{id}`). The dashboard button uses the first. The change must decide what happens to the second and record it in `impact-map.md`.

## 5. Soft‑delete mechanism — the reuse point
Approval must end up calling the existing soft‑delete, i.e. `assetRepository.deleteById(assetId)` (or equivalent on the entity), letting `@SQLDelete` set `is_deleted = true`. **Do not** write a new `UPDATE`, and **do not** physically delete. This is the single most important constraint of the change.

## 6. Security model

```java
csrf.disable();
authorizeHttpRequests: /auth/**, /asset_tracking_loginpage.png → permitAll; anyRequest → authenticated
formLogin: loginPage=/auth/login, processing=/auth/login, success=/assets-ui
logout: /auth/logout → /auth/login?logout
```

- **Single in‑memory user** from `application.properties`: `admin` / `admin123`. **No roles.** Every authenticated request is allowed.
- **CSRF disabled** → new POST forms need no token (`CLAUDE.md` §7).
- Implication: an "approver‑only" screen cannot be enforced by role today. Approval = any authenticated user. Document this; do not build RBAC (out of scope).

## 7. Runtime configuration (to be overridden in Docker)

| Property | Current value | Docker handling |
|---|---|---|
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/asset_db` | → `jdbc:postgresql://db:5432/asset_db` via env var |
| `spring.datasource.username` | `postgres` | → study‑only env var |
| `spring.datasource.password` | *(a real local password — do not reuse)* | → study‑only env var; never commit |
| `spring.jpa.hibernate.ddl-auto` | `update` | keep for the study; document generated schema |
| `server.port` | `8080` | publish only this port |
| `spring.security.user.{name,password}` | `admin` / `admin123` | keep for demo; may override via env |

## 8. Current end‑to‑end flow (working assumption, confirm in Phase 0)
1. User logs in at `/auth/login` (`admin`/`admin123`).
2. Dashboard `/assets-ui` lists active assets and offers an add form.
3. Inline edit issues `PATCH /assets/{id}` via fetch to update fields.
4. "Delete" issues `GET /assets-ui/delete/{id}` → soft‑delete → asset vanishes. **No approval, no reason, no record.** ← this is what we change.

## 9. Known unknowns for Phase 0 archaeology
- Exact markup of the Delete control in `assets.html` (link vs button vs JS) and how the inline PATCH JS is wired.
- Whether `edit-asset.html` posts anywhere or only the inline PATCH path is used.
- Whether any seed data beyond the in‑memory admin user is required to start.
- Whether the REST `DELETE /assets/{id}` is referenced by any template/JS or is effectively unused.
