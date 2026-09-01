/**
 * "The domain" section — Takaful-style depth (term · plain English · in our system).
 */
module.exports = {
  "why-digital-banking": {
    title: "Why EMI / E-Money Exists",
    lede:
      "Why this machine is being built — e-money issuance, safeguarding, agent networks, and remittance — and what it deliberately refuses to do.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — how to read this page</strong>
        <ul>
          <li><strong>Two businesses, one confusion.</strong> Selling accounts and moving money looks like marketing — but regulated money movement needs a machine that survives audit.</li>
          <li><strong>EMI / e-money operator.</strong> Licensed or partnered issuance of electronic money — not a marketing site with a balance field.</li>
          <li><strong>Three markets, one platform.</strong> Pakistan first, then UAE, then in-Kingdom Saudi Arabia — same services, different adapters.</li>
          <li><strong>Adapters, not reimplementation.</strong> NADRA, Raast, 1LINK, and later UAE/KSA rails plug in behind ports.</li>
        </ul>
      </div>

      <p>Retail EMI operators and remittance providers in Pakistan, the UAE and Saudi Arabia face the same structural problem: <strong>issue e-money, move it safely, redeem it on demand, and prove to a regulator that every rupee, dirham and riyal is safeguarded</strong>. Marketing sites and mobile apps are the shop window. The machine behind them — identity, screening, ledger, issuance/redemption, agent float, saga, reconciliation, reporting — is what auditors inspect.</p>
      <p>We are building that machine for <strong>EMI / e-money and remittance</strong> (Blueprint v3.1 banking track). Full terminology: <a href="/docs/emoney-overview/">EMI Overview</a>. Takaful and other products live in sibling documentation sets.</p>

      <h2 id="problem">The problem we are solving</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Pressure</th><th>In plain English</th><th>What the machine must do</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Onboarding</strong></td>
              <td>Know who the customer is before they hold value</td>
              <td>Identity SoR, eKYC adapters, risk tier, screening gate — fail closed on timeout</td>
            </tr>
            <tr>
              <td><strong>Movement</strong></td>
              <td>Send domestically and across corridors without losing track</td>
              <td>Quote → screen → hold → payout → settle saga with compensations</td>
            </tr>
            <tr>
              <td><strong>Proof</strong></td>
              <td>Regulator asks "where was this money at 14:32?"</td>
              <td>Append-only ledger, outbox events, case records — not channel caches</td>
            </tr>
            <tr>
              <td><strong>Markets</strong></td>
              <td>Same operator, different rules per country</td>
              <td>Tenant + market packs; regional data planes; KSA residency in-Kingdom</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="not">What this is not</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>It is not…</th><th>Because…</th><th>What we do instead</th></tr></thead>
          <tbody>
            <tr>
              <td>A marketing website</td>
              <td>Slides do not post journals</td>
              <td>Build-ready services, workflows, and acceptance criteria</td>
            </tr>
            <tr class="trap">
              <td><strong>"Balance in the app"</strong></td>
              <td>The channel is a view, not the vault</td>
              <td><strong>Ledger (04)</strong> is sole SoR for value; wallets compose product labels</td>
            </tr>
            <tr>
              <td>Core-banking replacement on day one</td>
              <td>Not every licensed product ships at PK launch</td>
              <td>CBS host adapter <span class="pill settled">deferred</span> until a tenant needs it</td>
            </tr>
            <tr>
              <td>Rails reimplemented in every service</td>
              <td>Certification and wire formats belong at the edge</td>
              <td>Ports + market adapters (16, 19, 15, 22, …)</td>
            </tr>
            <tr>
              <td>Cards at launch</td>
              <td>No licensed card need in the pilot bar yet</td>
              <td>Card workflow specified; product <span class="pill settled">deferred</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="markets">Why three markets on one platform</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Market</th><th>Regulator</th><th>Identity at launch</th><th>Domestic rail</th></tr></thead>
          <tbody>
            <tr><td><strong>Pakistan</strong></td><td>SBP / FMU</td><td>NADRA CNIC</td><td>Raast</td></tr>
            <tr><td><strong>UAE</strong></td><td>CBUAE</td><td>Emirates ID / UAE Pass</td><td>Aani</td></tr>
            <tr><td><strong>Saudi Arabia</strong></td><td>SAMA / SAFIU</td><td>Absher / Yakeen</td><td>sarie (in-Kingdom)</td></tr>
          </tbody>
        </table>
      </div>
      <p>Sequence: <strong>PK commercial bar first</strong>, then AE, then SA with <strong>in-Kingdom</strong> data residency enforced at gateway and datastore.</p>

      <h2 id="trap">The trap — shop window vs machine</h2>
      <div class="trap-box">
        <p><strong>If you optimise for the shop window alone</strong>, you ship a beautiful send-money form that caches balances in the BFF for speed. It demos well. An auditor asks which number is real — and engineering discovers three balances for the same customer.</p>
        <p><strong>The machine we are building</strong> accepts slower reads over wrong reads: one ledger dimension for value, screening that fails closed, and a saga that never invents money outside postings.</p>
      </div>

      <div class="callout warn">
        <strong>Read next</strong>
        <a href="/docs/how-the-money-works/">How the Money Works</a> walks one payment through the ledger. <a href="/docs/one-payment-followed/">One Payment, Followed</a> is the ten-minute narrative version.
      </div>

      <div class="footer-nav">
        <a href="/docs/start-here/"><small>Previous</small><strong>Start Here</strong></a>
        <a href="/docs/how-the-money-works/"><small>Next</small><strong>How the Money Works</strong></a>
      </div>
    `,
  },

  "how-the-money-works": {
    title: "How the Money Works",
    lede:
      "Three surfaces touch money — only one holds the truth. This page follows one domestic send from quote to settlement and names every durable write.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — the money model</strong>
        <ul>
          <li><strong>One SoR.</strong> Service <strong>04 Ledger</strong> owns value. Wallets label products. Payments orchestrate. Channels display.</li>
          <li><strong>Holds before spends.</strong> Funds are reserved on the ledger before the rail is instructed — not after.</li>
          <li><strong>Integers only.</strong> Minor units (<code>bigint</code> / <code>long</code>) — never floating-point money.</li>
          <li><strong>Corrections are reversals.</strong> Append-only journals; mistakes are equal-and-opposite postings, never edits.</li>
        </ul>
      </div>

      <h2 id="surfaces">Four surfaces — one truth</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Surface</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Ledger</strong></td>
              <td>The vault's ledger book — every debit and credit</td>
              <td><code>jvm/ledger</code> · append-only <code>journals</code> + <code>postings</code> · TigerBeetle in pilot · holds PLACED → CAPTURED | RELEASED</td>
            </tr>
            <tr class="trap">
              <td><strong>Wallet</strong></td>
              <td>What the customer thinks they own — "my PKR wallet"</td>
              <td><code>services/wallets</code> · product instance + statement · <strong>reads ledger projections</strong> — never authoritative balance column</td>
            </tr>
            <tr>
              <td><strong>Payments</strong></td>
              <td>The choreographer of a send</td>
              <td><code>services/payments</code> · <code>transfers</code> row + <code>saga_steps</code> · calls Pricing, Screening, Ledger, Payout ports</td>
            </tr>
            <tr>
              <td><strong>Channel</strong></td>
              <td>What the customer sees on screen</td>
              <td><code>apps/web</code> · forms and display · <strong>no durable money truth</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="trap-wallet">The trap — wallet balance vs ledger balance</h2>
      <div class="trap-box">
        <div class="table-wrap vocab-table">
          <table>
            <thead><tr><th></th><th>Wallet "balance" in the UI</th><th>Ledger balance</th></tr></thead>
            <tbody>
              <tr><td>What is it?</td><td>A <strong>product view</strong> composed for display</td><td>The <strong>authoritative</strong> amount after postings and holds</td></tr>
              <tr><td>Can two services disagree?</td><td>Yes — if you cache wrongly</td><td>No — single SoR by design</td></tr>
              <tr><td>What reconciliation matches?</td><td>Not the cache — the ledger</td><td>Ledger ↔ payments ↔ rail statement</td></tr>
              <tr><td>If you merge the concepts?</td><td>Auditor finds duplicate truths</td><td>Cannot unpick after live money moved</td></tr>
            </tbody>
          </table>
        </div>
        <p>See <a href="/docs/money-model-correction/">Money Model Correction</a> — share it with anyone drafting "update balance in wallet service".</p>
      </div>

      <h2 id="saga">One payment, five ledger touchpoints</h2>
      <p>Retail send-money saga: <strong>Quote → Screen → Hold → Payout → Settle.</strong> Full narrative: <a href="/docs/one-payment-followed/">One Payment, Followed</a>.</p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>

      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Step</th><th>What becomes true</th><th>Durable write (purple on diagrams)</th></tr></thead>
          <tbody>
            <tr><td><strong>01 Initiate</strong></td><td>Transfer exists; state INITIATED</td><td>PostgreSQL <code>transfers</code> INSERT + saga step 0</td></tr>
            <tr><td><strong>02 Quote</strong></td><td>Firm price with fee/tax/FX provenance</td><td><code>transfers.quote_id</code> UPDATE · Pricing (10) via REST</td></tr>
            <tr><td><strong>03 Screen</strong></td><td>CLEAR continues; HOLD waits; timeout ⇒ HOLD</td><td>Screening case INSERT if hit · event <code>screening.case.resolved.v1</code></td></tr>
            <tr class="trap">
              <td><strong>04 Hold</strong></td>
              <td>Money <strong>reserved</strong> — not spent yet</td>
              <td>Ledger <code>placeHold</code> · hold PLACED · reduces <strong>available</strong> not "balance" semantics in channel</td>
            </tr>
            <tr><td><strong>05 Payout</strong></td><td>Rail instructed; status unknown until confirmed</td><td>Payout ref on transfer · adapter call to Raast/Aani/sarie/partner</td></tr>
            <tr><td><strong>06 Settle</strong></td><td>Saga terminal; customer movement complete</td><td><code>captureHold</code> + balanced journal · <code>payments.transfer.completed.v1</code> outbox</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="hold-settle">Hold vs settle — the second trap</h2>
      <div class="trap-box">
        <div class="table-wrap vocab-table">
          <table>
            <thead><tr><th></th><th>Hold</th><th>Settle (capture)</th></tr></thead>
            <tbody>
              <tr><td>Plain English</td><td>"Ring-fence this amount"</td><td>"This amount is now finally moved"</td></tr>
              <tr><td>Ledger state</td><td>PLACED — reduces available balance</td><td>CAPTURED — posting lines written</td></tr>
              <tr><td>Customer experience</td><td>Balance may look unchanged; available drops</td><td>Movement completes; statement shows posting</td></tr>
              <tr><td>On rail reject</td><td>RELEASED — funds freed</td><td>Never captured — compensation C2</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2 id="rules">Rules that never bend</h2>
      <ul>
        <li><strong>Idempotency-Key</strong> on every mutation — replay returns the same result.</li>
        <li><strong>Transactional outbox</strong> — business row + outbox row in one DB transaction; no dual-write to Kafka.</li>
        <li><strong>FX provenance (ADR-0002)</strong> — rate is input to posting; recorded at quote; not looked up mid-posting.</li>
        <li><strong>Integer minor units</strong> — paisa, fils, halalas as integers end-to-end.</li>
      </ul>

      <div class="footer-nav">
        <a href="/docs/why-digital-banking/"><small>Previous</small><strong>Why Digital Banking Exists</strong></a>
        <a href="/docs/the-vocabulary/"><small>Next</small><strong>The Vocabulary</strong></a>
      </div>
    `,
  },

  "the-vocabulary": {
    title: "The Vocabulary",
    lede:
      "Every term in one place — what it means in plain English, and what it corresponds to inside our system. Rows shaded coral are pairs most often confused.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — how to use this page</strong>
        <ul>
          <li><strong>Three columns, three audiences.</strong> The term, the plain-English meaning, and the thing it maps to in software.</li>
          <li><strong>The third column is the useful one for engineers.</strong> Every concept resolves to a table, a posting, a state, or a port — not an abstraction slide.</li>
          <li><strong>Coral rows are traps.</strong> Terms that sound alike, get conflated, and mean different things — including pairs wrong in inherited sketches.</li>
        </ul>
      </div>

      <p>These words must mean the same thing in product meetings, compliance reviews, and pull requests. When two teams use the same word for different tables, reconciliation never finishes.</p>

      <h2 id="platform">Platform topology</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Tenant</strong></td>
              <td>Which operator / market context this request belongs to</td>
              <td><code>tenant_id</code> on every request, row, event, log, metric — isolation P1</td>
            </tr>
            <tr class="trap">
              <td><strong>Control plane</strong></td>
              <td>Global switches and registry — not customer money</td>
              <td>Service <strong>12</strong> · tenants, packs, entitlements, billing config · <strong>no regulated customer PII</strong></td>
            </tr>
            <tr class="trap">
              <td><strong>Data plane</strong></td>
              <td>Where regulated data and money actually live</td>
              <td>Regional cells PK / AE / SA · full service set · KSA stays in-Kingdom</td>
            </tr>
            <tr>
              <td><strong>Market pack</strong></td>
              <td>Bundle of rules for a country</td>
              <td>Control-plane config: lists, limits, tax packs, adapter bindings — version-pinned</td>
            </tr>
            <tr>
              <td><strong>Port / adapter</strong></td>
              <td>Contract inside; wire format outside</td>
              <td>Domain calls <code>EkycProviderPort</code>, <code>PayoutPort</code>, … · adapter implements NADRA, Raast, etc.</td>
            </tr>
            <tr>
              <td><strong>BFF</strong></td>
              <td>Gateway the apps talk to</td>
              <td>Service <strong>11</strong> · tenant resolution, auth, rate limits · never raw domain exposure</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="emi">EMI &amp; e-money</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr class="trap">
              <td><strong>E-money</strong></td>
              <td>Electronically stored monetary value</td>
              <td>Customer liability accounts on Ledger <strong>04</strong> — created on <a href="/docs/emoney-issuance-redemption/">issuance</a>, destroyed on <a href="/docs/emoney-issuance-redemption/">redemption</a></td>
            </tr>
            <tr class="trap">
              <td><strong>E-money account</strong></td>
              <td>What the customer "owns" in the app</td>
              <td>Wallets service product instance → maps to ledger account ids · lifecycle in <a href="/docs/emoney-lifecycle/">E-Money Account Lifecycle</a></td>
            </tr>
            <tr>
              <td><strong>Issuance</strong></td>
              <td>Creating e-money when funds received</td>
              <td><a href="/docs/workflows/cash-in/ci-initiate/">Cash-in</a> or bank transfer → balanced journal · <code>wallets.emoney.issued.v1</code></td>
            </tr>
            <tr>
              <td><strong>Redemption</strong></td>
              <td>Destroying e-money when customer cashes out</td>
              <td><a href="/docs/workflows/cash-out/co-initiate/">Cash-out</a> or bank payout → debit customer liability</td>
            </tr>
            <tr>
              <td><strong>Safeguarding</strong></td>
              <td>Customer money kept separate from operator funds</td>
              <td>Segregated ledger pool — <a href="/docs/safeguarding/">Safeguarding Architecture</a></td>
            </tr>
            <tr>
              <td><strong>Agent float</strong></td>
              <td>Prefunded balance at an outlet</td>
              <td>Outlet ledger account · <a href="/docs/agent-float-settlement/">Agent Float &amp; Settlement</a></td>
            </tr>
            <tr>
              <td><strong>Audit log</strong></td>
              <td>Who did what, when</td>
              <td><code>audit_log</code> / <code>ops_audit</code> — <strong>not</strong> used for balance · see <a href="/docs/ledger-vs-audit/">Ledger vs Audit Log</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="money">Money &amp; ledger</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>SoR</strong><br><small>system of record</small></td>
              <td>The one place auditors trust for a fact</td>
              <td>For <strong>value</strong>, always Ledger <strong>04</strong> — nowhere else</td>
            </tr>
            <tr>
              <td><strong>Journal</strong></td>
              <td>One financial event, balanced</td>
              <td>Group of postings that sum to zero per currency · append-only</td>
            </tr>
            <tr>
              <td><strong>Posting</strong></td>
              <td>One line of the journal</td>
              <td>Account, direction, <code>amount_minor</code>, currency — never UPDATEd</td>
            </tr>
            <tr class="trap">
              <td><strong>Balance</strong></td>
              <td>Total funds in an account</td>
              <td>Ledger projection from postings — <strong>not</strong> a wallet column</td>
            </tr>
            <tr class="trap">
              <td><strong>Available balance</strong></td>
              <td>What you can still spend</td>
              <td>Balance minus active holds — what limits and UI "available" should use</td>
            </tr>
            <tr>
              <td><strong>Hold</strong></td>
              <td>Money ring-fenced, not spent</td>
              <td><code>placeHold</code> → PLACED → CAPTURED or RELEASED (exactly one terminal)</td>
            </tr>
            <tr>
              <td><strong>Settle</strong></td>
              <td>Movement is final</td>
              <td><code>captureHold</code> + journal · saga terminal SETTLED</td>
            </tr>
            <tr>
              <td><strong>Minor units</strong></td>
              <td>Paisa not rupees</td>
              <td><code>bigint</code> (TS) / <code>long</code> (Java) · ESLint bans <code>number</code> for amounts</td>
            </tr>
            <tr>
              <td><strong>Reversal</strong></td>
              <td>Undo done correctly</td>
              <td>Equal-and-opposite journal linked to original — never DELETE or UPDATE posting</td>
            </tr>
            <tr>
              <td><strong>Outbox</strong></td>
              <td>Reliable "tell everyone else"</td>
              <td>Outbox row in same DB tx as business write · Debezium → Kafka</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="payments">Payments &amp; saga</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr class="trap">
              <td><strong>Quote</strong></td>
              <td>Firm price shown to customer</td>
              <td>Pricing <strong>10</strong> response with fees, tax, FX provenance · <code>quote_id</code> on transfer</td>
            </tr>
            <tr class="trap">
              <td><strong>Transfer</strong></td>
              <td>The whole send attempt</td>
              <td><code>transfers</code> aggregate + <code>TransferState</code> machine in Payments <strong>05</strong></td>
            </tr>
            <tr>
              <td><strong>Corridor</strong></td>
              <td>From country A to country B</td>
              <td>Config: source/dest ISO + <code>boundAdapter</code> rail key (raast, aani, sarie, xborder-partner)</td>
            </tr>
            <tr>
              <td><strong>Saga</strong></td>
              <td>Multi-step process with compensations</td>
              <td>Persisted state machine + <code>saga_steps</code> — not a heavyweight engine</td>
            </tr>
            <tr>
              <td><strong>Compensation</strong></td>
              <td>Undo when the world refuses</td>
              <td>C1 screen-fail · C2 rail-reject (release hold) · C3 settlement-fail (ops path)</td>
            </tr>
            <tr>
              <td><strong>Idempotency-Key</strong></td>
              <td>Same request twice ⇒ same outcome</td>
              <td>Header on every mutation · unique per tenant · replay stored result</td>
            </tr>
            <tr>
              <td><strong>Payout</strong></td>
              <td>Instruction to the rail</td>
              <td><code>PayoutPort</code> → adapter <strong>19</strong> · webhook/poll for terminal status</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="compliance">Compliance &amp; identity</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr class="trap">
              <td><strong>eKYC</strong></td>
              <td>Prove this person is who they claim</td>
              <td>Identity <strong>02</strong> + adapter <strong>16</strong> · verification case · timeout ⇒ MANUAL_REVIEW</td>
            </tr>
            <tr class="trap">
              <td><strong>Screening (AML)</strong></td>
              <td>Check against sanctions / PEP lists</td>
              <td>Screening <strong>03</strong> + adapter <strong>15</strong> · CLEAR / HOLD / REJECT · <strong>not</strong> identity verification</td>
            </tr>
            <tr>
              <td><strong>CLEAR</strong></td>
              <td>Proceed</td>
              <td>Saga continues · never returned on provider timeout</td>
            </tr>
            <tr>
              <td><strong>HOLD</strong></td>
              <td>Wait for human decision</td>
              <td>Case opened · maker-checker on HIGH · saga waits on event</td>
            </tr>
            <tr>
              <td><strong>REJECT</strong></td>
              <td>Stop — do not proceed</td>
              <td>Journey ends · customer informed · case retained</td>
            </tr>
            <tr>
              <td><strong>Risk tier</strong></td>
              <td>How risky we think this customer is</td>
              <td>UNRATED → LOW | MEDIUM | HIGH · drives limits · history append-only</td>
            </tr>
            <tr>
              <td><strong>Maker-checker</strong></td>
              <td>Two people for dangerous decisions</td>
              <td>HIGH case disposition · ops override above threshold</td>
            </tr>
            <tr>
              <td><strong>KYB</strong></td>
              <td>Know your business</td>
              <td>Corporate journey · UBO graph · same fail-closed screening as retail</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="products">Products &amp; channels</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Term</th><th>In plain English</th><th>In our system</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Wallet</strong></td>
              <td>Named product the customer holds</td>
              <td>Wallets <strong>06</strong> product instance · statement · links to ledger account(s)</td>
            </tr>
            <tr>
              <td><strong>Retail onboarding</strong></td>
              <td>Become a customer who can hold money</td>
              <td>8-stage workflow · ends with TigerBeetle account CREATE</td>
            </tr>
            <tr>
              <td><strong>Remittance</strong></td>
              <td>Cross-border or domestic send</td>
              <td>Payments saga · primary corridors UAE→PK, KSA→PK</td>
            </tr>
            <tr>
              <td><strong>Bill payment</strong></td>
              <td>Pay a utility or biller</td>
              <td>Separate 4-stage saga in Payments · select → create → confirm → debit</td>
            </tr>
            <tr>
              <td><strong>Agent assisted</strong></td>
              <td>Staff helps customer in branch</td>
              <td>AOB grant · agent headers on same sagas · audit before commission</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="rails">Rails &amp; adapters (launch bindings)</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Binding</th><th>Market</th><th>In our system</th></tr></thead>
          <tbody>
            <tr><td><code>raast</code></td><td>PK→PK</td><td>Payout adapter <strong>19</strong> · ISO 20022 pacs.008 / pacs.002</td></tr>
            <tr><td><code>aani</code></td><td>AE→AE</td><td>Al Etihad Payments instant rail</td></tr>
            <tr><td><code>sarie</code></td><td>SA→SA</td><td>SAMA IPS · in-Kingdom only</td></tr>
            <tr><td><code>xborder-partner</code></td><td>AE→PK, SA→PK</td><td>Partner API until direct scheme certified</td></tr>
            <tr><td>NADRA</td><td>PK identity</td><td>eKYC adapter <strong>16</strong> · CNIC verification</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="traps">The traps, gathered</h2>
      <div class="trap-box">
        <p><strong>Wallet balance vs ledger balance</strong> — product view versus vault truth.</p>
        <p><strong>Hold vs settle</strong> — reservation versus final posting.</p>
        <p><strong>Available vs total balance</strong> — what you can spend versus what you own.</p>
        <p><strong>eKYC vs AML screening</strong> — identity proof versus sanctions lists.</p>
        <p><strong>Quote vs transfer</strong> — firm price versus saga aggregate.</p>
        <p><strong>Control plane vs data plane</strong> — configuration versus regulated data.</p>
        <p><strong>Timeout vs CLEAR</strong> — fail closed means HOLD — never silent pass.</p>
      </div>

      <div class="footer-nav">
        <a href="/docs/how-the-money-works/"><small>Previous</small><strong>How the Money Works</strong></a>
        <a href="/docs/who-governs-it/"><small>Next</small><strong>Who Governs It</strong></a>
      </div>
    `,
  },

  "who-governs-it": {
    title: "Who Governs It",
    lede:
      "Three regulators, three cadences, and the internal owners who turn policy into machine behaviour — plus what each authority actually asks to see.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — governance layers</strong>
        <ul>
          <li><strong>Regulators</strong> supervise licensed activity in each market — they audit what the system <em>did</em>, not what slides claim.</li>
          <li><strong>Compliance</strong> owns fail-closed rules — screening, STR/SAR policy, maker-checker thresholds.</li>
          <li><strong>Engineering</strong> owns boundaries — SoR, ports, residency routing, isolation tests in CI.</li>
          <li><strong>Open questions</strong> live on <a href="/docs/what-we-do-not-know/">What We Do Not Know</a> — no silent guesses elsewhere.</li>
        </ul>
      </div>

      <h2 id="regulators">Market regulators — who can stop the business</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Market</th><th>Authority</th><th>What they care about</th><th>What they ask to see</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Pakistan</strong></td>
              <td>SBP · FMU (AML)</td>
              <td>Domestic rails, KYC, STR reporting, Raast certification</td>
              <td>Screening cases, ledger postings, goAML-aligned returns, audit trail of overrides</td>
            </tr>
            <tr>
              <td><strong>UAE</strong></td>
              <td>CBUAE</td>
              <td>Payment systems, AML, consumer protection</td>
              <td>Corridor records, Aani integration evidence, tenant isolation proof</td>
            </tr>
            <tr>
              <td><strong>Saudi Arabia</strong></td>
              <td>SAMA · SAFIU</td>
              <td>In-Kingdom data, sarie, AML</td>
              <td>Residency routing tests, KSA cell deployment, screening list scope</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="internal">Internal decision owners</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Domain</th><th>Owner</th><th>Decisions they own</th><th>Machine artefact</th></tr></thead>
          <tbody>
            <tr>
              <td>Compliance &amp; AML</td>
              <td>Compliance</td>
              <td>Fail-closed screening, list scope, STR/SAR policy, HIGH maker-checker</td>
              <td>Screening <strong>03</strong> config packs · case disposition workflows</td>
            </tr>
            <tr>
              <td>Product sequencing</td>
              <td>Product</td>
              <td>Corporate at launch?, corridor priority, card deferral</td>
              <td>Entitlements in control plane · journey visibility in apps</td>
            </tr>
            <tr>
              <td>Architecture</td>
              <td>Engineering</td>
              <td>SoR boundaries, port contracts, TS/JVM split</td>
              <td>Hexagonal rules · Pact · ADRs</td>
            </tr>
            <tr>
              <td>Commercial providers</td>
              <td>Commercial / Ops</td>
              <td>NADRA, Raast, IdP, tax, messaging contracts</td>
              <td>Adapter certification calendars — <strong>blocks PK go-live</strong></td>
            </tr>
            <tr>
              <td>Platform &amp; residency</td>
              <td>Platform</td>
              <td>Hosting regions, KSA in-Kingdom cells, capacity</td>
              <td>Gateway routing · <code>home_region</code> enforcement</td>
            </tr>
            <tr>
              <td>Finance / tax</td>
              <td>Finance</td>
              <td>Tax packs, fee disclosure, quote fail-closed behaviour</td>
              <td>Pricing <strong>10</strong> tax components · quote provenance</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="audit">What supervisors audit — not what we document</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Question an auditor asks</th><th>Wrong answer</th><th>Right artefact in our system</th></tr></thead>
          <tbody>
            <tr class="trap">
              <td>"Where is the customer's balance?"</td>
              <td>"In the wallet service" or "in the app"</td>
              <td>Ledger postings + hold state · wallet is a composed view</td>
            </tr>
            <tr>
              <td>"Prove this payment was screened"</td>
              <td>"The provider said OK in the log"</td>
              <td>Immutable <code>screening_requests</code> + case row + disposition event</td>
            </tr>
            <tr>
              <td>"Who approved this HIGH case?"</td>
              <td>"The same analyst closed it"</td>
              <td>Maker-checker audit · two operator IDs on disposition</td>
            </tr>
            <tr>
              <td>"Did KSA data leave the Kingdom?"</td>
              <td>"We don't store much there yet"</td>
              <td>Residency routing tests · gateway region assertion · SA cell only</td>
            </tr>
            <tr>
              <td>"Can tenant A see tenant B's data?"</td>
              <td>"We filter in the query"</td>
              <td>Isolation enforced at connection/RLS · 100% CI isolation suite — P1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="cadence">Cadence</h2>
      <ul>
        <li><strong>Real-time gates</strong> — screening on every payment; eKYC before tier upgrade; holds before payout.</li>
        <li><strong>Operational</strong> — AML case queues, reconciliation breaks, rail statement matching (service <strong>09</strong>).</li>
        <li><strong>Periodic</strong> — regulatory returns (service <strong>08</strong>), capacity review once year-three volume is known.</li>
      </ul>

      <h2 id="open">Still open — not governance guesses</h2>
      <p>Who holds the licence versus who operates the platform, second-tenant timing, and year-three volume — see <a href="/docs/what-we-do-not-know/">What We Do Not Know</a>.</p>

      <div class="footer-nav">
        <a href="/docs/the-vocabulary/"><small>Previous</small><strong>The Vocabulary</strong></a>
        <a href="/docs/what-we-are-building/"><small>Next</small><strong>What We Are Building</strong></a>
      </div>
    `,
  },
};
