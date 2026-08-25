# Design 16 — KYC / eKYC Provider Adapter

**Impl (v3.1):** TypeScript — NestJS injectable providers · **Consumer:** Identity (02) · **Docx:** `16_Adapter_KYC_eKYC_Provider_Adapter_Specification.docx`

Document verification, liveness, and national-ID / business-registry lookups behind one port. Launch runs **three parallel national integrations** — NADRA (PK), UAE Pass / Emirates ID (AE), Absher/Yakeen (SA) — plus a global document-verification vendor for passports/fallback, all satisfying the same `EkycProviderPort`.

## 1. Port (SPI)

```ts
export interface EkycProviderPort {
  startDocumentVerification(ctx: TenantContext, c: CustomerId, docs: DocumentImages): Promise<CaseRef>;
  startLivenessCheck(ctx: TenantContext, c: CustomerId, capture: BiometricCapture): Promise<CaseRef>;
  getVerificationResult(ctx: TenantContext, ref: CaseRef): Promise<VerificationResult>;   // poll; webhook preferred
  lookupNationalId(ctx: TenantContext, idNo: NationalIdNo, kind: IdKind): Promise<RegistryMatch>; // CNIC|EmiratesID|Iqama|NationalID
  lookupBusinessRegistry(ctx: TenantContext, regNo: string, jurisdiction: Iso3166): Promise<RegistryRecord>;
}
export interface VerificationResult {
  outcome: 'APPROVED' | 'REJECTED' | 'REVIEW';
  checks: CheckResult[];            // doc-authenticity, face-match, liveness, registry-match — each pass/fail/score
  evidenceRefs: ObjectRef[];        // object storage only; never inline PII blobs
  providerCaseRef: string;
}
```

## 2. Provider bindings (launch)

| Binding | Market | Strength | Notes |
|---|---|---|---|
| `nadra` | PK | CNIC/NICOP biometric + registry | Strongest PK tier; onboarding via NADRA e-Sahulat/API agreements |
| `uaepass` | AE | Emirates ID lookup + UAE Pass federated verification | UAE Pass can short-circuit doc capture entirely |
| `yakeen` | SA | Absher/Yakeen (NIC) Iqama/National ID lookup | In-Kingdom call path only (residency) |
| `globaldoc` | all | Passport/doc + liveness vendor | Fallback + non-resident flows |
| `mock` | sandbox | Deterministic fixtures | Bound in sandbox namespaces |

## 3. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_provider` | enum | Tenant + jurisdiction | e.g. PK→nadra, AE→uaepass, SA→yakeen |
| `verification_level` | basic\|standard\|enhanced | Pack | Which checks are mandatory |
| `accepted_document_types` | array | Pack | CNIC/NICOP · EmiratesID/passport · NationalID/Iqama |
| `evidence_retention` | duration | Pack | Crypto-shred on expiry/erasure |
| `webhook_secret_ref` | vault ref | Provider | Signed result callbacks |

## 4. Resilience & privacy
Timeout/5xx ⇒ case → `MANUAL_REVIEW` (consumer rule; adapter throws honestly) · poll fallback when webhooks late · evidence uploaded straight to region-local object storage, adapter passes refs only · national-ID numbers logged masked (`CNIC ****-****123-*`) · KSA calls pinned to in-Kingdom egress.

## 5. Certification & tests
Per-provider sandbox fixture suite: valid / expired / tampered doc, face-mismatch, liveness-replay attack, registry no-match — expected `VerificationResult` asserted (**pack-certification blocking**). Webhook signature vectors. Mapper parity: same fixture semantics across all bindings. Pact provider→02. Residency test: `sa`-tenant flows produce zero non-Kingdom egress (network-policy assertion).
