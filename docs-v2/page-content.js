/**
 * Rich page bodies for docs-v2 — sourced from blueprint companions + executive pages.
 * Merged into generate-docs.js CONTENT at build time.
 */
const domainPages = require("./domain-page-content");

module.exports = {
  "where-we-stand": {
    title: "Where We Stand",
    lede: "Five minutes. What we are building, three corrections we made to the inherited plan, and the answers we still need from the business.",
    body: `
        <div class="actions">
          <button class="btn" type="button" onclick="navigator.clipboard.writeText(location.href)">Copy link</button>
          <a class="btn" href="/docs/start-here/">Open index</a>
        </div>

        <p>We are building <strong>the machine a digital bank and remittance operator runs on</strong> — not the shop window. Scope is <strong>Digital Banking &amp; Remittance only</strong> across Pakistan, UAE and Saudi Arabia (Blueprint v3.1 banking track). Three corrections still matter. Two questions are still yours to answer. A local banking pilot can move money; Pakistan go-live still cannot.</p>

        <div class="stats">
          <div class="stat"><b>1</b><span>product in this documentation set: Digital Banking &amp; Remittance — ledger, wallets, corridors, and the send-money saga.</span></div>
          <div class="stat"><b>12</b><span>banking services in the blueprint set (identity through notification), plus market adapters behind stable ports.</span></div>
          <div class="stat"><b>3</b><span>launch markets and 9 milestones (M0–M8). Pakistan first, then UAE, then in-Kingdom Saudi Arabia.</span></div>
          <div class="stat"><b>311</b><span>tasks traced to the banking monorepo — 31 done, 63 partial, 214 not started (17 Aug 2026).</span></div>
        </div>

        <div class="callout">
          <strong>Scope of this site</strong>
          These pages describe <strong>Digital Banking &amp; Remittance only</strong>. Broader multi-product framing in other portals is out of scope here. Optional engineering library: <a href="https://document.digitalbank.zekiexperts.com/index.html" target="_blank" rel="noopener">document.digitalbank.zekiexperts.com</a> — use banking services and adapters only.
        </div>

        <h2 id="building">What we are building</h2>
        <p>The shop window sells. <strong>The machine has to survive an audit.</strong> We are building the machine for digital banking and remittance.</p>
        <p>Identity and KYC, sanctions screening, the double-entry ledger, the send-money saga, wallets, pricing, FX provenance, reconciliation, regulatory reporting, and the customer app and staff console that sit on top. Market providers (NADRA, Raast, and later UAE/KSA equivalents) plug in through adapters — the banking domain does not reimplement rails inside every service.</p>
        <p>That distinction explains most of the engineering priorities: <strong>a platform that sells well and cannot survive an audit has no second year.</strong></p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Launching with</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Pakistan domestic money movement (on-us + simulated rail)</strong></td><td><span class="pill part">Pilot live locally</span></td></tr>
              <tr><td><strong>Retail onboarding + mock eKYC + risk tier</strong></td><td><span class="pill part">Partial — mock providers</span></td></tr>
              <tr><td><strong>Screening + HIGH maker-checker</strong></td><td><span class="pill part">Partial — not live lists</span></td></tr>
              <tr><td><strong>Ledger L1–L5 (TigerBeetle)</strong></td><td><span class="pill ok">Implemented in pilot</span></td></tr>
              <tr><td><strong>Real NADRA / Raast / OIDC / tax / notifications</strong></td><td><span class="pill block">Not started</span></td></tr>
              <tr><td><strong>UAE then KSA markets</strong></td><td><span class="pill settled">Sequenced after PK</span></td></tr>
              <tr><td><strong>Cards / core-banking host</strong></td><td><span class="pill settled">Deferred until licensed need</span></td></tr>
              <tr><td><strong>Multi-tenant ready, PK-first operator</strong></td><td><span class="pill settled">Settled in architecture</span></td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="corrections">Three corrections we made</h2>
        <p>We asked one question of every claim in the inherited documents: <strong>which requirement makes this true?</strong> Three patterns kept failing that test.</p>

        <div class="correction">
          <div class="n">01 · Balances live in one place</div>
          <h3>Many services holding money → Ledger only</h3>
          <p>The temptation is to cache balances in wallets, payments, or the BFF for speed. That creates three truths about the same customer's money. Auditors find it; reconciliation never finishes.</p>
          <p><strong>Correction:</strong> the Ledger is the sole system of record for value. Wallets compose product views from Ledger balances. Payments place holds and post settlements — they do not invent balances.</p>
        </div>

        <div class="correction">
          <div class="n">02 · Fail closed on compliance</div>
          <h3>Timeout = clear → Timeout = HOLD</h3>
          <p>Inherited sketches sometimes treated a screening timeout as "proceed." That is how sanctioned traffic gets a receipt.</p>
          <p><strong>Correction:</strong> screening timeout or circuit open means <strong>HOLD</strong>, never CLEAR. HIGH cases need maker-checker. Provider failure on eKYC means MANUAL_REVIEW — never auto-approve.</p>
        </div>

        <div class="correction">
          <div class="n">03 · Size from demand, not from a diagram</div>
          <h3>Diagram-shaped spend → requirement-shaped spend</h3>
          <p>Stack choices and infrastructure envelopes were sometimes derived from boxes on a slide rather than participant volume, corridor mix, and residency rules (especially KSA in-Kingdom data).</p>
          <p><strong>Correction:</strong> NestJS/TypeScript by default; Java only for Ledger, Pricing, and FX. Money as integer minor units. Residency routing is a requirement, not an optional optimisation.</p>
        </div>

        <div class="callout">
          <strong>The pattern behind all three</strong>
          Each was a case of the technology being chosen from the shape of a diagram rather than from what the business and the regulator actually need. That inversion is expensive — and it will recur if nobody watches for it.
        </div>

        <h2 id="need">What we need from the business</h2>
        <p>Two questions are holding the critical path. <strong>Neither is purely technical</strong>, and neither can be closed by the engineering team alone.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question</th><th>Blocks</th><th>Owner</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Which live market providers, on what contracts — NADRA, Raast, IdP, tax, messaging?</strong></td>
                <td>Pakistan go-live. The pilot uses mocks and simulated rails. Certification calendars can dominate the date.</td>
                <td>Commercial / Ops</td>
              </tr>
              <tr>
                <td><strong>Year-three participant volume and product mix (domestic vs corridors)?</strong></td>
                <td>Nothing today — but every capacity and cost figure is a working assumption until answered.</td>
                <td>Business</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>Smaller items sit with docs and R&amp;D rather than blocking the pilot: confirmed tax packs, notification templates, whether corporate onboarding ships at launch, and hosting provider. Those change configuration — not the shape of the machine.</p>

        <h3 id="identity-questions">Three questions about what we are, not what we build</h3>
        <p>These shape the documents rather than the software. Guessing quietly would be worse than leaving them open.</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question</th><th>What it affects</th><th>Owner</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Who holds the banking / remittance licences, and who operates the platform?</strong></td>
                <td>Tenant model, branding, who the regulator talks to.</td>
                <td>Business</td>
              </tr>
              <tr>
                <td><strong>Who are we for, and why would they choose us?</strong></td>
                <td>Product emphasis, corridor priority, which surfaces ship first.</td>
                <td>Business</td>
              </tr>
              <tr>
                <td><strong>Is a second tenant imminent?</strong></td>
                <td>Whether branding, domains, terminology, and provisioning move into launch scope now.</td>
                <td>Business</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="docs">Where the documentation stands</h2>
        <p>Banking track of Blueprint set <strong>v3.1</strong>: master architecture, tech stack, twelve services, market adapters, feature specs, design companions, ADRs, and the M0–M8 plan. The domain explains the requirements; the requirements explain the architecture; the architecture explains the technology.</p>
        <p>Not a pile — a derivation. Every claim should trace to a requirement or be marked as an assumption. Decisions that gave the system its shape live in ADRs with alternatives rejected and conditions that would reverse them.</p>
        <p>Banking-oriented start docs: <strong>00</strong> (Master Architecture), <strong>01</strong> (Technology Stack), <strong>02–13</strong> (services), <strong>27</strong> (Repo &amp; branching), <strong>29</strong> (Development plan).</p>
        <p>Implementation reality (17 Aug 2026 banking monorepo review): <strong>311</strong> tasks — <strong>31</strong> done, <strong>63</strong> partial, <strong>214</strong> not started. The blueprint "design stage" and the pilot's "login-to-money-movement" reality are both true; they answer different questions.</p>

        <div class="callout warn">
          <strong>If you read nothing else</strong>
          Read <a href="/docs/one-payment-followed/">One Payment, Followed</a> and <a href="/docs/money-model-correction/">Money Model Correction</a>. Together they explain why the Ledger and the payment saga look the way they do — and why shortcutting either one fails an audit.
        </div>

        <div class="card-grid">
          <a class="card" href="/docs/start-here/"><strong>Start Here</strong><span>Pick a reading path — or read straight down.</span></a>
          <a class="card" href="/docs/money-model-correction/"><strong>Money Model Correction</strong><span>Share this with anyone still designing as if wallets hold balances.</span></a>
          <a class="card" href="/docs/what-we-do-not-know/"><strong>What We Do Not Know</strong><span>Open questions, owners, and what waiting costs.</span></a>
        </div>

        <div class="footer-nav">
          <a href="/docs/start-here/"><small>Previous</small><strong>Start Here</strong></a>
          <a href="/docs/money-model-correction/"><small>Next</small><strong>Money Model Correction</strong></a>
        </div>
    `,
  },

  "money-model-correction": {
    title: "Money Model Correction",
    lede: "A short correction for anyone drafting from the shared baseline — one error that is easy to fix now and expensive after money has moved. Share this one.",
    body: `
        <h2 id="found">What we found</h2>
        <p>Designs sometimes treat <strong>wallets, payments, or the channel app</strong> as if they hold customer balances. They do not. Under the architecture, only the <strong>Ledger</strong> is the system of record for value. Everything else composes a view or orchestrates a saga.</p>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Surface</th><th>Owns</th><th>Does not own</th></tr></thead>
            <tbody>
              <tr><td><strong>Ledger</strong></td><td>Append-only postings, holds, balance projections</td><td>Product UX, KYC decisions</td></tr>
              <tr><td><strong>Wallets &amp; Accounts</strong></td><td>Product instances, statements, customer labels</td><td>Authoritative balances</td></tr>
              <tr><td><strong>Payments</strong></td><td>Saga state: quote → screen → hold → payout → settle</td><td>Invented balances</td></tr>
              <tr><td><strong>apps/web</strong></td><td>Forms and display</td><td>Any durable money truth</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="why">Why it matters more than it looks</h2>
        <p>If two services both "know" a balance, you get two truths. Reconciliation becomes archaeology. An auditor asks which number is real — and both teams answer "ours."</p>
        <p>Integer minor units only. No floating-point money. FX provenance is recorded (ADR-0002). PKR-only pilot may keep FX conversion built but inactive until corridors need it.</p>

        <h2 id="correction">The correction</h2>
        <p><strong>One ledger dimension for value.</strong> Wallets are a product façade. Payments place holds and post settlements through the Ledger. Idempotency keys on every mutation. Outbox events after durable writes.</p>

        <div class="table-wrap">
          <table>
            <thead><tr><th></th><th>Balances in many services</th><th>Ledger only</th></tr></thead>
            <tbody>
              <tr><td>Where does the customer's money sit?</td><td>Wherever the last writer left it</td><td>In the Ledger, always</td></tr>
              <tr><td>Can it be corrected after postings?</td><td>Painfully — history disagrees</td><td>Nothing to unpick</td></tr>
              <tr><td>What does reconciliation do?</td><td>Guess which cache is wrong</td><td>Match Ledger ↔ payments ↔ rail statements</td></tr>
            </tbody>
          </table>
        </div>

        <div class="callout warn">
          <strong>Propagates if ignored</strong>
          New feature specs written as if the BFF or wallet "updates balance" will reintroduce the error. Point authors here before they draft.
        </div>

        <h2 id="need">What we still need from you</h2>
        <ul>
          <li>Confirmed product catalogue for launch wallets (which products, which currencies).</li>
          <li>Whether FX corridors activate at PK launch or later.</li>
          <li>Sign-off that Cards / CBS remain deferred until a licensed need appears.</li>
        </ul>

        <div class="footer-nav">
          <a href="/docs/where-we-stand/"><small>Previous</small><strong>Where We Stand</strong></a>
          <a href="/docs/what-we-do-not-know/"><small>Next</small><strong>What We Do Not Know</strong></a>
        </div>
    `,
  },

  "what-we-do-not-know": {
    title: "What We Do Not Know",
    lede: "Every unanswered question in one register — who owns it, what it blocks, and what waiting costs. No document elsewhere in this set should silently invent an answer.",
    body: `
        <h2 id="blocking">Blocking</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Question</th><th>Blocks</th><th>Owner</th><th>Waiting costs</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Live provider contracts: NADRA, Raast, IdP, tax, messaging</strong></td>
                <td>Pakistan go-live certification</td>
                <td>Commercial / Ops</td>
                <td>Pilot stays on mocks; date slips to the slowest cert</td>
              </tr>
              <tr>
                <td><strong>Year-three volume and corridor mix</strong></td>
                <td>Capacity and cost envelopes</td>
                <td>Business</td>
                <td>Infrastructure either overbuilt or underbuilt</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="config">Configuration — needed to launch, not to build</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Question</th><th>Owner</th></tr></thead>
            <tbody>
              <tr><td>Tax packs and fail-closed behaviour for quotes</td><td>Finance / Compliance</td></tr>
              <tr><td>Notification templates and sender identities per tenant</td><td>Ops / Brand</td></tr>
              <tr><td>Corporate / KYB at launch or later</td><td>Product</td></tr>
              <tr><td>Hosting provider and regions for AE / KSA</td><td>Platform</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="identity">Identity of the programme</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Question</th><th>Affects</th><th>Owner</th></tr></thead>
            <tbody>
              <tr><td>Who holds the licence vs who runs the platform?</td><td>Tenant model, regulator relationship</td><td>Business</td></tr>
              <tr><td>Target segment and why customers choose us</td><td>Product and channel priority</td><td>Business</td></tr>
              <tr><td>Is a second tenant imminent?</td><td>Branding / domain / provisioning scope</td><td>Business</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="engineering">Known engineering gaps (not unknowns — unfinished work)</h2>
        <p>As of the 17 Aug 2026 traceability review: isolation router and KSA residency not enforced; no CI; most SPI adapters mock or absent; compliance reporting and reconciliation services not built; customer UI is a narrow on-us demo.</p>
        <p>Counts: <strong>31 Done</strong>, <strong>63 Partial</strong>, <strong>214 Not Started</strong> of 311 traced tasks.</p>

        <div class="footer-nav">
          <a href="/docs/money-model-correction/"><small>Previous</small><strong>Money Model Correction</strong></a>
          <a href="/docs/one-payment-followed/"><small>Next</small><strong>One Payment, Followed</strong></a>
        </div>
    `,
  },

  "one-payment-followed": {
    title: "One Payment, Followed",
    lede: "Before any of the detail: the whole send-money system happening to one payment, in order. Ten minutes, and the rest of this set stops being a list of documents.",
    body: `
        <h2 id="saga">The saga</h2>
        <p><strong>Quote → Screen → Hold → Payout → Settle.</strong> Three compensations when the world refuses to cooperate: screen-fail, rail-reject, settlement-fail.</p>

        <p><a href="/docs/workflows/fund-transfer/">Open Fund Transfer stages (menu) →</a></p>
        <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Step</th><th>Who</th><th>What becomes true</th></tr></thead>
            <tbody>
              <tr><td><strong>01 Quote</strong></td><td>Pricing (+ FX / tax packs)</td><td>Customer sees a firm quote; provenance recorded</td></tr>
              <tr><td><strong>02 Screen</strong></td><td>Screening &amp; AML</td><td>CLEAR continues; HOLD or REJECT stops; timeout = HOLD</td></tr>
              <tr><td><strong>03 Hold</strong></td><td>Ledger</td><td>Funds reserved — not spent yet</td></tr>
              <tr><td><strong>04 Payout</strong></td><td>Payments + payout rail adapter</td><td>Raast / Aani / sarie / partner instructed</td></tr>
              <tr><td><strong>05 Settle</strong></td><td>Ledger + Payments</td><td>Postings final; saga closes</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="compensations">Compensations</h2>
        <ul>
          <li><strong>C1 Screen-fail</strong> — never held; customer informed; case if needed.</li>
          <li><strong>C2 Rail-reject</strong> — release hold; saga fails closed.</li>
          <li><strong>C3 Settlement-fail</strong> — operational path; money must not vanish into ambiguity.</li>
        </ul>

        <h2 id="invariants">Invariants that must stay true</h2>
        <ul>
          <li><code>tenant_id</code> on every request, event, row, and log line.</li>
          <li><code>Idempotency-Key</code> on every mutating call.</li>
          <li>Integer minor units only.</li>
          <li>KSA data never leaves the Kingdom when residency demands it.</li>
          <li>Isolation failures are release-blocking P1.</li>
        </ul>

        <div class="callout">
          <strong>Onboarding is a different journey</strong>
          Register → screen → eKYC → risk tier → open wallets/ledger accounts. Provider timeout on eKYC means MANUAL_REVIEW — never silent approve. See <a href="/docs/workflows/onboarding/register-login/">Customer Journeys · Onboarding</a>.
        </div>

        <div class="footer-nav">
          <a href="/docs/what-we-do-not-know/"><small>Previous</small><strong>What We Do Not Know</strong></a>
          <a href="/docs/customer-journeys/"><small>Next</small><strong>Customer Journeys</strong></a>
        </div>
    `,
  },

  "requirements": {
    title: "Requirements & Constraints",
    lede: "Non-negotiables that every service and adapter must honour. If a design violates one of these, the design is wrong — not pragmatic.",
    body: `
        <h2 id="hard">Hard constraints</h2>
        <ul>
          <li><strong>Tenant isolation</strong> — <code>tenant_id</code> everywhere; isolation bugs are P1.</li>
          <li><strong>Ledger SoR</strong> — no other component holds authoritative balances.</li>
          <li><strong>Idempotent mutations</strong> — <code>Idempotency-Key</code> on every write path.</li>
          <li><strong>Integer money</strong> — minor units only; no floats.</li>
          <li><strong>Fail closed on screening</strong> — timeout / circuit ⇒ HOLD.</li>
          <li><strong>Residency</strong> — KSA data stays in-Kingdom when required.</li>
          <li><strong>Outbox</strong> — durable write then event; no dual-write fantasies.</li>
        </ul>

        <h2 id="nfr">Non-functional requirements</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Area</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>Read APIs (p99)</td><td>&lt; 800 ms excluding provider latency</td></tr>
            <tr><td>Command APIs (p99)</td><td>&lt; 1.5 s excluding provider latency</td></tr>
            <tr><td>Screening (p99)</td><td>&lt; 700 ms excluding provider latency</td></tr>
            <tr><td>Outbox lag (p99)</td><td>&lt; 2 s</td></tr>
            <tr><td>Enterprise RPO / RTO</td><td>≤ 5 min / ≤ 30 min per cell</td></tr>
          </tbody>
        </table></div>

        <h2 id="deferred">Deferred by programme plan</h2>
        <ul>
          <li>Card issuing until a licensed need exists</li>
          <li>Core banking host adapter until a tenant requires it</li>
        </ul>

        <h2 id="ordering">Legal / operational ordering</h2>
        <p>E-Sign before Credit Bureau where consent is a prerequisite. Screening before money movement. Control plane before multi-tenant data planes.</p>

        <h2 id="hexagonal">Hexagonal &amp; contracts</h2>
        <p>Domain code imports only domain + ports. Adapters import frameworks. OpenAPI 3.1 on every boundary. Pact verification on TS↔JVM seams. Dependency-cruiser and ArchUnit are build-blocking.</p>

        <div class="footer-nav">
          <a href="/docs/markets-tenancy/"><small>Previous</small><strong>Markets &amp; Tenancy</strong></a>
          <a href="/docs/customer-journeys/"><small>Next</small><strong>Customer Journeys</strong></a>
        </div>
    `,
  },

  "customer-journeys": {
    title: "Customer Journeys",
    lede: "Retail paths for onboarding, send money, bill pay, and cards — expand each workflow in the sidebar for stage pages with full detail.",
    body: `
      <p>These are the journeys a retail customer runs in <code>apps/web</code>. Each workflow below has an overview diagram, stage links, and per-stage pages with actors, APIs, data writes, walkthrough, and acceptance checklists.</p>

      <h2 id="onboarding">Onboarding</h2>
      <p>Eight stages from register/login through wallet + TigerBeetle accounts. Identity is customer SoR; screening and eKYC gate progression; money accounts open only after compliance.</p>
      <p><a href="/docs/workflows/onboarding/register-login/">Start at Register / Login →</a></p>
      <div class="wf-embed" data-workflow="onboarding" data-view="overview"></div>

      <h2 id="send">Send money</h2>
      <p>Five-stage saga: quote → screen → hold → payout → settle. Product narrative: <a href="/docs/one-payment-followed/">One Payment, Followed</a>.</p>
      <p><a href="/docs/workflows/fund-transfer/ft-initiate/">Start at Initiate transfer →</a></p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>

      <h2 id="bill-payments">Bill payments</h2>
      <p>Select biller → create → confirm → debit. Separate saga from remittance but same money rules.</p>
      <p><a href="/docs/workflows/bill-payments/bp-select/">Start at Select biller →</a></p>
      <div class="wf-embed" data-workflow="bill-payments" data-view="overview"></div>

      <h2 id="debit-cards">Debit cards</h2>
      <p>Specified workflow; product <span class="pill settled">deferred</span> until licensed need. Authorisation uses hold pattern like payments.</p>
      <p><a href="/docs/workflows/debit-cards/dc-request/">Start at Card request →</a></p>
      <div class="wf-embed" data-workflow="debit-cards" data-view="overview"></div>

      <h2 id="serve">Serve (post-onboarding)</h2>
      <p>Balances, statements, profile, help — views composed from Ledger and wallet product data. No second balance cache in the channel.</p>
    `,
  },

  "corporate-journeys": {
    title: "Corporate Journeys",
    lede: "Business onboarding (KYB) and bulk movement — same fail-closed compliance as retail.",
    body: `
      <h2 id="kyb">KYB onboarding</h2>
      <p>Six stages: register business → capture UBOs → enhanced due diligence → screen business and owners → assign risk tier → activate business wallet and ledger accounts.</p>
      <p><a href="/docs/workflows/corporate-kyb/ck-register/">Start at Register business →</a></p>
      <div class="wf-embed" data-workflow="corporate-kyb" data-view="overview"></div>

      <h2 id="rules">Same rules as retail</h2>
      <ul>
        <li>Screening timeout ⇒ HOLD — never CLEAR</li>
        <li>eKYC / document provider timeout ⇒ MANUAL_REVIEW</li>
        <li>HIGH cases require maker-checker before disposition</li>
        <li>Ledger is sole SoR — business wallets compose views only</li>
      </ul>

      <h2 id="launch">Launch question</h2>
      <p>Whether corporate ships at Pakistan launch or later remains open — see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>.</p>
    `,
  },

  "agent-journeys": {
    title: "Agent Journeys",
    lede: "Assisted channels — agent identity, acting-on-behalf grants, and audited actions.",
    body: `
      <h2 id="model">Model</h2>
      <p>Agents authenticate with hierarchy and outlet context. Acting-on-behalf (AOB) grants scope which customer and products an agent may touch. Commission schemes are configuration; <strong>permission boundaries and audit trails are not</strong>.</p>

      <h2 id="workflow">Assisted workflow</h2>
      <p>Four stages: agent login → select customer (AOB grant) → perform domain saga with agent headers → audit and optional commission event.</p>
      <p><a href="/docs/workflows/agent-assisted/ag-login/">Start at Agent login →</a></p>
      <div class="wf-embed" data-workflow="agent-assisted" data-view="overview"></div>

      <h2 id="rules">Rules</h2>
      <ul>
        <li>Agent channel does <strong>not</strong> skip screening or ledger rules</li>
        <li>Every action carries <code>X-Agent-Id</code> and idempotency key</li>
        <li>BFF never holds shadow balances</li>
        <li>Audit log written before commission metering</li>
      </ul>
    `,
  },

  "operator-journeys": {
    title: "Operator Journeys",
    lede: "Staff console work: AML cases, tenant provisioning, overrides that must leave an audit trail.",
    body: `
      <h2 id="aml">AML cases &amp; screening</h2>
      <p>Operators disposition screening cases with maker-checker on HIGH severity. Four stages: request → provider → case open → dispose with outbox event.</p>
      <p><a href="/docs/workflows/screening-aml/sa-request/">Start at Screening request →</a></p>
      <div class="wf-embed" data-workflow="screening-aml" data-view="overview"></div>

      <h2 id="tenant">Tenant operations</h2>
      <p>Provision tenant → attach market pack → branding and entitlements → ops audit trail. Control plane holds config, not regulated customer data.</p>
      <p><a href="/docs/workflows/tenant-ops/to-provision/">Start at Provision tenant →</a></p>
      <div class="wf-embed" data-workflow="tenant-ops" data-view="overview"></div>

      <h2 id="console">Staff console</h2>
      <p><code>apps/console</code> is the operator surface for cases, tenant config, and overrides. Every override must be attributable and immutable in ops audit.</p>
    `,
  },

  "platform-external": {
    title: "Platform & External",
    lede: "Where the bank stops and the market provider begins — ports, adapters, and certification.",
    body: `
      <h2 id="boundary">Hexagonal boundary</h2>
      <p>Domain services call <strong>ports</strong>. <strong>Adapters</strong> translate to NADRA, Raast, screening vendors, IdP, tax, messaging. Domain code never imports vendor SDKs directly.</p>

      <h2 id="workflow">Adapter invocation flow</h2>
      <p>Five stages: port invocation → provider call → normalise response → translate to domain model → resume saga.</p>
      <p><a href="/docs/workflows/market-adapters/ma-port/">Start at Port invocation →</a></p>
      <div class="wf-embed" data-workflow="market-adapters" data-view="overview"></div>

      <h2 id="adapters">Launch adapters (Pakistan)</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Adapter</th><th>Provider</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>16 eKYC</td><td>NADRA CNIC</td><td><span class="pill block">Not certified</span></td></tr>
          <tr><td>15 Screening</td><td>Lists vendor + domestic</td><td><span class="pill part">Mock in pilot</span></td></tr>
          <tr><td>19 Payout rail</td><td>Raast</td><td><span class="pill block">Not certified</span></td></tr>
          <tr><td>22 IdP</td><td>OIDC provider</td><td><span class="pill block">Not started</span></td></tr>
          <tr><td>25 Tax</td><td>Tax authority</td><td><span class="pill block">Not started</span></td></tr>
          <tr><td>21 Notification</td><td>Messaging provider</td><td><span class="pill block">Not started</span></td></tr>
        </tbody>
      </table></div>

      <h2 id="certs">Certifications</h2>
      <p>Live provider contracts and certification calendars can dominate the Pakistan go-live date. Pilot uses sandbox mocks until certs complete.</p>

      <div class="callout warn"><strong>Fail closed</strong> Provider failure on compliance paths ⇒ HOLD or MANUAL_REVIEW — never silent pass.</div>
    `,
  },

  "what-we-are-building": {
    title: "What We Are Building",
    lede: "The machine behind digital banking and remittance — identity through rails.",
    body: `
      <h2 id="machine">The machine, not the shop window</h2>
      <p>We are building <strong>the machine a digital bank and remittance operator runs on</strong> — not the marketing site. Scope is <strong>Digital Banking &amp; Remittance</strong> across Pakistan, UAE and Saudi Arabia (Blueprint v3.1 banking track).</p>
      <p>That means: identity and KYC, sanctions screening, the double-entry ledger, the send-money saga, wallets, pricing, FX provenance, reconciliation, regulatory reporting, and the customer app and staff console. Market providers (NADRA, Raast, and later UAE/KSA equivalents) plug in through <strong>adapters</strong> — the banking domain does not reimplement rails inside every service.</p>

      <h2 id="services">Twelve domain services + adapters</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>#</th><th>Component</th><th>Runtime</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td>02</td><td>Identity, KYC/KYB &amp; Onboarding</td><td>NestJS/TS</td><td>Customer SoR, verification, risk tier</td></tr>
          <tr><td>03</td><td>Screening &amp; AML</td><td>NestJS/TS</td><td>Compliance gate — onboarding and every payment</td></tr>
          <tr><td>04</td><td><strong>Ledger</strong></td><td>Java 21</td><td>Double-entry SoR for value; holds &amp; postings</td></tr>
          <tr><td>05</td><td>Payments &amp; Remittance</td><td>NestJS/TS</td><td>Send-money saga orchestration</td></tr>
          <tr><td>06</td><td>Wallets &amp; Accounts</td><td>NestJS/TS</td><td>Product shells composing ledger balances</td></tr>
          <tr><td>07</td><td>Card Issuing</td><td>NestJS/TS</td><td><span class="pill settled">Deferred</span> until licensed need</td></tr>
          <tr><td>08</td><td>Compliance Reporting</td><td>NestJS/TS</td><td>STR/SAR and market returns</td></tr>
          <tr><td>09</td><td>Reconciliation</td><td>NestJS/TS</td><td>Ledger ↔ payments ↔ rail statements</td></tr>
          <tr><td>10</td><td>Pricing, Billing &amp; Metering</td><td>Java 21</td><td>Quotes, fees, FX/tax packs</td></tr>
          <tr><td>11</td><td>Developer Platform / BFF</td><td>NestJS/TS</td><td>API gateway, webhooks, partner surface</td></tr>
          <tr><td>12</td><td>Control Plane</td><td>NestJS/TS</td><td>Tenant registry, config, entitlements</td></tr>
          <tr><td>13</td><td>Notification</td><td>NestJS/TS</td><td>Customer and ops messaging</td></tr>
          <tr><td>15–22</td><td>Market adapters</td><td>TS (+ FX lib)</td><td>eKYC, screening, payout rails, IdP, messaging</td></tr>
        </tbody>
      </table></div>

      <h2 id="launch">Launch posture (Pakistan first)</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Capability</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Retail wallet + domestic send</td><td><span class="pill part">Pilot path — login-to-money on mocks</span></td></tr>
          <tr><td>Bill payments</td><td><span class="pill part">Specified in blueprint</span></td></tr>
          <tr><td>Live NADRA / Raast</td><td><span class="pill settled">Not certified — blocks PK go-live</span></td></tr>
          <tr><td>Cards</td><td><span class="pill settled">Deferred</span></td></tr>
          <tr><td>Core-banking host adapter</td><td><span class="pill settled">Deferred</span></td></tr>
        </tbody>
      </table></div>

      <h2 id="topology">Topology</h2>
      <p><strong>Global control plane</strong> (tenant registry, config, billing, OIDC) holds no regulated customer data. <strong>Regional data planes</strong> (PK → AE → SA) run the full service set in cells. KSA data stays in-Kingdom when residency requires it.</p>
      <p>See <a href="/docs/system-architecture/">System Architecture</a> for hexagonal boundaries and <a href="/docs/markets-tenancy/">Markets &amp; Tenancy</a> for rollout sequence.</p>

      <h2 id="journeys">How to read the journeys</h2>
      <p>Workflow stages with diagrams live in the sidebar under <strong>Journeys</strong> and <strong>Capability guides</strong>. Start with:</p>
      <ul>
        <li><a href="/docs/workflows/onboarding/register-login/">Onboarding · Register / Login</a></li>
        <li><a href="/docs/one-payment-followed/">One Payment, Followed</a> — the send-money saga in plain language</li>
        <li><a href="/docs/workflows/fund-transfer/ft-initiate/">Fund Transfer · Initiate</a></li>
      </ul>

      <div class="callout warn"><strong>Implementation reality (17 Aug 2026)</strong> 311 traced tasks — 31 done, 63 partial, 214 not started. Blueprint “design stage” and pilot “login-to-money” are both true; they answer different questions. Details: <a href="/docs/build-backlog/">Build Backlog</a>.</div>
    `,
  },

  "products-at-launch": {
    title: "Products at Launch",
    lede: "What ships for Pakistan first — and what waits.",
    body: `
      <h2 id="retail">Retail (Pakistan pilot path)</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Product</th><th>Description</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Retail wallet</td><td>PKR wallet product composing ledger balance</td><td><span class="pill part">Pilot path</span></td></tr>
          <tr><td>Domestic send</td><td>PK→PK via Raast adapter (when certified)</td><td><span class="pill part">Specified</span></td></tr>
          <tr><td>Bill payments</td><td>Biller catalogue, confirm, debit saga</td><td><span class="pill part">Specified</span></td></tr>
          <tr><td>Remittance corridors</td><td>UAE→PK, KSA→PK (primary), reverse</td><td><span class="pill part">Blueprint — AE/SA later</span></td></tr>
        </tbody>
      </table></div>

      <h2 id="deferred">Deferred by programme plan</h2>
      <ul>
        <li><strong>Debit card issuing</strong> — workflow specified; product deferred until licensed need.</li>
        <li><strong>Core-banking host adapter</strong> — only when a tenant requires CBS integration.</li>
        <li><strong>Corporate / KYB at launch</strong> — open question; see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>.</li>
      </ul>

      <h2 id="workflows">Related workflows</h2>
      <div class="card-grid">
        <a class="card" href="/docs/workflows/onboarding/register-login/"><strong>Onboarding</strong><span>8 stages — register through wallet + ledger</span></a>
        <a class="card" href="/docs/workflows/fund-transfer/ft-initiate/"><strong>Fund Transfer</strong><span>5 stages — quote through settle</span></a>
        <a class="card" href="/docs/workflows/bill-payments/bp-select/"><strong>Bill Payments</strong><span>4 stages — select through debit</span></a>
      </div>
    `,
  },

  "markets-tenancy": {
    title: "Markets & Tenancy",
    lede: "Pakistan → UAE → KSA. One control plane; data planes honour residency.",
    body: `
      <h2 id="sequence">Market sequence</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Market</th><th>Regulator context</th><th>Identity</th><th>Domestic rail</th></tr></thead>
        <tbody>
          <tr><td><strong>Pakistan</strong></td><td>SBP / FMU</td><td>NADRA CNIC</td><td>Raast</td></tr>
          <tr><td><strong>UAE</strong></td><td>CBUAE</td><td>Emirates ID / UAE Pass</td><td>Aani</td></tr>
          <tr><td><strong>Saudi Arabia</strong></td><td>SAMA / SAFIU</td><td>Absher / Yakeen</td><td>sarie (in-Kingdom)</td></tr>
        </tbody>
      </table></div>
      <p>Pakistan is the first commercial bar. UAE follows. KSA requires <strong>in-Kingdom</strong> data residency — routing enforced at gateway and datastore.</p>

      <h2 id="tenancy">Tenancy model</h2>
      <ul>
        <li><code>tenant_id</code> on every request, event, database row, and log line.</li>
        <li>Isolation: bridge by default, silo on demand, pool where safe.</li>
        <li>Cross-tenant access bugs are <strong>release-blocking P1</strong> — tested in CI.</li>
        <li>Control plane resolves effective config per tenant; no regulated data in CP.</li>
      </ul>

      <h2 id="tenant-ops">Provisioning a tenant</h2>
      <p>Operators provision markets through the control plane: tenant → market pack → branding → audit. See <a href="/docs/workflows/tenant-ops/to-provision/">Tenant Ops · Provision</a>.</p>
      <div class="wf-embed" data-workflow="tenant-ops" data-view="overview"></div>
    `,
  },

  "identity-kyc-aml": {
    title: "Identity, KYC & AML",
    lede: "Services 02 and 03 — who the customer is, and whether they may proceed.",
    body: `
      <h2 id="identity">Identity &amp; onboarding (service 02)</h2>
      <p>System of record for customers and businesses and their verification state. Orchestrates eKYC adapters; emits risk tier consumed by Screening, Wallets, and Payments.</p>
      <ul>
        <li><strong>Risk tiers:</strong> UNRATED → LOW | MEDIUM | HIGH after verification + screening signals.</li>
        <li><strong>Launch providers:</strong> NADRA CNIC (PK), Emirates ID/UAE Pass (AE), Absher/Yakeen (SA).</li>
        <li><strong>Fail-safe:</strong> provider timeout ⇒ <code>MANUAL_REVIEW</code> — never auto-approve.</li>
        <li><strong>Events:</strong> <code>identity.customer.registered.v1</code>, <code>identity.verification.completed.v1</code>, <code>identity.risk_tier.changed.v1</code>.</li>
      </ul>
      <p>Walk the stages: <a href="/docs/workflows/onboarding/register-login/">Onboarding · Register / Login</a> through <a href="/docs/workflows/onboarding/wallet-ledger/">Wallet + Ledger</a>.</p>
      <div class="wf-embed" data-workflow="onboarding" data-view="overview"></div>

      <h2 id="aml">Screening &amp; AML (service 03)</h2>
      <p>Compliance gate for <strong>onboarding and every money movement</strong>. Real-time screen target p99 &lt; 700 ms excluding provider latency.</p>
      <ul>
        <li><strong>Lists:</strong> UN Consolidated, OFAC SDN, plus domestic (NACTA, UAE Local Terrorist List, KSA designated persons).</li>
        <li><strong>Dispositions:</strong> CLEAR continues; HOLD queues for review; REJECT stops the journey.</li>
        <li><strong>Fail closed:</strong> provider failure, timeout, or circuit-open ⇒ HOLD — never pass silently.</li>
        <li><strong>HIGH cases:</strong> maker-checker required before disposition.</li>
      </ul>
      <p>Stages in the sidebar below, or start at <a href="/docs/workflows/screening-aml/sa-request/">Screening · Request</a>.</p>
      <div class="wf-embed" data-workflow="screening-aml" data-view="overview"></div>

      <h2 id="sequence">Onboarding sequence (happy path)</h2>
      <ol>
        <li>Client registers → Identity persists customer (tier = UNRATED)</li>
        <li>Screening runs onboarding-scope check</li>
        <li>Client starts verification → eKYC adapter (NADRA / UAE Pass / Yakeen)</li>
        <li>Identity recomputes risk tier from verification + screening + geography</li>
        <li>Wallets + Ledger accounts opened for approved tier</li>
      </ol>
    `,
  },

  "payments-rails": {
    title: "Payments & Rails",
    lede: "Service 05 plus payout adapters — the saga and the wires.",
    body: `
      <h2 id="saga">Send-money saga</h2>
      <p><strong>Quote → Screen → Hold → Payout → Settle.</strong> Three compensations when the world refuses to cooperate:</p>
      <ul>
        <li><strong>C1 Screen-fail</strong> — never held; customer informed; case if needed.</li>
        <li><strong>C2 Rail-reject</strong> — release hold; saga fails closed.</li>
        <li><strong>C3 Settlement-fail</strong> — operational path; money must not vanish into ambiguity.</li>
      </ul>
      <p>Product narrative: <a href="/docs/one-payment-followed/">One Payment, Followed</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>

      <h2 id="states">Transfer states</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>State</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>INITIATED → QUOTED</td><td>Pricing returned firm quote with provenance</td></tr>
          <tr><td>SCREEN_CLEAR / COMPLIANCE_HOLD</td><td>CLEAR continues; HOLD waits for case resolution</td></tr>
          <tr><td>FUNDS_HELD</td><td>Ledger hold placed — not spent yet</td></tr>
          <tr><td>PAYOUT_SENT → IN_FLIGHT</td><td>Rail instructed; unknown status never assumed success</td></tr>
          <tr><td>SETTLED</td><td>Hold captured; journal posted; saga complete</td></tr>
        </tbody>
      </table></div>

      <h2 id="rails">Launch rail bindings</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Binding</th><th>Market</th><th>Wire</th></tr></thead>
        <tbody>
          <tr><td><code>raast</code></td><td>PK→PK</td><td>ISO 20022 pacs.008/pacs.002 + Raast alias</td></tr>
          <tr><td><code>aani</code></td><td>AE→AE</td><td>ISO 20022 via Al Etihad Payments</td></tr>
          <tr><td><code>sarie</code></td><td>SA→SA</td><td>SAMA sarie IPS</td></tr>
          <tr><td><code>xborder-partner</code></td><td>AE→PK, SA→PK</td><td>Partner API until direct scheme certified</td></tr>
        </tbody>
      </table></div>

      <h2 id="bills">Bill payments</h2>
      <p>Separate saga: select biller → create payment → confirm → debit. <a href="/docs/workflows/bill-payments/bp-select/">Bill Payments stages →</a></p>
      <div class="wf-embed" data-workflow="bill-payments" data-view="overview"></div>
    `,
  },

  "ledger": {
    title: "Ledger",
    lede: "Service 04 — double-entry system of record for value.",
    body: `
      <h2 id="rules">Rules</h2>
      <ul>
        <li><strong>Nothing else may hold an authoritative balance.</strong></li>
        <li>Append-only journals; balances are projections from postings.</li>
        <li>Holds: PLACED → CAPTURED | RELEASED (exactly one terminal outcome).</li>
        <li>Integer minor units; Java <code>Money(long amountMinor, Currency)</code> on the JVM island.</li>
        <li>FX rate is an <em>input</em> to a posting — never looked up mid-posting (ADR-0002).</li>
      </ul>

      <h2 id="holds">Holds in the payment saga</h2>
      <p>Payments calls <code>placeHold</code> before payout, <code>captureHold</code> on settle, or <code>releaseHold</code> on compensation. See <a href="/docs/workflows/fund-transfer/ft-hold/">Hold stage</a> and <a href="/docs/workflows/fund-transfer/ft-settle/">Settle stage</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>

      <h2 id="events">Events</h2>
      <p><code>ledger.journal.posted.v1</code>, <code>ledger.hold.placed.v1</code>, <code>ledger.hold.captured.v1</code>, <code>ledger.hold.released.v1</code> — all via transactional outbox.</p>

      <div class="callout"><strong>Money model</strong> If anyone designs “update balance in wallet service”, send them to <a href="/docs/money-model-correction/">Money Model Correction</a>.</div>
    `,
  },

  "system-architecture": {
    title: "System Architecture",
    lede: "Hexagonal services, control plane, regional data planes.",
    body: `
      <h2 id="shape">Shape</h2>
      <p><strong>Apps</strong> (customer web, staff console) → <strong>BFF / gateway</strong> → <strong>domain services</strong> → <strong>ports</strong> → <strong>market adapters</strong> → external providers (NADRA, Raast, screening vendors, etc.).</p>
      <p>Each domain service is <strong>hexagonal</strong>: <code>domain/</code> imports nothing; <code>application/</code> imports domain + ports; only <code>adapters/</code> import frameworks and vendor SDKs. Enforced by dependency-cruiser (TS) and ArchUnit (Java) — build-blocking.</p>

      <h2 id="planes">Control plane vs data planes</h2>
      <ul>
        <li><strong>Global control plane</strong> — tenant registry, config &amp; entitlements, billing, global OIDC. No regulated customer data.</li>
        <li><strong>Regional data planes</strong> — PK (Karachi/Islamabad), AE (Dubai/Abu Dhabi), SA (Riyadh, in-Kingdom). Full service set per cell.</li>
        <li><strong>Gateway</strong> resolves tenant → region; KSA never leaves the Kingdom.</li>
      </ul>

      <h2 id="invariants">Invariant rules (every service)</h2>
      <ol>
        <li>Hexagonal boundaries — build-blocking in CI</li>
        <li>Integer minor units — <code>@platform/money</code> in TS; no native <code>number</code> for amounts</li>
        <li>Transactional outbox + Avro/Kafka envelope on every publish</li>
        <li><code>Idempotency-Key</code> on every mutation</li>
        <li>Tenant isolation — P1; 100% isolation test coverage</li>
        <li>KSA residency routing</li>
        <li>OpenAPI 3.1 + Pact on every boundary (mandatory TS↔JVM seams)</li>
      </ol>

      <h2 id="critical">Critical path to Pakistan go-live</h2>
      <p>Control plane → Ledger → Pricing/FX → Payments + Payout rail → live NADRA + Raast certification.</p>

      <h2 id="map">End-to-end</h2>
      <p>See <a href="/docs/end-to-end-map/">The End-to-End Map</a> and <a href="/docs/platform-anatomy/">Platform Anatomy</a> for repo-level naming.</p>
    `,
  },

  "platform-anatomy": {
    title: "Platform Anatomy",
    lede: "Moving parts named the way engineers name them in the monorepo.",
    body: `
      <h2 id="apps">Applications</h2>
      <ul>
        <li><code>apps/web</code> — customer channel (forms and display; no money truth)</li>
        <li><code>apps/console</code> — staff console (cases, tenants, overrides with audit)</li>
      </ul>

      <h2 id="services">Domain services (pilot snapshot)</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Service</th><th>Repo path</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Control plane</td><td><code>services/control-plane</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>Identity</td><td><code>services/identity</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>Screening</td><td><code>services/screening</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>Payments</td><td><code>services/payments</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>Wallets</td><td><code>services/wallets</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>BFF</td><td><code>services/bff</code></td><td><span class="pill part">Partial</span></td></tr>
          <tr><td>Ledger</td><td><code>jvm/ledger</code></td><td><span class="pill part">Partial — TigerBeetle pilot</span></td></tr>
          <tr><td>Pricing</td><td><code>jvm/pricing</code></td><td><span class="pill part">Partial</span></td></tr>
        </tbody>
      </table></div>

      <h2 id="adapters">Adapters</h2>
      <p>Market-specific implementations behind ports: <code>adapters/ekyc-nadra</code>, <code>adapters/payout-raast</code>, screening vendor adapters, IdP, messaging. Sandbox mocks ship first; live certs gate go-live.</p>
    `,
  },

  "data-design": {
    title: "Data Design",
    lede: "Tenant-scoped rows, outbox events, integer money, residency.",
    body: `
      <h2 id="invariants">Invariants</h2>
      <ul>
        <li><code>tenant_id</code> on every regulated table — even under silo isolation (defence in depth).</li>
        <li>Transactional outbox: business row + outbox row in one DB transaction; Debezium relay to Kafka.</li>
        <li>Minor-unit integers for all money columns (<code>amount_minor bigint</code>).</li>
        <li>PII in object storage with pointer in DB — not inline in events.</li>
        <li>KSA residency: <code>home_region = sa</code> routes to in-Kingdom cell only.</li>
      </ul>

      <h2 id="events">Event envelope</h2>
      <p>Topic: <code>‹capability›.‹entity›.‹event›.v‹n›</code>. Envelope fields: <code>event_id</code>, <code>event_type</code>, <code>event_version</code>, <code>tenant_id</code>, <code>occurred_at</code>, <code>correlation_id</code>, <code>causation_id</code>, <code>payload</code>. Consumers idempotent on <code>event_id</code>.</p>

      <h2 id="isolation">Isolation testing</h2>
      <p>Cross-tenant read/write attempts must fail in CI. Isolation bugs are release-blocking P1.</p>
    `,
  },

  "technology-choices": {
    title: "Technology Choices",
    lede: "NestJS/TS by default; Java only for Ledger, Pricing, FX.",
    body: `
      <h2 id="split">The split</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Runtime</th><th>Services</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>NestJS 10 / TypeScript strict</td><td>Identity, Screening, Payments, Wallets, BFF, Control plane, …</td><td>One toolchain for most squads; fast iteration</td></tr>
          <tr><td>Java 21 + Spring Boot 3.3</td><td>Ledger (04), Pricing (10), FX lib (17)</td><td>Exact money arithmetic; ArchUnit; posting hot path</td></tr>
        </tbody>
      </table></div>

      <h2 id="money">Money guardrails</h2>
      <ul>
        <li>TS: <code>@platform/money</code> with <code>bigint</code>; ESLint bans native <code>number</code> for amounts.</li>
        <li>Java: <code>Money(long amountMinor, Currency)</code> — no float paths.</li>
      </ul>

      <h2 id="infra">Data &amp; messaging</h2>
      <p>PostgreSQL 16 per service (tenant-scoped). Kafka + Avro schemas. Redis for balance read-model cache. TigerBeetle in ledger pilot path.</p>
    `,
  },

  "delivery": {
    title: "Delivery",
    lede: "Milestones M0–M8, squads, and the critical path to Pakistan live.",
    body: `
      <h2 id="milestones">Milestones M0–M8</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Gate</th><th>Theme</th></tr></thead>
        <tbody>
          <tr><td>M0–M1</td><td>Repo, CI, control plane skeleton — marked done in programme view</td></tr>
          <tr><td>M2–M4</td><td>Walking skeleton: ledger, identity, screening, payments on mocks</td></tr>
          <tr><td>M5–M6</td><td>Pakistan adapters — NADRA, Raast certification</td></tr>
          <tr><td>M7</td><td>Pakistan commercial pilot / go-live bar</td></tr>
          <tr><td>M8</td><td>UAE + KSA expansion</td></tr>
        </tbody>
      </table></div>

      <h2 id="squads">Squad map (blueprint)</h2>
      <p>Identity &amp; Onboarding · Screening &amp; AML · Ledger &amp; Money Movement · Payments &amp; Remittance · Platform &amp; Control plane · Market adapters (per region).</p>

      <h2 id="backlog">Traceability</h2>
      <p>311 tasks in banking monorepo traceability (17 Aug 2026): <a href="/docs/build-backlog/">Build Backlog</a>.</p>
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
        <div class="stat"><b>311</b><span>Total traced</span></div>
      </div>

      <h2 id="gaps">Known engineering gaps</h2>
      <ul>
        <li>Isolation router and KSA residency not fully enforced in pilot</li>
        <li>Most SPI adapters mock or absent — live certs block PK go-live</li>
        <li>Compliance reporting and reconciliation services not built</li>
        <li>Customer UI is a narrow on-us demo, not full product</li>
        <li>CI / Pact / isolation suites incomplete vs blueprint bar</li>
      </ul>

      <h2 id="bars">Two bars</h2>
      <p><strong>Blueprint bar:</strong> live providers, residency, reporting, recon, CI — required for regulated go-live.</p>
      <p><strong>Pilot bar:</strong> login-to-money-movement on mocks — partly true today.</p>
    `,
  },

  "end-to-end-map": {
    title: "The End-to-End Map",
    lede: "From channel click to rail and back to the Ledger — plus every workflow.",
    body: `
      <h2 id="map">Happy-path map</h2>
      <ol>
        <li>Customer acts in <code>apps/web</code> → BFF authenticates and resolves tenant</li>
        <li>Domain services enforce tenant + policy (tier, limits, entitlements)</li>
        <li>Screening gates onboarding and every payment</li>
        <li>Pricing returns firm quote with tax/FX provenance</li>
        <li>Ledger places hold — funds reserved, not spent</li>
        <li>Payout adapter instructs rail (Raast / Aani / sarie / x-border)</li>
        <li>Ledger captures hold and posts settlement journal</li>
        <li>Outbox events feed notification, reporting, reconciliation</li>
        <li>Ops reconcile ledger ↔ payments ↔ rail statements</li>
      </ol>

      <h2 id="workflows">All workflows</h2>
      <div class="wf-embed" data-view="gallery"></div>
    `,
  },

  "pricing-quotes": {
    title: "Pricing & Quotes",
    lede: "Deterministic quotes with tax and FX provenance.",
    body: `
      <h2 id="quote">What a quote contains</h2>
      <p>Firm price for a corridor and amount: fees, tax components, FX rate with provenance (ADR-0002), expiry, and idempotency key linkage. Pricing runs on the JVM island (service 10).</p>
      <p>First saga step: <a href="/docs/workflows/fund-transfer/ft-quote/">Fund Transfer · Quote</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>
      <div class="callout warn"><strong>Tax packs</strong> Fail-closed behaviour for quotes needs Finance/Compliance sign-off — see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>.</div>
    `,
  },

  "wallets-accounts": {
    title: "Wallets & Accounts",
    lede: "Product shells that compose balances from the Ledger.",
    body: `
      <h2 id="model">Product vs SoR</h2>
      <p>Wallets are <strong>product instances</strong> — labels, statements, limits, and UX. Authoritative balance always comes from Ledger projections. Opening a wallet triggers ledger account creation in onboarding.</p>
      <p><a href="/docs/workflows/onboarding/wallet-ledger/">Onboarding · Wallet + TigerBeetle →</a></p>
      <div class="wf-embed" data-workflow="onboarding" data-view="pipeline"></div>
    `,
  },

  "money-and-holds": {
    title: "Money & Holds",
    lede: "Reservation versus settlement.",
    body: `
      <h2 id="hold">Hold lifecycle</h2>
      <p><strong>PLACED</strong> — funds reserved when screening clears and before payout.<br>
      <strong>CAPTURED</strong> — hold converted to final postings on settle.<br>
      <strong>RELEASED</strong> — hold released on compensation (rail reject, cancel).</p>
      <p>Stages: <a href="/docs/workflows/fund-transfer/ft-hold/">Hold</a> · <a href="/docs/workflows/fund-transfer/ft-settle/">Settle</a></p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>

      <h2 id="card">Card authorisation (deferred product)</h2>
      <p>When cards activate: authorisation hold pattern mirrors payment holds. <a href="/docs/workflows/debit-cards/dc-auth/">Debit Cards · Authorize</a></p>
    `,
  },

  "reconciliation": {
    title: "Reconciliation",
    lede: "Three-way match: ledger ↔ payments ↔ rail statements.",
    body: `
      <h2 id="goal">Goal</h2>
      <p>Breaks surface as <strong>cases</strong>, not silent drift. Ops works exceptions; engineering fixes root cause.</p>
      <h2 id="sources">Three sources of truth</h2>
      <ol>
        <li><strong>Ledger</strong> — journals and holds (SoR for value)</li>
        <li><strong>Payments</strong> — saga state and payout references</li>
        <li><strong>Rail statements</strong> — Raast/Aani/sarie/partner files</li>
      </ol>
      <p>Service 09 specified in blueprint; not complete in pilot backlog snapshot.</p>
    `,
  },

  "regulatory-governance": {
    title: "Regulatory Governance",
    lede: "How policy decisions become machine behaviour.",
    body: `
      <h2 id="policy">Policy → controls</h2>
      <ul>
        <li>AML thresholds and list scope → screening service config per tenant pack</li>
        <li>Maker-checker rules → case disposition workflows</li>
        <li>Residency → gateway routing + datastore region binding</li>
        <li>Fail-closed defaults → code paths, not runbook hope</li>
      </ul>
      <p>Compliance owns fail-closed rules. Changes require compliance sign-off and regression in isolation/contract tests.</p>
    `,
  },

  "compliance-reporting": {
    title: "Compliance Reporting",
    lede: "Service 08 — goAML-aligned STR/SAR and market returns.",
    body: `
      <h2 id="scope">Scope</h2>
      <p>Suspicious transaction reports, regulatory returns, and audit exports — sourced from immutable ledger and case data, not channel caches.</p>
      <h2 id="status">Status</h2>
      <p>Specified in blueprint pack; <span class="pill settled">not built</span> in pilot backlog snapshot. Depends on screening case SoR and ledger posting completeness.</p>
    `,
  },

  "api-integration": {
    title: "The API & Integration Surface",
    lede: "BFF/gateway, webhooks, and partner contracts.",
    body: `
      <h2 id="bff">BFF &amp; gateway</h2>
      <p>Customer and partner traffic terminates at BFF/gateway. Tenant resolution, auth, rate limits, and OpenAPI contracts enforced here — domain services never exposed raw.</p>
      <p><a href="/docs/workflows/onboarding/register-login/">Onboarding · Register / Login</a> shows the first customer-facing API path.</p>

      <h2 id="webhooks">Webhooks</h2>
      <p>Inbound provider webhooks (eKYC result, rail status, card auth) verified and idempotent. Example: <a href="/docs/workflows/debit-cards/dc-auth/">Card authorise webhook</a>.</p>

      <h2 id="contracts">Contracts</h2>
      <p>OpenAPI 3.1 published per service. Pact verification blocks CI on TS↔JVM seams (Payments→Ledger, Payments→Pricing).</p>
    `,
  },

  "billing-metering": {
    title: "Billing & Metering",
    lede: "Usage and fees without inventing balances outside the Ledger.",
    body: `
      <h2 id="rule">Rule</h2>
      <p>Platform fees and usage charges <strong>post through the same money rules</strong> as customer value. Billing service (10) calculates; Ledger records.</p>
      <p>Metering events are outbox-published; no shadow balance tables.</p>
    `,
  },

  "experience-architecture": {
    title: "Experience Architecture",
    lede: "Customer web and staff console as windows onto the machine.",
    body: `
      <h2 id="apps">Channels</h2>
      <ul>
        <li><code>apps/web</code> — retail customer: onboarding, send, bills, statements</li>
        <li><code>apps/console</code> — operators: AML cases, tenant config, assisted overrides with audit</li>
      </ul>
      <h2 id="rule">Rule</h2>
      <p>Channels compose views from domain APIs. They never hold authoritative balances or screening decisions — only display and command intent.</p>
      <p>Agent-assisted flows: <a href="/docs/workflows/agent-assisted/ag-login/">Agent Journeys</a>.</p>
    `,
  },

  "infrastructure-cost": {
    title: "Infrastructure & Cost",
    lede: "Size from volume and residency — not from the number of boxes on a diagram.",
    body: `
      <h2 id="drivers">Cost drivers</h2>
      <ul>
        <li>Year-three volume and corridor mix (still open — see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>)</li>
        <li>Three regional data planes + in-Kingdom KSA cell</li>
        <li>Provider fees (NADRA, screening, rails) dominate unit economics at low volume</li>
      </ul>
      <h2 id="nfr">NFR anchors</h2>
      <p>p99 read &lt; 800 ms · command &lt; 1.5 s (excl. providers) · outbox lag p99 &lt; 2 s · Enterprise RPO ≤ 5 min / RTO ≤ 30 min per cell.</p>
    `,
  },

  "decisions": {
    title: "Decisions",
    lede: "ADRs and stack decisions that gave the banking system its shape.",
    body: `
      <h2 id="adrs">Key decisions</h2>
      <ul>
        <li><strong>Ledger as sole balance SoR</strong> — wallets and channels compose views only</li>
        <li><strong>Fail-closed screening</strong> — timeout/circuit ⇒ HOLD, never pass</li>
        <li><strong>NestJS default / JVM islands</strong> — Java only for Ledger, Pricing, FX lib</li>
        <li><strong>ADR-0002 FX provenance</strong> — rate is input to posting; provenance recorded for audit</li>
        <li><strong>Transactional outbox</strong> — no dual-write to Kafka</li>
        <li><strong>Hexagonal + Pact</strong> — boundaries enforced in CI</li>
      </ul>
    `,
  },

  "measured-against": {
    title: "Measured Against Peers",
    lede: "Against the blueprint go-live bar and the pilot reality.",
    body: `
      <h2 id="bars">Two bars</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Bar</th><th>What it means</th><th>Today</th></tr></thead>
        <tbody>
          <tr><td><strong>Blueprint go-live</strong></td><td>Live providers, residency, reporting, recon, CI, isolation tests</td><td><span class="pill settled">Not met</span></td></tr>
          <tr><td><strong>Pilot demo</strong></td><td>Login → onboard (mock) → move money on mocks</td><td><span class="pill part">Partly true</span></td></tr>
        </tbody>
      </table></div>
      <p>Both truths coexist. Programme status is design-and-build; Pakistan go-live waits on commercial certs and unfinished services.</p>
    `,
  },

  "design-system": {
    title: "Design System",
    lede: "Tokens and UI consistency — presentation, not money truth.",
    body: `
      <h2 id="scope">Scope</h2>
      <p>Design tokens, components, and accessibility patterns for <code>apps/web</code> and <code>apps/console</code>. This site uses the same light, colourful docs theme as a reference — not the production app skin.</p>
      <h2 id="rule">Rule</h2>
      <p>Design tokens serve channels. They never become a second ledger or hold business state.</p>
    `,
  },

  "banking-compendium": {
    title: "The Banking Compendium",
    lede: "Index of this docs site and pointers to the blueprint pack.",
    body: `
      <h2 id="this-site">This site</h2>
      <p>Executive: <a href="/docs/where-we-stand/">Where We Stand</a> → <a href="/docs/money-model-correction/">Money Model</a> → <a href="/docs/what-we-do-not-know/">Open Questions</a>.</p>
      <p>Product: <a href="/docs/one-payment-followed/">One Payment, Followed</a> → Journeys (sidebar stages).</p>
      <p>Engineering: <a href="/docs/system-architecture/">System Architecture</a> → <a href="/docs/technology-choices/">Technology Choices</a> → <a href="/docs/build-backlog/">Build Backlog</a>.</p>

      <h2 id="external">Engineering library</h2>
      <p>Full blueprint pack (docx companions, feature specs): <a href="https://document.digitalbank.zekiexperts.com/index.html" target="_blank" rel="noopener">document.digitalbank.zekiexperts.com</a> — banking services and adapters only.</p>
    `,
  },
};

Object.assign(module.exports, domainPages);
