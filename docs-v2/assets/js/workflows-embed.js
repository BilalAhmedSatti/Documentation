/**
 * Docs-native workflows: overview rails/paths + per-stage pages with diagrams.
 */
(function () {
  const ACCENTS = ["teal", "blue", "amber", "rose", "violet"];
  let diagramUid = 0;

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findWf(id) {
    return (window.WORKFLOWS || []).find((w) => w.id === id);
  }

  function accent(i) {
    return ACCENTS[i % ACCENTS.length];
  }

  function hrefStep(wfId, stepId) {
    return `/docs/workflows/${wfId}/${stepId}/`;
  }

  function firstStageHref(wf) {
    const step = wf.steps?.[0];
    return step ? hrefStep(wf.id, step.id) : `/docs/workflows/${wf.id}/`;
  }

  function writeChip(write) {
    if (!write) return "";
    return `
      <div class="doc-wf-write">
        <span class="op">${esc(write.op)}</span>
        <span class="store">${esc(write.store)}</span>
        <code>${esc(write.table)}</code>
        ${write.why ? `<em>${esc(write.why)}</em>` : ""}
      </div>`;
  }

  function list(items) {
    if (!items?.length) return "";
    return `<ul class="doc-wf-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  }

  function codes(items) {
    if (!items?.length) return "";
    return `<div class="doc-wf-codes">${items.map((a) => `<code>${esc(a)}</code>`).join("")}</div>`;
  }

  function edgePoint(from, to) {
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const x1 = from.cx + (dx > 0 ? from.w / 2 : -from.w / 2);
      const x2 = to.cx + (dx > 0 ? -to.w / 2 : to.w / 2);
      return { x1, y1: from.cy, x2, y2: to.cy };
    }
    const y1 = from.cy + (dy > 0 ? from.h / 2 : -from.h / 2);
    const y2 = to.cy + (dy > 0 ? -to.h / 2 : to.h / 2);
    return { x1: from.cx, y1, x2: to.cx, y2 };
  }

  function renderDiagram(story, title) {
    if (!story?.nodes?.length) return "";
    const uid = ++diagramUid;
    const arrowId = `wf-arrow-${uid}`;
    const nodes = [...story.nodes].sort((a, b) => (a.col ?? 0) - (b.col ?? 0) || 0);
    const cols = Math.max(...nodes.map((n) => n.col ?? 0), 0) + 1;
    const colX = (c) => 40 + c * 168;
    const laneY = { start: 56, process: 56, end: 56, decision: 56, app: 56, db: 168, event: 168 };
    const placed = nodes.map((n) => {
      const kind = n.kind || "process";
      const x = colX(n.col ?? 0);
      const y = laneY[kind] ?? 56;
      const w = kind === "db" || kind === "event" ? 132 : kind === "decision" ? 120 : 140;
      const h = kind === "db" || kind === "event" ? 72 : kind === "decision" ? 72 : 64;
      return { ...n, kind, x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
    });
    const placedById = Object.fromEntries(placed.map((n) => [n.id, n]));
    const width = Math.max(colX(cols - 1) + 180, 520);
    const height = 280;

    const edgeLines = (story.edges || [])
      .map((e) => {
        const a = placedById[e.from];
        const b = placedById[e.to];
        if (!a || !b) return "";
        const { x1, y1, x2, y2 } = edgePoint(a, b);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 8;
        const label = e.label
          ? `<text class="edge-label" x="${mx}" y="${my}">${esc(e.label)}</text>`
          : "";
        return `<path d="M${x1},${y1} L${x2},${y2}" class="edge" marker-end="url(#${arrowId})" />${label}`;
      })
      .join("");

    const nodeShapes = placed
      .map((n) => {
        const isData = n.kind === "db" || n.kind === "event";
        const titleText = isData
          ? `${n.op || "WRITE"} · ${n.store || ""}`
          : n.label || n.kind;
        const sub = isData ? n.table || "" : n.detail || n.api || "";
        if (n.kind === "decision") {
          const cx = n.w / 2;
          const cy = n.h / 2;
          return `
          <g transform="translate(${n.x},${n.y})">
            <polygon class="node decision" points="${cx},4 ${n.w - 4},${cy} ${cx},${n.h - 4} 4,${cy}" />
            <text class="node-title" x="${cx}" y="${cy - 4}">${esc(String(titleText).slice(0, 18))}</text>
            <text class="node-sub" x="${cx}" y="${cy + 12}">${esc(String(sub).slice(0, 20))}</text>
          </g>`;
        }
        const cls = isData ? "node data" : n.kind === "start" || n.kind === "end" ? "node terminal" : "node";
        return `
          <g transform="translate(${n.x},${n.y})">
            <rect class="${cls}" width="${n.w}" height="${n.h}" rx="10" />
            <text class="node-title" x="${n.w / 2}" y="24">${esc(String(titleText).slice(0, 22))}</text>
            <text class="node-sub" x="${n.w / 2}" y="44">${esc(String(sub).slice(0, 24))}</text>
          </g>`;
      })
      .join("");

    return `
      <div class="doc-wf-panel">
        <div class="doc-wf-head">
          <span class="doc-wf-kicker">Workflow diagram</span>
          <strong>${esc(title || story.title || "Flow")}</strong>
          ${story.summary ? `<p>${esc(story.summary)}</p>` : ""}
        </div>
        <div class="doc-wf-svg-wrap">
          <svg class="doc-wf-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Workflow diagram">
            <defs>
              <marker id="${arrowId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#38bdf8" />
              </marker>
            </defs>
            <text class="lane" x="12" y="40">Channel / Services</text>
            <text class="lane" x="12" y="152">Data</text>
            <line class="lane-line" x1="0" y1="130" x2="${width}" y2="130" />
            ${edgeLines}
            ${nodeShapes}
          </svg>
        </div>
        <div class="doc-wf-path compact">
          ${placed
            .map((n, i) => {
              const isData = n.kind === "db" || n.kind === "event";
              if (isData) {
                return `<div class="doc-wf-path-node kind-data accent-${accent(i)}">
                  <span class="tag">${esc(n.op || (n.kind === "event" ? "PUBLISH" : "WRITE"))}</span>
                  <strong>${esc(n.store || "")}</strong>
                  <code>${esc(n.table || "")}</code>
                </div>`;
              }
              return `<div class="doc-wf-path-node kind-${esc(n.kind)} accent-${accent(i)}">
                <strong>${esc(n.label || n.kind)}</strong>
                ${n.detail ? `<span>${esc(n.detail)}</span>` : ""}
              </div>`;
            })
            .join('<div class="doc-wf-path-arrow" aria-hidden="true"></div>')}
        </div>
      </div>`;
  }

  function renderRail(wf) {
    const stages = wf.overviewPipeline?.stages || [];
    if (!stages.length) return "";
    return `
      <div class="doc-wf-panel">
        <div class="doc-wf-head">
          <span class="doc-wf-kicker">Pipeline</span>
          <strong>${esc(wf.overviewPipeline.title || wf.label)}</strong>
          ${wf.overviewPipeline.summary ? `<p>${esc(wf.overviewPipeline.summary)}</p>` : ""}
        </div>
        <ol class="doc-wf-rail">
          ${stages
            .map(
              (s, i) => `
            <li class="doc-wf-rail-item accent-${accent(i)}">
              <div class="doc-wf-rail-n">${String(i + 1).padStart(2, "0")}</div>
              <div class="doc-wf-rail-body">
                <strong>${esc(s.title)}</strong>
                <span>${esc(s.does)}</span>
                ${s.api ? `<code>${esc(s.api)}</code>` : ""}
                ${writeChip(s.write)}
              </div>
            </li>`
            )
            .join("")}
        </ol>
        ${
          wf.overviewPipeline.outcome
            ? `<div class="doc-wf-outcome"><b>Outcome</b> ${esc(wf.overviewPipeline.outcome)}</div>`
            : ""
        }
      </div>`;
  }

  function renderStageLinks(wf) {
    const steps = wf.steps || [];
    if (!steps.length) return "";
    return `
      <div class="doc-wf-panel">
        <div class="doc-wf-head">
          <span class="doc-wf-kicker">Stages</span>
          <strong>Stage pages</strong>
        </div>
        <div class="doc-wf-stage-links">
          ${steps
            .map(
              (step, i) => `
            <a class="doc-wf-stage-link accent-${accent(i)}" href="${hrefStep(wf.id, step.id)}">
              <span class="n">${esc(step.num)}</span>
              <span class="t"><strong>${esc(step.title)}</strong><em>${esc(step.blurb)}</em></span>
              <span class="c">Open</span>
            </a>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function renderStepPage(wf, step) {
    const idx = wf.steps.findIndex((s) => s.id === step.id);
    const prev = idx > 0 ? wf.steps[idx - 1] : null;
    const next = idx < wf.steps.length - 1 ? wf.steps[idx + 1] : null;
    const writes = step.story?.nodes?.filter((n) => n.kind === "db" || n.kind === "event") || [];
    return `
      <div class="doc-wf">
        <div class="doc-wf-banner">
          <span class="doc-wf-kicker">${esc(wf.label)} · Stage ${esc(step.num)}</span>
          <h3>${esc(step.title)}</h3>
          <p>${esc(step.blurb)}</p>
          <div class="doc-wf-pills" style="margin-top:8px">
            ${step.must ? '<span class="must">Must</span>' : ""}
            ${step.duration ? `<span>${esc(step.duration)}</span>` : ""}
            ${step.repo ? `<span>${esc(step.repo)}</span>` : ""}
          </div>
        </div>
        ${renderDiagram(step.story, step.story?.title || `${step.title} · flow`)}
        <div class="doc-wf-panel">
          <div class="doc-wf-head"><span class="doc-wf-kicker">Detail</span><strong>What happens in this stage</strong></div>
          <div class="doc-wf-stage-body">
            <p class="doc-wf-detail">${esc(step.detail)}</p>
            <div class="doc-wf-grid">
              <div><h4>Actors</h4>${list(step.actors)}</div>
              <div><h4>Stack</h4>${list(step.stack) || "<p class='muted'>&mdash;</p>"}</div>
              <div><h4>Data</h4>${list(step.data) || "<p class='muted'>&mdash;</p>"}</div>
              <div><h4>Interfaces</h4>${codes(step.apis)}</div>
            </div>
            ${
              writes.length
                ? `<div class="doc-wf-writes"><h4>Durable writes</h4>${writes
                    .map((w) => writeChip({ op: w.op, store: w.store, table: w.table, why: w.why }))
                    .join("")}</div>`
                : ""
            }
            ${
              step.checklist?.length
                ? `<div class="doc-wf-check"><h4>Checklist</h4>${list(step.checklist)}</div>`
                : ""
            }
          </div>
        </div>
        <div class="footer-nav">
          ${
            prev
              ? `<a href="${hrefStep(wf.id, prev.id)}"><small>Previous</small><strong>${esc(prev.num)} - ${esc(prev.title)}</strong></a>`
              : `<span></span>`
          }
          ${
            next
              ? `<a href="${hrefStep(wf.id, next.id)}"><small>Next</small><strong>${esc(next.num)} - ${esc(next.title)}</strong></a>`
              : `<span></span>`
          }
        </div>
      </div>`;
  }

  function renderOverview(wf, view) {
    const parts = [];
    if (view === "full" || view === "overview" || view === "pipeline") parts.push(renderRail(wf));
    if ((view === "full" || view === "overview") && wf.overviewStory) {
      parts.push(renderDiagram(wf.overviewStory, wf.overviewStory.title));
    }
    if (view === "full" || view === "overview" || view === "steps") parts.push(renderStageLinks(wf));
    return `
      <div class="doc-wf">
        <div class="doc-wf-banner">
          <span class="doc-wf-kicker">Workflow</span>
          <h3>${esc(wf.label)}</h3>
          <p>${esc(wf.summary)}</p>
        </div>
        ${parts.join("")}
      </div>`;
  }

  function renderGallery() {
    return `
      <div class="doc-wf-gallery">
        ${(window.WORKFLOWS || [])
          .map(
            (w, i) => `
          <a class="accent-${accent(i)}" href="${firstStageHref(w)}">
            <span class="doc-wf-kicker">Workflow · ${(w.steps || []).length} stages</span>
            <strong>${esc(w.label)}</strong>
            <span>${esc(w.summary)}</span>
          </a>`
          )
          .join("")}
      </div>`;
  }

  function mount(el) {
    const view = el.getAttribute("data-view") || "full";
    if (view === "gallery") {
      el.innerHTML = renderGallery();
      return;
    }
    const id = el.getAttribute("data-workflow");
    const wf = findWf(id);
    if (!wf) {
      el.innerHTML = `<p class="callout warn"><strong>Workflow missing</strong> Could not load <code>${esc(id)}</code>.</p>`;
      return;
    }
    if (view === "step") {
      const stepId = el.getAttribute("data-step");
      const step = (wf.steps || []).find((s) => s.id === stepId);
      if (!step) {
        el.innerHTML = `<p class="callout warn"><strong>Stage missing</strong> <code>${esc(stepId)}</code>.</p>`;
        return;
      }
      el.innerHTML = renderStepPage(wf, step);
      return;
    }
    el.innerHTML = renderOverview(wf, view);
  }

  function boot() {
    document.querySelectorAll(".wf-embed").forEach(mount);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
