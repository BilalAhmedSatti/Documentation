# Design 24 — Credit / Risk Bureau Adapter ★ shared (Banking + Takaful)

**Impl:** TypeScript — NestJS injectable providers · **Owning squad:** Platform Adapters (shared) · **Status:** design draft — nothing built · **Docx:** `24_Adapter_Credit_Risk_Bureau_Adapter_Specification.docx`

Consent-gated credit-bureau inquiry behind one port. Banking uses it for lending limits and risk checks; Takaful for underwriting risk and contribution-default scoring. Launch bureaus: **eCIB** (SBP, PK — plus private supplements), **AECB** (UAE), **SIMAH** (SA). Every call carries `tenant_id` **and** `app_id`.

## 1. Port (SPI)

```ts
export const BUREAU_PORT = Symbol('BureauPort');
export interface BureauPort {
  getScore(ctx: SharedCtx, subject: SubjectId, purpose: PurposeCode, consent: ConsentRef): Promise<RiskScore>;
  getReport(ctx: SharedCtx, subject: SubjectId, purpose: PurposeCode, consent: ConsentRef): Promise<CreditReport>;
  monitorSubject(ctx: SharedCtx, subject: SubjectId, consent: ConsentRef): Promise<MonitoringRef>; // where supported
  healthCheck(): Promise<ProviderHealth & { dataFreshness: LocalDate }>;
}
export interface SharedCtx extends TenantContext { appId: 'banking' | 'takaful'; }
export interface RiskScore { normalized: number /*0..1000*/; band: 'A'|'B'|'C'|'D'|'E';
  bureauNative: number; freshnessDate: LocalDate; consentRef: ConsentRef; inquiryRef: InquiryRef; }
// Thin file ⇒ { normalized: null, band: 'UNRATED' } — NEVER a synthetic score.
```

**Consent is a hard precondition** — no bypass flag exists. `ConsentRef` is verified via the E-Sign/Consent adapter (26) before any bureau call; expired/revoked/scope-mismatch each raise a distinct error type.

## 2. Bindings (launch)

| Binding | Market | Notes |
|---|---|---|
| `ecib` | PK | SBP's regulatory bureau; mandated inquiry/reporting for regulated lenders; thin files common — pair with `thin_file_policy`; confirm takaful-operator access class with SBP/SECP |
| `pk-private` | PK | Tasdeeq/DataCheck-class supplementary signal; never a substitute for a mandated eCIB inquiry |
| `aecb` | AE | Al Etihad Credit Bureau; strict purpose-of-inquiry + consent enforcement; insurance-purpose terms confirmed at certification |
| `simah` | SA | Saudi Credit Bureau; in-Kingdom processing; licence class per consumer type |
| `mock` | sandbox | Deterministic fixtures: scored / thin-file / defaulted / disputed subjects |

## 3. Config (via control plane, Design 12)

`bound_bureau` (country) · `purpose_code_map` (app+country — platform purposes → bureau codes) · `consent_validity_window` (country pack) · `cache_ttl` (**bureau-licence constrained**) · `app_quotas` (per-app inquiry quotas — bureaus bill per pull) · `thin_file_policy` (app+pack).

## 4. Resilience
Bureau down ⇒ REVIEW-grade error (never auto-approve, never over-TTL cache) · circuit breaker per binding · retries transport-only, never on billed report pulls · idempotent by platform `inquiryRef` window (no double-billing on client retry) · freshness date surfaced on every result.

## 5. Certification & tests
Fixture suite per bureau (scored/thin/defaulted/disputed) → expected normalized `RiskProfile` · consent gating triple (missing/expired/revoked ⇒ rejected) · purpose-code map verified per app against the bureau's current list · cache behaviour matches licence · billing reconciliation per `app_id` against the bureau statement · **Pact provider for BOTH apps (blocking)** · mapper monotonicity property test (higher native never maps lower normalized) · isolation + `sa` zero non-Kingdom egress.
