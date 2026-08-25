# Design 15 — Screening/AML Provider Adapter

**Impl (v3.1):** TypeScript — NestJS injectable providers · **Consumer:** Screening & AML (03) · **Docx:** `15_Adapter_Screening_AML_Provider_Adapter_Specification.docx`

Translates a bound vendor's match model into the platform's `ScreeningResult`. Vendor choice is per-tenant SPI configuration. **Fail-safe closed is the consumer's rule; this adapter's job is honest errors** — it never converts a timeout into a CLEAR.

## 1. Port (SPI)

```ts
export const SCREENING_PROVIDER_PORT = Symbol('ScreeningProviderPort');
export interface ScreeningProviderPort {
  screenEntity(e: NormalizedEntity, lists: ListScope): Promise<ProviderResult>;
  screenTransaction(parties: Parties, corridor: Corridor, amount: Money): Promise<ProviderResult>;
  getListVersion(): Promise<ListVersion>;                    // stored on every result for audit replay
  healthCheck(): Promise<ProviderHealth>;
}
export interface ProviderResult { hits: RawHit[]; providerScore: number; listVersion: string; latencyMs: number; }
```

Normalization in `adapters/external/<vendor>/mapper.ts`: vendor hit → `{ listName, matchedName, matchStrength(0..1), listEntryRef }`; score scales mapped to the platform's 0–1 range with a per-vendor calibration table (part of certification).

## 2. Provider matrix (launch)

| Binding | Coverage | Notes |
|---|---|---|
| Global vendor A (primary) | UN Consolidated, OFAC SDN, PEP, adverse media | Real-time API; list-version endpoint required |
| Global vendor B (secondary/failover) | Same mandatory scope | Bound per tenant as fallback via SPI registry |
| Domestic list packs | PK NACTA · UAE Local Terrorist List · KSA designated persons | Delivered via vendor feed **or** direct FIU file ingest adapter variant — confirmed per market at pack certification |

## 3. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_provider` | enum | Tenant (pack) | SPI binding |
| `list_scope` | array | Pack | Mandatory lists per market — pack-certified |
| `match_threshold` | 0..1 | Pack | Below = auto-clear; above = case |
| `timeout_ms` / `retry` | object | Region | Latency budget feeding 03's 700 ms target |

## 4. Resilience

```ts
// circuit breaker (opossum) per provider binding
const breaker = new CircuitBreaker(vendorCall, { timeout: cfg.timeoutMs, errorThresholdPercentage: 50, resetTimeout: 30_000 });
breaker.fallback(() => { throw new ProviderUnavailableError(); });   // NEVER a synthetic CLEAR
```

Retries: idempotent screen calls ×2 with jitter · list-version drift alarm (version unchanged > SLA window ⇒ page compliance ops) · secondary-provider failover is consumer-orchestrated via SPI rebind, not hidden in-adapter.

## 5. Certification checklist & tests
Fixture names with known status per list (sanctioned/clean/fuzzy-transliteration incl. Urdu/Arabic name forms) ⇒ expected hit set — **blocking in pack certification (§19.1)**. Calibration table verified against vendor sandbox. WireMock suite: hit/clear/timeout/429/5xx/malformed. Contract parity across vendor A/B mappers (same fixtures ⇒ same normalized shape). Pact provider→03.
