/**
 * Generate docs-v2 pages + nav for Digital Banking
 * Workflow stages live as submenus inside category groups (Journeys, Capability guides).
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const richPageContent = require("./page-content");

const root = path.join(__dirname);
const docsDir = path.join(root, "docs");

function loadWorkflows() {
  const code = fs.readFileSync(path.join(root, "assets", "js", "workflows.js"), "utf8");
  const ctx = { window: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window.WORKFLOWS || [];
}

const WORKFLOWS = loadWorkflows();

const NAV = [
  {
    label: "Start here",
    items: [
      { id: "start-here", label: "Start Here", file: "start-here" },
      { id: "where-we-stand", label: "Where We Stand", file: "where-we-stand" },
      { id: "money-model-correction", label: "Money Model Correction", file: "money-model-correction" },
      { id: "what-we-do-not-know", label: "What We Do Not Know", file: "what-we-do-not-know" },
      { id: "one-payment-followed", label: "One Payment, Followed", file: "one-payment-followed" },
    ],
  },
  {
    label: "The domain",
    items: [
      { id: "why-digital-banking", label: "Why EMI / E-Money Exists", file: "why-digital-banking" },
      { id: "how-the-money-works", label: "How the Money Works", file: "how-the-money-works" },
      { id: "the-vocabulary", label: "The Vocabulary", file: "the-vocabulary" },
      { id: "who-governs-it", label: "Who Governs It", file: "who-governs-it" },
    ],
  },
  {
    label: "EMI & e-money",
    items: [
      { id: "emoney-overview", label: "EMI & E-Money Overview", file: "emoney-overview" },
      { id: "emoney-lifecycle", label: "E-Money Account Lifecycle", file: "emoney-lifecycle" },
      { id: "emoney-issuance-redemption", label: "Issuance & Redemption", file: "emoney-issuance-redemption" },
      { id: "safeguarding", label: "Safeguarding Architecture", file: "safeguarding" },
      { id: "limits-velocity", label: "Limits & Velocity Controls", file: "limits-velocity" },
      { id: "fraud-controls", label: "AML, KYC & Fraud Controls", file: "fraud-controls" },
      { id: "transaction-states", label: "Transaction State Machine", file: "transaction-states" },
      { id: "reversal-refund-chargeback", label: "Reversal, Refund & Chargeback", file: "reversal-refund-chargeback" },
      { id: "ledger-vs-audit", label: "Ledger vs Audit Log", file: "ledger-vs-audit" },
      { id: "idempotency-controls", label: "Idempotency & Duplicates", file: "idempotency-controls" },
      { id: "consent-authorization", label: "Consent & Authorization", file: "consent-authorization" },
      { id: "settlement-reconciliation", label: "Settlement & Reconciliation", file: "settlement-reconciliation" },
      { id: "exception-management", label: "Exception Management", file: "exception-management" },
      { id: "rails-pk", label: "1LINK & Raast (PK)", file: "rails-pk" },
      { id: "agent-float-settlement", label: "Agent Float & Settlement", file: "agent-float-settlement" },
      { id: "commission-settlement", label: "Commission Settlement", file: "commission-settlement" },
      { id: "financial-reporting", label: "Financial & Regulatory Reporting", file: "financial-reporting" },
    ],
  },
  {
    label: "Digital Banking",
    items: [
      { id: "what-we-are-building", label: "What We Are Building", file: "what-we-are-building" },
      { id: "products-at-launch", label: "Products at Launch", file: "products-at-launch" },
      { id: "markets-tenancy", label: "Markets & Tenancy", file: "markets-tenancy" },
      { id: "requirements", label: "Requirements & Constraints", file: "requirements" },
    ],
  },
  {
    label: "Journeys",
    items: [
      {
        id: "customer-journeys",
        label: "Customer Journeys",
        file: "customer-journeys",
        workflows: ["onboarding", "cash-in", "cash-out", "fund-transfer", "bill-payments", "debit-cards", "reversal-refund"],
      },
      { id: "corporate-journeys", label: "Corporate Journeys", file: "corporate-journeys", workflows: ["corporate-kyb"] },
      { id: "agent-journeys", label: "Agent Journeys", file: "agent-journeys", workflows: ["agent-assisted", "agent-float"] },
      { id: "operator-journeys", label: "Operator Journeys", file: "operator-journeys", workflows: ["screening-aml", "tenant-ops"] },
      { id: "platform-external", label: "Platform & External", file: "platform-external", workflows: ["market-adapters"] },
    ],
  },
  {
    label: "Capability guides",
    items: [
      {
        id: "identity-kyc-aml",
        label: "Identity, KYC & AML",
        file: "identity-kyc-aml",
        workflows: ["screening-aml"],
      },
      { id: "pricing-quotes", label: "Pricing & Quotes", file: "pricing-quotes" },
      { id: "wallets-accounts", label: "Wallets & Accounts", file: "wallets-accounts" },
      { id: "payments-rails", label: "Payments & Rails", file: "payments-rails" },
      { id: "money-and-holds", label: "Money & Holds", file: "money-and-holds" },
      { id: "ledger", label: "Ledger", file: "ledger" },
      { id: "reconciliation", label: "Reconciliation", file: "reconciliation" },
      { id: "regulatory-governance", label: "Regulatory Governance", file: "regulatory-governance" },
      { id: "compliance-reporting", label: "Compliance Reporting", file: "compliance-reporting" },
      { id: "api-integration", label: "The API & Integration Surface", file: "api-integration" },
      { id: "billing-metering", label: "Billing & Metering", file: "billing-metering" },
    ],
  },
  {
    label: "Architecture",
    items: [
      { id: "system-architecture", label: "System Architecture", file: "system-architecture" },
      { id: "data-design", label: "Data Design", file: "data-design" },
      { id: "experience-architecture", label: "Experience Architecture", file: "experience-architecture" },
      { id: "platform-anatomy", label: "Platform Anatomy", file: "platform-anatomy" },
      { id: "end-to-end-map", label: "The End-to-End Map", file: "end-to-end-map" },
    ],
  },
  {
    label: "Technology",
    items: [
      { id: "technology-choices", label: "Technology Choices", file: "technology-choices" },
      { id: "infrastructure-cost", label: "Infrastructure & Cost", file: "infrastructure-cost" },
      { id: "delivery", label: "Delivery", file: "delivery" },
    ],
  },
  {
    label: "Cross-cutting",
    items: [
      { id: "decisions", label: "Decisions", file: "decisions" },
      { id: "measured-against", label: "Measured Against Peers", file: "measured-against" },
      { id: "build-backlog", label: "Build Backlog", file: "build-backlog" },
      { id: "design-system", label: "Design System", file: "design-system" },
      { id: "banking-compendium", label: "The Banking Compendium", file: "banking-compendium" },
    ],
  },
];

const CONTENT = {
  "start-here": {
    title: "Start Here",
    lede: "One documentation set for EMI / e-money and remittance — Blueprint v3.1 banking track. Pick a path, or read straight down.",
    body: `
      <h2 id="paths">Reading paths</h2>
      <div class="card-grid">
        <a class="card" href="/docs/where-we-stand/"><strong>Executive — 5 minutes</strong><span>Where We Stand → Money Model Correction → What We Do Not Know.</span></a>
        <a class="card" href="/docs/one-payment-followed/"><strong>Product / BA — 20 minutes</strong><span>One Payment, Followed → Customer Journeys → Payments & Rails.</span></a>
        <a class="card" href="/docs/system-architecture/"><strong>Engineer — 40 minutes</strong><span>System Architecture → Technology Choices → Build Backlog.</span></a>
      </div>
      <h2 id="order">The order</h2>
      <p>Domain → product → journeys (with stage submenus) → capabilities → architecture → technology → cross-cutting.</p>
      <div class="callout"><strong>Scope</strong> EMI / e-money operator and remittance — Pakistan, UAE, KSA. Start with <a href="/docs/emoney-overview/">EMI Overview</a>. Workflow stages are under <strong>Journeys</strong> and <strong>EMI &amp; e-money</strong>.</div>
      <h2 id="workflows">Workflows in this pack</h2>
      <div class="wf-embed" data-view="gallery"></div>
    `,
  },
  "where-we-stand": null,
  "money-model-correction": null,
  "what-we-do-not-know": null,
  "one-payment-followed": null,
  "requirements": null,

  "why-digital-banking": {
    title: "Why Digital Banking Exists",
    lede: "Why this machine is being built — and what problem it is not trying to solve.",
    body: `
      <h2 id="problem">The problem</h2>
      <p>Retail and remittance operators need a machine that can open customers, move money, and survive audit — across markets with different providers.</p>
      <h2 id="not">What this is not</h2>
      <p>Not a marketing site. Not a core-banking replacement for every licensed product on day one. Cards and host adapters stay deferred until a licensed need appears.</p>
    `,
  },
  "how-the-money-works": {
    title: "How the Money Works",
    lede: "One system of record for value. Everything else composes a view.",
    body: `
      <h2 id="ledger">Ledger first</h2>
      <p>Balances live in the Ledger. Wallets label products. Payments place holds and settle. Channels never invent money.</p>
      <p>See <a href="/docs/money-model-correction/">Money Model Correction</a> and <a href="/docs/workflows/fund-transfer/">Fund Transfer workflow</a>.</p>
    `,
  },
  "the-vocabulary": {
    title: "The Vocabulary",
    lede: "Words that must mean the same thing in every room.",
    body: `
      <h2 id="terms">Core terms</h2>
      <ul>
        <li><strong>Hold</strong> — reserved, not spent</li>
        <li><strong>Settle</strong> — final postings</li>
        <li><strong>CLEAR / HOLD / REJECT</strong> — screening dispositions</li>
        <li><strong>Tenant</strong> — market/operator boundary on every request</li>
      </ul>
    `,
  },
  "who-governs-it": {
    title: "Who Governs It",
    lede: "Owners for policy, product, and engineering decisions that change machine behaviour.",
    body: `
      <h2 id="owners">Owners</h2>
      <p>Compliance owns fail-closed rules. Product owns sequencing (corporate, cards). Engineering owns adapters and SoR boundaries. Open questions stay on What We Do Not Know until answered.</p>
    `,
  },
  "what-we-are-building": {
    title: "What We Are Building",
    lede: "The machine behind digital banking and remittance — identity through rails.",
    body: `
      <h2 id="scope">Scope</h2>
      <p>Identity, screening, ledger, payments saga, wallets, pricing, FX provenance, reconciliation, reporting, customer app and staff console. Market providers plug in through adapters.</p>
    `,
  },
  "products-at-launch": {
    title: "Products at Launch",
    lede: "What ships for Pakistan first — and what waits.",
    body: `
      <div class="table-wrap"><table>
        <thead><tr><th>Product</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Retail wallet + domestic send</td><td><span class="pill part">Pilot path</span></td></tr>
          <tr><td>Bill payments</td><td><span class="pill part">Specified</span></td></tr>
          <tr><td>Cards</td><td><span class="pill settled">Deferred</span></td></tr>
          <tr><td>Core-banking host adapter</td><td><span class="pill settled">Deferred</span></td></tr>
        </tbody>
      </table></div>
    `,
  },
  "markets-tenancy": {
    title: "Markets & Tenancy",
    lede: "Pakistan → UAE → KSA. One control plane; data planes honour residency.",
    body: `
      <h2 id="sequence">Sequence</h2>
      <p>PK first commercial bar, then AE, then SA. KSA data stays in-Kingdom when required.</p>
      <h2 id="tenancy">Tenancy</h2>
      <p><code>tenant_id</code> on every request, event, row, and log. Isolation failures are release-blocking P1.</p>
    `,
  },
  "customer-journeys": {
    title: "Customer Journeys",
    lede: "Retail paths — expand each workflow in the Journeys menu for stage pages and diagrams.",
    body: `
      <h2 id="onboarding">Onboarding</h2>
      <p>Expand <strong>Customer Journeys</strong> in the sidebar, then pick a workflow and stage.</p>
      <div class="wf-embed" data-workflow="onboarding" data-view="overview"></div>
      <h2 id="send">Send money</h2>
      <p>Expand <strong>Fund Transfer</strong> in the sidebar. Narrative: <a href="/docs/one-payment-followed/">One Payment, Followed</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>
      <h2 id="bill-payments">Bill payments</h2>
      <p>Expand <strong>Bill Payments</strong> in the sidebar.</p>
      <div class="wf-embed" data-workflow="bill-payments" data-view="overview"></div>
      <h2 id="debit-cards">Debit cards</h2>
      <p>Expand <strong>Debit Cards</strong> in the sidebar.</p>
      <div class="wf-embed" data-workflow="debit-cards" data-view="overview"></div>
      <h2 id="serve">Serve</h2>
      <p>Balances, statements, profile, help — views composed from Ledger and wallet product data.</p>
    `,
  },
  "corporate-journeys": {
    title: "Corporate Journeys",
    lede: "Business onboarding and bulk movement — expand Corporate Journeys in the menu for the KYB flow and stages.",
    body: `
      <h2 id="kyb">KYB onboarding</h2>
      <p>Business identity, beneficial owners, enhanced due diligence — same screening fail-closed rules as retail.</p>
      <div class="wf-embed" data-workflow="corporate-kyb" data-view="overview"></div>
      <h2 id="launch">Launch question</h2>
      <p>Whether corporate ships at Pakistan launch or later remains open (see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>).</p>
    `,
  },
  "agent-journeys": {
    title: "Agent Journeys",
    lede: "Assisted channels — expand Agent Journeys in the menu for the full assisted flow.",
    body: `
      <h2 id="model">Model</h2>
      <p>Agent identity, hierarchy, and acting-on-behalf permissions. Commission schemes are configuration; permission boundaries are not.</p>
      <div class="wf-embed" data-workflow="agent-assisted" data-view="overview"></div>
    `,
  },
  "operator-journeys": {
    title: "Operator Journeys",
    lede: "Staff console work: cases, tenants, overrides that must leave an audit trail.",
    body: `
      <h2 id="aml">AML cases</h2>
      <p>Expand <strong>Screening &amp; AML</strong> under Operator Journeys for maker-checker case flow.</p>
      <div class="wf-embed" data-workflow="screening-aml" data-view="overview"></div>
      <h2 id="tenant">Tenant ops</h2>
      <p>Expand <strong>Tenant Operations</strong> for provisioning, packs, and entitlements.</p>
      <div class="wf-embed" data-workflow="tenant-ops" data-view="overview"></div>
    `,
  },
  "platform-external": {
    title: "Platform & External",
    lede: "Where the bank stops and the market provider begins.",
    body: `
      <h2 id="boundary">Boundary</h2>
      <p>Domain services call ports. Adapters call NADRA, Raast, IdP, tax, messaging. Fail closed on compliance paths.</p>
      <div class="wf-embed" data-workflow="market-adapters" data-view="overview"></div>
      <h2 id="certs">Certifications</h2>
      <p>Live provider contracts and certification calendars can dominate the Pakistan go-live date.</p>
    `,
  },
  "identity-kyc-aml": {
    title: "Identity, KYC & AML",
    lede: "Services 02 and 03 — who the customer is, and whether they may proceed.",
    body: `
      <h2 id="identity">Identity</h2>
      <p>Onboarding stages are under <strong>Journeys → Onboarding</strong> in the sidebar.</p>
      <div class="wf-embed" data-workflow="onboarding" data-view="overview"></div>
      <h2 id="aml">Screening &amp; AML</h2>
      <p>Expand <strong>Screening &amp; AML</strong> below in this menu section.</p>
      <div class="wf-embed" data-workflow="screening-aml" data-view="overview"></div>
    `,
  },
  "pricing-quotes": {
    title: "Pricing & Quotes",
    lede: "Deterministic quotes with tax and FX provenance.",
    body: `
      <h2 id="quote">Quote</h2>
      <p>See the quote stage in <a href="/docs/workflows/fund-transfer/ft-quote/">Fund Transfer · Quote</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>
    `,
  },
  "wallets-accounts": {
    title: "Wallets & Accounts",
    lede: "Product shells that compose balances from the Ledger.",
    body: `
      <h2 id="open">Opening wallets</h2>
      <p><a href="/docs/workflows/onboarding/wallet-ledger/">Onboarding · Wallet + TigerBeetle →</a></p>
      <div class="wf-embed" data-workflow="onboarding" data-view="overview"></div>
    `,
  },
  "payments-rails": {
    title: "Payments & Rails",
    lede: "Service 05 plus payout adapters — the saga and the wires.",
    body: `
      <h2 id="saga">Saga</h2>
      <p><a href="/docs/workflows/fund-transfer/">Fund Transfer stages →</a></p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>
      <h2 id="bills">Bill payments</h2>
      <p><a href="/docs/workflows/bill-payments/">Bill Payments stages →</a></p>
      <div class="wf-embed" data-workflow="bill-payments" data-view="overview"></div>
    `,
  },
  "money-and-holds": {
    title: "Money & Holds",
    lede: "Reservation versus settlement.",
    body: `
      <h2 id="hold">Hold &amp; settle</h2>
      <p><a href="/docs/workflows/fund-transfer/ft-hold/">Hold stage →</a> · <a href="/docs/workflows/fund-transfer/ft-settle/">Settle stage →</a></p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>
      <h2 id="card-auth">Card authorisation</h2>
      <p><a href="/docs/workflows/debit-cards/dc-auth/">Debit Cards · Authorize →</a></p>
    `,
  },
  "ledger": {
    title: "Ledger",
    lede: "Service 04 — double-entry system of record for value.",
    body: `
      <h2 id="rules">Rules</h2>
      <ul>
        <li>Nothing else may hold an authoritative balance</li>
        <li>Append-only postings; balances as projections</li>
        <li>Pilot implements L1–L5 on TigerBeetle</li>
      </ul>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>
    `,
  },
  "reconciliation": {
    title: "Reconciliation",
    lede: "Three-way match: ledger ↔ payments ↔ rail statements.",
    body: `<h2 id="goal">Goal</h2><p>Breaks surface as cases, not silent drift.</p>`,
  },
  "regulatory-governance": {
    title: "Regulatory Governance",
    lede: "How policy decisions become machine behaviour.",
    body: `<h2 id="policy">Policy → controls</h2><p>AML thresholds, maker-checker, residency, and fail-closed rules are configuration and code paths with owners.</p>`,
  },
  "compliance-reporting": {
    title: "Compliance Reporting",
    lede: "Service 08 — goAML-aligned STR/SAR and market returns.",
    body: `<h2 id="status">Status</h2><p>Specified in the blueprint pack; not complete in the pilot backlog snapshot.</p>`,
  },
  "api-integration": {
    title: "The API & Integration Surface",
    lede: "BFF/gateway, webhooks, and partner contracts.",
    body: `
      <h2 id="bff">BFF</h2>
      <p><a href="/docs/workflows/onboarding/register-login/">Onboarding · Register / Login →</a></p>
      <h2 id="webhooks">Webhooks</h2>
      <p><a href="/docs/workflows/debit-cards/dc-auth/">Card authorise webhook →</a></p>
    `,
  },
  "billing-metering": {
    title: "Billing & Metering",
    lede: "Usage and fees without inventing balances outside the Ledger.",
    body: `<h2 id="rule">Rule</h2><p>Fees post through the same money rules as customer value.</p>`,
  },
  "system-architecture": {
    title: "System Architecture",
    lede: "Hexagonal services, control plane, regional data planes.",
    body: `
      <h2 id="shape">Shape</h2>
      <p>Apps → domain services → ports → market adapters → providers.</p>
      <h2 id="critical">Critical path</h2>
      <p>Control plane → Ledger → Pricing/FX → Payments/Rail → Pakistan go-live.</p>
    `,
  },
  "data-design": {
    title: "Data Design",
    lede: "Tenant-scoped rows, outbox events, integer money, residency.",
    body: `
      <h2 id="invariants">Invariants</h2>
      <ul>
        <li><code>tenant_id</code> everywhere</li>
        <li>Transactional outbox after durable writes</li>
        <li>Minor-unit integers</li>
        <li>KSA residency when required</li>
      </ul>
    `,
  },
  "experience-architecture": {
    title: "Experience Architecture",
    lede: "Customer web and staff console as windows onto the machine.",
    body: `<h2 id="apps">Apps</h2><p><code>apps/web</code> for customers; <code>apps/console</code> for staff.</p>`,
  },
  "platform-anatomy": {
    title: "Platform Anatomy",
    lede: "Moving parts named the way engineers name them in the monorepo.",
    body: `
      <h2 id="services">Present in pilot</h2>
      <p>control-plane, identity, wallets, payments, screening, bff; jvm/ledger, jvm/pricing.</p>
    `,
  },
  "end-to-end-map": {
    title: "The End-to-End Map",
    lede: "From channel click to rail and back to the Ledger — plus every workflow.",
    body: `
      <h2 id="map">Map</h2>
      <ol>
        <li>Customer acts in web → BFF</li>
        <li>Domain services enforce tenant + policy</li>
        <li>Screening gates risk</li>
        <li>Ledger holds / posts</li>
        <li>Payout adapter speaks to the rail</li>
        <li>Events via outbox; ops reconcile</li>
      </ol>
      <h2 id="workflows">All workflows</h2>
      <div class="wf-embed" data-view="gallery"></div>
    `,
  },
  "technology-choices": {
    title: "Technology Choices",
    lede: "NestJS/TS by default; Java only for Ledger, Pricing, FX.",
    body: `
      <h2 id="why">Why the split</h2>
      <p>Exact money arithmetic where a float would be catastrophic. Everything else stays on one TypeScript toolchain.</p>
    `,
  },
  "infrastructure-cost": {
    title: "Infrastructure & Cost",
    lede: "Size from volume and residency — not from the number of boxes on a diagram.",
    body: `<h2 id="rule">Rule</h2><p>Year-three volume should drive capacity. Until then every cost envelope is a working assumption.</p>`,
  },
  "delivery": {
    title: "Delivery",
    lede: "Milestones M0–M8, squads, and the critical path to Pakistan live.",
    body: `<h2 id="milestones">Milestones</h2><p>M0–M1 marked done in programme view; PK go-live is the commercial bar.</p>`,
  },
  "decisions": {
    title: "Decisions",
    lede: "ADRs and stack decisions that gave the banking system its shape.",
    body: `
      <ul>
        <li>Ledger as sole balance SoR</li>
        <li>Fail-closed screening</li>
        <li>NestJS default / JVM islands</li>
        <li>ADR-0002 FX provenance</li>
      </ul>
    `,
  },
  "measured-against": {
    title: "Measured Against Peers",
    lede: "Against the blueprint go-live bar and the pilot reality.",
    body: `
      <h2 id="bars">Two bars</h2>
      <p><strong>Blueprint bar:</strong> live providers, residency, reporting, recon, CI.</p>
      <p><strong>Pilot bar:</strong> login-to-money-movement on mocks — already partly true.</p>
    `,
  },
  "build-backlog": {
    title: "Build Backlog",
    lede: "311 traced tasks from blueprint set v3.1 (17 Aug 2026 snapshot).",
    body: `
      <div class="stats">
        <div class="stat"><b>31</b><span>Done</span></div>
        <div class="stat"><b>63</b><span>Partial</span></div>
        <div class="stat"><b>214</b><span>Not started</span></div>
        <div class="stat"><b>281</b><span>Ticket-ready</span></div>
      </div>
    `,
  },
  "design-system": {
    title: "Design System",
    lede: "Tokens and UI consistency — presentation, not money truth.",
    body: `<h2 id="rule">Rule</h2><p>Design tokens serve channels. They never become a second ledger.</p>`,
  },
  "banking-compendium": {
    title: "The Banking Compendium",
    lede: "Index of this docs site and pointers to the blueprint pack.",
    body: `
      <h2 id="this-site">This site</h2>
      <p>Start Here through Cross-cutting. Onboarding and payment stages live under <strong>Journeys</strong> in the menu.</p>
    `,
  },
};

Object.assign(CONTENT, richPageContent);

const journeyPagesBuilder = require("./journeys-page-content");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStageLinksMap(workflows) {
  const accents = ["teal", "blue", "amber", "rose", "violet"];
  const map = {};
  for (const wf of workflows) {
    map[wf.id] = (wf.steps || [])
      .map(
        (s, i) =>
          `<a class="doc-wf-stage-link accent-${accents[i % accents.length]}" href="/docs/workflows/${wf.id}/${s.id}/">
        <span class="n">${esc(s.num)}</span>
        <span class="t"><strong>${esc(s.title)}</strong><em>${esc(s.blurb)}</em></span>
        <span class="c">Open →</span>
      </a>`
      )
      .join("");
  }
  return map;
}

Object.assign(CONTENT, journeyPagesBuilder(buildStageLinksMap(WORKFLOWS)));

function listHtml(items) {
  if (!items?.length) return "";
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function metaTableHtml(rows) {
  if (!rows.length) return "";
  return `<div class="table-wrap"><table>
    <thead><tr><th>Property</th><th>Detail</th></tr></thead>
    <tbody>${rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${v}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function buildWalkthroughFromNodes(story) {
  if (!story?.nodes?.length) return [];
  return story.nodes.map((n, i) => {
    const num = String(i + 1).padStart(2, "0");
    if (n.kind === "db" || n.kind === "event") {
      const op = n.op || "WRITE";
      const target = [n.store, n.table].filter(Boolean).join(" · ");
      return {
        n: num,
        title: n.table || n.store || "Durable write",
        text: `${op} on ${target}`,
        why: n.why || "Purple node on the diagram — this is what auditors can replay.",
        save: `${op} → ${target}`,
      };
    }
    return {
      n: num,
      title: n.label || n.id || "Step",
      text: n.detail || n.why || "",
      why: n.why || "",
      save: n.kind === "end" ? "Terminal state" : n.kind === "start" ? "Human / channel entry" : "In-flight processing",
    };
  });
}

function specCard(title, items, kind) {
  if (!items?.length) return "";
  const icons = { who: "👤", stack: "⚙", data: "🗄", api: "⇄" };
  const icon = icons[kind] || "•";
  return `
    <div class="stage-spec-card stage-spec-card--${kind}">
      <h3><span class="stage-spec-icon" aria-hidden="true">${icon}</span>${title}</h3>
      <ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`;
}

function nodesFlowTable(story) {
  if (!story?.nodes?.length || story.walkthrough?.length) return "";
  return `
    <h3 id="flow">Flow nodes</h3>
    <div class="table-wrap stage-flow-table">
      <table>
        <thead><tr><th>Node</th><th>Type</th><th>Detail</th><th>Durable?</th></tr></thead>
        <tbody>
          ${story.nodes
            .map((n) => {
              const type = n.kind || "process";
              const durable =
                type === "db" || type === "event"
                  ? `<span class="pill ok">${esc(n.op || "WRITE")}</span>`
                  : '<span class="pill settled">—</span>';
              const label = n.label || n.table || n.id || "—";
              const detail = n.detail || n.why || (n.store ? `${n.op || ""} ${n.store} ${n.table || ""}` : "");
              return `<tr>
                <td><strong>${esc(label)}</strong></td>
                <td><code>${esc(type)}</code></td>
                <td>${esc(detail)}</td>
                <td>${durable}</td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function checklistHtml(items) {
  if (!items?.length) return "";
  return `<div class="stage-checklist">${items
    .map((c) => `<div class="stage-check-item"><span class="stage-check-mark" aria-hidden="true">✓</span><span>${esc(c)}</span></div>`)
    .join("")}</div>`;
}

function stageDetailHtml(step, wf, stepIndex) {
  const accents = ["teal", "blue", "amber", "rose", "violet"];
  const accent = accents[stepIndex % accents.length];
  const pipelineStage = wf?.overviewPipeline?.stages?.[stepIndex];
  const story = step.story || {};
  const walkthrough = story.walkthrough?.length
    ? story.walkthrough
    : buildWalkthroughFromNodes(story);
  const narrative =
    story.summary && story.summary.length > 36
      ? story.summary
      : [step.detail, pipelineStage?.does, story.summary].filter(Boolean).join(" ");

  const metaRows = [];
  if (step.repo) metaRows.push(["Primary repo", `<code>${esc(step.repo)}</code>`]);
  if (step.duration) metaRows.push(["Trigger", esc(step.duration)]);
  if (pipelineStage?.api) metaRows.push(["API", `<code>${esc(pipelineStage.api)}</code>`]);
  if (wf?.designDoc) metaRows.push(["Design doc", `<code>${esc(wf.designDoc)}</code>`]);

  const writeChip = pipelineStage?.write
    ? `<div class="stage-write-chip">
        <span class="op">${esc(pipelineStage.write.op)}</span>
        <span class="store">${esc(pipelineStage.write.store)}</span>
        <code>${esc(pipelineStage.write.table)}</code>
        ${pipelineStage.write.why ? `<em>${esc(pipelineStage.write.why)}</em>` : ""}
      </div>`
    : "";

  return `
    <div class="stage-page stage-page--${accent}">
      <div class="stage-hero">
        <div class="stage-hero-badges">
          <span class="stage-badge stage-badge--num">${esc(step.num)}</span>
          <span class="stage-badge stage-badge--wf">${esc(wf.label)}</span>
          ${step.must ? '<span class="stage-badge stage-badge--req">Required</span>' : '<span class="stage-badge stage-badge--opt">Optional</span>'}
        </div>
        ${narrative ? `<p class="stage-lead">${esc(narrative)}</p>` : ""}
        ${writeChip}
        ${story.outcome ? `<div class="stage-outcome"><strong>Outcome when this step completes</strong><p>${esc(story.outcome)}</p></div>` : ""}
      </div>

      <div class="stage-diagram-panel">
        <div class="stage-diagram-head">
          <h2 id="diagram">Stage diagram</h2>
          <p>Follow the swimlane left to right. <strong>Purple cards</strong> are durable writes — the evidence an auditor replays.</p>
        </div>
        <div class="wf-embed" data-workflow="${esc(wf.id)}" data-step="${esc(step.id)}" data-view="step"></div>
      </div>

      <div class="stage-spec-grid">
        ${specCard("Who is involved", step.actors, "who")}
        ${specCard("Technology", step.stack, "stack")}
        ${specCard("Data touched", step.data, "data")}
        ${specCard("APIs &amp; ports", step.apis, "api")}
      </div>

      ${metaRows.length ? `<div class="stage-meta-panel">${metaTableHtml(metaRows)}</div>` : ""}

      <div class="stage-story-panel">
        <h2 id="story">${story.title ? esc(story.title) : "What happens in this stage"}</h2>
        ${story.cheatSheet?.length ? `<div class="stage-cheat"><strong>Presenter cheat sheet</strong>${listHtml(story.cheatSheet)}</div>` : ""}
        ${walkthrough.length ? `
          <h3 id="walkthrough">Step-by-step walkthrough</h3>
          <div class="table-wrap stage-walk-table">
            <table>
              <thead><tr><th>#</th><th>Component</th><th>What happens</th><th>Durable write</th></tr></thead>
              <tbody>
                ${walkthrough
                  .map((w) => {
                    const text = w.say || w.text || "";
                    const why = w.why ? `<br><em class="stage-why">${esc(w.why)}</em>` : "";
                    const tip = w.tip ? `<br><small class="stage-tip">${esc(w.tip)}</small>` : "";
                    return `<tr>
                      <td class="stage-walk-n">${esc(w.n)}</td>
                      <td><strong>${esc(w.title)}</strong></td>
                      <td>${esc(text)}${why}${tip}</td>
                      <td><code class="stage-save">${esc(w.save || "—")}</code></td>
                    </tr>`;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>` : ""}
        ${nodesFlowTable(story)}
      </div>

      ${step.checklist?.length ? `
        <div class="stage-checklist-panel">
          <h2 id="checklist">Acceptance checklist</h2>
          <p class="stage-checklist-note">Ship this stage only when every item below is true in code and CI.</p>
          ${checklistHtml(step.checklist)}
        </div>` : ""}
    </div>`;
}

function workflowOverviewExtra(wf) {
  const parts = [];
  if (wf.status) {
    const pill =
      wf.status === "ready"
        ? '<span class="pill ok">Ready</span>'
        : `<span class="pill part">${esc(wf.status)}</span>`;
    parts.push(`<p>${pill} workflow pack in this documentation set.</p>`);
  }
  if (wf.overviewPipeline?.outcome) {
    parts.push(
      `<div class="callout"><strong>Pipeline outcome</strong> ${esc(wf.overviewPipeline.outcome)}</div>`
    );
  }
  if (wf.overviewStory?.summary) {
    parts.push(`<h2 id="overview-story">Overview</h2><p>${esc(wf.overviewStory.summary)}</p>`);
  }
  if (wf.overviewStory?.cheatSheet?.length) {
    parts.push(`<h3 id="overview-cheat-sheet">Cheat sheet</h3>${listHtml(wf.overviewStory.cheatSheet)}`);
  }
  if (wf.designDoc) {
    parts.push(
      `<p><strong>Design companion:</strong> <code>${esc(wf.designDoc)}</code> (engineering library in <code>Docs_Portal</code>).</p>`
    );
  }
  return parts.join("\n");
}

function buildWfSectionMap() {
  const map = {};
  for (const group of NAV) {
    for (const item of group.items) {
      for (const wfId of item.workflows || []) map[wfId] = item.id;
    }
  }
  return map;
}
const WF_SECTION = buildWfSectionMap();

function firstStageHref(item) {
  const wfId = item.workflows?.[0];
  if (!wfId) return `/docs/${item.file}/`;
  const wf = WORKFLOWS.find((w) => w.id === wfId);
  const step = wf?.steps?.[0];
  if (!step) return `/docs/workflows/${wfId}/`;
  return `/docs/workflows/${wfId}/${step.id}/`;
}

function workflowStagesHtml(wfId, showGroupLabel, sectionId) {
  const wf = WORKFLOWS.find((w) => w.id === wfId);
  if (!wf) return "";
  const steps = (wf.steps || [])
    .map(
      (s) =>
        `<a class="depth-3" data-page="wf-${wf.id}-${s.id}" data-nav-section="${esc(sectionId)}" href="/docs/workflows/${wf.id}/${s.id}/">${esc(s.num)} - ${esc(s.title)}</a>`
    )
    .join("\n            ");
  const label = showGroupLabel
    ? `<div class="nav-stage-group">${esc(wf.label)}</div>\n            `
    : "";
  return `${label}${steps}`;
}

function sectionFolderHtml(item) {
  const workflows = item.workflows || [];
  const showLabels = workflows.length > 1;
  const stages = workflows.map((id) => workflowStagesHtml(id, showLabels, item.id)).join("\n            ");
  const entryHref = `/docs/${item.file}/`;
  const stageCount = workflows.reduce((n, id) => {
    const wf = WORKFLOWS.find((w) => w.id === id);
    return n + (wf?.steps?.length || 0);
  }, 0);
  const badge = stageCount ? `<span class="nav-section-badge">${stageCount}</span>` : "";
  return `
        <div class="nav-section nav-section--${esc(item.id)}" data-section="${esc(item.id)}">
          <div class="nav-section-row">
            <a data-page="${item.id}" data-nav-section="${esc(item.id)}" href="${entryHref}">${esc(item.label)}${badge}</a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle ${esc(item.label)}"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            ${stages}
          </div>
        </div>`;
}

function renderNavItem(item) {
  if (item.workflows?.length) return sectionFolderHtml(item);
  return `<a data-page="${item.id}" href="/docs/${item.file}/">${esc(item.label)}</a>`;
}

function sidebarHtml() {
  return NAV.map((group) => {
    const links = group.items.map(renderNavItem).join("\n        ");
    return `
    <div class="nav-group" data-group="${group.label}">
      <button type="button" class="nav-toggle" aria-expanded="true">${esc(group.label)} <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        ${links}
      </div>
    </div>`;
  }).join("\n");
}

function redirectPage(item) {
  const target = firstStageHref(item);
  return pageShell({
    id: item.id,
    title: item.label,
    section: item.id,
    lede: "Opening first stage…",
    body: `<script>location.replace("${target}");</script><p class="callout">Redirecting to the first stage… <a href="${target}">Continue</a></p>`,
  });
}

function pageShell({ id, title, eyebrow, lede, body, section, wf }) {
  const extra = [
    section ? `data-section="${esc(section)}"` : "",
    wf ? `data-wf="${esc(wf)}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/assets/css/docs.css" />
  <link rel="stylesheet" href="/assets/css/workflows.css" />
</head>
<body data-page="${esc(id)}" ${extra}>
  <div class="mobile-bar"><strong>Platform Docs</strong><button type="button" id="menuBtn">Menu</button></div>
  <div class="backdrop" id="backdrop"></div>
  <div class="app">
    <aside class="sidebar" id="sidebar"></aside>
    <div class="main">
      <article class="article">
        <p class="eyebrow">${esc(eyebrow || title)}</p>
        <h1>${esc(title)}</h1>
        ${lede ? `<p class="lede">${lede}</p>` : ""}
        ${body}
      </article>
      <aside class="toc" id="toc"></aside>
    </div>
  </div>
  <script src="/assets/js/docs.js"></script>
  <script src="/assets/js/workflows.js"></script>
  <script src="/assets/js/workflows-embed.js"></script>
</body>
</html>
`;
}

function writePage(relDir, html) {
  const dir = path.join(docsDir, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

// ---- docs.js ----
const docsJs = `/* Auto-generated nav — EMI / e-money menus + workflow stage submenus */
(function () {
  const SIDEBAR_HTML = \`
    <a class="brand" href="/docs/where-we-stand/">
      <strong>Platform Docs</strong>
      <small>EMI / E-Money &amp; Remittance</small>
    </a>
    <input class="search" type="search" placeholder="Search" aria-label="Search" disabled title="Search coming later" />
${sidebarHtml()}
  \`;

  function renderToc() {
    const headings = [...document.querySelectorAll(".article h2[id], .article h3[id]")];
    if (!headings.length) return "";
    return \`
      <div class="toc-label">On this page</div>
      \${headings.map((h) => \`<a href="#\${h.id}">\${h.textContent}</a>\`).join("")}
    \`;
  }

  function initNavActive() {
    const active = document.body.dataset.page || "";
    const activeSection = document.body.dataset.section || "";
    const activeWf = document.body.dataset.wf || "";
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.querySelectorAll("a[data-page]").forEach((a) => {
      const page = a.getAttribute("data-page");
      const linkSection = a.getAttribute("data-nav-section") || "";
      if (page !== active) return;
      if (linkSection && activeSection && linkSection !== activeSection) return;
      if (a.classList.contains("depth-3")) {
        a.classList.add("active");
        return;
      }
      if (!sidebar.querySelector(\`a.depth-3[data-page="\${active}"]\`)) {
        a.classList.add("active");
      }
    });

    if (active.startsWith("wf-") && activeSection && !sidebar.querySelector("a.depth-3.active")) {
      const parent = sidebar.querySelector(\`.nav-section[data-section="\${activeSection}"] .nav-section-row > a\`);
      parent?.classList.add("active");
    }

    sidebar.querySelectorAll(".nav-section").forEach((section) => {
      const sid = section.dataset.section;
      const wfInSection = activeWf && !!section.querySelector(\`a[data-page^="wf-\${activeWf}-"]\`);
      const isActiveSection =
        sid === activeSection ||
        wfInSection ||
        !!section.querySelector("a.depth-3.active") ||
        (active.startsWith("wf-") &&
          [...section.querySelectorAll("a[data-page]")].some((a) => a.getAttribute("data-page") === active));
      const toggle = section.querySelector(".nav-section-toggle");
      section.classList.remove("collapsed");
      section.classList.add("is-open");
      toggle?.setAttribute("aria-expanded", "true");
      if (isActiveSection) section.classList.add("is-active-branch");
    });

    const current = sidebar.querySelector("a.active");
    current?.scrollIntoView({ block: "nearest" });
  }

  function init() {
    const sidebar = document.getElementById("sidebar");
    const toc = document.getElementById("toc");
    if (sidebar) {
      sidebar.innerHTML = SIDEBAR_HTML;
      initNavActive();

      sidebar.querySelectorAll(".nav-group").forEach((group) => {
        group.classList.remove("collapsed");
        group.querySelector(":scope > .nav-toggle")?.setAttribute("aria-expanded", "true");
      });

      sidebar.querySelectorAll(".nav-toggle").forEach((btn) => {
        btn.addEventListener("click", () => {
          const group = btn.closest(".nav-group");
          const collapsed = group.classList.toggle("collapsed");
          btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        });
      });

      sidebar.querySelectorAll(".nav-section-toggle").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const section = btn.closest(".nav-section");
          const collapsed = section.classList.toggle("collapsed");
          btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
        });
      });
    }
    if (toc) toc.innerHTML = renderToc();
    const btn = document.getElementById("menuBtn");
    const backdrop = document.getElementById("backdrop");
    const close = () => {
      sidebar?.classList.remove("open");
      backdrop?.classList.remove("show");
    };
    btn?.addEventListener("click", () => {
      sidebar?.classList.add("open");
      backdrop?.classList.add("show");
    });
    backdrop?.addEventListener("click", close);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
`;

fs.writeFileSync(path.join(root, "assets", "js", "docs.js"), docsJs);

// ---- standard docs pages ----
let created = 0;
for (const group of NAV) {
  for (const item of group.items) {
    if (item.redirectToFirstStage && item.workflows?.length) {
      writePage(item.file, redirectPage(item));
      created++;
      continue;
    }
    if (CONTENT[item.id] === null) continue;
    const spec = CONTENT[item.id];
    if (!spec) continue;
    writePage(
      item.file,
      pageShell({
        id: item.id,
        title: spec.title,
        lede: spec.lede,
        body: spec.body,
        section: WF_SECTION[item.workflows?.[0]] || item.id,
        wf: item.workflows?.length === 1 ? item.workflows[0] : "",
      })
    );
    created++;
  }
}

// ---- workflow overview + stage pages (URLs unchanged; nav is under category groups) ----
let wfPages = 0;

for (const wf of WORKFLOWS) {
  const stageLinks = (wf.steps || [])
    .map(
      (s, i) => `
      <a class="doc-wf-stage-link accent-${["teal", "blue", "amber", "rose", "violet"][i % 5]}" href="/docs/workflows/${wf.id}/${s.id}/">
        <span class="n">${esc(s.num)}</span>
        <span class="t"><strong>${esc(s.title)}</strong><em>${esc(s.blurb)}</em></span>
        <span class="c">Open →</span>
      </a>`
    )
    .join("");

  writePage(
    path.join("workflows", wf.id),
    pageShell({
      id: `wf-${wf.id}`,
      title: wf.label,
      eyebrow: `Workflow · ${wf.label}`,
      lede: esc(wf.summary),
      section: WF_SECTION[wf.id] || "",
      wf: wf.id,
      body: `
        ${workflowOverviewExtra(wf)}
        <div class="wf-embed" data-workflow="${esc(wf.id)}" data-view="overview"></div>
        <h2 id="stages">Stages</h2>
        <p>Pick a stage below or use the sidebar under the matching journey section. Each stage page includes actors, APIs, data writes, walkthrough, and acceptance checklist.</p>
        <div class="doc-wf-stage-links">${stageLinks}</div>
      `,
    })
  );
  wfPages++;

  const steps = wf.steps || [];
  steps.forEach((step, idx) => {
    const prev = idx > 0 ? steps[idx - 1] : null;
    const next = idx < steps.length - 1 ? steps[idx + 1] : null;
    const nav = `
      <div class="footer-nav">
        ${
          prev
            ? `<a href="/docs/workflows/${wf.id}/${prev.id}/"><small>Previous</small><strong>${esc(prev.num)} - ${esc(prev.title)}</strong></a>`
            : `<a href="/docs/workflows/${wf.id}/"><small>Overview</small><strong>${esc(wf.label)}</strong></a>`
        }
        ${
          next
            ? `<a href="/docs/workflows/${wf.id}/${next.id}/"><small>Next</small><strong>${esc(next.num)} - ${esc(next.title)}</strong></a>`
            : `<a href="/docs/workflows/${wf.id}/"><small>Done</small><strong>Back to ${esc(wf.label)}</strong></a>`
        }
      </div>`;

    writePage(
      path.join("workflows", wf.id, step.id),
      pageShell({
        id: `wf-${wf.id}-${step.id}`,
        title: `${step.num} - ${step.title}`,
        eyebrow: `${wf.label} · Stage ${step.num}`,
        lede: esc(step.blurb),
        section: WF_SECTION[wf.id] || "",
        wf: wf.id,
        body: `
          ${stageDetailHtml(step, wf, idx)}
          ${nav}
        `,
      })
    );
    wfPages++;
  });
}

// Remove orphan workflows gallery page
const orphanWorkflowsIndex = path.join(docsDir, "workflows", "index.html");
if (fs.existsSync(orphanWorkflowsIndex)) fs.unlinkSync(orphanWorkflowsIndex);

// obsolete short pages
for (const o of ["domain", "journeys", "capabilities", "architecture", "technology", "cross-cutting"]) {
  const p = path.join(docsDir, o);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

console.log("Nav groups:", NAV.length);
console.log("Doc pages generated:", created);
console.log("Workflow pages generated:", wfPages);
console.log("Workflows:", WORKFLOWS.map((w) => `${w.id}(${(w.steps || []).length})`).join(", "));
