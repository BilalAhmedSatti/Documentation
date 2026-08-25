# Design 04 — Ledger Service ★ JVM island

**Runtime:** Java 21 + Spring Boot 3.3 (deliberate, per v3.1 §11.1) · **Squad:** Ledger & Money Movement · **DB:** PostgreSQL 16 (append-only enforced) · **Docx:** `04_Service_Ledger_Service.docx`

System of record for value. Double-entry, append-only; balances are projections. Nothing else on the platform may hold a balance. Stays on the JVM for BigDecimal/long-minor-unit exactness, ArchUnit, and throughput on the posting hot path.

## 1. Repo layout (`service-template-jvm`)

```
src/main/java/com/platform/ledger/
  domain/        Money, Journal, Posting, Hold, invariants — zero Spring imports
  application/   PostJournalUseCase, HoldLifecycleUseCase, ReverseJournalUseCase
  ports/in/      LedgerCommands, LedgerQueries
  ports/out/     JournalRepository, BalanceProjection, EventPublisher(Outbox)
  adapters/rest/ · adapters/persistence/ (jdbc) · adapters/events/ (outbox table writer)
src/test/architecture/HexagonalRulesTest.java   (ArchUnit — build blocking)
```

## 2. Domain

```java
public record Money(long amountMinor, Currency currency) {
  public Money { Objects.requireNonNull(currency); }
  public Money add(Money o) { requireSame(o); return new Money(Math.addExact(amountMinor, o.amountMinor), currency); }
  public Money negate() { return new Money(Math.negateExact(amountMinor), currency); }
}

public final class Journal {                       // aggregate root — balanced or it doesn't exist
  private final JournalId id; private final TenantId tenantId;
  private final List<Posting> postings;            // immutable after commit
  public static Journal balanced(TenantId t, List<PostingLine> lines, IdempotencyKey key) {
    Map<Currency, Long> sums = lines.stream().collect(groupingBy(l -> l.money().currency(),
        summingLong(l -> l.direction() == DEBIT ? l.money().amountMinor() : -l.money().amountMinor())));
    if (sums.values().stream().anyMatch(s -> s != 0L)) throw new UnbalancedJournalException(sums);
    return new Journal(...);
  }
  public Journal reversal(Reason r) { /* equal-and-opposite postings, linked, original untouched */ }
}

public final class Hold {   // PLACED -> CAPTURED | RELEASED (terminal, exactly one)
  public Capture capture() { assertState(PLACED); ... }
  public Release release() { assertState(PLACED); ... }
}
```

Rounding: `HALF_EVEN` for balance-affecting derivations; contract-specified mode at explicit fee/FX posting points only — `Money.applyRate(BigDecimal, RoundingMode)` is the sole decimal gateway.

## 3. Ports

```java
public interface LedgerCommands {                                  // inbound
  JournalId post(TenantContext ctx, List<PostingLine> lines, IdempotencyKey key);
  HoldId placeHold(TenantContext ctx, AccountId a, Money m, HoldReason r, IdempotencyKey key);
  void captureHold(TenantContext ctx, HoldId id, IdempotencyKey key);
  void releaseHold(TenantContext ctx, HoldId id, IdempotencyKey key);
  JournalId reverse(TenantContext ctx, JournalId original, Reason reason, IdempotencyKey key);
}
public interface JournalRepository {                               // outbound → Design 14 (Java impl)
  void append(Journal j);                        // INSERT-only; same tx as outbox row
  Optional<Journal> byIdempotencyKey(TenantContext ctx, IdempotencyKey k);
}
public interface FxRatePort { Rate rate(CurrencyPair p, Instant asOf); }   // → Design 17 (in-process JVM lib)
// ADR-0002 D6: NOT callable from the posting path (ArchUnit-enforced). Permitted only for
// (a) indicative consolidated balance, (b) scheduled FX-position revaluation, (c) supplied-rate sanity guard.
// The rate always arrives as an INPUT to a posting — never looked up while posting.
```

## 4. Posting sequence (with outbox)

```mermaid
sequenceDiagram
  Caller->>Ledger: POST /v1/journals (Idempotency-Key)
  Ledger->>Ledger: byIdempotencyKey? — replay stored result if present
  Ledger->>Ledger: Journal.balanced(lines)  %% domain invariant
  Ledger->>Postgres: BEGIN; INSERT journals+postings; INSERT outbox; COMMIT
  Postgres--)Debezium: CDC outbox row
  Debezium--)Kafka: ledger.journal.posted.v1
  Kafka--)BalanceProjector: update balances read model (+ Redis cache)
```

## 5. Data (append-only enforced at the DB)

