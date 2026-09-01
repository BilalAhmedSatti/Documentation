/* Auto-generated nav — EMI / e-money menus + workflow stage submenus */
(function () {
  const SIDEBAR_HTML = `
    <a class="brand" href="/docs/where-we-stand/">
      <strong>Platform Docs</strong>
      <small>EMI / E-Money &amp; Remittance</small>
    </a>
    <input class="search" type="search" placeholder="Search" aria-label="Search" disabled title="Search coming later" />

    <div class="nav-group" data-group="Start here">
      <button type="button" class="nav-toggle" aria-expanded="true">Start here <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="start-here" href="/docs/start-here/">Start Here</a>
        <a data-page="where-we-stand" href="/docs/where-we-stand/">Where We Stand</a>
        <a data-page="money-model-correction" href="/docs/money-model-correction/">Money Model Correction</a>
        <a data-page="what-we-do-not-know" href="/docs/what-we-do-not-know/">What We Do Not Know</a>
        <a data-page="one-payment-followed" href="/docs/one-payment-followed/">One Payment, Followed</a>
      </div>
    </div>

    <div class="nav-group" data-group="The domain">
      <button type="button" class="nav-toggle" aria-expanded="true">The domain <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="why-digital-banking" href="/docs/why-digital-banking/">Why EMI / E-Money Exists</a>
        <a data-page="how-the-money-works" href="/docs/how-the-money-works/">How the Money Works</a>
        <a data-page="the-vocabulary" href="/docs/the-vocabulary/">The Vocabulary</a>
        <a data-page="who-governs-it" href="/docs/who-governs-it/">Who Governs It</a>
      </div>
    </div>

    <div class="nav-group" data-group="EMI & e-money">
      <button type="button" class="nav-toggle" aria-expanded="true">EMI &amp; e-money <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="emoney-overview" href="/docs/emoney-overview/">EMI &amp; E-Money Overview</a>
        <a data-page="emoney-lifecycle" href="/docs/emoney-lifecycle/">E-Money Account Lifecycle</a>
        <a data-page="emoney-issuance-redemption" href="/docs/emoney-issuance-redemption/">Issuance &amp; Redemption</a>
        <a data-page="safeguarding" href="/docs/safeguarding/">Safeguarding Architecture</a>
        <a data-page="limits-velocity" href="/docs/limits-velocity/">Limits &amp; Velocity Controls</a>
        <a data-page="fraud-controls" href="/docs/fraud-controls/">AML, KYC &amp; Fraud Controls</a>
        <a data-page="transaction-states" href="/docs/transaction-states/">Transaction State Machine</a>
        <a data-page="reversal-refund-chargeback" href="/docs/reversal-refund-chargeback/">Reversal, Refund &amp; Chargeback</a>
        <a data-page="ledger-vs-audit" href="/docs/ledger-vs-audit/">Ledger vs Audit Log</a>
        <a data-page="idempotency-controls" href="/docs/idempotency-controls/">Idempotency &amp; Duplicates</a>
        <a data-page="consent-authorization" href="/docs/consent-authorization/">Consent &amp; Authorization</a>
        <a data-page="settlement-reconciliation" href="/docs/settlement-reconciliation/">Settlement &amp; Reconciliation</a>
        <a data-page="exception-management" href="/docs/exception-management/">Exception Management</a>
        <a data-page="rails-pk" href="/docs/rails-pk/">1LINK &amp; Raast (PK)</a>
        <a data-page="agent-float-settlement" href="/docs/agent-float-settlement/">Agent Float &amp; Settlement</a>
        <a data-page="commission-settlement" href="/docs/commission-settlement/">Commission Settlement</a>
        <a data-page="financial-reporting" href="/docs/financial-reporting/">Financial &amp; Regulatory Reporting</a>
      </div>
    </div>

    <div class="nav-group" data-group="Digital Banking">
      <button type="button" class="nav-toggle" aria-expanded="true">Digital Banking <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="what-we-are-building" href="/docs/what-we-are-building/">What We Are Building</a>
        <a data-page="products-at-launch" href="/docs/products-at-launch/">Products at Launch</a>
        <a data-page="markets-tenancy" href="/docs/markets-tenancy/">Markets &amp; Tenancy</a>
        <a data-page="requirements" href="/docs/requirements/">Requirements &amp; Constraints</a>
      </div>
    </div>

    <div class="nav-group" data-group="Journeys">
      <button type="button" class="nav-toggle" aria-expanded="true">Journeys <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        
        <div class="nav-section nav-section--customer-journeys" data-section="customer-journeys">
          <div class="nav-section-row">
            <a data-page="customer-journeys" data-nav-section="customer-journeys" href="/docs/customer-journeys/">Customer Journeys<span class="nav-section-badge">33</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Customer Journeys"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <div class="nav-stage-group">Onboarding</div>
            <a class="depth-3" data-page="wf-onboarding-register-login" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/register-login/">01 - Register / Login</a>
            <a class="depth-3" data-page="wf-onboarding-auth-persist" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/auth-persist/">02 - Auth credentials saved</a>
            <a class="depth-3" data-page="wf-onboarding-control-plane" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/control-plane/">03 - Load market rules</a>
            <a class="depth-3" data-page="wf-onboarding-customer-register" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/customer-register/">04 - Create customer record</a>
            <a class="depth-3" data-page="wf-onboarding-screening-save" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/screening-save/">05 - AML screen persisted</a>
            <a class="depth-3" data-page="wf-onboarding-ekyc-persist" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/ekyc-persist/">06 - eKYC evidence &amp; case</a>
            <a class="depth-3" data-page="wf-onboarding-tier-persist" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/tier-persist/">07 - Risk tier written</a>
            <a class="depth-3" data-page="wf-onboarding-wallet-ledger" data-nav-section="customer-journeys" href="/docs/workflows/onboarding/wallet-ledger/">08 - Wallet + TigerBeetle accounts</a>
            <div class="nav-stage-group">Cash In</div>
            <a class="depth-3" data-page="wf-cash-in-ci-initiate" data-nav-section="customer-journeys" href="/docs/workflows/cash-in/ci-initiate/">01 - Initiate cash-in</a>
            <a class="depth-3" data-page="wf-cash-in-ci-screen" data-nav-section="customer-journeys" href="/docs/workflows/cash-in/ci-screen/">02 - Screen &amp; limits</a>
            <a class="depth-3" data-page="wf-cash-in-ci-credit" data-nav-section="customer-journeys" href="/docs/workflows/cash-in/ci-credit/">03 - Issue e-money</a>
            <a class="depth-3" data-page="wf-cash-in-ci-receipt" data-nav-section="customer-journeys" href="/docs/workflows/cash-in/ci-receipt/">04 - Receipt &amp; event</a>
            <div class="nav-stage-group">Cash Out</div>
            <a class="depth-3" data-page="wf-cash-out-co-initiate" data-nav-section="customer-journeys" href="/docs/workflows/cash-out/co-initiate/">01 - Initiate cash-out</a>
            <a class="depth-3" data-page="wf-cash-out-co-screen" data-nav-section="customer-journeys" href="/docs/workflows/cash-out/co-screen/">02 - Screen &amp; limits</a>
            <a class="depth-3" data-page="wf-cash-out-co-debit" data-nav-section="customer-journeys" href="/docs/workflows/cash-out/co-debit/">03 - Redeem e-money</a>
            <a class="depth-3" data-page="wf-cash-out-co-disburse" data-nav-section="customer-journeys" href="/docs/workflows/cash-out/co-disburse/">04 - Disburse cash</a>
            <div class="nav-stage-group">Fund Transfer</div>
            <a class="depth-3" data-page="wf-fund-transfer-ft-initiate" data-nav-section="customer-journeys" href="/docs/workflows/fund-transfer/ft-initiate/">01 - Initiate transfer</a>
            <a class="depth-3" data-page="wf-fund-transfer-ft-quote" data-nav-section="customer-journeys" href="/docs/workflows/fund-transfer/ft-quote/">02 - Price quote</a>
            <a class="depth-3" data-page="wf-fund-transfer-ft-screen" data-nav-section="customer-journeys" href="/docs/workflows/fund-transfer/ft-screen/">03 - Transaction screen</a>
            <a class="depth-3" data-page="wf-fund-transfer-ft-hold" data-nav-section="customer-journeys" href="/docs/workflows/fund-transfer/ft-hold/">04 - Place funds hold</a>
            <a class="depth-3" data-page="wf-fund-transfer-ft-settle" data-nav-section="customer-journeys" href="/docs/workflows/fund-transfer/ft-settle/">05 - Payout &amp; settle</a>
            <div class="nav-stage-group">Bill Payments</div>
            <a class="depth-3" data-page="wf-bill-payments-bp-select" data-nav-section="customer-journeys" href="/docs/workflows/bill-payments/bp-select/">01 - Select biller</a>
            <a class="depth-3" data-page="wf-bill-payments-bp-create" data-nav-section="customer-journeys" href="/docs/workflows/bill-payments/bp-create/">02 - Create bill payment</a>
            <a class="depth-3" data-page="wf-bill-payments-bp-debit" data-nav-section="customer-journeys" href="/docs/workflows/bill-payments/bp-debit/">03 - Ledger debit</a>
            <a class="depth-3" data-page="wf-bill-payments-bp-confirm" data-nav-section="customer-journeys" href="/docs/workflows/bill-payments/bp-confirm/">04 - Confirm &amp; receipt</a>
            <div class="nav-stage-group">Debit Cards</div>
            <a class="depth-3" data-page="wf-debit-cards-dc-request" data-nav-section="customer-journeys" href="/docs/workflows/debit-cards/dc-request/">01 - Request card</a>
            <a class="depth-3" data-page="wf-debit-cards-dc-issue" data-nav-section="customer-journeys" href="/docs/workflows/debit-cards/dc-issue/">02 - Issue tokenised card</a>
            <a class="depth-3" data-page="wf-debit-cards-dc-activate" data-nav-section="customer-journeys" href="/docs/workflows/debit-cards/dc-activate/">03 - Activate card</a>
            <a class="depth-3" data-page="wf-debit-cards-dc-auth" data-nav-section="customer-journeys" href="/docs/workflows/debit-cards/dc-auth/">04 - Authorize (webhook)</a>
            <div class="nav-stage-group">Reversal &amp; Refund</div>
            <a class="depth-3" data-page="wf-reversal-refund-rr-request" data-nav-section="customer-journeys" href="/docs/workflows/reversal-refund/rr-request/">01 - Reversal request</a>
            <a class="depth-3" data-page="wf-reversal-refund-rr-approve" data-nav-section="customer-journeys" href="/docs/workflows/reversal-refund/rr-approve/">02 - Approve (if required)</a>
            <a class="depth-3" data-page="wf-reversal-refund-rr-ledger" data-nav-section="customer-journeys" href="/docs/workflows/reversal-refund/rr-ledger/">03 - Post reversal journal</a>
            <a class="depth-3" data-page="wf-reversal-refund-rr-complete" data-nav-section="customer-journeys" href="/docs/workflows/reversal-refund/rr-complete/">04 - Complete &amp; notify</a>
          </div>
        </div>
        
        <div class="nav-section nav-section--corporate-journeys" data-section="corporate-journeys">
          <div class="nav-section-row">
            <a data-page="corporate-journeys" data-nav-section="corporate-journeys" href="/docs/corporate-journeys/">Corporate Journeys<span class="nav-section-badge">6</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Corporate Journeys"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <a class="depth-3" data-page="wf-corporate-kyb-ck-register" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-register/">01 - Register business</a>
            <a class="depth-3" data-page="wf-corporate-kyb-ck-ubo" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-ubo/">02 - Capture UBOs</a>
            <a class="depth-3" data-page="wf-corporate-kyb-ck-edd" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-edd/">03 - Enhanced due diligence</a>
            <a class="depth-3" data-page="wf-corporate-kyb-ck-screen" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-screen/">04 - Screen business</a>
            <a class="depth-3" data-page="wf-corporate-kyb-ck-tier" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-tier/">05 - Business risk tier</a>
            <a class="depth-3" data-page="wf-corporate-kyb-ck-activate" data-nav-section="corporate-journeys" href="/docs/workflows/corporate-kyb/ck-activate/">06 - Activate business accounts</a>
          </div>
        </div>
        
        <div class="nav-section nav-section--agent-journeys" data-section="agent-journeys">
          <div class="nav-section-row">
            <a data-page="agent-journeys" data-nav-section="agent-journeys" href="/docs/agent-journeys/">Agent Journeys<span class="nav-section-badge">8</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Agent Journeys"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <div class="nav-stage-group">Agent Assisted</div>
            <a class="depth-3" data-page="wf-agent-assisted-ag-login" data-nav-section="agent-journeys" href="/docs/workflows/agent-assisted/ag-login/">01 - Agent login</a>
            <a class="depth-3" data-page="wf-agent-assisted-ag-select" data-nav-section="agent-journeys" href="/docs/workflows/agent-assisted/ag-select/">02 - Select customer</a>
            <a class="depth-3" data-page="wf-agent-assisted-ag-action" data-nav-section="agent-journeys" href="/docs/workflows/agent-assisted/ag-action/">03 - Perform action</a>
            <a class="depth-3" data-page="wf-agent-assisted-ag-audit" data-nav-section="agent-journeys" href="/docs/workflows/agent-assisted/ag-audit/">04 - Audit &amp; commission</a>
            <div class="nav-stage-group">Agent Float</div>
            <a class="depth-3" data-page="wf-agent-float-af-prefund" data-nav-section="agent-journeys" href="/docs/workflows/agent-float/af-prefund/">01 - Prefund outlet</a>
            <a class="depth-3" data-page="wf-agent-float-af-transact" data-nav-section="agent-journeys" href="/docs/workflows/agent-float/af-transact/">02 - Float movements</a>
            <a class="depth-3" data-page="wf-agent-float-af-reconcile" data-nav-section="agent-journeys" href="/docs/workflows/agent-float/af-reconcile/">03 - EOD reconciliation</a>
            <a class="depth-3" data-page="wf-agent-float-af-settle" data-nav-section="agent-journeys" href="/docs/workflows/agent-float/af-settle/">04 - Settle with operator</a>
          </div>
        </div>
        
        <div class="nav-section nav-section--operator-journeys" data-section="operator-journeys">
          <div class="nav-section-row">
            <a data-page="operator-journeys" data-nav-section="operator-journeys" href="/docs/operator-journeys/">Operator Journeys<span class="nav-section-badge">8</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Operator Journeys"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <div class="nav-stage-group">Screening &amp; AML</div>
            <a class="depth-3" data-page="wf-screening-aml-sa-request" data-nav-section="operator-journeys" href="/docs/workflows/screening-aml/sa-request/">01 - Screening request</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-provider" data-nav-section="operator-journeys" href="/docs/workflows/screening-aml/sa-provider/">02 - Provider screen</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-case" data-nav-section="operator-journeys" href="/docs/workflows/screening-aml/sa-case/">03 - Open case</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-dispose" data-nav-section="operator-journeys" href="/docs/workflows/screening-aml/sa-dispose/">04 - Disposition</a>
            <div class="nav-stage-group">Tenant Operations</div>
            <a class="depth-3" data-page="wf-tenant-ops-to-provision" data-nav-section="operator-journeys" href="/docs/workflows/tenant-ops/to-provision/">01 - Provision tenant</a>
            <a class="depth-3" data-page="wf-tenant-ops-to-pack" data-nav-section="operator-journeys" href="/docs/workflows/tenant-ops/to-pack/">02 - Attach market pack</a>
            <a class="depth-3" data-page="wf-tenant-ops-to-brand" data-nav-section="operator-journeys" href="/docs/workflows/tenant-ops/to-brand/">03 - Branding &amp; entitlements</a>
            <a class="depth-3" data-page="wf-tenant-ops-to-audit" data-nav-section="operator-journeys" href="/docs/workflows/tenant-ops/to-audit/">04 - Ops audit</a>
          </div>
        </div>
        
        <div class="nav-section nav-section--platform-external" data-section="platform-external">
          <div class="nav-section-row">
            <a data-page="platform-external" data-nav-section="platform-external" href="/docs/platform-external/">Platform &amp; External<span class="nav-section-badge">5</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Platform &amp; External"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <a class="depth-3" data-page="wf-market-adapters-ma-port" data-nav-section="platform-external" href="/docs/workflows/market-adapters/ma-port/">01 - Port invocation</a>
            <a class="depth-3" data-page="wf-market-adapters-ma-translate" data-nav-section="platform-external" href="/docs/workflows/market-adapters/ma-translate/">02 - Translate payload</a>
            <a class="depth-3" data-page="wf-market-adapters-ma-provider" data-nav-section="platform-external" href="/docs/workflows/market-adapters/ma-provider/">03 - Provider request</a>
            <a class="depth-3" data-page="wf-market-adapters-ma-normalise" data-nav-section="platform-external" href="/docs/workflows/market-adapters/ma-normalise/">04 - Normalise &amp; persist</a>
            <a class="depth-3" data-page="wf-market-adapters-ma-resume" data-nav-section="platform-external" href="/docs/workflows/market-adapters/ma-resume/">05 - Resume domain saga</a>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-group" data-group="Capability guides">
      <button type="button" class="nav-toggle" aria-expanded="true">Capability guides <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        
        <div class="nav-section nav-section--identity-kyc-aml" data-section="identity-kyc-aml">
          <div class="nav-section-row">
            <a data-page="identity-kyc-aml" data-nav-section="identity-kyc-aml" href="/docs/identity-kyc-aml/">Identity, KYC &amp; AML<span class="nav-section-badge">4</span></a>
            <button type="button" class="nav-section-toggle" aria-expanded="true" aria-label="Toggle Identity, KYC &amp; AML"><span class="chev" aria-hidden="true"></span></button>
          </div>
          <div class="nav-section-sub">
            <a class="depth-3" data-page="wf-screening-aml-sa-request" data-nav-section="identity-kyc-aml" href="/docs/workflows/screening-aml/sa-request/">01 - Screening request</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-provider" data-nav-section="identity-kyc-aml" href="/docs/workflows/screening-aml/sa-provider/">02 - Provider screen</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-case" data-nav-section="identity-kyc-aml" href="/docs/workflows/screening-aml/sa-case/">03 - Open case</a>
            <a class="depth-3" data-page="wf-screening-aml-sa-dispose" data-nav-section="identity-kyc-aml" href="/docs/workflows/screening-aml/sa-dispose/">04 - Disposition</a>
          </div>
        </div>
        <a data-page="pricing-quotes" href="/docs/pricing-quotes/">Pricing &amp; Quotes</a>
        <a data-page="wallets-accounts" href="/docs/wallets-accounts/">Wallets &amp; Accounts</a>
        <a data-page="payments-rails" href="/docs/payments-rails/">Payments &amp; Rails</a>
        <a data-page="money-and-holds" href="/docs/money-and-holds/">Money &amp; Holds</a>
        <a data-page="ledger" href="/docs/ledger/">Ledger</a>
        <a data-page="reconciliation" href="/docs/reconciliation/">Reconciliation</a>
        <a data-page="regulatory-governance" href="/docs/regulatory-governance/">Regulatory Governance</a>
        <a data-page="compliance-reporting" href="/docs/compliance-reporting/">Compliance Reporting</a>
        <a data-page="api-integration" href="/docs/api-integration/">The API &amp; Integration Surface</a>
        <a data-page="billing-metering" href="/docs/billing-metering/">Billing &amp; Metering</a>
      </div>
    </div>

    <div class="nav-group" data-group="Architecture">
      <button type="button" class="nav-toggle" aria-expanded="true">Architecture <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="system-architecture" href="/docs/system-architecture/">System Architecture</a>
        <a data-page="data-design" href="/docs/data-design/">Data Design</a>
        <a data-page="experience-architecture" href="/docs/experience-architecture/">Experience Architecture</a>
        <a data-page="platform-anatomy" href="/docs/platform-anatomy/">Platform Anatomy</a>
        <a data-page="end-to-end-map" href="/docs/end-to-end-map/">The End-to-End Map</a>
      </div>
    </div>

    <div class="nav-group" data-group="Technology">
      <button type="button" class="nav-toggle" aria-expanded="true">Technology <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="technology-choices" href="/docs/technology-choices/">Technology Choices</a>
        <a data-page="infrastructure-cost" href="/docs/infrastructure-cost/">Infrastructure &amp; Cost</a>
        <a data-page="delivery" href="/docs/delivery/">Delivery</a>
      </div>
    </div>

    <div class="nav-group" data-group="Cross-cutting">
      <button type="button" class="nav-toggle" aria-expanded="true">Cross-cutting <span class="chev" aria-hidden="true"></span></button>
      <div class="nav-sub">
        <a data-page="decisions" href="/docs/decisions/">Decisions</a>
        <a data-page="measured-against" href="/docs/measured-against/">Measured Against Peers</a>
        <a data-page="build-backlog" href="/docs/build-backlog/">Build Backlog</a>
        <a data-page="design-system" href="/docs/design-system/">Design System</a>
        <a data-page="banking-compendium" href="/docs/banking-compendium/">The Banking Compendium</a>
      </div>
    </div>
  `;

  function renderToc() {
    const headings = [...document.querySelectorAll(".article h2[id], .article h3[id]")];
    if (!headings.length) return "";
    return `
      <div class="toc-label">On this page</div>
      ${headings.map((h) => `<a href="#${h.id}">${h.textContent}</a>`).join("")}
    `;
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
      if (!sidebar.querySelector(`a.depth-3[data-page="${active}"]`)) {
        a.classList.add("active");
      }
    });

    if (active.startsWith("wf-") && activeSection && !sidebar.querySelector("a.depth-3.active")) {
      const parent = sidebar.querySelector(`.nav-section[data-section="${activeSection}"] .nav-section-row > a`);
      parent?.classList.add("active");
    }

    sidebar.querySelectorAll(".nav-section").forEach((section) => {
      const sid = section.dataset.section;
      const wfInSection = activeWf && !!section.querySelector(`a[data-page^="wf-${activeWf}-"]`);
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
