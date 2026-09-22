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
    lede: "Services 02 and 03 — complete digital KYC onboarding spine, remote verification ladder, named journeys J1–J19, limits engine, and sanctions screening.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — identity &amp; compliance architecture</strong>
        <ul>
          <li><strong>Identity SoR &amp; Screening Gate.</strong> Service <strong>02 Identity</strong> owns customer onboarding, digital ID verification, and risk tiering. Service <strong>03 Screening</strong> gates onboarding and every payment.</li>
          <li><strong>Regulatory Foundations.</strong> SBP Customer Onboarding Framework (CCOF 2025), EMI Regulations 2023 (§12, §14, §15, §17), BPRD Circular 04 of 2023 (device binding &amp; cooling-off), and AML/CFT regulations.</li>
          <li><strong>Late Account Assignment.</strong> A tracking ID is an unverified session. An e-money wallet number is issued only after complete verification, pre-screening, complete CDD, and 2-hour cooling-off.</li>
          <li><strong>Not a Bank Deposit.</strong> Funds sit in a trustee bank; an e-money wallet number is a claim on safeguarded e-money.</li>
        </ul>
      </div>

      <h2 id="spine">Master Onboarding Spine (Steps 1–10)</h2>
      <p>Every digital applicant enters through a single master capture spine. The frontend never talks to NADRA or screening lists directly — all provider calls execute through backend market adapters.</p>

      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Step</th><th>Phase</th><th>What happens in the system</th><th>Regulatory &amp; System Invariant</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>01</strong></td>
              <td>App Launch</td>
              <td>Customer opens the app; shown English/Urdu terms.</td>
              <td>Must not reveal whether a wallet already exists (BPRD 04 A.ix).</td>
            </tr>
            <tr>
              <td><strong>02</strong></td>
              <td>Mobile &amp; Device</td>
              <td>Mobile number captured; OTP sent from short code; device bound.</td>
              <td>Device fingerprinting (UUID/IMEI/IMSI); auto-fetch short code OTP.</td>
            </tr>
            <tr>
              <td><strong>03</strong></td>
              <td>Consent</td>
              <td>Customer accepts terms, fee schedules, privacy policy, and KYC notice.</td>
              <td>EMI 12.VI consent recorded; told application can be saved 30 days (J7).</td>
            </tr>
            <tr class="trap">
              <td><strong>04</strong></td>
              <td>Tracking ID</td>
              <td><code>APPLICATION_STARTED</code> record created with tracking ID.</td>
              <td><strong>Tracking ID is NOT a wallet number.</strong> Session resumable for 30 days.</td>
            </tr>
            <tr>
              <td><strong>05</strong></td>
              <td>Data Capture</td>
              <td>Union of CCOF Table-A and EMI 12.I captured (including 2 non-face CNIC fields).</td>
              <td>Live original CNIC image + live photo captured. Zero data stored on device.</td>
            </tr>
            <tr>
              <td><strong>06</strong></td>
              <td>Geo &amp; IP</td>
              <td>Gadget geolocation, IP address, and network headers recorded.</td>
              <td>CCOF F.3 requirement for digital onboarding evidence.</td>
            </tr>
            <tr class="trap">
              <td><strong>07</strong></td>
              <td>Duplicate Check</td>
              <td>Server checks whether an active wallet exists for this CNIC/ID.</td>
              <td>EMI 12.VII: Max 1 active e-money wallet per CNIC per EMI. Unauthenticated check returns generic message (J12).</td>
            </tr>
            <tr>
              <td><strong>08</strong></td>
              <td>Pre-screening</td>
              <td>Applicant &amp; associated persons screened against UNSC &amp; ATA 1997 lists.</td>
              <td>Screening moment 1. Hit = J5 (hard stop). Provider timeout = J11 (fail closed).</td>
            </tr>
            <tr>
              <td><strong>09</strong></td>
              <td>Risk Rating</td>
              <td>Customer Risk Profile (CRP) built: LOW, MEDIUM, or HIGH risk.</td>
              <td>HIGH risk triggers Enhanced Due Diligence (J6) and blocks activation.</td>
            </tr>
            <tr>
              <td><strong>10</strong></td>
              <td>Verification</td>
              <td>Primary NADRA Biometric Verification (BV) attempted.</td>
              <td>Success = J1; listed impossibility = J2 ladder; timeout = J11.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="ladder">Remote Verification Ladder (Rungs A–D)</h2>
      <p>CCOF §F.1 defines a strict remote verification hierarchy. Each rung is used <strong>only when the rung above it cannot be completed for an SBP-listed genuine reason</strong> — never as a convenience skip.</p>

      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Rung</th><th>Method</th><th>Requirements &amp; Controls</th><th>Limit Band &amp; Outcome</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Rung A</strong></td>
              <td>Primary — NADRA Biometric</td>
              <td>In-app finger/thumb, iris, or facial match through NADRA. Live photo captured. Re-used on J13 upgrade, J14 SIM change, and J19 cash-in.</td>
              <td>Biometric band (Commercial monthly load PKR 400,000; pilot PKR 200,000). Full wallet features.</td>
            </tr>
            <tr>
              <td><strong>Rung B</strong></td>
              <td>Verisys Bundle</td>
              <td>Used only for SBP-listed reasons (age &gt; 60, permanent disability, unclear prints, NRP/POC abroad). Requires NADRA Verisys + CNIC–MSISDN pairing + OTP/call-back + live photo.</td>
              <td>Verisys band (Monthly load PKR 50,000; cash withdrawal PKR 10,000/day). Cash-in still requires BV (J19).</td>
            </tr>
            <tr class="trap">
              <td><strong>Rung C</strong></td>
              <td>Verisys with Debit Block</td>
              <td>Verisys succeeded but CNIC–MSISDN pairing or OTP/call-back failed. Instrument opened in restricted state.</td>
              <td><code>DEBIT_BLOCKED</code> state. Zero spending, P2P, merchant pay, or cash-out until BV or full Rung B completed (J3).</td>
            </tr>
            <tr>
              <td><strong>Rung D</strong></td>
              <td>Remote Methods Fail</td>
              <td>All remote rungs A–C exhausted. Recorded video KYC interview + Verisys with reasons, or third-party bank reliance — or decline (J8).</td>
              <td>Video KYC decision or partner bank verification. <strong>Agents must not issue instruments (EMI 17.VII).</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="journeys-summary">Named KYC Journeys Registry (J1–J19)</h2>
      <p>J1 is the shared onboarding spine. All other journeys are named operational branches of the single EMI wallet lifecycle. Each journey carries its own regulatory rules, customer steps, operational controls, and system invariants.</p>

      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>ID</th><th>Journey Title</th><th>Group</th><th>Trigger / Prerequisite</th><th>Outcome &amp; Verification State</th></tr></thead>
          <tbody>
            <tr><td><strong>J1</strong></td><td>Clean Biometric Onboarding</td><td>Onboarding Spine</td><td>Spine 1–10 pass; NADRA BV succeeds</td><td><code>WALLET_ACTIVE</code> at biometric limit band (PKR 400,000).</td></tr>
            <tr><td><strong>J2</strong></td><td>Biometric Not Possible (Verisys)</td><td>Onboarding Spine</td><td>BV impossible for SBP-listed reason</td><td><code>WALLET_ACTIVE</code> at Verisys band (PKR 50,000). Reason logged.</td></tr>
            <tr class="trap"><td><strong>J3</strong></td><td>Verisys with Debit Block</td><td>Onboarding Spine</td><td>Verisys passed, pairing/OTP failed</td><td><code>DEBIT_BLOCKED</code> instrument. No spending until verified.</td></tr>
            <tr><td><strong>J4</strong></td><td>Remote Methods Fail</td><td>Onboarding Spine</td><td>Rungs A–C exhausted</td><td><code>VIDEO_KYC_REQUIRED</code> interview or partner bank / J8 decline.</td></tr>
            <tr class="trap"><td><strong>J5</strong></td><td>Sanctions / Proscribed Hit</td><td>Gates &amp; Exceptions</td><td>UNSC / ATA 1997 match in pre-screen</td><td>Hard stop; no wallet; zero tipping-off; STR considered.</td></tr>
            <tr><td><strong>J6</strong></td><td>High-Risk Customer (EDD)</td><td>Gates &amp; Exceptions</td><td>CRP rates applicant HIGH risk</td><td><code>RISK_HIGH_EDD</code>; extra evidence &amp; senior approval before open.</td></tr>
            <tr><td><strong>J7</strong></td><td>Save &amp; Resume (30 Days)</td><td>Gates &amp; Exceptions</td><td>User pauses onboarding session</td><td>Resumes with same tracking ID up to 30 days; re-checks lists.</td></tr>
            <tr><td><strong>J8</strong></td><td>Decline with Written Reason</td><td>Gates &amp; Exceptions</td><td>Terminal negative outcome</td><td>Written notice sent; tracking ID kept; compliance reason logged.</td></tr>
            <tr><td><strong>J9</strong></td><td>New Device After Onboarding</td><td>After Wallet Exists</td><td>Active customer logs in on new phone</td><td>NADRA BV on new phone + notification + 2-hour cooling-off.</td></tr>
            <tr class="trap"><td><strong>J10</strong></td><td>Continuous Screening &amp; Monitoring</td><td>After Wallet Exists</td><td>List update, periodic review, TMS rule fire</td><td><code>MONITORING_HOLD</code>; restrict &amp; investigate; STR if confirmed.</td></tr>
            <tr><td><strong>J11</strong></td><td>Provider Timeout (Fail Closed)</td><td>Gates &amp; Exceptions</td><td>NADRA, screening or OTP timeout</td><td><code>VERIFICATION_PENDING</code>; queue for retry; never auto-approve.</td></tr>
            <tr><td><strong>J12</strong></td><td>Duplicate CNIC</td><td>Gates &amp; Exceptions</td><td>CNIC already holds an active wallet</td><td>Prevents 2nd wallet; authenticated user routed to login/J9.</td></tr>
            <tr><td><strong>J13</strong></td><td>Limit / Category Upgrade</td><td>After Wallet Exists</td><td>Customer requests higher limit band</td><td>Re-verify category; Annexure-J doc for 1m band; 2-hr cooling.</td></tr>
            <tr><td><strong>J14</strong></td><td>Mobile, Email or Password Change</td><td>After Wallet Exists</td><td>Contact/credential change request</td><td>NADRA BV + pairing check + notification to old channels + 2-hr timer.</td></tr>
            <tr><td><strong>J15</strong></td><td>Parent-Linked Minor Wallet</td><td>Other EMI Customers</td><td>Guardian opens wallet for child in-app</td><td><code>MINOR_WALLET_ACTIVE</code>; linked to parent; basic 50k / freelancer 400k.</td></tr>
            <tr><td><strong>J16</strong></td><td>Close, Redeem, Release CNIC</td><td>After Wallet Exists</td><td>Customer close request or TFS/exit</td><td><code>WALLET_CLOSED</code>; e-money redeemed at par; records kept 10 yrs.</td></tr>
            <tr><td><strong>J17</strong></td><td>Periodic CDD / Expired CNIC</td><td>After Wallet Exists</td><td>CNIC expiry, address change, review due</td><td>Identity refresh case; 3-month token rule; re-screen on new data.</td></tr>
            <tr><td><strong>J18</strong></td><td>Non-Resident / Foreign IDs</td><td>Other EMI Customers</td><td>ID is NICOP, POC, ARC, POR or NRP</td><td>Same spine with foreign ID rules; Verisys for NRP abroad.</td></tr>
            <tr><td><strong>J19</strong></td><td>Cash-In / Cash-Out at Till/ATM</td><td>After Wallet Exists</td><td>Cash deposit/withdrawal at agent/ATM</td><td>NADRA BV at till for cash-in; 2FA at ATM; BV/2FA at agent.</td></tr>
          </tbody>
        </table>
      </div>

      <h3 id="j1-j19-deep-dive">Detailed Specifications for Named Journeys (J1–J19)</h3>
      <div style="display: grid; gap: 20px; margin-top: 15px;">
        <!-- J1 -->
        <div style="background: #1e293b; border-left: 4px solid #059669; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #34d399;">J1 · Clean Biometric Onboarding (Primary Spine)</h4>
          <p><strong>Trigger / From:</strong> Spine Steps 1–9 pass; NADRA Biometric succeeds.</p>
          <p><strong>Customer Flow:</strong> Opens app (bilingual UI); binds device via short-code OTP; accepts terms &amp; 30-day save notice; captures CCOF Table-A ∪ EMI 12.I fields + live CNIC + live selfie; completes NADRA biometric; waits mandatory 2-hour cooling-off window; wallet activates at PKR 400,000 monthly load ceiling.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Verifies BV came from NADRA; stores pre-screen list version; <code>APPLICATION_STARTED</code> tracking ID stored before NADRA call; <code>WALLET_ACTIVE</code> issued only after 4 gates pass.</p>
        </div>

        <!-- J2 -->
        <div style="background: #1e293b; border-left: 4px solid #1b6b93; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #38bdf8;">J2 · Biometric Not Possible (Verisys Fallback)</h4>
          <p><strong>Trigger / From:</strong> Spine Step 10 when BV cannot be performed for SBP-listed genuine reasons (age &gt; 60, disability, unclear prints, NRP abroad).</p>
          <p><strong>Customer Flow:</strong> BV capture fails or declared reason applies; runs NADRA Verisys + CNIC-MSISDN SIM pairing + OTP/call-back + live photo; 2-hour cooling-off; wallet activates at PKR 50,000 monthly load ceiling.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Reason code logged in writing; call-back uses negative step-wise confirmation; <code>VERISYS_PASSED</code> requires Verisys + pairing + OTP all true.</p>
        </div>

        <!-- J3 -->
        <div style="background: #1e293b; border-left: 4px solid #d97706; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #fbbf24;">J3 · Verisys with Debit Block</h4>
          <p><strong>Trigger / From:</strong> Verisys succeeded but CNIC-MSISDN pairing or OTP/call-back failed.</p>
          <p><strong>Customer Flow:</strong> Instrument opened in restricted <code>DEBIT_BLOCKED</code> state. Customer sees pending verification requirements; all debit attempts rejected with <code>DEBIT_BLOCK_KYC</code>.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Payments engine MUST fail closed; if verification never completes, close account and evaluate STR (EMI 12.IV).</p>
        </div>

        <!-- J4 -->
        <div style="background: #1e293b; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #a78bfa;">J4 · Remote Methods Fail (Video KYC / Partner)</h4>
          <p><strong>Trigger / From:</strong> Remote rungs A–C exhausted.</p>
          <p><strong>Customer Flow:</strong> Scheduled recorded video interview or partner bank branch direction. Video KYC checks original ID, live presence, and policy questions.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Video recording saved as encrypted evidence object; retention 10 years per CCOF G.2; officers prevented from viewing sanctions details to avoid tipping-off.</p>
        </div>

        <!-- J5 -->
        <div style="background: #1e293b; border-left: 4px solid #b91c1c; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #f87171;">J5 · Sanctions / Proscribed Person Hit</h4>
          <p><strong>Trigger / From:</strong> Pre-screening match against UNSC or ATA 1997 lists.</p>
          <p><strong>Customer Flow:</strong> Immediate hard stop. Receives legally safe generic decline message. Zero customer tipping-off.</p>
          <p><strong>Ops &amp; System Invariants:</strong> High-severity maker-checker; TFS freeze applied; internal STR evaluated; <code>PRE_SCREEN_HIT</code> immutable in Postgres.</p>
        </div>

        <!-- J6 -->
        <div style="background: #1e293b; border-left: 4px solid #b0892e; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #fde047;">J6 · High-Risk Customer (Enhanced Due Diligence - EDD)</h4>
          <p><strong>Trigger / From:</strong> Customer Risk Profile (CRP) scores applicant HIGH risk.</p>
          <p><strong>Customer Flow:</strong> Asked for additional income/wealth evidence and video interview. On approval, wallet activates with enhanced monitoring.</p>
          <p><strong>Ops &amp; System Invariants:</strong> <code>RISK_HIGH_EDD</code> blocks wallet activation until senior management sign-off; ongoing monitoring handed to TMS (J10).</p>
        </div>

        <!-- J7 -->
        <div style="background: #1e293b; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #38bdf8;">J7 · Save and Resume Within 30 Days</h4>
          <p><strong>Trigger / From:</strong> Customer pauses onboarding session.</p>
          <p><strong>Customer Flow:</strong> Returns within 30 days, authenticates via 2FA, and resumes onboarding seamlessly from saved state.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Device holds session pointer only (no PII); re-checks device bind and screening list version on resume; expires after 30 days.</p>
        </div>

        <!-- J8 -->
        <div style="background: #1e293b; border-left: 4px solid #64748b; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #94a3b8;">J8 · Decline with Written Reason</h4>
          <p><strong>Trigger / From:</strong> Terminal negative outcome across any journey.</p>
          <p><strong>Customer Flow:</strong> Receives written notice (in-app + SMS/email) with compliant reason code in English &amp; Urdu. Tracking ID retained.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Internal reason code stored separately from customer text; discrepancy notice sent inside TAT before decline.</p>
        </div>

        <!-- J9 -->
        <div style="background: #1e293b; border-left: 4px solid #0891b2; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #22d3ee;">J9 · New Device After Onboarding</h4>
          <p><strong>Trigger / From:</strong> Active customer logs in from unbound device.</p>
          <p><strong>Customer Flow:</strong> Completes NADRA BV in-app; receives immediate alerts on old mobile/email; waits 2-hour cooling-off before device is activated.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Max device limit enforced; multiple CNICs per device triggers fraud investigation; password reset blocked on unbound device.</p>
        </div>

        <!-- J10 -->
        <div style="background: #1e293b; border-left: 4px solid #be185d; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #f472b6;">J10 · Continuous Screening &amp; Transaction Monitoring</h4>
          <p><strong>Trigger / From:</strong> List update, periodic re-screen, or TMS rule fire.</p>
          <p><strong>Customer Flow:</strong> Transactions or app access placed on <code>MONITORING_HOLD</code>. Zero customer tipping-off.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Fail closed on vendor error (HOLD, never CLEAR); STR filed regardless of amount if suspicion exists; 10-year audit records.</p>
        </div>

        <!-- J11 -->
        <div style="background: #1e293b; border-left: 4px solid #ea580c; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #fb923c;">J11 · Provider Timeout (Fail Closed)</h4>
          <p><strong>Trigger / From:</strong> Provider timeout or technical error.</p>
          <p><strong>Customer Flow:</strong> Sees "Verification delayed / try again" with tracking ID. Queued for retry.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Maps to <code>VERIFICATION_PENDING</code>, never <code>APPROVED</code>; PII not cached on client or error logs.</p>
        </div>

        <!-- J12 -->
        <div style="background: #1e293b; border-left: 4px solid #4338ca; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #818cf8;">J12 · Duplicate CNIC (Max 1 Wallet Per EMI)</h4>
          <p><strong>Trigger / From:</strong> Spine Step 7 CNIC uniqueness check.</p>
          <p><strong>Customer Flow:</strong> Returning customer authenticated and routed to existing wallet. Unauthenticated request gets generic response.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Datastore enforces 1 active wallet per CNIC per EMI (EMI 12.VII); duplicate CNIC + new mobile investigated for takeover.</p>
        </div>

        <!-- J13 -->
        <div style="background: #1e293b; border-left: 4px solid #0f766e; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #2dd4bf;">J13 · Limit / Category Upgrade</h4>
          <p><strong>Trigger / From:</strong> Customer upgrade request or successful later BV.</p>
          <p><strong>Customer Flow:</strong> Re-verifies for target band (Annexure-J income doc + SIM pairing for 1m band); waits 2-hour cooling-off on new limit.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Re-run verification &amp; screening (Screening Moment 2); verify Annexure-J doc in-house; EMI 14.VI exclusions tracked separately.</p>
        </div>

        <!-- J14 -->
        <div style="background: #1e293b; border-left: 4px solid #0369a1; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #38bdf8;">J14 · Mobile, Email or Password Change</h4>
          <p><strong>Trigger / From:</strong> Credential change request from registered device.</p>
          <p><strong>Customer Flow:</strong> Completes NADRA BV; receives immediate alerts on old channels; 2-hour cooling-off before change takes effect.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Password reset on unbound device rejected; SIM change re-checks CNIC-MSISDN pairing; old channels remain active during window.</p>
        </div>

        <!-- J15 -->
        <div style="background: #1e293b; border-left: 4px solid #a21caf; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #f0abfc;">J15 · Parent-Linked Minor Wallet</h4>
          <p><strong>Trigger / From:</strong> Guardian initiates creation inside guardian's app.</p>
          <p><strong>Customer Flow:</strong> Guardian uploads child ID (B-Form / juvenile CNIC), signs undertaking, chooses minor band (Verisys 50k or BV freelancer 400k).</p>
          <p><strong>Ops &amp; System Invariants:</strong> Both parent and child screened (hit on either = J5 stop); basic minor funded ONLY from parent wallet; adult 1m limits prohibited.</p>
        </div>

        <!-- J16 -->
        <div style="background: #1e293b; border-left: 4px solid #57534e; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #d6d3d1;">J16 · Close, Redeem, Release CNIC</h4>
          <p><strong>Trigger / From:</strong> Customer close request, unverified expiry, or TFS exit.</p>
          <p><strong>Customer Flow:</strong> Completes BV for cash redemption or 2FA IBFT to own bank account; receives balance at par.</p>
          <p><strong>Ops &amp; System Invariants:</strong> 3 distinct closure reasons/files; redemption at par (EMI §15); 10-year record retention enforced (EMI 24.II).</p>
        </div>

        <!-- J17 -->
        <div style="background: #1e293b; border-left: 4px solid #c2410c; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #ff8800;">J17 · Periodic CDD / Expired CNIC</h4>
          <p><strong>Trigger / From:</strong> CNIC expiry, address change, or periodic review clock.</p>
          <p><strong>Customer Flow:</strong> Notified in-app + SMS/email; uploads renewed CNIC live image &amp; selfie; confirms legal particulars.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Discrepancy notice sent before restriction; re-screening executed (Screening Moment 3); 3-month token clock enforced.</p>
        </div>

        <!-- J18 -->
        <div style="background: #1e293b; border-left: 4px solid #1d4ed8; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #60a5fa;">J18 · Non-Resident / Foreign IDs (NICOP, POC, ARC, POR, NRP)</h4>
          <p><strong>Trigger / From:</strong> National data capture when ID is non-resident CNIC.</p>
          <p><strong>Customer Flow:</strong> Selects ID type (NICOP/POC/POR/ARC); provides foreign address/residency proof; Verisys path used abroad.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Passport-only goes J4/face-to-face; FATCA/CRS tax fields captured; confirm not an RDA bank product.</p>
        </div>

        <!-- J19 -->
        <div style="background: #1e293b; border-left: 4px solid #9a3412; padding: 16px; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #fb923c;">J19 · Cash-In / Cash-Out at Till or ATM</h4>
          <p><strong>Trigger / From:</strong> Cash deposit or withdrawal initiated at agent/ATM.</p>
          <p><strong>Customer Flow:</strong> Agent till cash-in: completes NADRA finger BV at till. ATM cash-out: enters OTP/2FA.</p>
          <p><strong>Ops &amp; System Invariants:</strong> Agent cannot bypass till BV for cash-in; real-time TigerBeetle posting with biometric/2FA proof metadata.</p>
        </div>
      </div>

      <h2 id="gates-cooling">Activation Gate &amp; 2-Hour Cooling-Off Rule</h2>
      <div class="trap-box">
        <p><strong>Activation Invariant:</strong> A wallet number is generated and assigned ONLY when all four conditions are met simultaneously:</p>
        <ol>
          <li><code>VERIFICATION_STRENGTH</code> satisfies target band (Biometric or Verisys).</li>
          <li><code>PRE_SCREEN_CLEAR</code> confirmed with list version recorded.</li>
          <li>Complete <code>CDD</code> captured (identity, address, occupation, two non-card fields).</li>
          <li><code>EDD</code> approved by senior management if CRP is HIGH.</li>
        </ol>
        <p><strong>Two-Hour Cooling-Off (BPRD 04 A.viii via CCOF K):</strong> After the activation gate clears, a mandatory 2-hour timer must run before the mobile app can execute financial transactions. This cooling-off timer also applies to new device registration (J9), mobile/email change (J14), password reset, and limit upgrades (J13).</p>
      </div>

      <h2 id="limits-engine">Wallet Limits Matrix &amp; EMI 14.VI Exclusions</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Verification Strength</th><th>Monthly Load Cap</th><th>Cash-Out / Withdrawal Cap</th><th>Special Conditions &amp; Rules</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Verisys Band (J2)</strong></td>
              <td>PKR 50,000</td>
              <td>PKR 10,000 per day</td>
              <td>Requires Verisys + SIM pairing + OTP. Cash-in requires BV (J19).</td>
            </tr>
            <tr>
              <td><strong>Biometric Band (J1)</strong></td>
              <td>PKR 400,000 (Commercial)<br><small>PKR 200,000 (Pilot stage)</small></td>
              <td>By risk profile (EMI 14.II.c)</td>
              <td>Primary adult band. Requires NADRA biometric verification.</td>
            </tr>
            <tr>
              <td><strong>Enhanced Band (J13)</strong></td>
              <td>Up to PKR 1,000,000</td>
              <td>By risk profile</td>
              <td>Requires SBP PSP&amp;OD permission, 1 Annexure-J document, SIM pairing, and in-house TMS.</td>
            </tr>
            <tr>
              <td><strong>Basic Minor (J15)</strong></td>
              <td>PKR 50,000</td>
              <td>PKR 10,000 per day</td>
              <td>Opened in parent's app. Funded ONLY from parent wallet. No street cash-in.</td>
            </tr>
            <tr>
              <td><strong>Freelancer Minor (J15)</strong></td>
              <td>PKR 400,000</td>
              <td>By risk profile</td>
              <td>Requires NADRA BV + verified income source. Adult 1m band does not apply.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="exclusions14vi">EMI 14.VI — Load Cap Exclusions</h3>
      <p>Under SBP EMI Regulations §14.VI, fully licensed EMIs with PSP&amp;OD permission may exclude specific transaction types from the monthly load cap for <strong>biometrically verified adult wallets</strong> (never minors):</p>
      <ul>
        <li><strong>Salary Credits:</strong> Employer credits disbursed via the employer's bank account (EMI verifies employer).</li>
        <li><strong>Inward Remittances:</strong> Inward home remittances via authorised dealers / PRI up to <strong>PKR 1,500,000</strong> per transaction outside the load cap.</li>
        <li><strong>Utility Payments:</strong> Direct payments for utility bills do not consume load capacity.</li>
        <li><strong>Separate Counters:</strong> Payments and receipts are counted separately (EMI 14.II.a) — monthly load is not a combined payments+receipts bucket.</li>
      </ul>

      <h2 id="annexure-j">Annexure-J — Source of Income Evidence Catalogue</h2>
      <p>For upgrading to the PKR 1,000,000 Enhanced Band (J13), any <strong>one</strong> document from the matching column in EMI Regulations Annexure-J must be verified in-house (must not be outsourced):</p>

      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Salaried Individuals</th><th>Non-Salaried / Self-Employed</th><th>Alternate Income Sources</th></tr></thead>
          <tbody>
            <tr>
              <td>
                • Latest salary slip<br>
                • Salary certificate from employer<br>
                • Official payment slip / payroll record<br>
                • Bank account statement showing salary<br>
                • Tax statement / return / certificate<br>
                • Pension book / terminal benefits record
              </td>
              <td>
                • Receipt of payment against services/work<br>
                • Bank account statement<br>
                • Particulars of fund providers (family/stipend)<br>
                • Tax statement / return / certificate<br>
                • Written declaration with proof of work
              </td>
              <td>
                • Inheritance documentation<br>
                • Agricultural income proof<br>
                • Securities, bonds, or shares dividend proof<br>
                • Property sale / investment agreement<br>
                • Rent agreement &amp; bank receipt<br>
                • Profit / interest income certificate
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="kyc-flow-diagram">Interactive KYC Master Flow Diagram</h2>
      <p>Below is the complete flow topology of the master capture spine, decision gates, remote verification ladder, and lifecycle branch paths (J1–J19).</p>

      <div class="stage-diagram-panel">
        <div class="stage-diagram-head">
          <h3>Master KYC Spine &amp; Journeys Topology</h3>
          <p>Navy cards = shared capture spine. Blue cards = verification ladder. Green = activation. Gold = risk/hold. Red = decline/sanctions.</p>
        </div>
        <div class="table-wrap">
          <svg viewBox="0 0 1000 680" style="width: 100%; height: auto; background: #0f172a; border-radius: 8px; font-family: system-ui, sans-serif; padding: 10px;">
            <!-- Swimlane Bands -->
            <rect x="20" y="20" width="960" height="90" fill="#1e293b" rx="6" />
            <text x="35" y="45" fill="#94a3b8" font-size="12" font-weight="bold">STAGE 1 · CAPTURE SPINE</text>
            
            <rect x="20" y="125" width="960" height="110" fill="#1e293b" rx="6" />
            <text x="35" y="150" fill="#94a3b8" font-size="12" font-weight="bold">STAGE 2 · ELIGIBILITY GATES &amp; SCREENING</text>
            
            <rect x="20" y="250" width="960" height="150" fill="#1e293b" rx="6" />
            <text x="35" y="275" fill="#94a3b8" font-size="12" font-weight="bold">STAGE 3 · REMOTE VERIFICATION LADDER (Rungs A-D)</text>
            
            <rect x="20" y="415" width="960" height="110" fill="#1e293b" rx="6" />
            <text x="35" y="440" fill="#94a3b8" font-size="12" font-weight="bold">STAGE 4 · ACTIVATION GATE &amp; COOLING-OFF</text>
            
            <rect x="20" y="540" width="960" height="120" fill="#1e293b" rx="6" />
            <text x="35" y="565" fill="#94a3b8" font-size="12" font-weight="bold">STAGE 5 · LIFECYCLE JOURNEYS (J9 - J19)</text>

            <!-- Spine Nodes -->
            <rect x="40" y="55" width="130" height="40" rx="5" fill="#3b82f6" />
            <text x="105" y="80" fill="#ffffff" font-size="11" text-anchor="middle">Step 1-4: Mobile &amp; Track</text>

            <rect x="200" y="55" width="140" height="40" rx="5" fill="#3b82f6" />
            <text x="270" y="80" fill="#ffffff" font-size="11" text-anchor="middle">Step 5-6: Data &amp; Live ID</text>

            <rect x="370" y="55" width="130" height="40" rx="5" fill="#0ea5e9" />
            <text x="435" y="80" fill="#ffffff" font-size="11" text-anchor="middle">J7: Save &amp; Resume (30d)</text>

            <rect x="530" y="55" width="140" height="40" rx="5" fill="#1d4ed8" />
            <text x="600" y="80" fill="#ffffff" font-size="11" text-anchor="middle">J18: NICOP/POC/POR</text>

            <!-- Stage 2 Gates -->
            <rect x="40" y="165" width="140" height="45" rx="5" fill="#4338ca" />
            <text x="110" y="185" fill="#ffffff" font-size="11" text-anchor="middle">J12: Dup Check</text>
            <text x="110" y="200" fill="#cbd5e1" font-size="9" text-anchor="middle">1 wallet / CNIC</text>

            <rect x="220" y="165" width="150" height="45" rx="5" fill="#b91c1c" />
            <text x="295" y="185" fill="#ffffff" font-size="11" text-anchor="middle">J5: Pre-Screen Gate</text>
            <text x="295" y="200" fill="#fca5a5" font-size="9" text-anchor="middle">UNSC/ATA Hit = Stop</text>

            <rect x="400" y="165" width="140" height="45" rx="5" fill="#b0892e" />
            <text x="470" y="185" fill="#ffffff" font-size="11" text-anchor="middle">J6: CRP Risk Score</text>
            <text x="470" y="200" fill="#fde68a" font-size="9" text-anchor="middle">HIGH = EDD Case</text>

            <rect x="570" y="165" width="140" height="45" rx="5" fill="#ea580c" />
            <text x="640" y="185" fill="#ffffff" font-size="11" text-anchor="middle">J11: Provider Timeout</text>
            <text x="640" y="200" fill="#fed7aa" font-size="9" text-anchor="middle">Fail Closed = PENDING</text>

            <rect x="740" y="165" width="220" height="45" rx="5" fill="#64748b" />
            <text x="850" y="185" fill="#ffffff" font-size="11" text-anchor="middle">J8: Decline with Reason</text>
            <text x="850" y="200" fill="#e2e8f0" font-size="9" text-anchor="middle">Written Notice + Tracking ID</text>

            <!-- Stage 3 Ladder -->
            <rect x="40" y="295" width="200" height="50" rx="5" fill="#059669" />
            <text x="140" y="315" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">J1: Rung A - NADRA BV</text>
            <text x="140" y="333" fill="#a7f3d0" font-size="10" text-anchor="middle">Biometric Band (PKR 400,000)</text>

            <rect x="270" y="295" width="200" height="50" rx="5" fill="#1b6b93" />
            <text x="370" y="315" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">J2: Rung B - Verisys</text>
            <text x="370" y="333" fill="#bae6fd" font-size="10" text-anchor="middle">Verisys Band (PKR 50,000)</text>

            <rect x="500" y="295" width="200" height="50" rx="5" fill="#d97706" />
            <text x="600" y="315" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">J3: Rung C - Debit Block</text>
            <text x="600" y="333" fill="#fef3c7" font-size="10" text-anchor="middle">DEBIT_BLOCKED State</text>

            <rect x="730" y="295" width="210" height="50" rx="5" fill="#7c3aed" />
            <text x="835" y="315" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">J4: Rung D - Video KYC</text>
            <text x="835" y="333" fill="#ddd6fe" font-size="10" text-anchor="middle">Video Interview / Partner</text>

            <!-- Stage 4 Activation -->
            <rect x="40" y="455" width="300" height="50" rx="5" fill="#047857" />
            <text x="190" y="475" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">ACTIVATION GATE</text>
            <text x="190" y="492" fill="#a7f3d0" font-size="10" text-anchor="middle">Strength + Pre-Screen + CDD + EDD</text>

            <rect x="370" y="455" width="240" height="50" rx="5" fill="#0891b2" />
            <text x="490" y="475" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">2-HOUR COOLING-OFF</text>
            <text x="490" y="492" fill="#cff4fc" font-size="10" text-anchor="middle">BPRD 04 A.viii Timer</text>

            <rect x="640" y="455" width="300" height="50" rx="5" fill="#10b981" />
            <text x="790" y="475" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle">WALLET_ACTIVE</text>
            <text x="790" y="492" fill="#ecfdf5" font-size="10" text-anchor="middle">Wallet Number Assigned &amp; Live</text>

            <!-- Stage 5 Lifecycle -->
            <rect x="40" y="590" width="130" height="45" rx="5" fill="#0891b2" />
            <text x="105" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J9: New Device</text>
            <text x="105" y="623" fill="#cff4fc" font-size="9" text-anchor="middle">BV + 2h Timer</text>

            <rect x="185" y="590" width="140" height="45" rx="5" fill="#be185d" />
            <text x="255" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J10: Continuous TMS</text>
            <text x="255" y="623" fill="#fbcfe8" font-size="9" text-anchor="middle">HOLD / Investigation</text>

            <rect x="340" y="590" width="140" height="45" rx="5" fill="#0f766e" />
            <text x="410" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J13: Limit Upgrade</text>
            <text x="410" y="623" fill="#ccfbf1" font-size="9" text-anchor="middle">Annexure-J / BV</text>

            <rect x="495" y="590" width="140" height="45" rx="5" fill="#0369a1" />
            <text x="565" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J14: Contact Change</text>
            <text x="565" y="623" fill="#e0f2fe" font-size="9" text-anchor="middle">BV + SIM Pairing</text>

            <rect x="650" y="590" width="140" height="45" rx="5" fill="#a21caf" />
            <text x="720" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J15: Minor Wallet</text>
            <text x="720" y="623" fill="#fae8ff" font-size="9" text-anchor="middle">Guardian App</text>

            <rect x="805" y="590" width="145" height="45" rx="5" fill="#9a3412" />
            <text x="877" y="610" fill="#ffffff" font-size="11" text-anchor="middle">J19: Till Cash-In/Out</text>
            <text x="877" y="623" fill="#ffedd5" font-size="9" text-anchor="middle">BV @ Till / 2FA @ ATM</text>
          </svg>
        </div>
      </div>

      <h2 id="sequence">Onboarding Sequence &amp; Audit Trail</h2>
      <ol>
        <li><strong>Capture &amp; Tracking ID:</strong> Client registers → Identity (Service 02) creates application with tracking ID.</li>
        <li><strong>Pre-Screening Gate:</strong> Service 03 screens applicant against UNSC/ATA lists. Clear status recorded with list version.</li>
        <li><strong>Remote Verification:</strong> eKYC Adapter (16) calls NADRA BV (or Verisys fallback with genuine reason). Verification state stored.</li>
        <li><strong>Risk Tiering &amp; EDD:</strong> Identity computes CRP (LOW, MEDIUM, HIGH). HIGH risk triggers EDD workflow and senior approval.</li>
        <li><strong>Activation Gate &amp; Ledger:</strong> Upon complete CDD, clear pre-screening, and verified identity, Wallets (06) and Ledger (04) create accounts.</li>
        <li><strong>Cooling-off &amp; Go-Live:</strong> 2-hour cooling-off timer elapses → <code>WALLET_ACTIVE</code> state → customer starts transacting.</li>
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
