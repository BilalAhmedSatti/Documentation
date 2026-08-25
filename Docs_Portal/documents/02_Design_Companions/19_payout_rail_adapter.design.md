# Design 19 — Payout Rail Adapter

**Impl (v3.1):** TypeScript — NestJS injectable providers, **one per rail**, in Payments (05) · **Docx:** `19_Adapter_Payout_Rail_Adapter_Specification.docx`

Executes payout per corridor binding and exposes statements to Reconciliation (09). Launch rails: **Raast** (PK, SBP), **Aani** (AE, Al Etihad Payments/CBUAE), **sarie** (SA, SAMA) for domestic; a cross-border partner rail for UAE→PK / KSA→PK until direct scheme connectivity is certified.

## 1. Port (SPI)

```ts
export interface PayoutRailPort {
  executePayout(ctx: TenantContext, i: PayoutInstruction): Promise<PayoutRef>;   // idempotent by i.platformRef
  getPayoutStatus(ctx: TenantContext, ref: PayoutRef): Promise<PayoutStatus>;    // PENDING|SETTLED|FAILED|UNKNOWN
  validateBeneficiary(ctx: TenantContext, b: Beneficiary, corridor: Corridor): Promise<ValidationResult>; // e.g. Raast alias/IBAN
  fetchStatement(ctx: TenantContext, p: Period): Promise<StatementLine[]>;       // feeds Design 09
}
export interface PayoutInstruction { platformRef: string; beneficiary: Beneficiary;
  amount: Money; corridor: Corridor; purposeCode: string; }   // purpose codes mandatory on PK corridors
```

## 2. Rail bindings

| Binding | Market | Wire format | Status model |
|---|---|---|---|
| `raast` | PK→PK | ISO 20022 (pacs.008/pacs.002) + Raast alias (RTP directory) | Sync accept + async settlement callback |
| `aani`  | AE→AE | ISO 20022 via Al Etihad Payments | Near-instant; webhook + poll fallback |
| `sarie` | SA→SA | ISO 20022 (SAMA sarie IPS) | Instant tier + deferred tier |
| `xborder-partner` | AE→PK, SA→PK | Partner API | Webhook settled/failed; statement daily |

Parsers under `adapters/external/rails/<rail>/`: `pacs008.builder.ts`, `pacs002.parser.ts`, `camt053.parser.ts` — golden-file fixtures per rail version, shared with Design 09.

## 3. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_rail` | enum | Corridor | SPI binding per source→destination |
| `cutoff_time` / `settlement_calendar` | ref | Corridor | Queue past cut-off; PK/AE/SA holiday calendars differ (incl. Fri/Sat vs Sat/Sun weekends) |
| `max_payout_amount` | Money | Corridor/tier | Rail/risk ceiling — distinct from pack regulatory limit |
| `participant_creds_ref` | vault ref | Tenant/rail | Scheme participant identity, mTLS/signing keys |
| `purpose_code_map` | table | Corridor | Platform reason → scheme purpose code |

## 4. Resilience
Idempotency echoed via scheme end-to-end ID (certified) · `UNKNOWN` ⇒ transfer stays `IN_FLIGHT`, status-inquiry job with backoff · webhook signature verification + poll fallback · circuit breaker per rail · duplicate-callback dedupe by (rail, ref) · settlement-calendar aware queueing.

## 5. Certification & tests (per rail — scheme onboarding gates)
Scheme simulator suite: accept/settle/reject/timeout/duplicate/late-settlement · pacs/camt golden files vs current scheme rulebook version · beneficiary validation matrix (Raast alias hit/miss, IBAN checksum, name-match tolerance) · idempotent double-send ⇒ single scheme transaction · statement→09 end-to-end with seeded break · Pact provider→05/09.
