# Design 06 — Wallets & Accounts Service

**Runtime:** NestJS 10 / TS strict · **Squad:** Accounts & Cards · **DB:** PostgreSQL 16 + Redis · **Docx:** `06_Service_Wallets_Accounts_Service.docx`

Customer-facing account layer: product instances, statements, balance views. **Never holds value** — every balance is composed from Ledger (04).

## 1. Domain

```ts
export interface Product {                 // configured template — new product = catalog entry
  id: ProductId; tenantId: TenantId; currencies: CurrencyCode[];
  eligibilityRulesRef: RuleSetRef; version: number;
}
export class Account {                     // instance of a Product, maps to N ledger accounts (1/ccy)
  status: 'ACTIVE' | 'DORMANT' | 'CLOSED';
  readonly ledgerAccountIds: Record<CurrencyCode, LedgerAccountId>;
  close(balances: Money[]) {
    if (balances.some(b => b.amountMinor !== 0n)) throw new NonZeroBalanceError();
    this.status = 'CLOSED';                // terminal
  }
}
export interface Statement { id: StatementId; accountId: AccountId; period: Period; documentRef: ObjectRef; }
// invariant: immutable once generated; correction = new linked amended statement
```

## 2. Ports

```ts
export interface OpenAccountUC { exec(ctx: TenantContext, customerId: CustomerId, productId: ProductId): Promise<AccountId>; }
export interface GetBalancesUC { exec(ctx: TenantContext, id: AccountId): Promise<Money[]>; }

export interface LedgerPort { balance(ctx: TenantContext, id: LedgerAccountId): Promise<Money>; }  // → 04 (Pact-locked)
export interface RulesPort  { eligible(ctx: TenantContext, ruleSet: RuleSetRef, facts: Json): Promise<Decision>; } // OPA / 12
export interface AccountRepository extends TenantScopedRepo<Account> {}                             // → 14
```

Balance view: Redis cache keyed `tenant:account:ccy`, invalidated by consuming `ledger.journal.posted.v1` (target: within the 2 s outbox-lag budget).

## 3. Data

```sql
CREATE TABLE products (id uuid, tenant_id uuid, name text, currencies char(3)[],
  eligibility_rules_ref text, version int, PRIMARY KEY (id, version));
CREATE TABLE accounts (id uuid PK, tenant_id uuid NOT NULL, customer_id uuid NOT NULL,
  product_id uuid NOT NULL, status text NOT NULL,
  ledger_account_ids jsonb NOT NULL);           -- {"PKR":"...","AED":"..."}
CREATE TABLE statements (id uuid PK, account_id uuid, period daterange, document_ref text, amended_from uuid);
```

## 4. API / Events
`POST /v1/accounts` (eligibility-gated) · `GET /v1/accounts/{id}/balances` · `POST /v1/accounts/{id}/close` (zero-balance rule) · `GET /v1/accounts/{id}/statements` (async job for long ranges).
Publishes `wallets.account.opened|closed.v1`; consumes `ledger.journal.posted.v1` (cache invalidation).

## 5. NFRs / Tests
Balance view p99 < 150 ms (cache) · statement (month) < 10 s async. `@platform/money` for all amounts pass-through. Tests: close-with-balance rejection, cache-invalidation timing test against injected ledger events, Pact consumer→04, isolation suite.
