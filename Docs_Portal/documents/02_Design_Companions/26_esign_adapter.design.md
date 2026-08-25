# Design 26 — E-Signature / Consent Capture Adapter ★ shared (Banking + Takaful)

**Impl:** TypeScript — NestJS injectable providers per signing scheme · **Owning squad:** Platform Adapters · **Status:** design draft · **Docx:** `26_Adapter_E_Signature_Consent_Adapter_Specification.docx`

Signing envelopes + first-class consent records. Banking: account/loan/mandate agreements, bureau-inquiry consent. Takaful: policy documents, wakala agreement, claim forms. **The evidence bundle is the product** — who signed, authenticated how, when, document hashes, device/channel, certificate chain — stored region-local per residency (a KSA signer's evidence never leaves the Kingdom), retained per pack.

## 1. Port (SPI)

```ts
export interface SignaturePort {
  createEnvelope(ctx: SharedCtx, docs: DocumentRef[], signers: Signer[], wf: Workflow): Promise<EnvelopeRef>;
  getStatus(ctx: SharedCtx, env: EnvelopeRef): Promise<EnvelopeStatus>;              // webhook preferred, poll fallback
  downloadEvidenceBundle(ctx: SharedCtx, env: EnvelopeRef): Promise<EvidenceBundle>; // the legal artefact
  captureConsent(ctx: SharedCtx, subject: SubjectId, type: ConsentType, scope: Scope[], via: Channel): Promise<ConsentRef>;
  verifyConsent(ctx: SharedCtx, ref: ConsentRef, required: Scope): Promise<'VALID'|'EXPIRED'|'REVOKED'|'SCOPE_MISMATCH'>;
  revokeConsent(ctx: SharedCtx, ref: ConsentRef, reason: string): Promise<RevocationRecord>; // append-only, immediate
}
// Documents hashed at envelope creation — any later byte change voids the envelope (loud tamper detection).
// verifyConsent is a LOCAL high-availability read path — never depends on the external scheme being up.
```

Consent records are append-only: `{ consentRef, subject, consentType, scope[], capturedVia, validFrom, validUntil, revokedAt?, evidenceRef }`. The Bureau adapter (24) verifies against these before any inquiry.

## 2. Bindings (launch)

| Binding | Market | Basis | Watch-outs |
|---|---|---|---|
| `uaepass_sign` | AE | UAE Pass national digital-signature capability | Signature levels / doc-class eligibility per current UAE Pass terms; consumer vs KYB flows differ |
| `nafath_linked` | SA | Nafath authentication + licensed Saudi trust-service provider signing | Auth (Nafath) vs signature-creation (TSP) split must be explicit in the evidence bundle; in-Kingdom evidence |
| `pk_certified_esign` | PK | Electronic Transactions Ordinance 2002 + ECAC-accredited providers | Assurance-level taxonomy less standardized — `signature_level` mapping per doc class needs counsel sign-off |
| `global_vendor` | all | DocuSign-class fallback | Cross-border/KYB signers, scheme-gap coverage; vendor storage residency must be verified per market |
| `mock` | sandbox | Deterministic | Bound in sandbox namespaces |

## 3. Config
`bound_scheme` per doc class (country+app) · `signature_level` per document class (simple / advanced / qualified-equivalent — **counsel-confirmed pack decision**) · `evidence_retention` (pack; insurance evidence typically outlives banking mandates) · `consent_taxonomy` (controlled `consentType`+`scope` list per app) · `webhook_secret_ref` · `app_id` scoping built-in.

## 4. Resilience
Scheme outage queues envelopes with expiry alerts — never silently downgrades signature level · webhooks signature-verified + deduped by (provider, envelopeRef, event); poll fallback · hash mismatch ⇒ distinct void error · evidence bundle written region-local **before** envelope reports complete (else PENDING_EVIDENCE) · consent reads local/HA.

## 5. Certification & tests
Validity vectors per scheme (valid / expired-cert / wrong-signer / tampered-doc) · evidence completeness audit (identity, auth method, trusted timestamps, hashes, cert chain, channel) · `sa` zero non-Kingdom egress · **end-to-end consent lifecycle across adapters 26→24**: capture → verify → bureau inquiry → revoke → verify-fails · counsel sign-off of `signature_level` per doc class before pack activation · Pact provider for Banking, Takaful **and** adapter 24 (blocking) · hash-chain property test · RTL determinism: ur-PK (Nastaliq) and ar-AE/ar-SA documents render + hash deterministically through the pipeline.
