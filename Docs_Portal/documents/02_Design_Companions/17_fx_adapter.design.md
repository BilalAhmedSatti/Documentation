# Design 17 — FX Rate Provider Adapter ★ JVM library

**Impl (v3.1):** Java 21 **library module** (`platform-fx`), consumed **in-process** by Ledger (04) and Pricing (10) — no network hop on the quote path · **Docx:** `17_Adapter_FX_Rate_Provider_Adapter_Specification.docx`

Serves raw **mid-market** rates; margin/spread is Pricing's job, never applied here. Launch pairs: PKR↔USD, PKR↔AED, PKR↔SAR, AED↔USD, SAR↔USD, AED↔SAR (UAE→PK and KSA→PK corridors first).

## 1. Port (Java SPI)

```java
public interface FxRatePort {
  Rate midRate(CurrencyPair pair, Instant asOf);          // throws StaleRateException past tolerance
  Optional<Rate> historicalRate(CurrencyPair pair, LocalDate date);   // reporting/recon
  RateSnapshot snapshot(Set<CurrencyPair> pairs);          // bound into a Quote (Design 10)
}
public record Rate(CurrencyPair pair, BigDecimal mid, Instant asOf, RateSource source) {
  public Rate {
    if (mid.signum() <= 0) throw new InvalidRateException(pair, mid);
    mid = mid.setScale(8, RoundingMode.HALF_EVEN);   // ADR-0002 D5: canonical scale 8, enforced at construction
  }
}
// ADR-0002 D5: storage NUMERIC(18,8). Rate equality and sanity-band comparison MUST use compareTo,
// never equals (scale-sensitive) — this is what makes Pricing's byte-identical determinism achievable.
public record CurrencyPair(Currency base, Currency quote) { }   // ISO 4217 registry-validated
```

All arithmetic downstream goes through `Money.applyRate(BigDecimal, RoundingMode)` — this library never returns floats and never rounds **money**.

> **Clarification (ADR-0002 D5).** "Never returns floats" bans `float`/`double` (inexact binary), not decimals: rates are `BigDecimal`, the exact decimal type, canonicalised to scale 8. "Never rounds" means the library does not decide *money* rounding — full rate precision is handed to `Money.applyRate`, the sole decimal gateway, so rounding happens exactly once with an explicit mode. Rate scale-8 canonicalisation is not money rounding.

## 2. Feed adapters (behind the same port)

| Binding | Role | Notes |
|---|---|---|
| `commercial-primary` | Real-time quoting source | Streaming/pull commercial feed; per-pair subscription |
| `commercial-secondary` | Failover | Different vendor; sanity-band cross-check |
| `centralbank-ref` | Daily reference | SBP (PKR) · CBUAE (AED) · SAMA (SAR) published rates — reporting/recon cross-check only, never sole real-time source |
| `fixed-test` | Sandbox | Deterministic table |

## 3. Cache & staleness (in-process)

```java
final class CachedFxRatePort implements FxRatePort {
  private final LoadingCache<CurrencyPair, Rate> cache =    // Caffeine
      Caffeine.newBuilder().refreshAfterWrite(cfg.refresh())            // e.g. 5s majors
              .expireAfterWrite(cfg.staleTolerance()).build(loader);    // e.g. 60s hard stop
  public Rate midRate(CurrencyPair p, Instant asOf) {
    Rate r = cache.get(p);
    if (r.asOf().isBefore(asOf.minus(cfg.staleTolerance()))) throw new StaleRateException(p, r.asOf());
    if (!sanityBand.contains(p, r.mid())) throw new RateOutOfBandException(p, r.mid());  // fat-finger guard
    return r;                                                   // stale/out-of-band ⇒ quoting halts (fail closed)
  }
}
```

## 4. Config schema (via Design 12)

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_feed` | enum | Region/tenant | Primary binding; secondary listed for failover |
| `refresh_interval` / `stale_tolerance` | duration | Pair class | Majors vs exotics |
| `sanity_band_pct` | decimal | Pair | Deviation-vs-last-good guard |
| `pairs_enabled` | array | Region | Launch set above; new market = config row |

## 5. Certification & tests
Deterministic-snapshot test: quote replays byte-identical with a pinned `RateSnapshot`. Staleness/out-of-band ⇒ exception (never a silent last-good). Failover drill primary→secondary under load. Cross-check job: daily central-bank ref vs commercial mid within tolerance ⇒ alert otherwise. jqwik property tests on pair/rate validation. Consumed via direct DI in 04/10 — covered by their ArchUnit + unit suites (no Pact needed: in-process).
