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

        <section class="journey-panel journey-panel--slate" id="kyc-j1-j19">
          <h2>Master KYC &amp; Onboarding Journeys Registry (J1–J19)</h2>
          <p>J1 is the shared onboarding spine. All other journeys are named operational branches of the single EMI wallet lifecycle. Each card specifies the customer flow, operational controls, system invariants, and regulatory rules.</p>

          <div class="kyc-journey-grid" style="display: grid; gap: 20px; margin-top: 20px;">
            <!-- J1 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #059669; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #34d399;">J1 · Clean Biometric Onboarding</h3>
                <span class="pill" style="background: #059669; color: #fff;">Onboarding Spine</span>
              </div>
              <p><strong>Summary:</strong> Resident CNIC holder completes digital onboarding on a first device. NADRA Biometric succeeds, pre-screening is clear, risk is not high, 2-hour cooling-off completes, and an e-money wallet is issued at the biometric limit band (PKR 400,000 monthly load cap).</p>
              <p><strong>Outcome:</strong> <code>WALLET_ACTIVE</code> at biometric limits. Wallet number assigned only after BV + Pre-Screen + CDD + 2-hr cooling-off.</p>
              <p><strong>Regulations:</strong> CCOF B, D, F, I, J, K · EMI 12 &amp; 14.II · AML CDD · BPRD 04 A via CCOF K.</p>
              <div style="background: #0f172a; padding: 12px; border-radius: 4px; margin-top: 10px;">
                <strong style="color: #cbd5e1;">Customer Step-by-Step:</strong>
                <ol style="margin: 6px 0 0 18px; padding: 0; color: #94a3b8; font-size: 13px;">
                  <li>Opens app; product explained in English/Urdu; app does not reveal if wallet exists (BPRD 04 A.ix).</li>
                  <li>Enters mobile, completes short-code OTP/2FA, device bound.</li>
                  <li>Accepts terms &amp; fee schedule; notified session can be saved 30 days (J7).</li>
                  <li>Receives session tracking ID by SMS/email (<code>APPLICATION_STARTED</code>).</li>
                  <li>Enters national data (CCOF Table-A ∪ EMI 12.I, including 2 non-face CNIC fields). Uploads live CNIC + selfie/liveness.</li>
                  <li>Completes in-app NADRA biometric verification. Shown verified.</li>
                  <li>Notified of 2-hour cooling-off delay; wallet activates after 2 hours at PKR 400,000 limit band.</li>
                </ol>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px; color: #cbd5e1;">
                <div><strong>Ops Controls:</strong> Confirm CNIC class may onboard digitally; verify BV came from NADRA (not local selfie match); verify pre-screen used current UNSC &amp; ATA lists; no human override on J1.</div>
                <div><strong>System Invariants:</strong> <code>APPLICATION_STARTED</code> tracking ID exists before NADRA call; customer claims stored separately from NADRA payload; <code>WALLET_ACTIVE</code> issued only after 4 gates pass.</div>
              </div>
            </div>

            <!-- J2 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #1b6b93; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #38bdf8;">J2 · Biometric Not Possible (Verisys Fallback)</h3>
                <span class="pill" style="background: #1b6b93; color: #fff;">Onboarding Spine</span>
              </div>
              <p><strong>Summary:</strong> NADRA BV is not possible for an SBP-listed genuine reason (age &gt; 60, permanent disability, unclear prints, or NRP/POC abroad until BV exists). The remote ladder requires Verisys + CNIC–MSISDN pairing + OTP or call-back, with live photo. Not a convenience skip.</p>
              <p><strong>Outcome:</strong> <code>WALLET_ACTIVE</code> at Verisys limits (monthly load PKR 50,000; cash withdrawal PKR 10,000/day). Written reason logged.</p>
              <p><strong>Regulations:</strong> CCOF F.1.iv–v.a–b · EMI 12 &amp; 14.II.a–b · BPRD 04 alternate controls.</p>
              <div style="background: #0f172a; padding: 12px; border-radius: 4px; margin-top: 10px;">
                <strong style="color: #cbd5e1;">Customer Step-by-Step:</strong>
                <ol style="margin: 6px 0 0 18px; padding: 0; color: #94a3b8; font-size: 13px;">
                  <li>Reaches biometric; capture fails or declared eligible SBP reason applies.</li>
                  <li>Told alternate verification used and limits capped at PKR 50,000 until BV completed.</li>
                  <li>NADRA Verisys demographic check executes against CNIC.</li>
                  <li>CNIC–MSISDN SIM pairing checked with telco; completes OTP or randomised call-back.</li>
                  <li>2-hour cooling-off, then activation at Verisys band with upgrade path via J13.</li>
                </ol>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px; color: #cbd5e1;">
                <div><strong>Ops Controls:</strong> Record genuine reason code ("customer skipped" is invalid); call-back uses negative step-wise confirmations; failure routes to human agent.</div>
                <div><strong>System Invariants:</strong> <code>VERISYS_PASSED</code> requires Verisys + pairing + OTP/call-back all true; store BV-not-possible reason code; limit engine reads verification strength.</div>
              </div>
            </div>

            <!-- J3 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #d97706; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #fbbf24;">J3 · Verisys with Debit Block</h3>
                <span class="pill" style="background: #d97706; color: #fff;">Restricted State</span>
              </div>
              <p><strong>Summary:</strong> BV and Verisys+pairing+OTP have not both succeeded, but Verisys itself passed. CCOF allows opening instrument in restricted <code>DEBIT_BLOCKED</code> state until BV or full J2 completes.</p>
              <p><strong>Outcome:</strong> Instrument opened with <code>DEBIT_BLOCKED</code>. Zero debits, cash-out, P2P, or merchant pay. If never verified, close and consider STR (EMI 12.IV).</p>
              <p><strong>Regulations:</strong> CCOF F.1.v.c · EMI 12.III &amp; 12.IV · AML incomplete CDD.</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px; color: #cbd5e1;">
                <div><strong>Ops Controls:</strong> Compliance control—payments engine MUST fail closed; if verification never completes, close account and evaluate STR.</div>
                <div><strong>System Invariants:</strong> <code>DEBIT_BLOCKED</code> flag passed to wallets &amp; payments; any debit attempt logs <code>DEBIT_BLOCK_KYC</code>.</div>
              </div>
            </div>

            <!-- J4 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #7c3aed; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #a78bfa;">J4 · Remote Methods Fail (Video KYC / Partner)</h3>
                <span class="pill" style="background: #7c3aed; color: #fff;">Onboarding Fallback</span>
              </div>
              <p><strong>Summary:</strong> BV, J2, and Rung C debit block failed to verify customer. CCOF requires recorded video KYC + Verisys with reasons, or third-party bank reliance. Agents must not issue e-money instruments (EMI 17.VII).</p>
              <p><strong>Outcome:</strong> <code>VIDEO_KYC</code> completed and wallet decision follows strength, or partner bank reliance, or J8 decline.</p>
              <p><strong>Regulations:</strong> CCOF F.1.v.d–f &amp; G.2 · EMI 12.V &amp; 17.VII · AML CDD.</p>
            </div>

            <!-- J5 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #b91c1c; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #f87171;">J5 · Sanctions or Proscribed-Person Hit</h3>
                <span class="pill" style="background: #b91c1c; color: #fff;">Hard Stop / Gate</span>
              </div>
              <p><strong>Summary:</strong> Pre-screening finds applicant or associated person on UNSC designated lists or ATA 1997 proscribed lists. Services MUST NOT be provided. Zero tipping-off. Screening Moment 1 of 4.</p>
              <p><strong>Outcome:</strong> <code>DECLINED</code> / relationship refused. Possible STR to FMU. Zero tipping-off; generic customer decline text.</p>
              <p><strong>Regulations:</strong> CCOF F.4 · EMI 12.III, IX, X · AML TFS · STR · Tipping-off prohibition.</p>
            </div>

            <!-- J6 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #b0892e; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #fde047;">J6 · High-Risk Customer (Enhanced Due Diligence - EDD)</h3>
                <span class="pill" style="background: #b0892e; color: #fff;">EDD Gate</span>
              </div>
              <p><strong>Summary:</strong> Customer Risk Profile (CRP) rates applicant HIGH risk. EDD applies: additional evidence (source of funds/wealth), recorded video KYC, and senior management approval required before activation.</p>
              <p><strong>Outcome:</strong> <code>EDD_APPROVED</code> and senior sign-off to onboard — or J8 decline if EDD refused.</p>
              <p><strong>Regulations:</strong> CCOF G · EMI 12.V · AML EDD.</p>
            </div>

            <!-- J7 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #0ea5e9; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #38bdf8;">J7 · Save and Resume Within 30 Days</h3>
                <span class="pill" style="background: #0ea5e9; color: #fff;">Session Rule</span>
              </div>
              <p><strong>Summary:</strong> Online application saves ongoing session server-side, resumable up to 30 days using the same tracking ID without restarting. After 30 days, status becomes <code>EXPIRED</code>.</p>
              <p><strong>Regulations:</strong> CCOF J.iii, J.iv, I, K.iv · BPRD 04 re-auth.</p>
            </div>

            <!-- J8 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #64748b; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #94a3b8;">J8 · Decline with Written Reason</h3>
                <span class="pill" style="background: #64748b; color: #fff;">Terminal Outcome</span>
              </div>
              <p><strong>Summary:</strong> Terminal negative outcome produces specific written reason in English and Urdu, retains tracking ID for lookup, and complies with TAT communication rules.</p>
              <p><strong>Regulations:</strong> CCOF I.2–I.4 · EMI 12.IV · AML incomplete CDD · No tipping-off.</p>
            </div>

            <!-- J9 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #0891b2; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #22d3ee;">J9 · New Device After Onboarding</h3>
                <span class="pill" style="background: #0891b2; color: #fff;">Lifecycle Security</span>
              </div>
              <p><strong>Summary:</strong> Registered customer accessing from new phone must complete NADRA BV, receive immediate alerts on old channels, wait 2-hour cooling-off, and register device fingerprint (BPRD 04).</p>
              <p><strong>Regulations:</strong> BPRD 04 A.i.b, A.iii, A.v–viii · CCOF K.</p>
            </div>

            <!-- J10 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #be185d; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #f472b6;">J10 · Continuous Screening &amp; Transaction Monitoring</h3>
                <span class="pill" style="background: #be185d; color: #fff;">Ongoing Compliance</span>
              </div>
              <p><strong>Summary:</strong> Post-issuance list updates, periodic re-screens, and transaction monitoring rules detect sanctions matches or fraud anomalies. Instantly sets <code>MONITORING_HOLD</code>. Fail closed on provider error.</p>
              <p><strong>Regulations:</strong> AML ongoing monitoring · EMI 12.IX–X · BPRD 04 D · 10-year records.</p>
            </div>

            <!-- J11 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #ea580c; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #fb923c;">J11 · Provider Timeout (Fail Closed)</h3>
                <span class="pill" style="background: #ea580c; color: #fff;">Fail-Closed Gate</span>
              </div>
              <p><strong>Summary:</strong> External provider (NADRA, screening, SMS/OTP) times out or fails. System MUST NOT auto-approve. Status maps to <code>VERIFICATION_PENDING</code>. Customer queued for retry.</p>
              <p><strong>Regulations:</strong> AML complete CDD requirement · CCOF TAT discrepancy notice · EMI 12.III.</p>
            </div>

            <!-- J12 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #4338ca; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #818cf8;">J12 · Duplicate CNIC (Max 1 Wallet Per EMI)</h3>
                <span class="pill" style="background: #4338ca; color: #fff;">Uniqueness Invariant</span>
              </div>
              <p><strong>Summary:</strong> CNIC holder may obtain only ONE active e-money instrument per EMI (EMI 12.VII). Prevents account enumeration by returning generic response to unauthenticated requests.</p>
              <p><strong>Regulations:</strong> EMI 12.VII · BPRD 04 A.ix enumeration control.</p>
            </div>

            <!-- J13 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #0f766e; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #2dd4bf;">J13 · Limit / Category Upgrade</h3>
                <span class="pill" style="background: #0f766e; color: #fff;">Category Upgrade</span>
              </div>
              <p><strong>Summary:</strong> Wallet category change (Verisys → Biometric → Enhanced PKR 1,000,000) requires re-verification and re-screening. Enhanced band requires 1 Annexure-J document, CNIC–SIM pairing, in-house TMS, and detailed CRP. 2-hour cooling-off applies.</p>
              <p><strong>Regulations:</strong> CCOF F.1 · EMI 14.II–III &amp; 14.VI · Annexure-J · BPRD 04 cooling-off.</p>
            </div>

            <!-- J14 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #0369a1; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #38bdf8;">J14 · Mobile, Email or Password Change</h3>
                <span class="pill" style="background: #0369a1; color: #fff;">Credential Control</span>
              </div>
              <p><strong>Summary:</strong> Modification of registered mobile, email, or password requires NADRA BV from registered device, short-code OTP, alerts to old channels, and 2-hour cooling-off (BPRD 04 via CCOF K).</p>
              <p><strong>Regulations:</strong> BPRD 04 A.i.c, A.iii, A.viii · CCOF K.i.b &amp; F.1.</p>
            </div>

            <!-- J15 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #a21caf; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #f0abfc;">J15 · Parent-Linked Minor Wallet</h3>
                <span class="pill" style="background: #a21caf; color: #fff;">Minor Product</span>
              </div>
              <p><strong>Summary:</strong> EMI §14.IV–V allows minor wallet ONLY when opened inside authenticated parent/guardian's app. Guardian signs undertaking. Basic minor: Verisys, 50k cap, funded ONLY from parent wallet. Adult 1m limits do not apply to minors.</p>
              <p><strong>Regulations:</strong> EMI 14.IV–V · EMI 12 CDD for both · CCOF associated-person CDD &amp; screening.</p>
            </div>

            <!-- J16 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #57534e; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #d6d3d1;">J16 · Close, Redeem, Release CNIC</h3>
                <span class="pill" style="background: #57534e; color: #fff;">Redemption / Exit</span>
              </div>
              <p><strong>Summary:</strong> EMI §15 requires e-money redemption at par without closure charges. NADRA BV required for cash redemption. 10-year record retention enforced after closure.</p>
              <p><strong>Regulations:</strong> EMI 15.I–III &amp; 12.IV &amp; 24.II · AML exit CDD · 10-year retention.</p>
            </div>

            <!-- J17 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #c2410c; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #ff8800;">J17 · Periodic CDD / Expired CNIC</h3>
                <span class="pill" style="background: #c2410c; color: #fff;">CDD Refresh</span>
              </div>
              <p><strong>Summary:</strong> Timed CCOF obligations (CNIC expiry, expired ID + token 3-month window, address change, periodic risk review) require identity data refresh and re-screening (Screening Moment 3).</p>
              <p><strong>Regulations:</strong> AML ongoing CDD · CCOF Table-A footnote · EMI 12.I live ID.</p>
            </div>

            <!-- J18 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #1d4ed8; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #60a5fa;">J18 · Non-Resident / Foreign IDs (NICOP, POC, ARC, POR, NRP)</h3>
                <span class="pill" style="background: #1d4ed8; color: #fff;">Overseas / Foreign ID</span>
              </div>
              <p><strong>Summary:</strong> CCOF C.5 enables digital onboarding for NICOP, POC, POR, or ARC holders. Non-Resident Pakistanis (NRP) abroad use Verisys exception until NADRA BV abroad exists. Not an RDA account.</p>
              <p><strong>Regulations:</strong> CCOF C.5 &amp; F.1.iv.b · EMI 12.I · AML residency &amp; tax (FATCA/CRS).</p>
            </div>

            <!-- J19 -->
            <div class="kyc-card" style="background: #1e293b; border-left: 4px solid #9a3412; padding: 18px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; color: #fb923c;">J19 · Cash-In / Cash-Out at Till or ATM</h3>
                <span class="pill" style="background: #9a3412; color: #fff;">Cash Operations</span>
              </div>
              <p><strong>Summary:</strong> Street cash deposit (cash-in) at agent till requires NADRA BV (CCOF/BPRD). ATM cash-out requires 2FA (EMI 14.II.d). Agent cash-out requires BV or 2FA where BVS is constrained. IBFT load is 15.II.a.</p>
              <p><strong>Regulations:</strong> EMI 14.II.d &amp; 15.II.a · CCOF BVS at agent till · BPRD 04 2FA.</p>
            </div>
          </div>
        </section>

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
