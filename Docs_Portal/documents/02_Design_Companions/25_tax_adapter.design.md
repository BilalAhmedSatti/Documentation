# Design 25 — Country Tax Computation Adapter ★ shared (Banking + Takaful)

**Impl:** TypeScript — pure rule-table computation on `@platform/money` (judged against the v3.1 JVM rule; eligible to move to a Java library like FX/17 if complexity grows — a packaging change, ports are language-agnostic) · **Owning squad:** Platform Adapters · **Status:** design draft · **Docx:** `25_Adapter_Country_Tax_Computation_Adapter_Specification.docx`

Computes every tax/levy line the platform applies — WHT/VAT on banking fees, levies/VAT on takaful contributions and wakala fees. **It computes; it never files** (filing stays with Compliance Reporting 08). Deterministic and explainable by construction: same inputs + same pack version = byte-identical output; every line traceable to `{ruleId, rulePackVersion}`.

## 1. Port (SPI)

```ts
export interface TaxPort {
  computeLevies(ctx: SharedCtx, op: TaxableOperation, amounts: MoneySet,
                country: 'PK'|'AE'|'SA', asOf: LocalDate): Promise<TaxComputation>;
  explain(ctx: SharedCtx, ref: ComputationRef): Promise<LineDerivation[]>;   // audit surface
  effectiveRules(country: Country, asOf: LocalDate): Promise<RulePackSummary>;
  healthCheck(): Promise<{ loadedPacks: Record<Country, Semver> }>;          // missing pack = hard startup error
}
export interface TaxComputation { lines: TaxLine[]; total: Money; ref: ComputationRef; }
export interface TaxLine { type: 'WHT'|'VAT'|'PROVINCIAL_SERVICES_TAX'|'LEVY'|'STAMP';
  label: string; ruleId: RuleId; rulePackVersion: Semver;
  base: Money; rate: string; amount: Money; }   // Σ lines === total — property-tested
```

Rules are **data**: versioned, effective-dated tables in the control plane's country-pack hierarchy (same publish → maker-checker → promote → rollback lifecycle as compliance packs). Rate changes are new rows, never edits.

## 2. Authority packs (launch)

| Pack | Authority | Key content | Watch-outs |
|---|---|---|---|
| PK | FBR + provincial (SRB/PRA/KPRA) | WHT schedules on fees/commission; services sales tax | Services taxation is largely **provincial** — pack keyed by province of service; annual Finance Act cadence |
| AE | FTA | VAT 5% | Financial-services nuance: margin-based often exempt, explicit fees standard-rated — classification is a counsel-confirmed pack decision |
| SA | ZATCA | VAT 15% | **Zakat is entity-level — out of transaction scope**; FATOORA e-invoicing hooks live in 08, not here |

## 3. Config
`rule_pack_version` (semver, immutable) · `rounding_mode` per levy (explicit, authority-mandated) · `effective_dating` (validFrom/validTo rows) · `product_exemptions` (app+pack — e.g. takaful contribution treatment vs banking fee) · `app_id` scoping built-in.

## 4. Resilience
No runtime dependency on authorities (rules are local data) ⇒ no provider-outage mode · missing/unloadable pack **fails closed at startup** — never silent zero-tax · stateless, horizontally scalable · `computationRef` audit records stored in the consuming app's data plane (residency-correct).

## 5. Certification & tests
**Golden calculation tables per market, signed off by tax counsel** (banking fee, remittance, contribution, wakala fee, claim payout) — blocking for pack activation · effective-date boundary triple (day before/on/after a rate change) · rounding per authority rules · Pricing (10) cross-check: quote totals reconcile (TS↔JVM seam, Pact-blocking) · property tests: Σ lines = total for arbitrary inputs; determinism byte-for-byte; no native `number` (ESLint money rule) · pack-schema validation rejects overlapping date rows at publish time · rate-change drill with turnaround SLA.
