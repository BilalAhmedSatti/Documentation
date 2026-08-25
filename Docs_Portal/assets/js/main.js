/* ============================================================================
   MAIN.JS — navigation, catalog rendering/search/filter, small utilities.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", ()=>{
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (toggle && nav){
    toggle.addEventListener("click", ()=> nav.classList.toggle("open"));
  }
});

function fileExt(path){
  const m = /\.(\w+)$/.exec(path);
  return m ? m[1].toUpperCase() : "";
}
function fileIcon(ext){
  if (ext==="MD") return "\u2261";
  if (ext==="PPTX") return "\u25A4";
  if (ext==="ZIP") return "\u25A3";
  return "\u25A6";
}

const CATEGORY_ORDER = ["Blueprint Specification","Design Companion","Feature Specification","Decision Record","Plan & Milestone","Presentation"];
const CATEGORY_LABEL = {
  "Blueprint Specification":"Blueprint specifications",
  "Design Companion":"Design companions",
  "Feature Specification":"Feature specifications",
  "Decision Record":"Decision records (ADR)",
  "Plan & Milestone":"Plans & milestones",
  "Presentation":"Presentations",
};

/* -------------------------------------------------- build catalog entries */
function buildCatalogEntries(){
  const entries = [];

  COMPONENTS.forEach(c=>{
    entries.push({
      category:"Blueprint Specification", num:c.num, title:c.name, kind:c.kind, tags:c.tags,
      squad:c.squad, runtime:c.runtime,
      summary:c.summary, file:c.blueprint,
      siblings:[ {label:"Feature spec", file:c.feature}, {label:"Design doc", file:c.design} ]
    });
    entries.push({
      category:"Design Companion", num:c.num, title:c.name+" \u2014 Design", kind:c.kind, tags:c.tags,
      squad:c.squad, runtime:c.runtime,
      summary:"Code-level interfaces, DDL excerpts, sequence diagrams and test gates.", file:c.design,
      siblings:[ {label:"Blueprint spec", file:c.blueprint}, {label:"Feature spec", file:c.feature} ]
    });
    entries.push({
      category:"Feature Specification", num:c.num, title:c.name+" \u2014 Feature Spec", kind:c.kind, tags:c.tags,
      squad:c.squad, runtime:c.runtime,
      summary:"MoSCoW feature catalogue, functional/non-functional requirements, dependencies, risks.", file:c.feature,
      siblings:[ {label:"Blueprint spec", file:c.blueprint}, {label:"Design doc", file:c.design} ]
    });
  });

  const CAT_MAP = { blueprint:"Blueprint Specification", plan:"Plan & Milestone", adr:"Decision Record", deck:"Presentation" };
  EXTRAS.forEach(e=>{
    const siblings = e.design ? [{label:"Design doc", file:e.design}] : [];
    entries.push({ category:CAT_MAP[e.category], num:e.num, title:e.name, kind:"doc", tags:[],
      squad:"", runtime:"", summary:e.summary, file:e.file, siblings });
    if (e.design){
      entries.push({ category:"Design Companion", num:e.num, title:e.name+" \u2014 Design", kind:"doc", tags:[],
        squad:"", runtime:"", summary:"Engineering design companion.", file:e.design,
        siblings:[{label:"Blueprint doc", file:e.file}] });
    }
  });

  return entries;
}

function tagChip(tag){
  const map = {
    "shared":"chip-shared","new":"chip-new","jvm":"chip-jvm","foundation":"chip-foundation",
    "critical-path":"chip-critical","optional":"chip-optional","core":"chip-service","dual-lang":"chip-adapter"
  };
  const cls = map[tag] || "chip-optional";
  const label = { "critical-path":"Critical path","dual-lang":"Dual language","jvm":"JVM","new":"New build" }[tag] || (tag.charAt(0).toUpperCase()+tag.slice(1));
  return `<span class="chip ${cls}">${label}</span>`;
}

