# Design 18 — Core Banking Host Adapter

**Impl (v3.1):** TypeScript — NestJS injectable provider in Payments (05) / Wallets (06) integration paths · **Docx:** `18_Adapter_Core_Banking_Host_Adapter_Specification.docx`

For Enterprise tenants whose **existing core** (e.g. a Temenos/Flexcube-class host) stays the ultimate book of record: translates platform commands to the host's format (ISO 20022 / ISO 8583 / proprietary) and back. The platform Ledger (04) still records platform-side entries; **which side is authoritative per account class is explicit tenant configuration**, and Reconciliation (09) proves the two agree.

## 1. Port (SPI)

```ts
export interface CoreBankingPort {
  postTransaction(ctx: TenantContext, instr: HostInstruction): Promise<HostRef>;      // idempotent by platform ref
  inquireBalance(ctx: TenantContext, hostAccount: HostAccountId): Promise<Money>;
  inquireStatus(ctx: TenantContext, ref: HostRef): Promise<HostStatus>;               // PENDING|POSTED|REJECTED|UNKNOWN
  fetchStatement(ctx: TenantContext, hostAccount: HostAccountId, p: Period): Promise<StatementLine[]>;
}
```

`UNKNOWN` is a first-class status: host timeouts park the platform transfer `IN_FLIGHT` pending status inquiry — never assumed either way.

## 2. Message translation
`adapters/external/hosts/<host>/`: `iso20022.pain001.mapper.ts`, `iso8583.mapper.ts`, field-mapping tables checked into the repo and versioned with the host's interface spec release. Character-set handling explicit (host EBCDIC/legacy encodings ↔ UTF-8) — round-trip tested.

## 3. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `host_binding` | enum | Tenant | Which host adapter variant |
| `authority_map` | object | Tenant | Per account-class: `platform` \| `host` authoritative |
| `endpoint_ref` / `mTLS_cert_ref` | vault ref | Tenant | Host connectivity — usually tenant-private network path (VPN/leased) |
| `cutoff_calendar` | ref | Tenant | Host batch windows; commands queued outside window |
| `field_map_version` | string | Tenant | Pin; upgrades are a certified change |

## 4. Resilience
Idempotency by platform reference echoed in host echo-field (certified per host) · retry only on transport errors, never on business rejects · circuit breaker per host endpoint · batch-window queueing with expiry alerts · statement fetch feeds 09 directly.

## 5. Certification & tests
Host-simulator suite (per host variant): post/inquire/reject/timeout/duplicate-echo · encoding round-trip fixtures · authority_map enforcement test (writes to a host-authoritative class must route host-first) · reconciliation end-to-end fixture with seeded drift ⇒ break raised · Pact provider→05/06/09 consumers.
