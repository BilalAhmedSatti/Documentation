/* ============================================================================
   GRAPH.JS — builds the node/edge model from data.js and renders it as an
   interactive SVG. Two modes: 'hero' (decorative, index.html) and
   'full' (dependencies.html — searchable, clickable, links to real docs).
   ========================================================================= */

const SVGNS = "http://www.w3.org/2000/svg";

function byNum(num){ return COMPONENTS.find(c => c.num === num); }

/* ---------------------------------------------------------------- MODEL --- */
function buildGraphModel(mode){
  const nodes = [];
  const edges = [];
  const nodeIndex = {};

  function addNode(n){ nodeIndex[n.id] = n; nodes.push(n); return n; }

  // apps
  Object.keys(APP_NODES).forEach(id=>{
    addNode({ id, label:APP_NODES[id], sub:"Application", kind:"app", row:0 });
  });

  const services = COMPONENTS.filter(c=>c.kind==="service");
  const adapters = COMPONENTS.filter(c=>c.kind==="adapter");

  const wantAll = mode === "full";
  const sharedOnly = mode === "hero";

  const svcList = wantAll ? services : services.filter(c=>c.tags.includes("shared")||c.tags.includes("foundation"));
  const adpList = wantAll ? adapters : adapters.filter(c=>c.tags.includes("shared")||c.tags.includes("new")||c.tags.includes("foundation"));

  svcList.forEach(c=> addNode({
    id:c.num, label:c.name, sub:c.num+" \u00b7 "+c.runtime.split(" / ")[0], kind:"service", row:1,
    tags:c.tags, ref:c
  }));
  adpList.forEach(c=> addNode({
    id:c.num, label:c.name, sub:c.num+" \u00b7 "+c.runtime.split(" / ")[0], kind:"adapter", row:2,
    tags:c.tags, ref:c
  }));

  if (wantAll){
    Object.keys(EXTERNAL_NODES).forEach(id=>{
      addNode({ id, label:EXTERNAL_NODES[id], sub:"External", kind:"external", row:3 });
    });
  }

  // ---- edges ----
  function ensureEdge(from,to,kind){
    if(!nodeIndex[from] || !nodeIndex[to]) return;
    if (edges.some(e=>e.from===from && e.to===to)) return;
    edges.push({from,to,kind});
  }

  if (sharedOnly){
    // hero: simple — both apps consume every shown node
    nodes.filter(n=>n.kind==="service"||n.kind==="adapter").forEach(n=>{
      ensureEdge("app-banking", n.id, "uses");
      ensureEdge("app-takaful", n.id, "uses");
    });
  } else {
    COMPONENTS.forEach(c=>{
      // app -> component (component consumed directly by an app)
      (c.consumedBy||[]).forEach(cons=>{
        if (cons==="app-banking"||cons==="app-takaful") ensureEdge(cons, c.num, "uses");
      });
      // component -> its dependencies (component or external)
      (c.dependsOn||[]).forEach(dep=> ensureEdge(c.num, dep, "depends"));
      // foundational hub edges
      (c.consumedBy||[]).forEach(cons=>{
        if (cons==="every service") svcList.forEach(s=> s.num!==c.num && ensureEdge(s.num, c.num, "depends"));
        if (cons==="every adapter") adpList.forEach(a=> a.num!==c.num && ensureEdge(a.num, c.num, "depends"));
      });
    });
  }

  return { nodes, edges, nodeIndex };
}

/* --------------------------------------------------------------- LAYOUT --- */
function layoutGraph(model, mode){
  const rows = {0:[],1:[],2:[],3:[]};
  model.nodes.forEach(n=> rows[n.row].push(n));

  const colW = mode==="hero" ? 118 : 124;
  const rowH = mode==="hero" ? 118 : 138;
  const padX = 70, padTop = 46;

  const maxCols = Math.max(...Object.values(rows).map(r=>r.length), 1);
  const width = maxCols*colW + padX*2;

  Object.keys(rows).forEach(rk=>{
    const list = rows[rk];
    if(!list.length) return;
    const rowWidth = list.length*colW;
    const startX = (width-rowWidth)/2 + colW/2;
    list.forEach((n,i)=>{ n.x = startX + i*colW; n.y = padTop + rk*rowH; });
  });

  const usedRows = Object.keys(rows).filter(rk=>rows[rk].length>0).map(Number);
  const height = padTop + (Math.max(...usedRows))*rowH + 60;
  return { width, height };
}

/* --------------------------------------------------------------- RENDER --- */
function kindColor(kind, tags){
  tags = tags||[];
  if (kind==="app") return {fill:"#1E8449", ring:"#34B37A"};
  if (kind==="external") return {fill:"#26374F", ring:"#4A5D78"};
  if (tags.includes("new")) return {fill:"#B9770E", ring:"#E2A33D"};
  if (kind==="service") return {fill:"#0E7C75", ring:"#17B8AE"};
  return {fill:"#8B6A17", ring:"#E2A33D"}; // adapter
}