```sql
CREATE TABLE journals  (id uuid PRIMARY KEY, tenant_id uuid NOT NULL, status text NOT NULL,
  idempotency_key text NOT NULL, created_at timestamptz NOT NULL,
  quote_id uuid,                    -- ADR-0002 D1: audit link to the Pricing quote that set the rate
  display_meta jsonb,               -- ADR-0002 D2: {originalAmountMinor, originalCurrency, appliedRate, rateMid}
  UNIQUE (tenant_id, idempotency_key));
CREATE INDEX ON journals (tenant_id, quote_id);
CREATE TABLE postings  (id uuid PRIMARY KEY, journal_id uuid NOT NULL REFERENCES journals(id),
  account_id uuid NOT NULL, currency char(3) NOT NULL, amount_minor bigint NOT NULL,
  direction char(1) NOT NULL CHECK (direction IN ('D','C')));
CREATE INDEX ON postings (account_id, currency);
REVOKE UPDATE, DELETE ON journals, postings FROM ledger_app;      -- corrections are reversals
CREATE TABLE holds (id uuid PK, account_id uuid, currency char(3), amount_minor bigint,
  status text CHECK (status IN ('PLACED','CAPTURED','RELEASED')), expires_at timestamptz);
CREATE MATERIALIZED VIEW balances AS
  SELECT account_id, currency,
         SUM(CASE direction WHEN 'C' THEN amount_minor ELSE -amount_minor END) AS ledger_minor
  FROM postings GROUP BY account_id, currency;   -- rebuildable; Redis-fronted
```

## 6. API / Events
`POST /v1/journals` · `POST /v1/holds` · `POST /v1/holds/{id}/capture|release` · `GET /v1/accounts/{id}/balance` (projection) · `POST /v1/journals/{id}/reversal`.
Publishes `ledger.journal.posted.v1`, `ledger.hold.placed|captured|released.v1`, `ledger.journal.reversed.v1`. Consumes none.

## 7. NFRs
Post p99 < 200 ms · balance read p99 < 50 ms (cache) · zero lost postings (sync replication before ack) · Enterprise silo always, tightest RPO/RTO in §18 · nightly projector-vs-postings reconciliation job alerts on any drift.

## 7b. FX conversion booking (ADR-0002)

Rates are **not** managed here. Pricing (10) locks the rate; the Ledger books what it is handed and records the provenance.

- **Provenance (D1):** `rate_mid` / margin / customer rate stay authoritative in `quotes.fx_snapshot` (Design 10). `journals.quote_id` is the audit link. The Ledger is never a second source of truth for rates.
- **Statement fields (D2):** `journals.display_meta` snapshots `{originalAmountMinor, originalCurrency, appliedRate, rateMid}` so statements and dispute responses stay reproducible after quote retention lapses. The quote wins on any discrepancy.
- **Spread currency (D3):** the FX spread posts to `FX-Revenue-<funding currency>` — the currency the customer was charged in.
- **Journal shape (D4):** one journal, per-currency groups each summing to zero, bridged by `FX-Position-<ccy>`:

```
Journal J-1001   type: FX_CONVERSION   quote_id: Q-8823      -- 1,000 AED → PKR, mid 76.50, margin 1%
  Dr Customer-AED      1,000.00 AED   |  Cr FX-Position-AED    1,000.00 AED   -- AED group = 0
  Dr FX-Position-PKR  76,500.00 PKR   |  Cr Customer-PKR      75,735.00 PKR
                                      |  Cr FX-Revenue-PKR       765.00 PKR   -- PKR group = 0
```

- **Pilot scope (D7):** PK inbound remittance books PKR only (conversion happens at the corridor boundary). `FX_CONVERSION` and the position accounts are built behind a capability flag, activated when multi-currency wallets ship.

### Reporting model

| Report | Built from | Live FX rate? |
|---|---|---|
| Customer statement | the customer's own postings + `display_meta` | No — shows the rate that applied |
| Consolidated balance | postings valued at read time | Yes — labelled **indicative**, never stored |
| FX revenue / treasury | `FX-Revenue-*` and `FX-Position-*` postings | No — the spread was booked exactly |

## 8. Tests
**Property-based Money suite** (jqwik): add/negate/applyRate closure, no overflow (`Math.*Exact`), rounding table per currency. Unbalanced-journal fuzzing must always throw. Idempotency replay test (same key twice ⇒ same JournalId, one row). ArchUnit gate **including ADR-0002 D6** (no posting-path call to `FxRatePort.midRate`). Conversion-journal test: per-currency groups each sum to zero and the spread lands in the funding currency. `display_meta`-vs-quote consistency test. Testcontainers PG with the REVOKE in place — an UPDATE attempt in tests must fail. Pact provider for Payments/Wallets/Cards/Pricing consumers (TS↔JVM seam: blocking).
