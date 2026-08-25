# Design 20 — Card Issuing Processor Adapter

**Impl (v3.1):** TypeScript — NestJS injectable provider in Cards (07); inbound authorization webhook rides 07's FastifyAdapter route · **Docx:** `20_Adapter_Card_Issuing_Processor_Adapter_Specification.docx`

Bridge to the issuer processor (issuance, lifecycle, auth forwarding, clearing files). **Tokenised refs only — raw PAN never enters platform storage or logs** (PCI DSS scope stays at the processor).

## 1. Port (SPI)

```ts
export interface CardProcessorPort {
  issueCard(ctx: TenantContext, req: IssueRequest): Promise<TokenRef>;         // virtual instant; physical → fulfilment status
  updateStatus(ctx: TenantContext, ref: TokenRef, s: 'FREEZE'|'UNFREEZE'|'CLOSE'): Promise<void>;
  setControls(ctx: TenantContext, ref: TokenRef, controls: ProcessorControl[]): Promise<void>; // mirror of 07 SpendControls where processor-enforced
  fetchClearingFile(ctx: TenantContext, date: LocalDate): Promise<ClearingRecord[]>;           // feeds settlement postings + 09
}
// inbound (processor→platform): auth webhook payload normalized to 07's AuthRequest
export interface InboundAuthMapper { toAuthRequest(raw: ProcessorAuthPayload): AuthRequest; } // amountMinor: bigint from processor minor units
```

## 2. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_processor` | enum | Tenant | SPI binding |
| `bin_ranges` | array | Tenant/product | Issued BIN/product mapping (incl. mada-scheme BINs for SA-issued cards where applicable) |
| `auth_webhook_secret_ref` | vault ref | Processor | HMAC verification on every inbound auth |
| `control_sync_mode` | platform\|processor\|both | Tenant | Where each SpendControl type is enforced |
| `clearing_schedule` | cron | Processor | File pull cadence |

## 3. Resilience & PCI posture
Auth webhook: signature check → normalize → hand to 07 inside its < 400 ms budget; any adapter failure ⇒ 07's DECLINE (fail closed) · issuance retries idempotent by platform ref · clearing-file gap detection (missing date ⇒ alert) · **CI guard:** log/DB linters reject PAN-shaped patterns (`\b\d{13,19}\b` Luhn-valid) anywhere in this repo's output fixtures.

## 4. Certification & tests
Processor sandbox suite: issue/freeze/close/auth-approve/auth-decline/timeout/duplicate-auth · webhook signature vectors (valid/expired/wrong-key) · minor-unit mapping property test (processor units ↔ `@platform/money`) · clearing-file golden files → settlement postings asserted in 04 via 09 fixture · Pact provider→07.
