# Design 23 — Documentation Index & Build Order

**Docx:** `23_Documentation_Index_and_Build_Order.docx` · **Set version:** v3.1 (NestJS-first stack), 8 July 2026

## 1. The set at a glance

| Range | What | Runtime rule |
|---|---|---|
| 00–01 | Master blueprint · Tech stack/ADR | — (01 defines the golden paths) |
| 02–13 | Twelve service designs | NestJS/TS **except** 04 Ledger & 10 Pricing (Java) |
| 14–22 | Nine adapter/SPI designs | TS **except** 17 FX (Java lib); 14 ships TS **and** Java impls |
| 23 | This index | — |

Every `NN_*.design.md` pairs 1:1 with `NN_*.docx` — the docx is the specification narrative; the design.md is the engineering companion (interfaces, repo layout, DDL, sequences, test gates).

## 2. Build order (phases mirror docx 23 §build-order)

1. **Foundations** — 01 templates + `@platform/*` packages → 12 Control Plane → 22 OIDC → 14 Persistence (both impls). *Exit:* config resolution < 5 ms p99; isolation suite green on all three models.
2. **Walking skeleton** — 04 Ledger (JVM) → 02 Identity → 16 eKYC (mock + NADRA sandbox). *Exit:* onboard→verify→post-journal demo in the PK dev plane.
3. **Compliance gate** — 03 Screening → 15 provider adapter → 08 reporting skeleton. *Exit:* PK pack certification suite (§19.1) green.
4. **Money movement** — 10 Pricing (JVM) + 17 FX lib → 05 Payments saga → 19 Raast + x-border partner. *Exit:* PK→PK and AE→PK sandbox transfers settle with compensation drills passing.
5. **First real tenant (Pakistan)** — full §19.3 isolation suite; SBP/FMU pack certified; NADRA + Raast certified.
6. **Extended** — 07 Cards + 20 processor · 09 Reconciliation · 18 Core-banking (if a tenant needs it) · 06/11/13/21 harden.
7. **Scale out** — UAE plane (CBUAE pack, UAE Pass, Aani) → KSA in-Kingdom plane (SAMA pack, Yakeen, sarie/mada). *Exit:* all three markets live; residency routing tests green; UAE→PK & KSA→PK corridors in production.

## 3. Cross-document invariants (checked in every review)
Hexagonal boundaries (dependency-cruiser/ArchUnit, build-blocking) · `@platform/money`/`Money` minor units only · outbox on every producer · `Idempotency-Key` on every mutation · `tenant_id` on every request/event/row/log · Pact on every boundary, blocking across TS↔JVM seams · fail-safe-closed on compliance and card-auth paths.

## 4. Ownership map

| Squad | Owns |
|---|---|
| Platform/Enablement | 01, 12, 14, 22, golden paths, `@platform/*` |
| Identity & Onboarding | 02, 16 |
| Compliance & AML | 03, 08, 15 |
| Ledger & Money Movement | 04, 09, 17 (with Pricing) |
| Payments & Remittance | 05, 18, 19 |
| Accounts & Cards | 06, 07, 20 |
| Pricing & Billing | 10, 17 (with Ledger) |
| Developer Platform | 11, 13, 21 |
