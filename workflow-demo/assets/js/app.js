(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const state = { workflowId: "onboarding", stepId: null };

  function parseHash() {
    const raw = (location.hash || "#/onboarding").replace(/^#\/?/, "");
    const [wf, step] = raw.split("/");
    state.workflowId = wf || "onboarding";
    state.stepId = step || null;
  }

  function hashFor(wfId, stepId) {
    return stepId ? `#/${wfId}/${stepId}` : `#/${wfId}`;
  }

  function getWorkflow() {
    return (
      window.WORKFLOWS.find((w) => w.id === state.workflowId) ||
      window.WORKFLOWS.find((w) => w.id === "onboarding") ||
      window.WORKFLOWS[0]
    );
  }

  function getStep(wf) {
    if (!state.stepId || !wf.steps?.length) return null;
    return wf.steps.find((s) => s.id === state.stepId) || null;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderSidebar() {
    const list = window.WORKFLOWS || [];
    $("#wfNav").innerHTML = list
      .map((wf) => {
        const isCurrent = wf.id === state.workflowId;
        return `<li class="menu-item ${isCurrent ? "current" : ""}">
          <a class="menu-link ${isCurrent ? "active" : ""}" href="${hashFor(wf.id)}">
            <span class="menu-title">${escapeHtml(wf.label)}</span>
            <span class="menu-count">${(wf.steps || []).length}</span>
          </a>
        </li>`;
      })
      .join("");
  }

  function diagramBlock(caption, html, nav) {
    const toolbar = nav
      ? `<div class="diagram-toolbar">
          ${nav.prev || "<span></span>"}
          <div class="diagram-caption">${escapeHtml(caption)}</div>
          ${nav.next || "<span></span>"}
        </div>`
      : `<div class="diagram-caption">${escapeHtml(caption)}</div>`;
    return `
      ${toolbar}
      <div class="diagram-shell">${html || '<p class="diagram-empty">No diagram</p>'}</div>`;
  }

  function accordion(title, bodyHtml) {
    return `<details class="acc">
      <summary>${escapeHtml(title)}</summary>
      <div class="acc-body">${bodyHtml}</div>
    </details>`;
  }

  function renderOverview(wf) {
    const cards = (wf.steps || [])
      .map(
        (s) => `
      <a class="step-card" href="${hashFor(wf.id, s.id)}">
        <div class="num">Step ${s.num}</div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.blurb)}</p>
        <span class="open-detail">Open step →</span>
      </a>`
      )
      .join("");

    const first = wf.steps?.[0];
    const nextBtn = first
      ? `<a class="btn btn-primary" href="${hashFor(wf.id, first.id)}">Lets Dive In</a>`
      : "";

    const overviewNav = { prev: "<span></span>", next: nextBtn };

    return `
      <div class="page-hero">
        <div class="eyebrow">WORKFLOW · ${escapeHtml(wf.label).toUpperCase()}</div>
        <h1>${escapeHtml(wf.label)}</h1>
        <p class="lede">${escapeHtml(wf.summary)}</p>
      </div>
      ${
        wf.overviewPipeline
          ? `<div class="panel block diagram-panel">
        ${diagramBlock(
          "Step-by-step flow · who does what and what gets saved",
          window.ArchDiagrams.renderPipeline(wf.overviewPipeline),
          overviewNav
        )}
      </div>`
          : ""
      }
      ${
        wf.overviewStory
          ? `<div class="panel block diagram-panel">
        ${diagramBlock(
          "Full path · apps → services → databases",
          window.ArchDiagrams.renderWorkflow(wf.overviewStory)
        )}
      </div>`
          : ""
      }
      <div class="panel block">
        <h3>Steps</h3>
        <div class="step-cards">${cards}</div>
      </div>`;
  }

  function renderStep(wf, step) {
    const idx = wf.steps.findIndex((s) => s.id === step.id);
    const prev = idx > 0 ? wf.steps[idx - 1] : null;
    const next = idx < wf.steps.length - 1 ? wf.steps[idx + 1] : null;

    const prevBtn = `<a class="btn btn-ghost" href="${hashFor(wf.id, prev ? prev.id : null)}">← Previous</a>`;
    const nextBtn = next
      ? `<a class="btn btn-primary" href="${hashFor(wf.id, next.id)}">Next →</a>`
      : `<a class="btn btn-primary" href="${hashFor(wf.id)}">Next →</a>`;

    const sideAccordions = [
      accordion("Detail", `<p class="detail-body">${escapeHtml(step.detail)}</p>`),
      accordion(
        "Actors",
        `<ul class="list-clean">${step.actors.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
      ),
      step.stack?.length
        ? accordion(
            "Services & stack",
            `<ul class="list-clean">${step.stack.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
          )
        : "",
      step.data?.length
        ? accordion(
            "Data stores",
            `<ul class="list-clean">${step.data.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
          )
        : "",
      accordion(
        "Interfaces",
        `<div class="api-list">${step.apis.map((a) => `<code>${escapeHtml(a)}</code>`).join("")}</div>`
      ),
      accordion(
        "Checklist",
        `<ul class="list-clean">${step.checklist.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>`
      ),
    ]
      .filter(Boolean)
      .join("");

    return `
      <div class="page-hero">
        <div class="eyebrow">STEP ${step.num} · ${escapeHtml(wf.label).toUpperCase()}</div>
        <h1>${escapeHtml(step.title)}</h1>
        <p class="lede">${escapeHtml(step.blurb)}</p>
        <div class="meta-row">
          ${step.must ? '<span class="pill must">Must</span>' : ""}
          <span class="pill">${escapeHtml(step.duration)}</span>
          ${step.repo ? `<span class="pill">${escapeHtml(step.repo)}</span>` : ""}
        </div>
      </div>

      <div class="panel block diagram-panel">
        ${diagramBlock(
          "Step-by-step flow · who does what and what gets saved",
          window.ArchDiagrams.renderWorkflow(step.story),
          { prev: prevBtn, next: nextBtn }
        )}
      </div>

      <div class="acc-stack">${sideAccordions}</div>`;
  }

  function updateChrome(wf, step) {
    const crumb = $("#crumb");
    if (step) {
      crumb.innerHTML = `<span class="crumb-wf">${escapeHtml(wf.label)}</span><span class="sep">/</span><span class="crumb-step">Step ${step.num}</span><span class="sep">/</span><b>${escapeHtml(step.title)}</b>`;
    } else {
      crumb.innerHTML = `<span class="crumb-wf">${escapeHtml(wf.label)}</span><span class="sep">/</span><b>Overview</b>`;
    }
    document.title = step ? `${step.title} · ${wf.label}` : `${wf.label} · Workflow Demo`;
    const chip = $("#docChip");
    if (chip && wf.designDoc) {
      chip.href = wf.designDoc;
      chip.textContent = wf.label;
    }
  }

  function render() {
    parseHash();
    const known = window.WORKFLOWS.some((w) => w.id === state.workflowId);
    if (!known) {
      location.hash = "#/onboarding";
      return;
    }
    const wf = getWorkflow();
    const step = getStep(wf);
    if (state.stepId && !step && wf.steps?.length) {
      location.hash = hashFor(wf.id);
      return;
    }
    renderSidebar();
    updateChrome(wf, step);
    $("#page").innerHTML = step ? renderStep(wf, step) : renderOverview(wf);
    window.scrollTo(0, 0);
  }

  function wireUi() {
    const sidebar = $("#sidebar");
    const backdrop = $("#backdrop");
    const menuBtn = $("#menuBtn");
    const closeNav = () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    };
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
    });
    backdrop.addEventListener("click", closeNav);
    window.addEventListener("hashchange", () => {
      closeNav();
      render();
    });
  }

  function boot() {
    wireUi();
    if (!location.hash || location.hash === "#") location.hash = "#/onboarding";
    else render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
