/**
 * Enterprise swimlane workflow diagrams — detailed enough to read end-to-end.
 * Lanes: Channel | Services | Data platform
 */
(function (global) {
  let uid = 0;

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const LANES = [
    { id: "channel", label: "PEOPLE & APPS", sub: "customer / website" },
    { id: "service", label: "BACKEND", sub: "services that run" },
    { id: "data", label: "DATABASES", sub: "what gets saved" },
  ];

  function laneOf(n) {
    if (n.kind === "db" || n.kind === "event") return "data";
    if (n.kind === "start" || n.kind === "app" || n.lane === "Channel") return "channel";
    return "service";
  }

  function buildColumns(map) {
    const nodes = map.nodes || [];
    const cols = {};
    nodes.forEach((n, i) => {
      const c = n.col != null ? n.col : i;
      if (!cols[c]) cols[c] = [];
      cols[c].push(n);
    });
    return { cols, colKeys: Object.keys(cols).map(Number).sort((a, b) => a - b) };
  }

  function wrapLines(text, max, maxLines) {
    const words = String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let cur = "";

    function pushLongWord(w) {
      let rest = w;
      while (rest.length > max) {
        lines.push(rest.slice(0, max));
        rest = rest.slice(max);
      }
      cur = rest;
    }

    words.forEach((w) => {
      if (w.length > max) {
        if (cur) {
          lines.push(cur);
          cur = "";
        }
        pushLongWord(w);
        return;
      }
      const next = cur ? `${cur} ${w}` : w;
      if (next.length <= max) cur = next;
      else {
        if (cur) lines.push(cur);
        cur = w;
      }
    });
    if (cur) lines.push(cur);
    if (lines.length <= maxLines) return lines;
    const kept = lines.slice(0, maxLines);
    const last = kept[maxLines - 1];
    kept[maxLines - 1] = last.length > max - 1 ? last.slice(0, max - 1) + "…" : last + "…";
    return kept;
  }

  /** Approx chars that fit in a box at a given font size (presentation fonts are wide). */
  function charsFor(widthPx, fontPx, pad = 52) {
    const avail = Math.max(40, widthPx - pad);
    // 0.72 is conservative for Sora/Figtree bold so glyphs never spill past the rect
    return Math.max(8, Math.floor(avail / (fontPx * 0.72)));
  }

  function textLines(lines, x, startY, attrs) {
    const step = attrs.step || 26;
    const size = attrs.size || 16;
    const fill = attrs.fill || "#F8FAFC";
    const weight = attrs.weight || "500";
    const family = attrs.family || "Figtree, sans-serif";
    return lines
      .map(
        (line, i) =>
          `<text x="${x}" y="${startY + i * step}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}">${esc(line)}</text>`
      )
      .join("");
  }

  function nodeContent(n, w) {
    const isData = n.kind === "db" || n.kind === "event";
    if (isData) {
      const title = wrapLines(n.store || n.label || "Store", charsFor(w, 17), 2);
      const table = wrapLines(n.table || "", charsFor(w, 14), 1);
      const why = wrapLines(n.why || n.detail || "saved in database", charsFor(w, 13), 3);
      return { isData, title, table, why };
    }
    const title = wrapLines(n.label || "", charsFor(w, 17), 2);
    const does = wrapLines(n.detail || "", charsFor(w, 14), 2);
    const whySrc = n.why || "";
    const why = wrapLines(whySrc || (!n.detail ? n.api || "" : ""), charsFor(w, 13), 3);
    const api =
      n.api && whySrc && !whySrc.includes(n.api) ? wrapLines(n.api, charsFor(w, 12), 1) : [];
    return { isData, title, does, why, api };
  }

  function measureNodeH(n, w) {
    const c = nodeContent(n, w);
    const top = c.isData ? 40 : 36;
    const bottom = 14;
    const gap = 6;
    let body = 0;
    if (c.isData) {
      body += c.title.length * 22 + gap;
      body += c.table.length * 18 + gap;
      body += c.why.length * 18;
    } else {
      body += c.title.length * 22 + gap;
      body += c.does.length * 18 + gap;
      body += c.why.length * 18;
      if (c.api?.length) body += gap + c.api.length * 16;
    }
    return Math.max(c.isData ? 148 : 140, top + body + bottom);
  }

  function buildWalkthrough(map, colKeys, cols) {
    if (map.walkthrough?.length) return map.walkthrough;
    return colKeys.map((ck, i) => {
      const list = cols[ck] || [];
      const proc = list.find((n) => n.kind !== "db" && n.kind !== "event") || list[0];
      const writes = list.filter((n) => n.kind === "db" || n.kind === "event");
      const who = proc?.label || "Step";
      const does = proc?.why || proc?.detail || proc?.label || "";
      const save = writes
        .map((w) => `${w.op || "WRITE"} → ${w.store || w.label}${w.table ? ` (${w.table})` : ""}`)
        .join("; ");
      return {
        n: String(i + 1).padStart(2, "0"),
        title: who,
        text: does,
        say: does,
        why: proc?.why || "This stage moves the customer forward in the journey.",
        save: save || "Nothing saved in this stage",
        tip: writes.length
          ? "Point at the purple box — that is the durable write."
          : "Point at the process box — no database write yet.",
      };
    });
  }

  function renderEnterprise(map) {
    if (!map?.nodes?.length) {
      return `<div class="ent-empty">No workflow diagram defined.</div>`;
    }

    const id = `ent${++uid}`;
    const { cols, colKeys } = buildColumns(map);
    const many = colKeys.length >= 6;
    const gap = many ? 64 : 112;
    const labelW = many ? 112 : 132;
    const padX = 12;
    const padTop = many ? 40 : 48;
    const padY = 16;
    const stackGap = 14;
    const lanePad = 16;

    // Compact boxes — denser when many columns so fit-to-window stays readable
    const colW = many ? 176 : 220;
    const nodeW = colW;

    // Measure each stack height from real wrapped content
    const colStacks = {};
    const laneStackH = { channel: 0, service: 0, data: 0 };
    colKeys.forEach((ck) => {
      const list = cols[ck];
      const byLane = { channel: [], service: [], data: [] };
      list.forEach((n) => byLane[laneOf(n)].push(n));
      const heights = { channel: [], service: [], data: [] };
      LANES.forEach((lane) => {
        heights[lane.id] = byLane[lane.id].map((n) => measureNodeH(n, nodeW));
        const sum = heights[lane.id].reduce((a, h, i) => a + h + (i ? stackGap : 0), 0);
        if (sum > laneStackH[lane.id]) laneStackH[lane.id] = sum;
      });
      colStacks[ck] = { byLane, heights };
    });

    const baseLaneH = {
      channel: laneStackH.channel === 0 ? 44 : lanePad + laneStackH.channel + lanePad,
      service: laneStackH.service === 0 ? 44 : lanePad + laneStackH.service + lanePad,
      data: laneStackH.data === 0 ? 44 : lanePad + laneStackH.data + lanePad,
    };

    const laneY = {};
    let yCursor = padTop;
    LANES.forEach((l) => {
      laneY[l.id] = yCursor;
      yCursor += baseLaneH[l.id];
    });
    const width = labelW + padX * 2 + colKeys.length * colW + (colKeys.length - 1) * gap;
    const height = yCursor + padY;

    const pos = {};
    const stageTitles = {};
    colKeys.forEach((ck, ci) => {
      const list = cols[ck];
      const x = labelW + padX + ci * (colW + gap);
      const { byLane, heights } = colStacks[ck];

      const headline =
        map.stageLabels?.[ci] ||
        list.find((n) => n.kind !== "db" && n.kind !== "event")?.stageTitle ||
        list.find((n) => n.kind !== "db" && n.kind !== "event")?.label ||
        `Stage ${ci + 1}`;
      stageTitles[ck] = headline;

      LANES.forEach((lane) => {
        const stack = byLane[lane.id];
        let y = laneY[lane.id] + (stack.length ? 22 : 10);
        stack.forEach((n, ni) => {
          const h = heights[lane.id][ni];
          pos[n.id] = {
            ...n,
            lane: lane.id,
            x,
            y,
            w: nodeW,
            h,
            cx: x + nodeW / 2,
            cy: y + h / 2,
            stage: ci + 1,
          };
          y += h + stackGap;
        });
      });
    });

    const edgePaths = (map.edges || [])
      .map((e) => {
        const a = pos[e.from];
        const b = pos[e.to];
        if (!a || !b) return "";
        const toData = b.lane === "data" && a.lane !== "data";
        const sameCol = Math.abs(a.x - b.x) < 4;
        let d;
        if (sameCol && a.lane !== b.lane) {
          const x = (a.cx + b.cx) / 2;
          d = `M ${a.cx} ${a.y + a.h} L ${x} ${a.y + a.h + 8} L ${x} ${b.y - 8} L ${b.cx} ${b.y}`;
        } else if (a.lane === b.lane) {
          const y = a.cy;
          const mid = (a.x + a.w + b.x) / 2;
          d = `M ${a.x + a.w} ${y} L ${mid} ${y} L ${b.x} ${y}`;
        } else {
          const midY = (a.y + a.h + b.y) / 2;
          d = `M ${a.cx} ${a.y + a.h} L ${a.cx} ${midY} L ${b.cx} ${midY} L ${b.cx} ${b.y}`;
        }
        const stroke = toData ? "#A78BFA" : "#7DD3FC";
        const marker = toData ? `url(#${id}-mdb)` : `url(#${id}-mstd)`;
        const lw = toData ? 2.2 : 1.6;
        return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${lw}" marker-end="${marker}"/>`;
      })
      .join("");

    const edgeLabels = (map.edges || [])
      .map((e) => {
        const a = pos[e.from];
        const b = pos[e.to];
        if (!a || !b) return "";
        const toData = b.lane === "data" && a.lane !== "data";
        const sameCol = Math.abs(a.x - b.x) < 4;
        const labelText = e.label || (toData ? "save" : "");
        if (!labelText) return "";

        // Keep the card strictly inside the open corridor between boxes
        let lx;
        let ly;
        let maxTw;
        if (sameCol && toData) {
          maxTw = 120;
          lx = a.cx + 18;
          ly = (a.y + a.h + b.y) / 2;
        } else if (a.lane === b.lane) {
          const left = a.x + a.w;
          const right = b.x;
          const corridor = Math.max(48, right - left);
          maxTw = corridor - 12;
          lx = (left + right) / 2;
          ly = a.cy;
        } else if (!toData) {
          maxTw = Math.min(140, Math.abs(b.cx - a.cx) * 0.55 || 100);
          lx = (a.cx + b.cx) / 2;
          ly = (a.y + a.h + b.y) / 2;
        } else {
          return "";
        }

        const maxChars = Math.max(6, Math.floor((maxTw - 14) / 7.1));
        const lines = wrapLines(labelText, maxChars, 2);
        const longest = lines.reduce((m, s) => Math.max(m, s.length), 0);
        const tw = Math.min(maxTw, Math.max(52, Math.ceil(longest * 7.1 + 16)));
        const lineH = 14;
        const th = 10 + lines.length * lineH;
        const anchor = sameCol && toData ? "start" : "middle";
        const bx = anchor === "middle" ? lx - tw / 2 : lx - 4;
        const by = ly - th / 2;
        const textSvg = lines
          .map((line, i) => {
            const ty = by + 12 + i * lineH;
            return `<text x="${lx}" y="${ty}" text-anchor="${anchor}" class="ent-edge-label">${esc(line)}</text>`;
          })
          .join("");
        return `
          <rect x="${bx}" y="${by}" width="${tw}" height="${th}" rx="6" fill="#0B1520" stroke="#64748B" stroke-width="1"/>
          ${textSvg}`;
      })
      .join("");

    const laneBands = LANES.map((l, i) => {
      const y = laneY[l.id];
      const h = baseLaneH[l.id];
      return `
        <rect x="0" y="${y}" width="${width}" height="${h}" class="ent-lane-${l.id}" />
        <rect x="0" y="${y}" width="${labelW}" height="${h}" fill="rgba(0,0,0,0.22)"/>
        <line x1="${labelW}" y1="${y}" x2="${labelW}" y2="${y + h}" stroke="#334155" stroke-width="1"/>
        <text x="12" y="${y + 48}" class="ent-lane-title">${l.label}</text>
        <text x="12" y="${y + 72}" class="ent-lane-sub">${l.sub}</text>
        ${i < LANES.length - 1 ? `<line x1="0" y1="${y + h}" x2="${width}" y2="${y + h}" stroke="#334155" stroke-width="1"/>` : ""}
      `;
    }).join("");

    const stageHeads = colKeys
      .map((ck, ci) => {
        const x = labelW + padX + ci * (colW + gap) + nodeW / 2;
        const title = String(stageTitles[ck] || "");
        const short = title.length > 32 ? title.slice(0, 31) + "…" : title;
        return `
          <text x="${x}" y="${padTop - 22}" text-anchor="middle" class="ent-stage">STEP ${String(ci + 1).padStart(2, "0")}</text>
          <text x="${x}" y="${padTop - 4}" text-anchor="middle" class="ent-stage-name">${esc(short)}</text>`;
      })
      .join("");

    function nodeSvg(n) {
      const c = nodeContent(n, n.w);
      const tx = n.x + 18;

      if (c.isData) {
        const isEvt = n.kind === "event" || n.op === "PUBLISH";
        const fill = isEvt ? "#2A1F3D" : "#1F1835";
        const stroke = isEvt ? "#C084FC" : "#A78BFA";
        const head = isEvt ? "#7E22CE" : "#6D28D9";
        let y = n.y + 56;
        const titleSvg = textLines(c.title, tx, y, {
          size: 17,
          weight: "700",
          family: "Sora, sans-serif",
          fill: "#FFFFFF",
          step: 22,
        });
        y += c.title.length * 22 + 6;
        const tableSvg = textLines(c.table, tx, y, {
          size: 13,
          weight: "600",
          family: "IBM Plex Mono, monospace",
          fill: "#E9D5FF",
          step: 18,
        });
        y += c.table.length * 18 + 6;
        const whySvg = textLines(c.why, tx, y, { size: 13, fill: "#F8FAFC", step: 18 });
        return `
          <g class="ent-node">
            <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>
            <rect x="${n.x}" y="${n.y}" width="${n.w}" height="30" rx="8" fill="${head}"/>
            <rect x="${n.x}" y="${n.y + 18}" width="${n.w}" height="12" fill="${head}"/>
            <text x="${n.x + n.w / 2}" y="${n.y + 20}" text-anchor="middle" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="13" font-weight="700" letter-spacing="0.04em">${esc(n.op || (isEvt ? "PUBLISH" : "WRITE"))}</text>
            ${titleSvg}${tableSvg}${whySvg}
          </g>`;
      }

      const isStart = n.kind === "start";
      const isEnd = n.kind === "end";
      const isGate = n.kind === "decision";
      const isApp = n.kind === "app";
      const fill = isStart ? "#0F2F2C" : isEnd ? "#12291C" : isGate ? "#2A2410" : "#1A2736";
      const stroke = isStart ? "#2DD4BF" : isEnd ? "#4ADE80" : isGate ? "#FBBF24" : "#7DD3FC";
      const accent = isStart ? "#5EEAD4" : isEnd ? "#86EFAC" : isGate ? "#FCD34D" : "#7DD3FC";
      const tag = isStart ? "START" : isEnd ? "END" : isGate ? "DECISION" : isApp ? "APP" : "PROCESS";

      let y = n.y + 52;
      const titleSvg = textLines(c.title, n.x + 20, y, {
        size: 17,
        weight: "700",
        family: "Sora, sans-serif",
        fill: "#FFFFFF",
        step: 22,
      });
      y += c.title.length * 22 + 6;
      const doesSvg = textLines(c.does, n.x + 20, y, {
        size: 13,
        weight: "600",
        fill: "#FFFFFF",
        step: 18,
      });
      y += c.does.length * 18 + 6;
      const whySvg = textLines(c.why, n.x + 20, y, { size: 13, fill: "#E2E8F0", step: 18 });
      y += c.why.length * 18;
      const apiSvg = c.api?.length
        ? textLines(c.api, n.x + 20, y + 6, {
            size: 12,
            fill: "#94A3B8",
            family: "IBM Plex Mono, monospace",
            step: 16,
          })
        : "";

      return `
        <g class="ent-node">
          <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>
          <line x1="${n.x + 10}" y1="${n.y + 12}" x2="${n.x + 10}" y2="${n.y + n.h - 12}" stroke="${accent}" stroke-width="2.8" stroke-linecap="round"/>
          <text x="${n.x + 20}" y="${n.y + 26}" fill="${accent}" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" letter-spacing="0.08em">${tag}</text>
          ${titleSvg}${doesSvg}${whySvg}${apiSvg}
        </g>`;
    }

    const nodesSvg = Object.values(pos).map(nodeSvg).join("");
    const dbCount = map.nodes.filter((n) => n.kind === "db" || n.kind === "event").length;
    const walkthrough = buildWalkthrough(map, colKeys, cols);

    return `
      <div class="ent-diagram ent-diagram--fit">
        <header class="ent-header ent-header--compact">
          <div>
            <h3 class="ent-title">${esc(map.title || "Workflow")}</h3>
            ${map.summary ? `<p class="ent-pitch-inline">${esc(map.summary)}</p>` : ""}
          </div>
          <div class="ent-meta">
            <span>${colKeys.length} stages</span>
            <span>${dbCount} DB</span>
          </div>
        </header>
        <div class="ent-canvas-wrap" style="--ent-w:${width};--ent-h:${height}">
          <svg class="ent-svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(map.title || "Workflow")}">
            <defs>
              <marker id="${id}-mstd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 1.5 L9 5 L0 8.5 z" fill="#7DD3FC"/>
              </marker>
              <marker id="${id}-mdb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0 1.5 L9 5 L0 8.5 z" fill="#A78BFA"/>
              </marker>
              <style>
                .ent-lane-channel { fill: #152A32; }
                .ent-lane-service { fill: #162233; }
                .ent-lane-data { fill: #1A1730; }
                .ent-lane-title { font-family: IBM Plex Mono, monospace; font-size: 15px; font-weight: 700; fill: #5EEAD4; letter-spacing: 0.08em; }
                .ent-lane-sub { font-family: Figtree, sans-serif; font-size: 13px; fill: #E2E8F0; }
                .ent-edge-label { font-family: IBM Plex Mono, monospace; font-size: 12px; fill: #E0F2FE; font-weight: 700; }
                .ent-edge-vert { font-family: IBM Plex Mono, monospace; font-size: 12px; fill: #E9D5FF; font-weight: 700; }
                .ent-stage { font-family: IBM Plex Mono, monospace; font-size: 12px; fill: #5EEAD4; letter-spacing: 0.08em; font-weight: 700; }
                .ent-stage-name { font-family: Figtree, sans-serif; font-size: 14px; fill: #FFFFFF; font-weight: 700; }
              </style>
            </defs>
            ${laneBands}
            ${stageHeads}
            ${edgePaths}
            ${nodesSvg}
            ${edgeLabels}
          </svg>
        </div>
        <section class="ent-cheat" aria-label="Stage talking points">
          <div class="ent-cheat-head">
            <h4>Stage by stage</h4>
            <p>What to say for each column on the diagram.</p>
          </div>
          <ol class="ent-cheat-grid">${walkthrough
            .map((w, i) => {
              const say = w.say || w.text || "";
              const why = w.why || "";
              const tip = w.tip || "";
              return `
          <li class="ent-cheat-card">
            <div class="ent-cheat-top">
              <span class="ent-walk-n">${esc(w.n || String(i + 1).padStart(2, "0"))}</span>
              <strong>${esc(w.title)}</strong>
            </div>
            <p class="ent-cheat-say"><b>Say:</b> ${esc(say)}</p>
            ${why ? `<p class="ent-cheat-why"><b>Why:</b> ${esc(why)}</p>` : ""}
            <p class="ent-cheat-save"><b>Database:</b> ${esc(w.save || "Nothing saved")}</p>
            ${tip ? `<p class="ent-cheat-tip"><b>Point to:</b> ${esc(tip)}</p>` : ""}
          </li>`;
            })
            .join("")}</ol>
          ${
            map.outcome
              ? `<div class="ent-cheat-close"><b>Close with:</b> ${esc(map.outcome)}</div>`
              : ""
          }
        </section>
        <footer class="ent-footer">
          <div class="ent-legend">
            <span><i class="el-proc"></i>Work step</span>
            <span><i class="el-db"></i>Save to database</span>
            <span><i class="el-evt"></i>Send a message</span>
          </div>
          ${map.outcome ? `<div class="ent-outcome"><b>Result</b> ${esc(map.outcome)}</div>` : ""}
        </footer>
      </div>`;
  }

  function renderPipeline(pipeline) {
    if (!pipeline?.stages?.length) return "";
    const nodes = [];
    const edges = [];
    const walkthrough = [];
    const stageLabels = [];
    pipeline.stages.forEach((s, i) => {
      const pid = `p${i}`;
      stageLabels.push(s.title);
      nodes.push({
        id: pid,
        label: s.title,
        detail: s.does,
        why: s.why || s.does,
        api: s.api || "",
        kind: i === 0 ? "start" : i === pipeline.stages.length - 1 ? "end" : "process",
        col: i,
        stageTitle: s.title,
      });
      if (i > 0) edges.push({ from: `p${i - 1}`, to: pid, label: s.fromPrev || "next" });
      if (s.write) {
        const did = `d${i}`;
        nodes.push({
          id: did,
          kind: s.write.op === "PUBLISH" ? "event" : "db",
          op: s.write.op,
          store: s.write.store,
          table: s.write.table,
          why: s.write.why || "Durable commit for this stage",
          col: i,
        });
        edges.push({ from: pid, to: did, label: s.write.label || "save" });
      }
      walkthrough.push({
        n: String(i + 1).padStart(2, "0"),
        title: s.title,
        text: s.why || s.does,
        say: s.say || s.why || s.does,
        why: s.why || "This stage is required before the next one can run.",
        save: s.write
          ? `${s.write.op} → ${s.write.store}${s.write.table ? ` (${s.write.table})` : ""}`
          : "Nothing saved",
        tip: s.write
          ? "Point at the purple box under this stage — that is the database write."
          : "No purple database box in this stage.",
      });
    });
    return renderEnterprise({
      title: pipeline.title || "End-to-end onboarding",
      summary: pipeline.summary,
      outcome: pipeline.outcome,
      stageLabels,
      walkthrough,
      nodes,
      edges,
    });
  }

  global.ArchDiagrams = {
    renderWorkflow: renderEnterprise,
    renderPipeline,
    renderMap: renderEnterprise,
    renderStory: renderEnterprise,
    renderFlow: renderEnterprise,
    renderSequence: () => "",
  };
})(window);
