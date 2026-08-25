# Design 21 — Notification / Messaging Adapter

**Impl (v3.1):** TypeScript — NestJS injectable providers, one per channel/provider · **Consumer:** Notification (13) · **Docx:** `21_Adapter_Notification_Messaging_Adapter_Specification.docx`

Delivers rendered messages over SMS / email / push using the tenant's configured sender identity, and reports delivery status back to 13. Regional sender rules matter at launch: PK/AE/SA SMS all require **registered sender IDs** and (PK notably) template pre-approval with the telco/regulator ecosystem — modelled as config + certification, not code.

## 1. Port (SPI)

```ts
export interface MessagingPort {
  send(ctx: TenantContext, channel: Channel, msg: RenderedMessage, to: Address): Promise<ProviderRef>; // idempotent by msg.dedupeKey
  getDeliveryStatus(ctx: TenantContext, ref: ProviderRef): Promise<DeliveryStatus>;  // poll fallback
}
// inbound: provider delivery webhooks normalized → notification.delivery.updated (internal)
```

Bindings (launch): `sms-primary` + `sms-secondary` (regional aggregators with PK/AE/SA reach), `email` (transactional ESP, per-tenant domain/DKIM), `push` (FCM/APNs via tenant app credentials), `mock` (sandbox).

## 2. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `bound_provider` | enum per channel | Tenant | SPI binding; secondary for failover |
| `sender_id` / `from_domain` | string | Tenant/market | Registered SMS sender ID per market; DKIM-verified email domain |
| `template_registration_refs` | map | Tenant/market | Where a market requires pre-registered SMS templates (PK) |
| `credentials_ref` | vault ref | Tenant/provider | Never plaintext |
| `throughput_cap` | rate | Provider | Provider rate limits respected upstream |

## 3. Resilience
Retry ×3 exp backoff on transport errors → 13 orchestrates failover to secondary binding · delivery webhooks signature-verified + deduped by (provider, ref) · unicode/segmentation handled per channel — Urdu (`ur-PK`) and Arabic SMS are UCS-2, segment-count surfaced to 13 for cost metering · addresses logged masked.

## 4. Certification & tests
Provider sandbox: sent/delivered/bounced/invalid-address/throttle(429) · UCS-2 segmentation golden tests for `ur-PK`/`ar-AE`/`ar-SA` bodies · sender-ID/DKIM misconfig ⇒ hard config-validation error at bind time, not runtime · idempotent double-send · webhook signature vectors · Pact provider→13.
