---
adr: 0002
title: FX conversion — booking, rate provenance, and statement reporting
status: Accepted
date: 2026-07-29
deciders: Ledger & Money Movement, Pricing & Billing, Platform / Enablement
affects: Ledger (04), Pricing (10), FX Rate adapter (17), Wallets (06)
supersedes: —
---

# ADR-0002 — FX conversion: booking, rate provenance, and statement reporting

## Context

The v3.1 blueprint specifies exact-money discipline (integer minor units, `BigDecimal` rates, `Money.applyRate` as the sole decimal gateway) and a `Journal.balanced()` invariant that balances **per currency**. It also specifies that the FX adapter (17) returns raw mid-market rates and that Pricing (10) applies the margin.

Review of the specifications found **six related decisions unspecified**. Each is small; together they determine whether a cross-currency transaction can be booked, audited and shown to a customer:

1. How a cross-currency conversion is booked, given journals balance per currency (a single journal cannot balance across two currencies without a bridge account).
2. Which currency the FX spread is recognised in.
3. Where `rate_mid` and the customer rate are recorded — `journals` has no rate column and no reference to the quote that produced it, so a booked entry cannot be traced to the rate that created it.
4. Where the customer-statement display fields (original amount, original currency, applied rate) live, given ledger and quote retention periods may differ.
5. The scale/precision of an FX rate — `BigDecimal` with no fixed scale breaks `equals()` comparisons and the byte-identical determinism guarantee in Pricing.
6. Whether the Ledger may call `FxRatePort` on the posting path (it holds the port, but the legitimate uses are narrow).

Without these, the Ledger cannot correctly book an AED↔PKR conversion, and a customer statement or dispute response cannot be reconstructed.

## Decision

### D1 — Rate provenance: authoritative in Pricing, referenced from the Ledger

`rate_mid`, the applied margin, and the derived customer rate remain authoritative in Pricing's immutable `quotes.fx_snapshot`. The Ledger does **not** become a second source of truth for rates.

The Ledger's `journals` table gains a nullable reference to the quote:

```sql
ALTER TABLE journals ADD COLUMN quote_id uuid;          -- null for non-priced journals
CREATE INDEX ON journals (tenant_id, quote_id);
```

A journal produced by a priced operation MUST carry `quote_id`. This is the audit link from a booked entry to the rate decision that produced it.

### D2 — Statement display fields are snapshotted onto the journal

Because ledger retention (typically 10 years) exceeds quote retention, the display fields are denormalised onto the journal at posting time as clearly-labelled reference data — not as postings, and not as a rate source for any calculation:

```sql
ALTER TABLE journals ADD COLUMN display_meta jsonb;
-- { "originalAmountMinor": 100000, "originalCurrency": "AED",
--   "appliedRate": "75.73500000", "rateMid": "76.50000000", "quoteId": "..." }
```

Precedence rule: while the quote exists it is authoritative; `display_meta` exists so statements and dispute responses remain reproducible after quote retention lapses. Any discrepancy is a reconciliation defect, not a judgement call — the quote wins.

### D3 — The FX spread is recognised in the customer's charged (funding) currency

For any conversion, the spread posts to `FX-Revenue-<funding currency>`. In both launch corridors the customer funds in a single currency, so the spread is unambiguous and revenue accounts do not proliferate per corridor pair.

### D4 — Conversion is one journal with per-currency balanced groups via FX position accounts

A conversion is a single journal whose currency groups each sum to zero independently (satisfying the existing `Journal.balanced()` invariant), bridged by per-currency FX position accounts. Worked example — 1,000 AED → PKR, mid 76.50, margin 1.0%, customer rate 75.735:

```
Journal J-1001   type: FX_CONVERSION   quote_id: Q-8823
  Dr  Customer-AED        1,000.00 AED
  Cr  FX-Position-AED     1,000.00 AED         AED group = 0 ✓
  Dr  FX-Position-PKR    76,500.00 PKR
  Cr  Customer-PKR       75,735.00 PKR
  Cr  FX-Revenue-PKR        765.00 PKR         PKR group = 0 ✓
```

The mirrored direction (PKR funding an AED payout) posts the spread to `FX-Revenue-PKR` under D3.

### D5 — FX rates are fixed at scale 8, compared with `compareTo`

```java
public record Rate(CurrencyPair pair, BigDecimal mid, Instant asOf, RateSource source) {
  public Rate {
    if (mid.signum() <= 0) throw new InvalidRateException(pair, mid);
    mid = mid.setScale(8, RoundingMode.HALF_EVEN);   // canonical scale — enforced at construction
  }
}
```

Storage is `NUMERIC(18,8)`. Rate equality and sanity-band comparison MUST use `compareTo`, never `equals` (which is scale-sensitive). This is what makes Pricing's byte-identical determinism guarantee achievable.

Note this does not change the existing rule: the FX library still never rounds **money** and never returns a float. Scale-8 canonicalisation applies to the rate only; money rounding remains solely in `Money.applyRate(BigDecimal, RoundingMode)`.

### D6 — The posting path must never look up a rate

The Ledger's `FxRatePort` is permitted for exactly three uses, none of which is deriving a customer-facing posted amount:

| Permitted use | Nature |
|---|---|
| Indicative consolidated balance in a display currency | Read-time derivation; labelled indicative; never stored, never posted |
| Scheduled period-end revaluation of FX position accounts | A deliberate posting with its own documented rate and approval |
| Sanity-guard rejecting a supplied rate that is far off market | A validation, not a derivation |

Enforced by an ArchUnit rule: no call path from the posting use-case to `FxRatePort.midRate`. The rate always arrives as an input to the posting.

### D7 — Pakistan pilot ships the single-currency model

For the PK inbound-remittance pilot, recipients hold PKR only; conversion occurs at the corridor/partner boundary and the Ledger books PKR exclusively. FX position accounts and the `FX_CONVERSION` journal type (D4) are **built but not activated** until a tenant offers genuine multi-currency wallets.

The per-currency balancing invariant, `quote_id`, `display_meta` and D5/D6 all apply from L1 regardless — they are cheap now and expensive to retrofit.

## Consequences

**Positive.** A booked entry is traceable to its rate decision. Statements and dispute responses are reproducible for the full ledger retention period. Determinism in Pricing becomes testable. Rate drift between quote and settlement is structurally impossible (D6). Multi-currency capability exists without being switched on before it is needed (D7).

**Costs.** Two columns on `journals` and a jsonb payload that must be kept consistent with the quote (covered by a reconciliation check). A chart-of-accounts addition for FX position and revenue accounts per currency. `display_meta` is a deliberate denormalisation, justified only by the retention asymmetry.

**Rejected alternative.** Copying `rate_mid`/`rate_customer` into `journals` as the primary record was rejected: two authoritative sources can disagree, and in a dispute there would be no defensible answer as to which governs.

## Follow-up actions

- [ ] Ledger (04): add `quote_id` + `display_meta` to the DDL; add the ArchUnit rule for D6; add the `FX_CONVERSION` journal type behind a capability flag.
- [ ] FX adapter (17): enforce scale 8 in the `Rate` constructor; `NUMERIC(18,8)` storage; property test asserting `compareTo` semantics.
- [ ] Pricing (10): record the funding currency on the quote so D3 is derivable, not inferred.
- [ ] Chart of accounts: define `FX-Position-<ccy>` and `FX-Revenue-<ccy>` for PKR, AED, SAR.
- [ ] Reconciliation (09): add a check that `journals.display_meta.appliedRate` matches the referenced quote while the quote exists.