function makeEl(tag, attrs){
  const el = document.createElementNS(SVGNS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function edgePath(x1,y1,x2,y2){
  const midY = (y1+y2)/2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

function renderDependencyGraph(svgEl, mode, opts){
  opts = opts || {};
  const model = buildGraphModel(mode);
  const dims = layoutGraph(model, mode);
  const r = mode==="hero" ? 20 : 24;

  svgEl.setAttribute("viewBox", `0 0 ${dims.width} ${dims.height}`);
  svgEl.innerHTML = "";
  const nodeR = mode === "hero" ? 15 : 19;

  const edgeLayer = makeEl("g", {class:"edge-layer"});
  const nodeLayer = makeEl("g", {class:"node-layer"});
  svgEl.appendChild(edgeLayer);
  svgEl.appendChild(nodeLayer);

  const nodeEls = {};
  const edgeEls = [];

  model.edges.forEach(e=>{
    const a = model.nodeIndex[e.from], b = model.nodeIndex[e.to];
    if(!a||!b) return;
    const path = makeEl("path", {
      d: edgePath(a.x, a.y+ (a.row<b.row? nodeR: -nodeR), b.x, b.y + (a.row<b.row? -nodeR-4: nodeR+4)),
      fill:"none", stroke: e.kind==="uses" ? "#2C4160" : "#243349",
      "stroke-width": mode==="hero"?1.4:1.6, opacity:mode==="hero"?0.55:0.5,
      class:"dep-edge"
    });
    path.dataset.from = e.from; path.dataset.to = e.to;
    edgeLayer.appendChild(path);
    edgeEls.push(path);
  });

  model.nodes.forEach(n=>{
    const col = kindColor(n.kind, n.tags);
    const g = makeEl("g", {class:"dep-node", tabindex:"0", role:"button",
      "aria-label": n.label, transform:`translate(${n.x},${n.y})`});
    g.dataset.id = n.id;

    const inner = makeEl("g", {class:"dep-node-inner", style:"transform-box:fill-box; transform-origin:center;"});
    g.appendChild(inner);

    const halo = makeEl("circle", {r:nodeR+7, fill:col.ring, opacity:0.14, class:"halo"});
    const circle = makeEl("circle", {r:nodeR, fill:col.fill, stroke:col.ring, "stroke-width":1.6, class:"core"});
    inner.appendChild(halo); inner.appendChild(circle);

    if (n.kind==="app"){
      const ic = makeEl("text", {x:0,y:5,"text-anchor":"middle", style:"font-size:13px;font-weight:700;fill:#fff;font-family:'Space Grotesk',sans-serif"});
      ic.textContent = n.id==="app-banking" ? "B" : "T";
      inner.appendChild(ic);
    } else if (n.kind!=="external"){
      const ic = makeEl("text", {x:0,y:5,"text-anchor":"middle", style:"font-size:11.5px;font-weight:700;fill:#fff;font-family:'JetBrains Mono',monospace"});
      ic.textContent = n.id;
      inner.appendChild(ic);
    } else {
      const ic = makeEl("text", {x:0,y:5,"text-anchor":"middle", style:"font-size:12px;fill:#C6D1E0"});
      ic.textContent = "\u21c4";
      inner.appendChild(ic);
    }

    if (mode!=="hero"){
      const lbl = makeEl("text", {x:0,y:nodeR+18,"text-anchor":"middle", class:"graph-node-label"});
      const words = n.label.split(" ");
      let line1 = "", line2 = "";
      words.forEach(w=>{ (line1.length<16? line1=line1?line1+" "+w:w : line2=line2?line2+" "+w:w); });
      lbl.textContent = line1.length>18? line1.slice(0,17)+"\u2026" : line1;
      g.appendChild(lbl);
      if (line2){
        const lbl2 = makeEl("text", {x:0,y:nodeR+31,"text-anchor":"middle", class:"graph-node-label"});
        lbl2.textContent = line2.length>18? line2.slice(0,17)+"\u2026" : line2;
        g.appendChild(lbl2);
      }
    }

    nodeLayer.appendChild(g);
    nodeEls[n.id] = { outer:g, inner:inner };

    if (mode!=="hero"){
      g.addEventListener("mouseenter", ()=>focusNode(n.id));
      g.addEventListener("mouseleave", ()=>clearFocus());
      g.addEventListener("click", ()=> opts.onSelect && opts.onSelect(n));
      g.addEventListener("keypress", (ev)=>{ if(ev.key==="Enter") opts.onSelect && opts.onSelect(n); });
    }
  });

  function focusNode(id){
    const related = new Set([id]);
    edgeEls.forEach(p=>{
      const match = p.dataset.from===id || p.dataset.to===id;
      p.style.opacity = match ? 0.95 : 0.08;
      p.style.stroke = match ? "#3FD8CC" : "#243349";
      if(match){ related.add(p.dataset.from); related.add(p.dataset.to); }
    });
    Object.keys(nodeEls).forEach(k=>{
      nodeEls[k].outer.style.opacity = related.has(k) ? 1 : 0.25;
    });
  }
  function clearFocus(){
    edgeEls.forEach(p=>{ p.style.opacity = mode==="hero"?0.55:0.5; p.style.stroke = "#243349"; });
    Object.keys(nodeEls).forEach(k=> nodeEls[k].outer.style.opacity = 1);
  }
  svgEl._clearFocus = clearFocus;
  svgEl._focusNode = focusNode;
  svgEl._model = model;

  // entrance animation — animates the INNER group only; outer keeps its translate untouched
  if (!opts.skipAnim){
    nodeLayer.querySelectorAll(".dep-node-inner").forEach((inner,i)=>{
      inner.style.opacity = 0;
      inner.style.transform = "scale(.55)";
      inner.style.transition = "opacity .5s ease, transform .5s cubic-bezier(.2,.8,.3,1)";
      setTimeout(()=>{ inner.style.opacity = 1; inner.style.transform = "scale(1)"; }, 60+i*22);
    });
    edgeLayer.querySelectorAll(".dep-edge").forEach((p)=>{
      const len = p.getTotalLength ? p.getTotalLength() : 400;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = "stroke-dashoffset 1.1s ease .35s";
      requestAnimationFrame(()=> setTimeout(()=>{ p.style.strokeDashoffset = 0; }, 30));
    });
  }

  return model;
}
