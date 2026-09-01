/**
 * EMI / e-money capability pages — ticket coverage for regulated wallet operator docs.
 */
module.exports = {
  "emoney-overview": {
    title: "EMI & E-Money Overview",
    lede:
      "How this platform is documented as an electronic money institution (EMI) — issuing e-money, safeguarding customer funds, and moving value through agents and rails.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief — EMI framing</strong>
        <ul>
          <li><strong>EMI / e-money issuer</strong> — licensed operator that creates electronic money when funds are received and destroys it on redemption.</li>
          <li><strong>E-money account</strong> — customer wallet product backed by ledger accounts; not a bank deposit account unless separately licensed.</li>
          <li><strong>Safeguarded funds</strong> — customer money segregated from operator working capital; reconciled daily to ledger.</li>
          <li><strong>Agent network</strong> — outlets with float, hierarchy, and settlement — cash-in/cash-out at the edge.</li>
        </ul>
      </div>

      <h2 id="terminology">Terminology shift</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Generic (avoid in regulated docs)</th><th>EMI / e-money term</th><th>In our system</th></tr></thead>
          <tbody>
            <tr><td>Digital banking</td><td><strong>EMI / e-money operator</strong></td><td>Tenant licensed or partnered for e-money issuance</td></tr>
            <tr><td>Wallet balance</td><td><strong>E-money balance</strong></td><td>Ledger projection on customer e-money accounts</td></tr>
            <tr><td>Top-up</td><td><strong>E-money issuance</strong></td><td>Credit customer e-money account when safeguarded funds received</td></tr>
            <tr><td>Withdraw</td><td><strong>E-money redemption</strong></td><td>Debit customer account; pay out cash or bank transfer</td></tr>
            <tr><td>Branch</td><td><strong>Agent outlet</strong></td><td>Hierarchy node with float account and limits</td></tr>
            <tr><td>Transfer</td><td><strong>Payment / remittance</strong></td><td>Saga on payments service — same ledger rules</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="scope">What the EMI machine covers</h2>
      <ul>
        <li><a href="/docs/emoney-lifecycle/">E-money account lifecycle</a> — open, active, blocked, dormant, closed</li>
        <li><a href="/docs/emoney-issuance-redemption/">Issuance &amp; redemption</a> — creating and destroying e-money</li>
        <li><a href="/docs/safeguarding/">Safeguarding architecture</a> — segregated accounts and daily reconciliation</li>
        <li><a href="/docs/workflows/cash-in/ci-initiate/">Cash-in</a> / <a href="/docs/workflows/cash-out/co-initiate/">Cash-out</a> journeys</li>
        <li><a href="/docs/limits-velocity/">Limits &amp; velocity controls</a></li>
        <li><a href="/docs/fraud-controls/">AML, KYC, sanctions &amp; fraud</a></li>
        <li><a href="/docs/rails-pk/">1LINK &amp; Raast</a> integration flows</li>
        <li><a href="/docs/agent-float-settlement/">Agent float &amp; outlet settlement</a></li>
      </ul>

      <div class="footer-nav">
        <a href="/docs/the-vocabulary/"><small>Previous</small><strong>The Vocabulary</strong></a>
        <a href="/docs/emoney-lifecycle/"><small>Next</small><strong>E-Money Account Lifecycle</strong></a>
      </div>
    `,
  },

  "emoney-lifecycle": {
    title: "E-Money Account Lifecycle",
    lede: "States and transitions for customer e-money accounts — from first issuance through block, dormancy, and closure with zero balance.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief</strong>
        <ul>
          <li>E-money accounts are <strong>product instances</strong> (wallets service) mapped to <strong>ledger accounts</strong> (value SoR).</li>
          <li>Lifecycle state lives in wallets/identity; <strong>money truth</strong> lives only in the ledger.</li>
          <li>Closure requires <strong>zero balance</strong> and no active holds — redemption or transfer first.</li>
        </ul>
      </div>

      <h2 id="states">Account states</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>State</th><th>Meaning</th><th>Customer can</th><th>Durable writes</th></tr></thead>
          <tbody>
            <tr><td><strong>PENDING</strong></td><td>KYC incomplete</td><td>Complete verification only</td><td><code>accounts.status</code> INSERT at register</td></tr>
            <tr><td><strong>ACTIVE</strong></td><td>Issuance, payments, cash-in/out allowed per tier</td><td>Full entitled product set</td><td>Ledger CREATE on activation · tier on customer</td></tr>
            <tr><td><strong>BLOCKED</strong></td><td>Compliance or fraud hold</td><td>Read-only / support channel</td><td>Case or fraud flag UPDATE · audit_log</td></tr>
            <tr><td><strong>DORMANT</strong></td><td>No activity N months</td><td>Reactivation flow</td><td>Scheduled job UPDATE · notification event</td></tr>
            <tr><td><strong>CLOSED</strong></td><td>Terminal — zero balance</td><td>None</td><td><code>accounts.status=CLOSED</code> · ledger accounts frozen</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="transitions">Key transitions</h2>
      <ol>
        <li><strong>Onboard → PENDING → ACTIVE</strong> — <a href="/docs/workflows/onboarding/wallet-ledger/">Wallet + Ledger activation</a> after KYC + screening CLEAR.</li>
        <li><strong>ACTIVE → BLOCKED</strong> — screening REJECT, fraud rule, or operator override with maker-checker.</li>
        <li><strong>ACTIVE → DORMANT</strong> — pack-configured inactivity threshold.</li>
        <li><strong>ACTIVE/DORMANT → CLOSED</strong> — customer request or offboarding; <strong>redeem all e-money</strong> first.</li>
      </ol>

      <div class="wf-embed" data-workflow="onboarding" data-view="pipeline"></div>

      <div class="trap-box">
        <p><strong>The trap:</strong> closing an account by deleting the row. Closure is a state transition; ledger history and audit trail remain immutable.</p>
      </div>

      <div class="footer-nav">
        <a href="/docs/emoney-overview/"><small>Previous</small><strong>EMI Overview</strong></a>
        <a href="/docs/emoney-issuance-redemption/"><small>Next</small><strong>Issuance &amp; Redemption</strong></a>
      </div>
    `,
  },

  "emoney-issuance-redemption": {
    title: "E-Money Issuance & Redemption",
    lede: "Creating e-money when safeguarded funds arrive — and destroying it when the customer redeems to cash or bank account.",
    body: `
      <h2 id="issuance">Issuance (e-money creation)</h2>
      <p>When the operator receives <strong>eligible funds</strong> (customer bank transfer, agent cash deposit, or partner prefunding), the platform:</p>
      <ol>
        <li>Records the inbound funds in <strong>safeguarding / settlement accounts</strong> (ledger).</li>
        <li>Runs screening and limits checks on the funding event.</li>
        <li><strong>Credits</strong> the customer e-money account with an equal-and-opposite double-entry journal.</li>
        <li>Emits <code>wallets.emoney.issued.v1</code> for reporting and reconciliation.</li>
      </ol>
      <p>Agent channel: <a href="/docs/workflows/cash-in/ci-initiate/">Cash-in workflow →</a></p>
      <div class="wf-embed" data-workflow="cash-in" data-view="overview"></div>

      <h2 id="redemption">Redemption (e-money destruction)</h2>
      <p>When the customer withdraws e-money to cash or external bank account:</p>
      <ol>
        <li>Validate available balance (ledger projection minus holds).</li>
        <li>Screen transaction; enforce limits and velocity.</li>
        <li><strong>Debit</strong> customer e-money account; post to safeguarding / payout suspense.</li>
        <li>Disburse via agent cash-out or Raast/1LINK bank payout.</li>
        <li>Confirm settlement; emit <code>wallets.emoney.redeemed.v1</code>.</li>
      </ol>
      <p>Agent channel: <a href="/docs/workflows/cash-out/co-initiate/">Cash-out workflow →</a></p>
      <div class="wf-embed" data-workflow="cash-out" data-view="overview"></div>

      <div class="callout warn">
        <strong>Regulatory rule</strong> Issuance and redemption must reconcile to safeguarding account movements daily. No e-money created without a matching safeguarded funds receipt.
      </div>

      <div class="footer-nav">
        <a href="/docs/emoney-lifecycle/"><small>Previous</small><strong>Account Lifecycle</strong></a>
        <a href="/docs/safeguarding/"><small>Next</small><strong>Safeguarding</strong></a>
      </div>
    `,
  },

  "safeguarding": {
    title: "Safeguarding Architecture",
    lede: "How customer funds are segregated from operator money — safeguarded accounts, daily reconciliation, and audit evidence.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief</strong>
        <ul>
          <li><strong>Safeguarded pool</strong> — ledger accounts holding customer funds only; separate from operator revenue and float working accounts.</li>
          <li><strong>Issuance</strong> increases customer e-money and safeguarded liabilities in balance.</li>
          <li><strong>Redemption</strong> decreases both when funds leave to bank or agent.</li>
          <li><strong>Daily recon</strong> — safeguarded ledger balance = sum of customer e-money + agent float liabilities ± in-transit items.</li>
        </ul>
      </div>

      <h2 id="accounts">Ledger account classes</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Class</th><th>Purpose</th><th>Who owns the balance</th></tr></thead>
          <tbody>
            <tr><td><strong>Customer e-money</strong></td><td>Per-customer liability accounts</td><td>Customer</td></tr>
            <tr><td><strong>Agent float</strong></td><td>Prefunded outlet working balance</td><td>Agent / outlet (operator liability)</td></tr>
            <tr><td><strong>Safeguarded pool</strong></td><td>Segregated trust/settlement mirror</td><td>Customers collectively</td></tr>
            <tr><td><strong>Operator</strong></td><td>Fees, commission, working capital</td><td>EMI operator</td></tr>
            <tr><td><strong>In-transit / suspense</strong></td><td>Rail or agent settlement in flight</td><td>Temporary — must clear daily</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="flow">Safeguarding flow</h2>
      <ol>
        <li>External funds hit <strong>partner bank / agent prefunding</strong> → credited to safeguarded pool (ledger).</li>
        <li>Issuance journals move value from pool to customer e-money liability.</li>
        <li>Payments and remittance move value between customer accounts via double-entry — total safeguarded liability unchanged until redemption.</li>
        <li>Redemption journals reduce customer liability and pool; bank payout confirms exit.</li>
      </ol>

      <p>Reconciliation detail: <a href="/docs/settlement-reconciliation/">Settlement &amp; Reconciliation</a> · Exception handling: <a href="/docs/exception-management/">Exception Management</a></p>

      <div class="footer-nav">
        <a href="/docs/emoney-issuance-redemption/"><small>Previous</small><strong>Issuance &amp; Redemption</strong></a>
        <a href="/docs/limits-velocity/"><small>Next</small><strong>Limits &amp; Velocity</strong></a>
      </div>
    `,
  },

  "limits-velocity": {
    title: "Transaction Limits & Velocity Controls",
    lede: "Per-tier, per-product, and per-channel limits — plus velocity rules that detect structuring and abnormal patterns.",
    body: `
      <h2 id="layers">Control layers</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Layer</th><th>Source</th><th>Examples</th></tr></thead>
          <tbody>
            <tr><td><strong>Risk tier</strong></td><td>Identity after KYC + screening</td><td>LOW / MEDIUM / HIGH daily caps</td></tr>
            <tr><td><strong>Product pack</strong></td><td>Control plane market pack</td><td>Max single cash-in, max wallet balance</td></tr>
            <tr><td><strong>Agent hierarchy</strong></td><td>Outlet + supervisor chain</td><td>Agent transaction cap, float ceiling</td></tr>
            <tr><td><strong>Velocity rules</strong></td><td>Transaction monitoring (pack-versioned)</td><td>N transactions in T minutes; cumulative amount windows</td></tr>
            <tr><td><strong>Channel</strong></td><td>BFF + domain services</td><td>Step-up auth above threshold (ADR IdP)</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="enforcement">Enforcement points</h2>
      <ul>
        <li><strong>Before issuance</strong> — cash-in checks tier + velocity + agent float availability.</li>
        <li><strong>Before payment saga</strong> — quote and initiate validate available balance and limits.</li>
        <li><strong>Before redemption</strong> — cash-out and bank payout validate daily/monthly redemption caps.</li>
        <li><strong>On breach</strong> — hard decline with reason code; optional auto-case to fraud/AML queue.</li>
      </ul>

      <div class="callout warn">
        <strong>Status</strong> Velocity / transaction monitoring rule engine is specified in blueprint; implementation <span class="pill settled">not complete</span> in pilot backlog. Limits by tier are partially enforced.
      </div>

      <div class="footer-nav">
        <a href="/docs/safeguarding/"><small>Previous</small><strong>Safeguarding</strong></a>
        <a href="/docs/fraud-controls/"><small>Next</small><strong>Fraud Controls</strong></a>
      </div>
    `,
  },

  "fraud-controls": {
    title: "AML, KYC, Sanctions & Fraud Controls",
    lede: "Compliance gates for onboarding and every money movement — plus fraud monitoring beyond list screening.",
    body: `
      <p>See also: <a href="/docs/identity-kyc-aml/">Identity, KYC &amp; AML</a> · <a href="/docs/workflows/screening-aml/sa-request/">Screening workflow</a></p>

      <h2 id="kyc">KYC / KYB</h2>
      <ul>
        <li>Retail: NADRA CNIC (PK), Emirates ID / UAE Pass (AE), Absher/Yakeen (SA).</li>
        <li>Corporate: KYB with UBO threshold (default 25%) — <a href="/docs/corporate-journeys/">Corporate Journeys</a>.</li>
        <li>Fail-safe: provider timeout ⇒ <code>MANUAL_REVIEW</code> — never auto-approve.</li>
      </ul>

      <h2 id="aml">AML / sanctions screening</h2>
      <ul>
        <li>Lists: UN Consolidated, OFAC SDN, NACTA (PK), UAE Local Terrorist List, KSA designated persons.</li>
        <li>Every onboarding and <strong>every payment</strong> — real-time target p99 &lt; 700 ms excluding provider.</li>
        <li>Dispositions: CLEAR · HOLD · REJECT — fail closed on provider error.</li>
        <li>HIGH severity cases: maker-checker before disposition.</li>
      </ul>

      <h2 id="fraud">Fraud controls (beyond lists)</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Control</th><th>Trigger</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>Velocity / structuring</td><td>Pack-versioned TM rules</td><td>Decline or HOLD + case</td></tr>
            <tr><td>Device / session anomaly</td><td>BFF risk signals</td><td>Step-up auth or block</td></tr>
            <tr><td>Agent abuse</td><td>Outlet limit breach, split transactions</td><td>Block outlet; ops alert</td></tr>
            <tr><td>Duplicate transaction</td><td>Idempotency-Key collision or hash match</td><td>Return original result — no double post</td></tr>
            <tr><td>Rail fraud</td><td>Beneficiary mismatch, account takeover</td><td>Screening HOLD + investigation</td></tr>
          </tbody>
        </table>
      </div>

      <div class="wf-embed" data-workflow="screening-aml" data-view="overview"></div>

      <div class="footer-nav">
        <a href="/docs/limits-velocity/"><small>Previous</small><strong>Limits &amp; Velocity</strong></a>
        <a href="/docs/transaction-states/"><small>Next</small><strong>Transaction States</strong></a>
      </div>
    `,
  },

  "transaction-states": {
    title: "Transaction State Machine",
    lede: "Explicit states for transfers, cash events, and bill payments — persisted in payments with saga_steps audit trail.",
    body: `
      <h2 id="transfer">Transfer state machine (remittance / P2P)</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>State</th><th>Next states</th><th>Compensation</th></tr></thead>
          <tbody>
            <tr><td>INITIATED</td><td>QUOTED, FAILED</td><td>None — no hold yet</td></tr>
            <tr><td>QUOTED</td><td>SCREEN_CLEAR, COMPLIANCE_HOLD</td><td>Cancel → terminal</td></tr>
            <tr><td>COMPLIANCE_HOLD</td><td>SCREEN_CLEAR, REJECTED</td><td>Wait <code>screening.case.resolved.v1</code></td></tr>
            <tr><td>SCREEN_CLEAR</td><td>FUNDS_HELD</td><td>Screen fail → C1 (never held)</td></tr>
            <tr><td>FUNDS_HELD</td><td>PAYOUT_SENT, CANCELLED</td><td>Release hold</td></tr>
            <tr><td>PAYOUT_SENT / IN_FLIGHT</td><td>SETTLED, FAILED</td><td>C2 rail reject → release hold</td></tr>
            <tr><td>SETTLED</td><td>— (terminal)</td><td>Reversal flow if required</td></tr>
            <tr><td>FAILED / REJECTED / CANCELLED</td><td>— (terminal)</td><td>Documented compensation executed</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="cash">Cash-in / cash-out states</h2>
      <ul>
        <li><strong>Cash-in:</strong> REQUESTED → SCREENED → CREDITED → RECEIPTED</li>
        <li><strong>Cash-out:</strong> REQUESTED → SCREENED → DEBITED → DISBURSED</li>
      </ul>
      <p>Workflows: <a href="/docs/workflows/cash-in/">Cash-in</a> · <a href="/docs/workflows/cash-out/">Cash-out</a></p>

      <h2 id="persistence">Persistence rules</h2>
      <ul>
        <li>Every transition writes a <code>saga_steps</code> row with attempt count and last error.</li>
        <li>Out-of-order retries converge via idempotency — state cannot skip forward illegally.</li>
        <li>IN_FLIGHT rail status resolved by status-inquiry job — never guessed as success.</li>
      </ul>

      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>

      <div class="footer-nav">
        <a href="/docs/fraud-controls/"><small>Previous</small><strong>Fraud Controls</strong></a>
        <a href="/docs/reversal-refund-chargeback/"><small>Next</small><strong>Reversal &amp; Refund</strong></a>
      </div>
    `,
  },

  "reversal-refund-chargeback": {
    title: "Reversal, Refund & Chargeback",
    lede: "Correcting completed or in-flight money movement without editing ledger history — equal-and-opposite postings and saga compensation.",
    body: `
      <div class="callout vocab-brief">
        <strong>Principle</strong> The ledger is append-only. Corrections are <strong>reversal journals</strong> linked to the original transaction id — never UPDATE or DELETE on postings.
      </div>

      <h2 id="types">Flow types</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Type</th><th>When</th><th>Mechanism</th></tr></thead>
          <tbody>
            <tr><td><strong>Saga compensation</strong></td><td>Before SETTLED — screen fail, rail reject</td><td><code>releaseHold</code> · no customer debit</td></tr>
            <tr><td><strong>Reversal</strong></td><td>After SETTLED — operator error, duplicate</td><td>Linked reversal journal · refund saga</td></tr>
            <tr><td><strong>Refund</strong></td><td>Customer request, failed service</td><td>Credit customer e-money or external payout</td></tr>
            <tr><td><strong>Chargeback</strong></td><td>Card dispute (deferred product)</td><td>Processor dispute webhook → hold or debit adjustment</td></tr>
          </tbody>
        </table>
      </div>

      <p>Workflow: <a href="/docs/workflows/reversal-refund/rr-request/">Reversal &amp; refund →</a></p>
      <div class="wf-embed" data-workflow="reversal-refund" data-view="overview"></div>

      <h2 id="idempotency">Duplicate prevention</h2>
      <p>Reversal requests carry their own <code>Idempotency-Key</code> and reference <code>originalTransferId</code>. Replay returns the same reversal id — prevents double refund.</p>

      <div class="footer-nav">
        <a href="/docs/transaction-states/"><small>Previous</small><strong>Transaction States</strong></a>
        <a href="/docs/ledger-vs-audit/"><small>Next</small><strong>Ledger vs Audit Log</strong></a>
      </div>
    `,
  },

  "ledger-vs-audit": {
    title: "Financial Ledger vs Audit Log",
    lede: "Two different immutability stories — the ledger records value; audit logs record who did what for attribution and compliance.",
    body: `
      <h2 id="compare">Side by side</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th></th><th>Financial ledger (Service 04)</th><th>Audit log (operational)</th></tr></thead>
          <tbody>
            <tr><td><strong>Purpose</strong></td><td>System of record for <strong>value</strong></td><td>System of record for <strong>actions &amp; attribution</strong></td></tr>
            <tr><td><strong>Store</strong></td><td>TigerBeetle + journal metadata (PostgreSQL)</td><td><code>audit_log</code>, <code>ops_audit</code>, adapter call logs</td></tr>
            <tr><td><strong>Mutability</strong></td><td>Append-only postings; reversals via new journals</td><td>Append-only inserts; no UPDATE</td></tr>
            <tr><td><strong>Reconciliation</strong></td><td>Balances, safeguarding, rail statements</td><td>Not used for balance recon</td></tr>
            <tr><td><strong>Regulatory use</strong></td><td>Financial reporting, safeguarding proof</td><td>STR evidence, operator accountability, agent attribution</td></tr>
            <tr class="trap"><td><strong>Trap</strong></td><td>Never infer balance from audit_log</td><td>Never post money based on audit_log alone</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="double-entry">Double-entry architecture</h2>
      <ul>
        <li>Every financial event produces balanced debit/credit postings.</li>
        <li>Holds are two-phase: PLACED → CAPTURED | RELEASED on TigerBeetle.</li>
        <li>Customer e-money balance = sum of postings on customer liability accounts.</li>
        <li>FX rate is input to posting — recorded in <code>display_meta</code> (ADR-0002).</li>
      </ul>
      <p>Deep dive: <a href="/docs/ledger/">Ledger capability guide</a></p>
      <div class="wf-embed" data-workflow="fund-transfer" data-view="pipeline"></div>

      <h2 id="idempotency">Financial idempotency</h2>
      <p>Every mutating API requires <code>Idempotency-Key</code> scoped to tenant. Ledger and payments converge on replay — same key returns same transfer/hold/journal ids. See <a href="/docs/idempotency-controls/">Idempotency &amp; Duplicate Prevention</a>.</p>

      <div class="footer-nav">
        <a href="/docs/reversal-refund-chargeback/"><small>Previous</small><strong>Reversal &amp; Refund</strong></a>
        <a href="/docs/idempotency-controls/"><small>Next</small><strong>Idempotency Controls</strong></a>
      </div>
    `,
  },

  "idempotency-controls": {
    title: "Idempotency & Duplicate Prevention",
    lede: "How the platform ensures the same financial request twice produces one outcome — keys, dedupe, and rail echo handling.",
    body: `
      <h2 id="api">API layer</h2>
      <ul>
        <li><code>Idempotency-Key</code> header required on every POST/PATCH that moves money or creates aggregates.</li>
        <li>Scoped per <code>tenant_id</code> + client — collision returns stored HTTP response body and status.</li>
        <li>BFF forwards key unchanged; domain services persist in <code>idempotency_records</code>.</li>
      </ul>

      <h2 id="ledger">Ledger layer</h2>
      <ul>
        <li>Hold placement keyed by business id — replay converges on same <code>hold_id</code>.</li>
        <li>TigerBeetle deterministic transfer ids per (holdId, phase).</li>
      </ul>

      <h2 id="rail">Rail / adapter layer</h2>
      <ul>
        <li>Raast / 1LINK: end-to-end id echoed in scheme message id.</li>
        <li>Duplicate webhook or callback deduped by <code>(rail, provider_ref)</code> unique index.</li>
        <li>IN_FLIGHT timeout → status inquiry — never second payout without inquiry result.</li>
      </ul>

      <h2 id="agent">Agent channel</h2>
      <p>Agent requests add <code>X-Agent-Id</code> but use the same idempotency rules — prevents double cash-in from double tap on agent terminal.</p>

      <div class="footer-nav">
        <a href="/docs/ledger-vs-audit/"><small>Previous</small><strong>Ledger vs Audit Log</strong></a>
        <a href="/docs/consent-authorization/"><small>Next</small><strong>Consent &amp; Authorization</strong></a>
      </div>
    `,
  },

  "consent-authorization": {
    title: "Consent & Authorization Controls",
    lede: "Customer consent, agent acting-on-behalf grants, and step-up authorization for high-risk operations.",
    body: `
      <h2 id="customer">Customer consent</h2>
      <ul>
        <li>E-Sign before credit bureau pull where pack requires it.</li>
        <li>Terms acceptance stored with version id and timestamp on customer record.</li>
        <li>Marketing / data processing consent flags — separate from payment authorization.</li>
      </ul>

      <h2 id="agent">Agent acting-on-behalf (AOB)</h2>
      <ul>
        <li>Grant records: agent_id, customer_id, product scope, expiry, consent flag where regulated.</li>
        <li>Every assisted mutation carries <code>X-Agent-Id</code> + AOB grant id in audit_log.</li>
        <li>Grant expiry enforced at BFF — expired grant ⇒ 403.</li>
      </ul>
      <p>Workflow: <a href="/docs/workflows/agent-assisted/ag-select/">Agent · Select customer</a></p>

      <h2 id="stepup">Step-up authorization</h2>
      <ul>
        <li>IdP adapter supports elevated <code>acr</code> for high-risk ops: beneficiary add, large transfer, cash-out above threshold.</li>
        <li>Pack-configured thresholds per market.</li>
      </ul>

      <div class="wf-embed" data-workflow="agent-assisted" data-view="overview"></div>

      <div class="footer-nav">
        <a href="/docs/idempotency-controls/"><small>Previous</small><strong>Idempotency</strong></a>
        <a href="/docs/settlement-reconciliation/"><small>Next</small><strong>Settlement &amp; Reconciliation</strong></a>
      </div>
    `,
  },

  "settlement-reconciliation": {
    title: "Settlement & Reconciliation",
    lede: "Matching ledger, payments, agent float, and rail statements — daily safeguarding proof and settlement cycles.",
    body: `
      <h2 id="three-way">Three-way match (payments)</h2>
      <ol>
        <li><strong>Ledger</strong> — journals, holds, safeguarding pool balance</li>
        <li><strong>Payments</strong> — transfer/bill state + payout references</li>
        <li><strong>Rail statements</strong> — Raast, 1LINK, partner files</li>
      </ol>

      <h2 id="agent">Agent settlement</h2>
      <ul>
        <li>Outlet float account reconciled to physical cash + pending cash-in/out.</li>
        <li>Commission accruals matched to <code>agent.action.v1</code> events.</li>
        <li>Supervisor hierarchy receives rolled-up settlement reports.</li>
      </ul>
      <p><a href="/docs/agent-float-settlement/">Agent float &amp; settlement →</a> · <a href="/docs/commission-settlement/">Commission settlement →</a></p>

      <h2 id="safeguarding">Safeguarding reconciliation</h2>
      <p>Daily job: sum(customer e-money liabilities) + agent float liabilities + in-transit = safeguarded pool per bank statement. Break ⇒ exception case.</p>

      <p>Exceptions: <a href="/docs/exception-management/">Exception Management</a></p>

      <div class="footer-nav">
        <a href="/docs/consent-authorization/"><small>Previous</small><strong>Consent</strong></a>
        <a href="/docs/exception-management/"><small>Next</small><strong>Exception Management</strong></a>
      </div>
    `,
  },

  "exception-management": {
    title: "Exception Management",
    lede: "Failed, unmatched, and ambiguous transactions — ops cases, not silent ledger drift.",
    body: `
      <h2 id="types">Exception types</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Type</th><th>Example</th><th>Owner</th></tr></thead>
          <tbody>
            <tr><td><strong>Unmatched rail item</strong></td><td>Raast settlement file row with no transfer id</td><td>Reconciliation ops</td></tr>
            <tr><td><strong>IN_FLIGHT timeout</strong></td><td>Payout sent, no pacs.002 within SLA</td><td>Payments + status inquiry job</td></tr>
            <tr><td><strong>Amount mismatch</strong></td><td>Ledger journal ≠ rail amount</td><td>Finance + engineering</td></tr>
            <tr><td><strong>Duplicate suspected</strong></td><td>Same amount/beneficiary within velocity window</td><td>Fraud ops</td></tr>
            <tr><td><strong>Agent float break</strong></td><td>Outlet cash ≠ float account</td><td>Agent network ops</td></tr>
            <tr><td><strong>Safeguarding break</strong></td><td>Pool ≠ liabilities</td><td>Compliance — P1</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="workflow">Ops workflow</h2>
      <ol>
        <li>Exception raised automatically from recon job or manual flag.</li>
        <li>Case assigned with priority; linked transaction ids frozen if needed.</li>
        <li>Investigation documented in ops_audit — maker-checker on financial adjustment.</li>
        <li>Resolution posts reversal/adjustment journal or marks external item matched.</li>
      </ol>

      <div class="callout warn">
        <strong>Status</strong> Reconciliation matching engine <span class="pill settled">not built</span> in pilot — specified as Service 09.
      </div>

      <div class="footer-nav">
        <a href="/docs/settlement-reconciliation/"><small>Previous</small><strong>Settlement</strong></a>
        <a href="/docs/rails-pk/"><small>Next</small><strong>1LINK &amp; Raast</strong></a>
      </div>
    `,
  },

  "rails-pk": {
    title: "1LINK & Raast Integration",
    lede: "Pakistan rail bindings — instant payments via Raast and interbank/bill connectivity via 1LINK where applicable.",
    body: `
      <h2 id="raast">Raast (instant payments)</h2>
      <ul>
        <li>Binding: <code>raast</code> · Adapter 19 · ISO 20022 pacs.008 / pacs.002.</li>
        <li>Use: PK→PK domestic payout, alias/IBAN validation, status inquiry on IN_FLIGHT.</li>
        <li>Settlement: rail statement → reconciliation Service 09.</li>
      </ul>
      <p>Stage: <a href="/docs/workflows/fund-transfer/ft-settle/">Fund Transfer · Settle</a></p>

      <h2 id="1link">1LINK</h2>
      <ul>
        <li>Use: interbank account verification, bill payment aggregation, legacy switch connectivity where pack enables.</li>
        <li>Bill pay saga may route biller confirm via 1LINK adapter (parallel to Raast for account-to-account).</li>
        <li>Idempotency: scheme reference echoed end-to-end; duplicate response deduped.</li>
      </ul>
      <p>Bill pay: <a href="/docs/workflows/bill-payments/bp-confirm/">Bill Payments · Confirm</a></p>

      <h2 id="flow">Combined flow (domestic send)</h2>
      <ol>
        <li>Customer initiates transfer in apps/web → BFF → payments saga.</li>
        <li>Screen + hold on ledger (TigerBeetle).</li>
        <li>Payout adapter selects Raast for PK→PK or 1LINK/partner per corridor config.</li>
        <li>Webhook/poll updates IN_FLIGHT → SETTLED or triggers compensation.</li>
      </ol>

      <div class="wf-embed" data-workflow="fund-transfer" data-view="overview"></div>

      <div class="footer-nav">
        <a href="/docs/exception-management/"><small>Previous</small><strong>Exceptions</strong></a>
        <a href="/docs/agent-float-settlement/"><small>Next</small><strong>Agent Float</strong></a>
      </div>
    `,
  },

  "agent-float-settlement": {
    title: "Agent Float & Outlet Settlement",
    lede: "How agents prefund outlets, serve cash-in/cash-out within float limits, and settle with the operator.",
    body: `
      <div class="callout vocab-brief">
        <strong>In brief</strong>
        <ul>
          <li><strong>Float</strong> — e-money prefunded to agent outlet ledger account before serving customers.</li>
          <li><strong>Hierarchy</strong> — supervisor → outlet → agent; limits roll up the chain.</li>
          <li><strong>Cash-in</strong> — customer cash → agent float debit → customer e-money credit (issuance).</li>
          <li><strong>Cash-out</strong> — customer e-money debit → agent float credit → cash disbursement (redemption).</li>
        </ul>
      </div>

      <h2 id="hierarchy">Hierarchy &amp; limits</h2>
      <div class="table-wrap vocab-table">
        <table>
          <thead><tr><th>Level</th><th>Responsibility</th><th>Limits</th></tr></thead>
          <tbody>
            <tr><td><strong>Supervisor / Distributor</strong></td><td>Prefunds outlets, resolves exceptions</td><td>Aggregate float ceiling</td></tr>
            <tr><td><strong>Outlet</strong></td><td>Physical location, cash handling</td><td>Daily cash-in/out caps, float min/max</td></tr>
            <tr><td><strong>Agent user</strong></td><td>Authenticated teller session</td><td>Per-transaction cap, AOB scope</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="float-cycle">Float lifecycle</h2>
      <ol>
        <li><strong>Prefund</strong> — operator transfers to outlet float account (<a href="/docs/workflows/agent-float/af-prefund/">Agent float · Prefund</a>).</li>
        <li><strong>Transact</strong> — cash-in/out moves value between customer and float.</li>
        <li><strong>Reconcile</strong> — end-of-day physical cash count vs float ledger.</li>
        <li><strong>Settle</strong> — net position with operator; commission deducted per scheme.</li>
      </ol>

      <div class="wf-embed" data-workflow="agent-float" data-view="overview"></div>

      <p>Assisted customer actions: <a href="/docs/agent-journeys/">Agent Journeys</a> · Consent: <a href="/docs/consent-authorization/">Consent &amp; Authorization</a></p>

      <div class="footer-nav">
        <a href="/docs/rails-pk/"><small>Previous</small><strong>1LINK &amp; Raast</strong></a>
        <a href="/docs/commission-settlement/"><small>Next</small><strong>Commission Settlement</strong></a>
      </div>
    `,
  },

  "commission-settlement": {
    title: "Commission Calculation & Settlement",
    lede: "How agent and outlet commissions are calculated from audited actions, accrued, and settled without bypassing the ledger.",
    body: `
      <h2 id="calc">Calculation</h2>
      <ul>
        <li>Commission schemes are <strong>pack configuration</strong> — version-pinned, never hard-coded.</li>
        <li>Trigger: successful assisted transaction after <code>audit_log</code> write.</li>
        <li>Event: <code>agent.action.v1</code> with product, amount, agent_id, outlet_id — PII minimised.</li>
        <li>Billing service computes fee/commission; posts accrual to operator commission payable account.</li>
      </ul>

      <h2 id="settlement">Settlement</h2>
      <ol>
        <li>Accrual period closes (daily/weekly per pack).</li>
        <li>Reconciliation matches events to completed transactions.</li>
        <li>Net commission journal: operator payable → agent/outlet settlement account or external payout.</li>
        <li>Disputes handled via exception case — never silent adjustment.</li>
      </ol>

      <p>Workflow stages: <a href="/docs/workflows/agent-assisted/ag-audit/">Audit &amp; commission</a> · <a href="/docs/workflows/agent-float/af-settle/">Agent float · Settle</a></p>

      <div class="callout">
        <strong>Rule</strong> Audit before commission. Commission metering never fires without immutable audit_log row for the underlying action.
      </div>

      <div class="footer-nav">
        <a href="/docs/agent-float-settlement/"><small>Previous</small><strong>Agent Float</strong></a>
        <a href="/docs/financial-reporting/"><small>Next</small><strong>Financial Reporting</strong></a>
      </div>
    `,
  },

  "financial-reporting": {
    title: "Financial & Regulatory Reporting",
    lede: "Reports sourced from ledger and case data — not channel caches — for management accounts and regulatory returns.",
    body: `
      <h2 id="financial">Financial reporting</h2>
      <ul>
        <li>E-money outstanding report — sum of customer liabilities by currency.</li>
        <li>Safeguarding reconciliation report — daily pool vs liabilities.</li>
        <li>Agent float outstanding — per outlet and hierarchy roll-up.</li>
        <li>Commission expense and revenue recognition from billing journals.</li>
        <li>FX provenance report — ADR-0002 display_meta on conversion journals.</li>
      </ul>

      <h2 id="regulatory">Regulatory reporting</h2>
      <ul>
        <li>STR/SAR (goAML-aligned) — Service 08, sourced from screening cases + transaction patterns.</li>
        <li>Transaction reporting thresholds per SBP / CBUAE / SAMA pack.</li>
        <li>Audit exports — immutable ledger extract + case disposition history.</li>
      </ul>

      <p>Related: <a href="/docs/compliance-reporting/">Compliance Reporting</a> · <a href="/docs/regulatory-governance/">Regulatory Governance</a></p>

      <div class="callout warn">
        <strong>Status</strong> Compliance reporting service <span class="pill settled">not built</span> in pilot backlog snapshot.
      </div>

      <div class="footer-nav">
        <a href="/docs/commission-settlement/"><small>Previous</small><strong>Commission</strong></a>
        <a href="/docs/start-here/"><small>Next</small><strong>Start Here</strong></a>
      </div>
    `,
  },
};
