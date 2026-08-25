# Design 01 — Technology Stack & Golden Path

**Decision (v3.1):** NestJS 10 + TypeScript 5.5 (strict) for every service/BFF · Java 21 + Spring Boot 3.3 only for Ledger (04), Pricing (10), FX adapter (17). Interop is REST + Kafka; Pact contracts block CI on both sides of every TS↔JVM seam.

## 1. Pinned versions

Node 22 LTS · NestJS 10 · TS 5.5+ · `@platform/money` 1.x (dinero.js v2 / decimal.js) · Java 21 · Spring Boot 3.3 · PostgreSQL 16 · Kafka 3.7+ · K8s 1.30+ · Istio 1.22+ · Terraform 1.8+ · React 18.

## 2. service-template-ts layout (default)

```
src/
  domain/          # entities, VOs, aggregates — zero framework imports
  application/     # use cases, sagas — depends on domain + ports
  ports/
    inbound/       # use-case interfaces + DI tokens
    outbound/      # driven-port interfaces + DI tokens
  adapters/
    rest/          # Nest controllers
    events/        # kafkajs consumers/producers + outbox relay wiring
    persistence/   # pg/Kysely repositories
    external/      # provider clients
  config/          # Nest modules; SPI-registry provider bindings
test/{unit,component,contract,architecture}
.dependency-cruiser.cjs  eslint.config.mjs  tsconfig.json(extends @platform/tsconfig)
Dockerfile  helm/  .github/workflows/ci.yml
```

`service-template-jvm` mirrors this with Java packages + ArchUnit under `src/test/architecture` (used only by 04 and 10).

## 3. Guardrail #1 — Money (mandatory, all TS services)

```ts
// @platform/money (internal package)
export type CurrencyCode = string; // ISO 4217, validated against the currency registry
export interface Money { readonly amountMinor: bigint; readonly currency: CurrencyCode; }

export const money = (amountMinor: bigint, currency: CurrencyCode): Money => ({ amountMinor, currency });
export function add(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new CurrencyMismatchError(a.currency, b.currency);
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}
// multiply by a decimal rate — the ONLY sanctioned path through decimals:
export function applyRate(a: Money, rate: string, rounding: 'HALF_EVEN' | 'HALF_UP'): Money;
```

ESLint (shipped in template): custom rule `platform/no-number-money` — any identifier typed/named `*amount*|*fee*|*balance*|*price*` declared as `number` fails lint; arithmetic operators on `Money` fields fail lint (must call package fns).

JVM equivalent:

```java
public record Money(long amountMinor, Currency currency) {
  public Money add(Money o) { requireSame(o); return new Money(Math.addExact(amountMinor, o.amountMinor), currency); }
  public Money applyRate(BigDecimal rate, RoundingMode rm) { /* scale via minor units, never double */ }
}
```

## 4. Guardrail #2 — Boundary test

```js
// .dependency-cruiser.cjs (excerpt)
module.exports = { forbidden: [
  { name: 'domain-is-pure',   from: { path: '^src/domain' },      to: { path: '^src/(application|ports|adapters|config)' }, severity: 'error' },
  { name: 'ports-no-adapters',from: { path: '^src/ports' },       to: { path: '^src/adapters' }, severity: 'error' },
  { name: 'tech-only-in-adapters', from: { pathNot: '^src/adapters' }, to: { path: 'node_modules/(pg|kafkajs|axios|kysely)' }, severity: 'error' },
]};
```

ArchUnit twin (JVM): `noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAnyPackage("..adapters..","org.springframework..")`.

## 5. Guardrail #3 — Strict TS

`@platform/tsconfig`: `strict`, `noImplicitAny`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `useUnknownInCatchVariables`. CI gate: `tsc --noEmit`.

## 6. Port binding pattern (SPI registry → NestJS DI)

```ts
// ports/outbound/screening.port.ts
export const SCREENING_PORT = Symbol('ScreeningPort');
export interface ScreeningPort { screenEntity(ctx: TenantContext, e: EntityRef, s: ListScope): Promise<ScreeningResult>; }

// config/spi.module.ts — per-tenant adapter swap = configuration, not code
@Module({ providers: [{
  provide: SCREENING_PORT,
  useFactory: (spi: SpiRegistry, a: VendorAAdapter, b: VendorBAdapter) =>
    new TenantRoutingScreening(spi, { vendorA: a, vendorB: b }),   // resolves per request-tenant
  inject: [SpiRegistry, VendorAAdapter, VendorBAdapter],
}]})
export class SpiModule {}
```

## 7. CI stages (both templates)

`lint-and-test` (ESLint+money rule, tsc --noEmit, unit, dependency-cruiser | ArchUnit) → `security-scan` (deps, image, SBOM) → `build-and-sign` (cosign) → `component-test` (Testcontainers: real PG+Kafka) → `contract-test` (Pact broker, blocking) → `deploy-dev` (ArgoCD).

## 8. Local dev

`docker compose --profile <service>` (PG + Redpanda + mock adapters) · `platform-cli new-service --name x [--jvm]` scaffolds, registers with local gateway, wires Keycloak dev realm. Internal npm: `@platform/money|tsconfig|telemetry|pact-fixtures`.
