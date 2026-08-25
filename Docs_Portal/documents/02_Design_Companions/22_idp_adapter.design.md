# Design 22 — Identity Provider (OIDC) Adapter

**Impl (v3.1):** TypeScript client library (`@platform/oidc`, openid-client-based) for all NestJS services + gateway; the two JVM islands (04, 10) validate with the equivalent Spring Security resource-server config against the **same realms** · **Docx:** `22_Adapter_Identity_Provider_OIDC_Adapter_Specification.docx`

Authentication for platform operators, tenant staff, and end customers. **Realm-per-tenant** on the platform IdP (Keycloak reference); tenant-federated IdPs (their Azure AD/Okta) join via OIDC/SAML federation into that tenant's realm. Every access token carries `tenant_id` — the claim the whole isolation model keys on.

## 1. Port / library surface

```ts
export interface IdpAdminPort {                       // used by Control Plane (12) during onboarding
  createTenantRealm(t: TenantId, cfg: RealmCfg): Promise<RealmRef>;
  configureFederation(realm: RealmRef, idp: FederatedIdpCfg): Promise<void>;   // tenant's own IdP
  createServiceClient(realm: RealmRef, c: ClientCfg): Promise<ClientCredsRef>; // M2M, vault-stored
}
export interface TokenValidator {                     // used by every service (defence-in-depth re-check)
  validate(bearer: string): Promise<Claims>;          // iss per-realm, aud, exp, sig via JWKS (cached, kid-rotated)
}
export interface Claims { sub: string; tenant_id: string; roles: string[]; scope: string[]; acr?: string; }
```

Nest guard packaged in the library:

```ts
@Injectable() export class JwtTenantGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const claims = await this.validator.validate(bearer(ctx));
    if (!claims.tenant_id) throw new UnauthorizedException();
    requestContext.set({ tenantId: claims.tenant_id, principal: claims.sub });
    return true;
  }
}
```

## 2. Token & session posture
Access tokens ≤ 10 min, refresh rotation, revocation on suspension (12 emits `control.tenant.suspended.v1` ⇒ realm disable) · step-up (`acr`) required for high-risk operations per pack (e.g. beneficiary add, large transfer) · customer flows support market schemes where federated (UAE Pass as an upstream IdP for AE tenants).

## 3. Config schema

| Key | Type | Scope | Notes |
|---|---|---|---|
| `realm_ref` | string | Tenant | Created at onboarding step 4 (§16) |
| `federated_idp` | object | Tenant | issuer, client creds ref, claim mappings, JIT-provisioning rules |
| `token_ttl` / `session_policy` | object | Tenant/pack | Step-up rules, max session, MFA policy |
| `role_mappings` | table | Tenant | Tenant staff roles → platform RBAC roles |

## 4. Resilience & tests
JWKS cache with kid-rotation grace (old+new valid during rotation) · IdP outage: validation continues on cached JWKS; **admin ops queue**, logins degrade per tenant policy · clock-skew tolerance ±60 s.
Tests: token vectors (expired/wrong-aud/wrong-iss/none-alg/kid-unknown) must all reject · realm-isolation test — token from tenant A realm rejected on tenant B routes (part of §19.3) · federation JIT-provisioning fixture · Spring-side parity suite runs the same vectors against 04/10 config · Pact: consumer contracts with 12 (admin port).
