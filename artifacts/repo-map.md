# repo-map.md  (Phase 0)

> Inventory of the **actual** repository, built by reading the tree.
>
> Note on provenance: the original brownfield source (`faizal08/asset-tracking-system`)
> was not reachable from this environment and the target repository was empty. The
> baseline application was reconstructed faithfully from `docs/02-repo-baseline.md`
> (entity, endpoints, security model, runtime config) so there is a concrete "as-is"
> tree to characterize and change. Where the spec under-specified an implementation
> detail (e.g. exact dashboard markup, inline-edit JS wiring), the reconstruction
> follows the spec's described behaviour; those details are flagged in
> `as-is-behaviour.md` and the archaeology questions below.

## Modules / packages
- Base package: `com.nesa.interview.assettracking`
  - `config` — Spring Security filter chain.
  - `controller` — web + REST controllers (`AssetController`, `AssetUIController`, `AuthController`).
  - `model` — JPA entity (`Asset`).
  - `repository` — Spring Data JPA repository (`AssetRepository`).

## Entry point
- `AssetTrackingApplication` — `@SpringBootApplication`; standard `SpringApplication.run` main.

## Controllers & endpoints
| Method | Path | Class.method | Notes |
|---|---|---|---|
| GET | `/auth/login` | `AuthController.login` | Returns `login` Thymeleaf view. `permitAll`. |
| GET | `/` | `AuthController.home` | Redirects → `/assets-ui`. |
| GET | `/assets-ui` | `AssetUIController.listAssets` | Dashboard: lists active assets + add form (`assets` view). |
| POST | `/assets-ui/add` | `AssetUIController.addAsset` | Saves a new asset, redirect back to dashboard. |
| GET | `/assets-ui/edit/{id}` | `AssetUIController.editAsset` | Edit page (`edit-asset` view). |
| **GET** | **`/assets-ui/delete/{id}`** | **`AssetUIController.deleteAsset`** | **UI "Delete" → `repository.deleteById(id)` → soft-delete. PRIMARY CHANGE TARGET.** |
| GET | `/assets` | `AssetController.getAllAssets` | JSON list (`findAll`). |
| POST | `/assets` | `AssetController.createAsset` | Create from JSON body. |
| GET | `/assets/{id}` | `AssetController.getAsset` | JSON fetch by id (404 if absent/soft-deleted). |
| PATCH | `/assets/{id}` | `AssetController.patchAsset` | Partial update of `name`/`type`/`status` from a JSON map. Used by dashboard inline edit. **Must not regress.** |
| **DELETE** | **`/assets/{id}`** | **`AssetController.deleteAsset`** | REST soft-delete (also triggers `@SQLDelete`). **Second delete path — see CLAUDE.md §5.** |

## Entities
| Entity | Table | Key annotations | Fields |
|---|---|---|---|
| `Asset` | `assets` | `@Entity`, `@Data`, `@SQLDelete(UPDATE assets SET is_deleted=true WHERE id=?)`, `@SQLRestriction("is_deleted = false")` | `id` (IDENTITY), `name`, `type`, `status` (free-text), `isDeleted` (`is_deleted`, default false) |

## Repositories
| Repository | Entity | Methods |
|---|---|---|
| `AssetRepository` | `Asset` | Inherited `JpaRepository<Asset, Long>` only (no custom methods). |

## Templates
| Template | Used by | Purpose |
|---|---|---|
| `login.html` | `AuthController.login` | Login form posting to `/auth/login`. |
| `assets.html` | `AssetUIController.listAssets` | Dashboard: active-asset table, add form, inline-edit (PATCH) JS, Delete control. |
| `edit-asset.html` | `AssetUIController.editAsset` | Single-asset edit page (saves via `PATCH /assets/{id}`). |

## Config files
| File | Purpose | Values of note (no secrets) |
|---|---|---|
| `application.properties` | DB + JPA + security + server config | `ddl-auto=update`; datasource URL/user are local-dev defaults overridable by `SPRING_DATASOURCE_*` env vars; single demo user `admin` (no roles); `server.port=8080`. The DB password is a study-only local default and must not be propagated into Docker files/commits. |
| `pom.xml` | Maven build | Spring Boot **3.2.3** parent, Java **17**, artifact `asset-tracking-0.0.1-SNAPSHOT`. Starters: web, thymeleaf, security, data-jpa; postgresql (runtime); lombok; test. |

## Tests present?
- No `src/test` tree yet. `spring-boot-starter-test` is on the classpath. Tests will be created in Phase 2 (characterization) and Phase 4 (new behaviour).

## Seed data needed to start?
- None. Schema is created by `ddl-auto=update` on first start; the `admin` user is in-memory (from `application.properties`). The `assets` table starts empty.

## Build verification
- `mvn -DskipTests compile` succeeds against the reconstructed tree (JDK present; release 17). No application code has been changed beyond the faithful reconstruction.