function entryCardHTML(e){
  const ext = fileExt(e.file);
  const kindClass = e.kind==="adapter" ? "adapter" : "service";
  const numDisplay = e.num==="\u2014" ? "\u2014" : e.num;
  const tagHTML = [ e.kind==="service"?tagChip("core"):"", e.kind==="adapter"?"":"" ]
    .concat((e.tags||[]).slice(0,3).map(tagChip)).filter(Boolean).join("");
  const sibLinks = (e.siblings||[]).filter(s=>s.file).map(s=>
    `<a href="${s.file}" target="_blank" rel="noopener">${s.label} \u2197</a>`).join("");

  return `<div class="doc-card" data-title="${e.title.toLowerCase()}" data-summary="${(e.summary||'').toLowerCase()}" data-num="${e.num.toLowerCase()}" data-category="${e.category}" data-kind="${e.kind}" data-tags="${(e.tags||[]).join(',')}">
    <div class="card-top">
      <span class="badge-num ${kindClass}">${numDisplay}</span>
      <div>
        <h4>${e.title}</h4>
        ${e.squad ? `<div class="meta-line">${e.squad}${e.runtime? " \u00b7 "+e.runtime:""}</div>` : `<div class="meta-line">${ext} document</div>`}
      </div>
    </div>
    <p class="desc">${e.summary}</p>
    ${tagHTML ? `<div class="chiprow">${tagHTML}</div>` : ""}
    <div class="card-links">
      <a href="${e.file}" target="_blank" rel="noopener"><b>Open ${ext}</b> \u2197</a>
      ${sibLinks}
    </div>
  </div>`;
}

let ACTIVE_CATEGORY = "All";
let ACTIVE_TAG = "All";

function matchesTag(e, tag){
  if (tag==="All") return true;
  if (tag==="Service") return e.kind==="service";
  if (tag==="Adapter") return e.kind==="adapter";
  const slug = tag.toLowerCase().replace(/\s+/g,"-");
  return (e.tags||[]).includes(slug);
}

function renderCatalog(){
  const all = window.__catalogEntries || (window.__catalogEntries = buildCatalogEntries());
  const q = (document.getElementById("catSearch")?.value || "").trim().toLowerCase();

  const filtered = all.filter(e=>{
    if (ACTIVE_CATEGORY!=="All" && e.category!==ACTIVE_CATEGORY) return false;
    if (!matchesTag(e, ACTIVE_TAG)) return false;
    if (q && !(e.title.toLowerCase().includes(q) || (e.summary||"").toLowerCase().includes(q) || e.num.toLowerCase().includes(q))) return false;
    return true;
  });

  const mount = document.getElementById("catalogGroups");
  const countEl = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  if (countEl) countEl.textContent = filtered.length + (filtered.length===1?" document":" documents");
  if (!mount) return;

  if (!filtered.length){
    mount.innerHTML = "";
    noResults && noResults.classList.add("show");
    return;
  }
  noResults && noResults.classList.remove("show");

  if (ACTIVE_CATEGORY!=="All"){
    mount.innerHTML = `<div class="doc-grid">${filtered.map(entryCardHTML).join("")}</div>`;
    return;
  }

  let html = "";
  CATEGORY_ORDER.forEach(cat=>{
    const group = filtered.filter(e=>e.category===cat);
    if (!group.length) return;
    html += `<div class="cat-group"><h3>${CATEGORY_LABEL[cat]} \u00b7 ${group.length}</h3><div class="doc-grid">${group.map(entryCardHTML).join("")}</div></div>`;
  });
  mount.innerHTML = html;
}

function initCatalogPage(){
  renderCatalog();
  document.getElementById("catSearch")?.addEventListener("input", renderCatalog);
  document.querySelectorAll("[data-cat-filter]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll("[data-cat-filter]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      ACTIVE_CATEGORY = btn.dataset.catFilter;
      renderCatalog();
    });
  });
  document.querySelectorAll("[data-tag-filter]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll("[data-tag-filter]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      ACTIVE_TAG = btn.dataset.tagFilter;
      renderCatalog();
    });
  });
}
