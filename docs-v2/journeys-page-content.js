/**
 * Journey hub pages — rich content + UI blocks.
 * Stage link HTML injected at build time from workflows.js.
 */
module.exports = function journeyPages(stageLinks) {
  const L = stageLinks;

  function hero(theme, title, subtitle, stats) {
    return `
      <div class="journey-hero journey-hero--${theme}">
        <div class="journey-hero-inner">
          <p class="journey-hero-kicker">Journey</p>
          <h2 class="journey-hero-title">${title}</h2>
          <p class="journey-hero-sub">${subtitle}</p>
        </div>
        <div class="journey-stats">${stats
          .map(([b, s]) => `<div class="journey-stat"><b>${b}</b><span>${s}</span></div>`)
          .join("")}</div>
      </div>`;
  }

  function workflowPanel(id, theme, title, desc, startHref, startLabel, embedWf) {
    return `
      <section class="journey-panel journey-panel--${theme}" id="${id}">
        <div class="journey-panel-head">
          <h2>${title}</h2>
          <p>${desc}</p>
          <a class="journey-panel-cta" href="${startHref}">${startLabel} →</a>
        </div>
        <div class="wf-embed" data-workflow="${embedWf}" data-view="overview"></div>
        <h3 class="journey-stages-label">Stages — open any for full detail</h3>
        <div class="doc-wf-stage-links">${L[embedWf] || ""}</div>
      </section>`;
  }

  return {
    "customer-journeys": {
      title: "Customer Journeys",
      lede:
        "Every path a retail customer runs in apps/web — onboarding, send money, bills, and cards — with the same money and compliance rules as every other channel.",
      body: `
        ${hero(
          "customer",
          "Retail customer paths",
          "Self-serve in apps/web → BFF → domain sagas. Channels display and command intent; they never hold authoritative balances or screening decisions.",
          [
            ["4", "workflows — onboard, send, bills, cards"],
            ["21", "stages with diagrams + checklists"],
            ["1", "channel — apps/web (BFF gateway)"],
          ]
        )}

        <div class="callout vocab-brief">
          <strong>In brief — customer journeys</strong>
          <ul>
            <li><strong>Onboarding first.</strong> No ledger accounts until identity, screening, and eKYC complete — tier UNRATED until verified.</li>
            <li><strong>Send money is a saga.</strong> Quote → screen → hold → payout → settle — see <a href="/docs/one-payment-followed/">One Payment, Followed</a>.</li>
            <li><strong>Same invariants everywhere.</strong> <code>tenant_id</code>, idempotency keys, integer money, fail-closed screening.</li>
          </ul>
        </div>

        ${workflowPanel(
          "onboarding",
          "teal",
          "Onboarding",
          "Eight stages: register/login through TigerBeetle account CREATE. Identity is customer SoR; purple nodes on diagrams are durable writes.",
          "/docs/workflows/onboarding/register-login/",
          "Start at Register / Login",
          "onboarding"
        )}

        ${workflowPanel(
          "send",
          "blue",
          "Send money",
          "Five-stage remittance saga. Pricing returns firm quote; screening gates; ledger holds before rail; settle captures hold and posts journal.",
          "/docs/workflows/fund-transfer/ft-initiate/",
          "Start at Initiate transfer",
          "fund-transfer"
        )}

        ${workflowPanel(
          "bill-payments",
          "amber",
          "Bill payments",
          "Four-stage saga separate from remittance: select biller → create → confirm → debit. Same ledger rules — no shadow balances in payments DB.",
          "/docs/workflows/bill-payments/bp-select/",
          "Start at Select biller",
          "bill-payments"
        )}

        ${workflowPanel(
          "debit-cards",
          "violet",
          "Debit cards",
          "Workflow specified; product <span class='pill settled'>deferred</span> until licensed need. Authorisation uses hold pattern like payment holds.",
          "/docs/workflows/debit-cards/dc-request/",
          "Start at Card request",
          "debit-cards"
        )}

        <section class="journey-panel journey-panel--slate" id="serve">
          <h2>Serve — after onboarding</h2>
          <p>Balances, statements, profile, limits, and help are <strong>composed views</strong> from Ledger projections and wallet product metadata. The channel refreshes display; it does not cache authoritative balance.</p>
          <div class="table-wrap vocab-table">
            <table>
              <thead><tr><th>Surface</th><th>Source of truth</th><th>Never</th></tr></thead>
              <tbody>
                <tr><td>Balance display</td><td>Ledger read model / projection API</td><td>UPDATE balance in wallets for UX speed</td></tr>
                <tr><td>Statement lines</td><td>Ledger postings + wallet product label</td><td>Reconstruct from payment saga alone</td></tr>
                <tr><td>Available to send</td><td>Balance minus active holds</td><td>Show total as available during FUNDS_HELD</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="footer-nav">
          <a href="/docs/one-payment-followed/"><small>Previous</small><strong>One Payment, Followed</strong></a>
          <a href="/docs/corporate-journeys/"><small>Next</small><strong>Corporate Journeys</strong></a>
        </div>
      `,
    },

    "corporate-journeys": {
      title: "Corporate Journeys",
      lede:
        "Business onboarding (KYB) — legal entity, beneficial owners, enhanced due diligence, screening, tier, and business wallet activation — with the same fail-closed compliance as retail.",
      body: `
        ${hero(
          "corporate",
          "Corporate &amp; KYB",
          "Businesses are not “big retail customers.” UBO graphs, registry lookups, and enhanced due diligence run before any business wallet or ledger account opens.",
          [
            ["6", "KYB stages — register to ACTIVE"],
            ["02", "identity service — business SoR"],
            ["?", "launch scope — open question for PK"],
          ]
        )}

        <div class="callout vocab-brief">
          <strong>In brief — corporate journeys</strong>
          <ul>
            <li><strong>Channel:</strong> <code>apps/console</code> or corporate web — operator-assisted intake is common.</li>
            <li><strong>UBO graph required.</strong> Each beneficial owner feeds screening; missing UBO blocks progression.</li>
            <li><strong>Same money rules.</strong> Business wallet composes ledger balance; activation only after CLEAR screening.</li>
          </ul>
        </div>

        <h2 id="who">Who this journey is for</h2>
        <div class="table-wrap vocab-table">
          <table>
            <thead><tr><th>Actor</th><th>Role in KYB</th><th>In our system</th></tr></thead>
            <tbody>
              <tr><td><strong>Operator</strong></td><td>Intake, document review, case disposition</td><td><code>apps/console</code> · maker-checker on HIGH</td></tr>
              <tr><td><strong>Business user</strong></td><td>Submit registration and documents</td><td>Corporate web channel → BFF → identity</td></tr>
              <tr><td><strong>Identity (02)</strong></td><td>Business aggregate, UBOs, verification cases</td><td><code>businesses</code>, <code>beneficial_owners</code>, <code>verification_cases</code></td></tr>
              <tr><td><strong>Screening (03)</strong></td><td>Entity + each UBO screened</td><td><code>screenEntity</code> — timeout ⇒ HOLD</td></tr>
              <tr><td><strong>Wallets + Ledger</strong></td><td>Business product shell + value SoR</td><td>TigerBeetle CREATE after tier assigned</td></tr>
            </tbody>
          </table>
        </div>

        ${workflowPanel(
          "kyb",
          "rose",
          "KYB onboarding workflow",
          "Six stages from business registration through business wallet and ledger activation. Walk each stage for actors, APIs, walkthrough tables, and acceptance checklists.",
          "/docs/workflows/corporate-kyb/ck-register/",
          "Start at Register business",
          "corporate-kyb"
        )}

        <h2 id="rules">Rules — identical discipline to retail</h2>
        <div class="trap-box">
          <div class="table-wrap vocab-table">
            <table>
              <thead><tr><th>Rule</th><th>Plain English</th><th>Violation cost</th></tr></thead>
              <tbody>
                <tr class="trap"><td>Screening timeout</td><td>Never auto-CLEAR</td><td>Sanctioned entity onboarded</td></tr>
                <tr class="trap"><td>eKYC / document timeout</td><td>MANUAL_REVIEW — never auto-approve</td><td>Fake documents accepted silently</td></tr>
                <tr><td>HIGH case disposition</td><td>Maker-checker required</td><td>Single analyst approves own hit</td></tr>
                <tr class="trap"><td>Business “balance”</td><td>Ledger SoR only</td><td>Duplicate truths at audit</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="callout warn" id="launch">
          <strong>Launch question</strong>
          Whether corporate / KYB ships at Pakistan launch or later remains open — see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>. The workflow is specified; product sequencing is not closed.
        </div>

        <div class="footer-nav">
          <a href="/docs/customer-journeys/"><small>Previous</small><strong>Customer Journeys</strong></a>
          <a href="/docs/agent-journeys/"><small>Next</small><strong>Agent Journeys</strong></a>
        </div>
      `,
    },

    "agent-journeys": {
      title: "Agent Journeys",
      lede:
        "Assisted channels — branch agents, outlets, and hierarchy — act on behalf of customers with scoped grants, full saga compliance, and immutable audit before any commission.",
      body: `
        ${hero(
          "agent",
          "Agent-assisted service",
          "The agent channel runs the same domain sagas as self-serve — plus agent_id, acting-on-behalf grants, and audit rows on every mutation.",
          [
            ["4", "stages — login → AOB → action → audit"],
            ["0", "compliance shortcuts — screening still gates"],
            ["∞", "audit — attribution is not optional"],
          ]
        )}

        <div class="callout vocab-brief">
          <strong>In brief — agent journeys</strong>
          <ul>
            <li><strong>AOB grant</strong> records which customer and products an agent may touch, with expiry.</li>
            <li><strong>Headers on every call:</strong> <code>X-Agent-Id</code>, tenant, idempotency key — same as retail plus attribution.</li>
            <li><strong>Commission is optional config;</strong> audit trail and permission boundaries are not.</li>
          </ul>
        </div>

        <h2 id="model">Acting on behalf — what changes vs self-serve</h2>
        <div class="table-wrap vocab-table">
          <table>
            <thead><tr><th>Dimension</th><th>Self-serve (apps/web)</th><th>Agent-assisted</th></tr></thead>
            <tbody>
              <tr><td>Authentication</td><td>Customer JWT</td><td>Agent session + hierarchy + outlet context</td></tr>
              <tr><td>Authorisation</td><td>Customer owns journey</td><td>AOB grant scopes customer + products + TTL</td></tr>
              <tr><td>Screening / ledger</td><td>Full saga</td><td><strong>Identical</strong> — no bypass</td></tr>
              <tr><td>Attribution</td><td>Customer id only</td><td><code>agent_id</code> on audit_log + optional metering event</td></tr>
              <tr class="trap"><td>Balance display</td><td>From ledger projection</td><td>BFF still <strong>never</strong> holds shadow balances</td></tr>
            </tbody>
          </table>
        </div>

        ${workflowPanel(
          "workflow",
          "teal",
          "Assisted workflow",
          "Four stages: authenticate agent, record acting-on-behalf grant, run onboarding or payment saga with agent headers, emit audit (and optional commission event).",
          "/docs/workflows/agent-assisted/ag-login/",
          "Start at Agent login",
          "agent-assisted"
        )}

        <h2 id="hierarchy">Agent hierarchy &amp; permissions</h2>
        <ul>
          <li><strong>Hierarchy</strong> — parent outlet / supervisor chain encoded in agent session; used for limits and escalation.</li>
          <li><strong>Product entitlements</strong> — agent may only assist on products the tenant has enabled and the grant allows.</li>
          <li><strong>Customer consent</strong> — where regulation requires explicit consent for assisted actions, grant creation checks consent flag.</li>
          <li><strong>Rate limits</strong> — auth and AOB endpoints throttled like retail auth (Redis optional at BFF).</li>
        </ul>

        <div class="trap-box">
          <p><strong>The trap:</strong> treating assisted channel as “ops override.” Agents do not skip screening, invent balances, or post journals from the BFF. They trigger the same use cases with extra headers and audit rows.</p>
        </div>

        <div class="footer-nav">
          <a href="/docs/corporate-journeys/"><small>Previous</small><strong>Corporate Journeys</strong></a>
          <a href="/docs/operator-journeys/"><small>Next</small><strong>Operator Journeys</strong></a>
        </div>
      `,
    },

    "operator-journeys": {
      title: "Operator Journeys",
      lede:
        "Staff console work — AML case disposition, tenant provisioning, entitlements, and overrides — every sensitive action logged with operator id and maker-checker where required.",
      body: `
        ${hero(
          "operator",
          "Operator &amp; staff console",
          "Operators work in apps/console on screening cases and control-plane config. Regulated customer data stays in data planes — control plane holds packs and entitlements only.",
          [
            ["2", "workflow families — AML + tenant ops"],
            ["8", "stages across screening &amp; provisioning"],
            ["4", "eyes — maker-checker on HIGH / overrides"],
          ]
        )}

        <div class="callout vocab-brief">
          <strong>In brief — operator journeys</strong>
          <ul>
            <li><strong>AML cases</strong> — disposition with maker-checker on HIGH; events unblock waiting sagas.</li>
            <li><strong>Tenant ops</strong> — provision tenant → market pack → branding → immutable ops audit.</li>
            <li><strong>Overrides</strong> — ex-gratia and manual fixes need attributable, immutable ops_audit rows.</li>
          </ul>
        </div>

        ${workflowPanel(
          "aml",
          "rose",
          "Screening &amp; AML cases",
          "Four stages: open screening request → call provider → open case on hit → dispose with outbox event. Saga in COMPLIANCE_HOLD waits on <code>screening.case.resolved.v1</code>.",
          "/docs/workflows/screening-aml/sa-request/",
          "Start at Screening request",
          "screening-aml"
        )}

        <div class="journey-panel journey-panel--slate" id="case-work">
          <h2>What operators do on a case</h2>
          <div class="table-wrap vocab-table">
            <table>
              <thead><tr><th>Disposition</th><th>Effect on customer journey</th><th>Controls</th></tr></thead>
              <tbody>
                <tr><td><strong>CLEAR</strong></td><td>Saga resumes; payment can hold and payout</td><td>Analyst documents reason; list version recorded</td></tr>
                <tr><td><strong>HOLD</strong></td><td>Remains queued; customer informed per policy</td><td>Escalation timer; senior review</td></tr>
                <tr><td><strong>REJECT</strong></td><td>Journey terminal; no money movement</td><td>STR consideration per policy</td></tr>
                <tr class="trap"><td><strong>HIGH severity</strong></td><td>Cannot self-approve</td><td>Maker-checker — second operator id required</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        ${workflowPanel(
          "tenant",
          "blue",
          "Tenant operations",
          "Provision a tenant, attach PK/AE/SA market pack, set branding and product entitlements, log every change in ops_audit. No customer PII in control plane DB.",
          "/docs/workflows/tenant-ops/to-provision/",
          "Start at Provision tenant",
          "tenant-ops"
        )}

        <h2 id="console">apps/console — operator surface</h2>
        <p><code>apps/console</code> is the staff channel for cases, tenant configuration, and assisted overrides. It calls BFF/gateway APIs — never raw domain services. Every override must answer: <strong>who</strong>, <strong>when</strong>, <strong>what changed</strong>, and <strong>why</strong> — stored in <code>ops_audit</code>, not application logs alone.</p>

        <div class="footer-nav">
          <a href="/docs/agent-journeys/"><small>Previous</small><strong>Agent Journeys</strong></a>
          <a href="/docs/platform-external/"><small>Next</small><strong>Platform &amp; External</strong></a>
        </div>
      `,
    },

    "platform-external": {
      title: "Platform & External",
      lede:
        "Where the bank stops and the market provider begins — hexagonal ports, certified adapters, and fail-closed behaviour when the outside world is slow or down.",
      body: `
        ${hero(
          "platform",
          "Platform boundary &amp; market adapters",
          "Domain services call ports. Adapters translate to NADRA, Raast, screening vendors, IdP, tax, and messaging. Certification calendars can dominate Pakistan go-live.",
          [
            ["5", "adapter stages — port to saga resume"],
            ["6+", "launch adapters — PK first"],
            ["0", "vendor SDKs in domain/ — forbidden"],
          ]
        )}

        <div class="callout vocab-brief">
          <strong>In brief — platform &amp; external</strong>
          <ul>
            <li><strong>Hexagonal rule:</strong> <code>domain/</code> and <code>application/</code> never import provider SDKs.</li>
            <li><strong>Market pack</strong> selects which adapter implementation binds to each port per tenant.</li>
            <li><strong>Fail closed:</strong> provider timeout on compliance paths ⇒ HOLD or MANUAL_REVIEW — never silent CLEAR.</li>
          </ul>
        </div>

        <h2 id="boundary">The boundary in one picture</h2>
        <div class="journey-boundary-diagram">
          <div class="journey-boundary-col journey-boundary-col--bank">
            <span class="journey-boundary-label">Inside the bank</span>
            <ul>
              <li>Domain services (02–13)</li>
              <li>Ports (stable interfaces)</li>
              <li>Ledger, screening decisions</li>
            </ul>
          </div>
          <div class="journey-boundary-mid">
            <span>Port</span>
            <span class="journey-boundary-arrow">→</span>
            <span>Adapter</span>
          </div>
          <div class="journey-boundary-col journey-boundary-col--ext">
            <span class="journey-boundary-label">Outside the bank</span>
            <ul>
              <li>NADRA · Raast · lists vendor</li>
              <li>OIDC · tax · messaging</li>
              <li>Partner x-border APIs</li>
            </ul>
          </div>
        </div>

        ${workflowPanel(
          "workflow",
          "violet",
          "Adapter invocation workflow",
          "Five stages: domain invokes port → translate via market pack → HTTPS to provider → normalise to CLEAR/HOLD/REJECT → outbox event resumes saga.",
          "/docs/workflows/market-adapters/ma-port/",
          "Start at Port invocation",
          "market-adapters"
        )}

        <h2 id="adapters">Launch adapters (Pakistan)</h2>
        <div class="table-wrap vocab-table">
          <table>
            <thead><tr><th>#</th><th>Adapter</th><th>Provider</th><th>Port consumer</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>16</td><td>eKYC</td><td>NADRA CNIC</td><td>Identity onboarding</td><td><span class="pill block">Not certified</span></td></tr>
              <tr><td>15</td><td>Screening</td><td>Lists vendor + NACTA</td><td>Screening 03 · every payment</td><td><span class="pill part">Mock in pilot</span></td></tr>
              <tr><td>19</td><td>Payout rail</td><td>Raast</td><td>Payments saga payout step</td><td><span class="pill block">Not certified</span></td></tr>
              <tr><td>22</td><td>IdP</td><td>OIDC provider</td><td>BFF auth</td><td><span class="pill block">Not started</span></td></tr>
              <tr><td>25</td><td>Tax</td><td>Tax authority</td><td>Pricing quotes</td><td><span class="pill block">Not started</span></td></tr>
              <tr><td>21</td><td>Notification</td><td>Messaging provider</td><td>Notification 13</td><td><span class="pill block">Not started</span></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="certs">Certification &amp; mocks</h2>
        <p>Pilot uses sandbox mocks and simulated rails — login-to-money works locally. <strong>Pakistan go-live</strong> waits on commercial contracts and provider certification. The slowest cert sets the date.</p>

        <div class="trap-box">
          <p><strong>The trap:</strong> embedding Raast or NADRA client code inside Payments or Identity “for speed.” It breaks hexagonal boundaries, duplicates wire logic, and makes certification per-service instead of per-adapter.</p>
        </div>

        <div class="footer-nav">
          <a href="/docs/operator-journeys/"><small>Previous</small><strong>Operator Journeys</strong></a>
          <a href="/docs/identity-kyc-aml/"><small>Next</small><strong>Identity, KYC &amp; AML</strong></a>
        </div>
      `,
    },
  };
};
