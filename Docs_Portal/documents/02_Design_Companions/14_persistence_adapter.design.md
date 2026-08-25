# Design 14 — Persistence / Database Adapter ★ dual implementation (TS + Java)

**Consumers:** every service · **Impls (v3.1):** TypeScript (`@platform/persistence`, NestJS providers — all TS services) **and** Java (`platform-persistence-spring` — Ledger 04, Pricing 10) · **Docx:** `14_Adapter_Persistence_Database_Adapter_Specification.docx`

The only layer that knows how tenancy isolation (silo/bridge/pool) and residency routing are physically achieved. Domain code sees a `RepositoryPort`; this adapter decides *which database, which schema, which region*. Both language implementations are certified against the **same contract + isolation test suite** — behavioural parity is a release gate.

## 1. Port contract (mirrored in both languages)

```ts
// TS — @platform/persistence
export interface TenantScopedRepo<T, Id> {
  byId(ctx: TenantContext, id: Id): Promise<T | null>;
  save(ctx: TenantContext, entity: T): Promise<void>;          // same tx as outbox row when events emitted
  query(ctx: TenantContext, spec: QuerySpec<T>): AsyncIterable<T>;
}
export interface UnitOfWork { withTransaction<R>(ctx: TenantContext, fn: (tx: TxHandle) => Promise<R>): Promise<R>; }
```

```java
// Java — platform-persistence-spring
public interface TenantScopedRepo<T, ID> {
  Optional<T> byId(TenantContext ctx, ID id);
  void save(TenantContext ctx, T entity);
  Stream<T> query(TenantContext ctx, QuerySpec<T> spec);
}
```

`ctx.tenantId` is **mandatory on every call** — there is no overload without it; a missing/empty tenant throws before any connection is acquired.

## 2. Isolation routing (the core mechanism)

```ts
export class TenantConnectionRouter {
  async acquire(ctx: TenantContext): Promise<PoolClient> {
    const t = await this.registry.tenantMeta(ctx.tenantId);        // cached from Design 12
    assertRegion(t.homeRegion, LOCAL_REGION);                      // pk|ae|sa — wrong region = hard error, never proxy
    switch (t.isolation) {
      case 'SILO':   return this.pools.forDatabase(t.dbRef).connect();          // dedicated DB
      case 'BRIDGE': { const c = await this.pools.shared().connect();
                       await c.query(`SET search_path TO ${schemaFor(t.id)}`);  // schema-per-tenant
                       return c; }
      case 'POOL':   { const c = await this.pools.shared().connect();
                       await c.query(`SET app.tenant_id = $1`, [t.id]);          // RLS predicate
                       return c; }
    }
  }
}
```

RLS policy (pool tier only):

```sql
ALTER TABLE t ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON t
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
-- app role has no BYPASSRLS; policy tested in CI (§19.3)
```

## 3. Config schema (resolved via Design 12)

| Key | Type | Scope | Notes |
|---|---|---|---|
| `isolation_model` | enum silo\|bridge\|pool | Tenant | From tier at onboarding; migration silo⇄bridge is a managed runbook |
| `home_region` | `pk` \| `ae` \| `sa` | Tenant | Residency routing; KSA (`sa`) connections never leave the in-Kingdom plane |
| `db_ref` / `schema_ref` | string | Tenant | Physical location handles (silo/bridge) |
| `pool_limits` | object | Tenant tier | Per-tenant connection caps — one noisy tenant cannot starve a cell |
| `encryption_key_ref` | vault ref | Tenant | Per-tenant KMS key for at-rest field encryption where the pack demands it |

## 4. Cross-cutting behaviours (both impls)
Transactional outbox helper (`saveWithOutbox(entity, events[])` — single tx; Debezium relays) · statement timeout + slow-query log with `tenant_id` · read-replica routing for `query()` when spec is `staleOk` · migration runner applies per-silo/per-schema with drift detection.

## 5. Certification & tests (gate for BOTH implementations)
1. **Isolation suite (§19.3, blocking):** for each model — tenant A can never read/write B via any port method; RLS bypass attempts; missing-tenant-context rejection.
2. **Residency suite:** connection audit proves `sa` tenants touch only in-Kingdom hosts.
3. Contract parity: identical fixture suite runs against TS and Java impls; any behavioural diff fails release.
4. Outbox atomicity: kill-between-write fault injection ⇒ either both rows or neither.
5. Pool-limit starvation test; failover (replica promotion) test per RPO/RTO tier.
