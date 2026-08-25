# Design 11 — Developer Platform, API Gateway & BFF Service

**Runtime:** NestJS 10 / TS strict (+ Kong at the edge, Redis) · **Squad:** Developer Platform · **Docx:** `11_Service_Developer_Platform_API_Gateway_BFF_Service.docx`

The public/partner surface: tenant/channel resolution, OAuth2 scope enforcement (via 22), webhooks, sandbox, SDK generation, localization + theming composition. **BFFs compose; they never re-implement domain logic** (review checklist rule).

## 1. Edge pipeline

```
Client → Kong (WAF-ed, rate-limit per tenant/tier, OAuth2 introspection plugin)
      → BFF (NestJS): TenantContextInterceptor → LocaleResolver → composition use case → domain services
```

```ts
@Injectable() export class TenantContextInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const claims = ctx.switchToHttp().getRequest().auth;      // validated JWT (Design 22)
    if (!claims?.tenant_id) throw new UnauthorizedException('tenant claim missing');
    return this.als.run({ tenantId: claims.tenant_id, correlationId: cid() }, () => next.handle());
  } // AsyncLocalStorage — tenant ctx flows to every port call & log line
}
```

Locale chain (launch): request `Accept-Language` → user pref → tenant default → `en-*` fallback; RTL flag for `ur-PK` (Nastaliq), `ar-AE`, `ar-SA`. Design tokens per tenant injected into composed responses/templates.

## 2. Webhooks

```ts
export interface WebhookSubscription { id: SubId; tenantId: TenantId; url: string;
  eventTypes: string[]; secretRef: VaultRef; }   // secret in Vault, never plaintext

// delivery worker (Kafka consumer over all domain topics, filtered per subscription)
sign = HMAC_SHA256(secret, `${timestamp}.${body}`)  →  header `X-Platform-Signature`
retry: exp backoff ×3 → dead-letter + platform.webhook.failed.v1 → replay API
```

## 3. Sandbox
Structurally separate namespaces/datastores (never a flag on production rows); simulated provider adapters bound via the same SPI registry; `GET /v1/sandbox/reset` self-serve.

## 4. Data

```sql
CREATE TABLE webhook_subscriptions (id uuid PK, tenant_id uuid, url text,
  event_types text[], secret_ref text, created_at timestamptz);
CREATE TABLE webhook_deliveries (id uuid PK, subscription_id uuid, event_id uuid,
  status text, attempts int, last_code int, delivered_at timestamptz);   -- replay + audit
```

## 5. API / Events / NFRs / Tests
Gateway: `ALL /v1/*` routed post-resolution · `POST /v1/webhooks` (returns signing secret) · `GET /.well-known/openapi.json` (drives SDK gen) · sandbox reset.
Publishes `platform.webhook.delivered|failed.v1`; consumes all domain topics with subscription matches.
NFRs: gateway overhead < 10 ms p99; webhook success > 99.9 % within 3 attempts. Tests: signature verification vectors; retry/dead-letter/replay component test; missing-tenant-claim rejection (part of §19.3 suite); locale fallback matrix incl. RTL; Pact consumer→every domain service.
