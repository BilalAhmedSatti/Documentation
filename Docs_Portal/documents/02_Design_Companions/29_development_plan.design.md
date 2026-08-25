# Design 29 — Development Plan, Sequencing & Milestones

**Team assumption:** ~20 engineers, 5 squads (+ Takaful squad at Phase C) · **Sprint:** 2 weeks · **Status:** plan for approval · **Docx:** `29_Development_Plan_Sequencing_and_Milestones.docx`

Turns Docs 00–28 into an executable schedule: what's sequential, what's parallel, and the gates that define progress.

## 1. Critical path (determines the go-live date)

```
Sprint 0 → Control Plane (12) → Ledger (04) → Pricing (10)+FX (17) → Payments (05)+Rail (19) → PK GO-LIVE
```
Everything else (Identity, Screening, Wallets, Notification, BFF, Recon, Reporting) has slack — that's where scope growth gets absorbed. **External certification (NADRA/Raast/SBP) runs alongside and can dominate the date regardless of engineering.**

## 2. Squads

| Squad | Size | Owns |
|---|---|---|
| Platform / Enablement | 4 | infra, packages, templates, Control Plane (12), Persistence (14), OIDC (22), BFF (11) |
| Ledger & Money (JVM) | 3 | Ledger (04), Pricing (10), FX (17), Recon (09) |
| Identity & Compliance | 4 | Identity (02), Screening (03), Reporting (08) |
| Payments | 3 | Payments saga (05), Wallets (06), corridors |
| Platform Adapters | 4 | 15·16·19·21·13 + new 24·25·26 |
| QA & Release (embedded) | 2 | isolation suite, Pact broker, release mgmt |
| Takaful (Phase C) | 4–6 | takaful-app services |

## 3. Two rules of sequencing

**Dependency-forced (cannot parallelise):** services need Sprint 0 → tenant-data services need 12+14+22 → Wallets/Payments/Pricing need Ledger → Payments completion needs Screening+Pricing → Pricing needs Tax (25) or interim pack → **Bureau (24) needs E-Sign (26) — legal, not architectural** → Takaful needs proven adapters → go-live needs certification.

**Team-forced (should parallelise):** everything else. Enabled by contract-first specs, mock bindings at every port, and Pact catching drift.

## 4. Phases & gates

| Gate | Phase (~sprints) | Exit criteria |
|---|---|---|
| **M0** | 0 — Engineering foundation (~S3) | hello-service through full pipeline to production-pk, unmodified; certification engagement opened |
| **M1** | 1 — Foundation trio, 3 parallel (~S7) | config p99 <5ms; isolation suite green+blocking; JWT→routed DB; KSA in-Kingdom. **Re-baseline here** |
| **M2** | 2 — Walking skeleton (~S11) | onboard → verify (mock eKYC) → post balanced journal, real tenant context + outbox |
| **M3** | 3 — Compliance gate (~S13) | screening fail-safe closed (timeout⇒HOLD); cert fixtures pass; maker-checker cases |
| **M4** | 4 — Money movement (~S18) | PK domestic transfer E2E; all 3 compensation paths fault-injected; no double-pay under retry |
| **M5** | 5 — **Pakistan live** (~S21) | real tenant in prod; NADRA+Raast certified; SBP/FMU pack signed; clean recon cycle; on-call rehearsed |
| **M6** | 6 — Adapter platform complete (~S24) | 8 adapters, dual-consumer Pact; consent lifecycle 26→24 works |
| **M7** | 7 — Takaful pilot live (~S30) | policy issued + contribution via Raast in prod; insurance pack + Shariah sign-off |
| **M8** | 8 — Three markets (~S33+) | UAE + KSA tenants live, no code forks; KSA residency proven; both corridors settling |

Phase 1 runs 3 streams in parallel; Phase 2 runs 3; Phase 4 runs 4; Phase 5 runs 5.

## 5. Decisions needed now
- **Tax adapter timing:** build 25 in Phase 4 with Pricing, *or* interim single-rule PK pack + full packs in Phase 6. Changes Platform Adapters load at its busiest point.
- **E-Sign before Bureau** must hold even if a lending initiative pulls 24 earlier.
- **Deferred entirely:** Cards (07) + Card Processor (20), Core Banking Host (18) — until a tenant licenses them.

## 6. Top schedule risks
1. **Certification lead times** — start week 1, track as its own stream, build behind mocks.
2. **Ledger slip** = programme slip (critical path) → strongest squad, earliest start, JVM gaps later absorb recovery.
3. **Adapters squad overload Phase 4–6** → tax decision + borrow JVM capacity + defer 18/20.
4. **Phase 1 gold-plating** → timebox to the gate, not to perfection.
5. **Takaful too early** → hard rule: nothing before M5, ideally M6.

## 7. Tracking
One org GitHub Project; M0–M8 as GitHub Milestones; `phase/0…8` labels; phase streams = epics; Must-tier features from the 24 feature specs = stories. **Weekly review covers the critical path only.** Gate reviews recorded as ADRs. Formal re-baseline at M1 and M5.

## 8. First 30 days
W1 org+repos+templates & **open certification paperwork** · W2 `@platform/*` v0.1.0 + protections + Pact broker · W3 develop cluster + ArgoCD + hello-service deploys · W4 full promotion drill → **declare M0**.

> Single most important sequencing decision: **start Sprint 0 and regulator/provider certification in the same week.** Engineering can be recovered with people; certification lead time cannot.
