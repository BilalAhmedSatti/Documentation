# Design 09 — Reconciliation Service

**Runtime:** NestJS 10 / TS strict · **Squad:** Ledger & Money Movement · **Docx:** `09_Service_Reconciliation_Service.docx`

Three-way match: Ledger postings ↔ Payments records ↔ rail statements (Raast / Aani / sarie / x-border partner). Breaks are investigated; resolution goes **through Ledger reversals**, never a data patch. All amount comparison in integer minor units.

## 1. Domain

```ts
export class ReconciliationRun {          // immutable result set; re-run = new run
  readonly id: RunId; readonly tenantId: TenantId; readonly rail: RailKey; readonly window: Period;
  match(internal: InternalSide, statement: StatementLine[]): MatchOutcome;   // pure; tolerance from config
}
export class Break {
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  resolve(res: Resolution, ledgerAdjustmentRef: JournalId) {  // linked reversal mandatory
    if (!ledgerAdjustmentRef) throw new AdjustmentRefRequired();
  }
}
export interface MatchTolerance { maxDiffMinor: bigint; }     // e.g. 0n default; rounding-diff per rail config
```

## 2. Ports

```ts
export interface IngestStatementUC { exec(ctx: TenantContext, rail: RailKey, file: FileRef): Promise<RunId>; }
export interface LedgerQueryPort   { postings(ctx: TenantContext, w: Period): AsyncIterable<PostingRecord>; }  // → 04 (Pact)
export interface PayoutStatementPort { fetch(ctx: TenantContext, rail: RailKey, p: Period): Promise<StatementLine[]>;
                                       parse(rail: RailKey, raw: Buffer): StatementLine[]; }                   // → 19
export interface BreakRepository extends TenantScopedRepo<Break> {}
```

Parsers in `adapters/external/parsers/`: `raast.csv.ts`, `aani.iso20022.ts` (camt.053), `sarie.iso20022.ts`, `xborder.partner.ts` — fixture-tested, format changes caught by contract fixtures.

## 3. Data

```sql
CREATE TABLE reconciliation_runs (id uuid PK, tenant_id uuid, rail text,
  window_start date, window_end date, matched int, unmatched int, executed_at timestamptz);
CREATE TABLE breaks (id uuid PK, run_id uuid, tenant_id uuid, status text,
  internal_ref text, statement_ref text, amount_diff_minor bigint, currency char(3),
  opened_at timestamptz, resolved_at timestamptz, ledger_adjustment_ref uuid);
```

Aging job → SLA alert on stale breaks.

## 4. API / Events / NFRs / Tests
`POST /v1/reconciliation/runs` · `GET /v1/reconciliation/breaks?status=` · `POST /v1/reconciliation/breaks/{id}/resolve`.
Publishes `reconciliation.break.opened|resolved.v1`; consumes `ledger.journal.posted.v1`, `payments.transfer.completed.v1`.
NFRs: break detection within one statement cycle; false-positive rate < 1 % monitored monthly. Tests: parser golden files per rail (incl. malformed rows); tolerance boundary cases; resolve-without-adjustment rejection; Pact consumer→04/19.
