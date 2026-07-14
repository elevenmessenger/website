// 🤖 Shared script for the planet-scale operations guide.
//
// This file is the single source of truth for the guide's structure. It:
//   1. renders the sidebar navigation on every page (from the PAGES list below),
//   2. renders the previous / next links at the bottom of every page,
//   3. renders the "you are here" system map at the top of every page,
//   4. adds a small anchor link to every heading that has an id.
//
// To add a page: create the HTML file (copy an existing page as a template),
// then add one entry to PAGES below, in reading order. Nothing else to update —
// every page's sidebar and pager follow this list automatically.
//
// All markup injected here is built from static, in-code strings only (the
// repo rule: never innerHTML untrusted content).

"use strict";

const PAGES = [
  { file: "index.html",       num: "01", short: "Overview",               title: "Overview and orientation" },
  { file: "router.html",      num: "02", short: "The router",             title: "The router: the front door of every box" },
  { file: "processes.html",   num: "03", short: "Processes on a box",     title: "Everything that runs on a box" },
  { file: "deploys.html",     num: "04", short: "Deploys and updates",    title: "Installing and updating the software" },
  { file: "spaces.html",      num: "05", short: "Creating spaces",        title: "Creating and removing chat spaces" },
  { file: "hibernation.html", num: "06", short: "Hibernation",            title: "Hibernation: how idle spaces sleep in object storage" },
  { file: "mesh.html",        num: "07", short: "The mesh",               title: "The mesh: running more than one box" },
  { file: "operations.html",  num: "08", short: "Day-to-day operations",  title: "Day-to-day operations and checks" },
  { file: "reference.html",   num: "09", short: "Reference",              title: "Complete reference: commands, files, variables" },
];

function currentPage() {
  const explicit = document.body.dataset.page;
  if (explicit) return explicit;
  const leaf = location.pathname.split("/").pop();
  return leaf === "" ? "index.html" : leaf;
}

// ---- sidebar ----
function renderSidebar() {
  const nav = document.querySelector("nav.side");
  if (!nav) return;
  const here = currentPage();
  const items = PAGES.map(p => {
    const current = p.file === here ? ' aria-current="page"' : "";
    return `<li><a href="${p.file}"${current}><span class="num">${p.num}</span><span>${p.short}</span></a></li>`;
  }).join("");
  nav.innerHTML =
    `<p class="brand"><a href="index.html">Running the fleet</a></p>` +
    `<p class="brand-sub">An operator&rsquo;s guide to the planet-scale system</p>` +
    `<ol>${items}</ol>`;
  nav.setAttribute("aria-label", "Guide contents");
}

// ---- previous / next pager + colophon ----
function renderPager() {
  const wrap = document.querySelector("main.content .wrap");
  if (!wrap) return;
  const here = currentPage();
  const idx = PAGES.findIndex(p => p.file === here);
  if (idx === -1) return;
  const prev = PAGES[idx - 1];
  const next = PAGES[idx + 1];
  const pager = document.createElement("footer");
  pager.className = "pager";
  let html = "";
  if (prev) html += `<a class="prev" href="${prev.file}"><span class="dir">Previous</span><span class="dest">${prev.num} &middot; ${prev.short}</span></a>`;
  if (next) html += `<a class="next" href="${next.file}"><span class="dir">Next</span><span class="dest">${next.num} &middot; ${next.short}</span></a>`;
  pager.innerHTML = html;
  wrap.appendChild(pager);

  const colophon = document.createElement("footer");
  colophon.className = "colophon";
  colophon.innerHTML =
    `\u{1F916} This guide was written by an LLM from the code and design documents in this repository. ` +
    `The code is the source of truth; if the guide and the code disagree, trust the code and please fix the guide. ` +
    `How to update it: <a href="README.html">maintaining this guide</a>. ` +
    `Deeper design rationale: <code>docs/planet-scale.md</code> and <code>docs/instance-router.md</code>.`;
  wrap.appendChild(colophon);
}

// ---- heading anchors ----
function renderHeadingAnchors() {
  document.querySelectorAll("h2[id], h3[id]").forEach(h => {
    const a = document.createElement("a");
    a.className = "hlink";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.appendChild(a);
  });
}

// ---- the system map (the "you are here" diagram) ----
//
// One SVG, drawn identically on every page; the page highlights its own
// component(s) via <div class="sysmap" data-highlight="router bucket">.
// Node keys: members, router, instances, services, control, updater,
//            bucket, backup, peer.
function sysmapSVG(highlights) {
  const hl = key => highlights.includes(key) ? ' class="here"' : "";
  return `
<svg viewBox="0 0 960 400" role="img" aria-label="Map of the whole system: members' devices reach a box over the internet; on the box a router forwards traffic to chat space instances and sibling services; a control daemon and provisioner create spaces; an updater installs new versions; object storage holds parked spaces, leases, heartbeats and backups; peer boxes form the mesh.">
  <!-- zone: the internet -->
  <rect class="zone" x="10" y="34" width="140" height="330" rx="10"></rect>
  <text class="zonelabel" x="24" y="24">THE INTERNET</text>
  <g${hl("members")}>
    <rect class="node" x="26" y="150" width="108" height="72" rx="7"></rect>
    <text class="boxlabel" x="80" y="180" text-anchor="middle">Members&rsquo;</text>
    <text class="boxlabel" x="80" y="196" text-anchor="middle">devices</text>
    <text class="sublabel" x="80" y="211" text-anchor="middle">browsers, apps</text>
  </g>

  <!-- zone: one box -->
  <rect class="zone" x="180" y="34" width="440" height="330" rx="10"></rect>
  <text class="zonelabel" x="194" y="24">ONE BOX (A LINUX SERVER)</text>

  <g${hl("router")}>
    <rect class="node" x="200" y="60" width="150" height="86" rx="7"></rect>
    <text class="boxlabel" x="275" y="88" text-anchor="middle">lchat router</text>
    <text class="sublabel" x="275" y="104" text-anchor="middle">TLS on ports 80 / 443</text>
    <text class="sublabel" x="275" y="119" text-anchor="middle">host &rarr; unix socket</text>
    <text class="sublabel" x="275" y="134" text-anchor="middle">activator lives inside</text>
  </g>

  <g${hl("instances")}>
    <rect class="node" x="420" y="52" width="180" height="34" rx="7"></rect>
    <text class="boxlabel" x="510" y="73" text-anchor="middle">instance: chat-a.example.com</text>
    <rect class="node" x="420" y="94" width="180" height="34" rx="7"></rect>
    <text class="boxlabel" x="510" y="115" text-anchor="middle">instance: chat-b.example.com</text>
    <rect class="node" x="420" y="136" width="180" height="34" rx="7"></rect>
    <text class="boxlabel" x="510" y="157" text-anchor="middle">bot sidecars (one per instance)</text>
  </g>

  <g${hl("services")}>
    <rect class="node" x="420" y="186" width="180" height="46" rx="7"></rect>
    <text class="boxlabel" x="510" y="205" text-anchor="middle">sibling services</text>
    <text class="sublabel" x="510" y="221" text-anchor="middle">home server, push relay</text>
  </g>

  <g${hl("control")}>
    <rect class="node" x="200" y="186" width="150" height="62" rx="7"></rect>
    <text class="boxlabel" x="275" y="207" text-anchor="middle">control daemon +</text>
    <text class="boxlabel" x="275" y="222" text-anchor="middle">cloud provisioner</text>
    <text class="sublabel" x="275" y="238" text-anchor="middle">creates chat spaces</text>
  </g>

  <g${hl("updater")}>
    <rect class="node" x="200" y="272" width="150" height="62" rx="7"></rect>
    <text class="boxlabel" x="275" y="295" text-anchor="middle">auto-updater</text>
    <text class="sublabel" x="275" y="311" text-anchor="middle">hourly timer; installs</text>
    <text class="sublabel" x="275" y="325" text-anchor="middle">signed releases</text>
  </g>

  <!-- zone: object storage -->
  <rect class="zone" x="650" y="34" width="300" height="190" rx="10"></rect>
  <text class="zonelabel" x="664" y="24">OBJECT STORAGE (AMAZON S3)</text>

  <g${hl("bucket")}>
    <rect class="node" x="668" y="52" width="264" height="86" rx="7"></rect>
    <text class="boxlabel" x="800" y="76" text-anchor="middle">hibernation bucket</text>
    <text class="sublabel" x="800" y="93" text-anchor="middle">parked space databases &middot; per-space locks</text>
    <text class="sublabel" x="800" y="108" text-anchor="middle">mesh membership heartbeats</text>
    <text class="sublabel" x="800" y="123" text-anchor="middle">one prefix per chat space</text>
  </g>

  <g${hl("backup")}>
    <rect class="node" x="668" y="152" width="264" height="56" rx="7"></rect>
    <text class="boxlabel" x="800" y="176" text-anchor="middle">fleet-backup bucket</text>
    <text class="sublabel" x="800" y="192" text-anchor="middle">continuous copies of every database</text>
  </g>

  <!-- zone: peer boxes -->
  <rect class="zone" x="650" y="252" width="300" height="112" rx="10"></rect>
  <text class="zonelabel" x="664" y="246">OTHER BOXES &mdash; THE MESH</text>

  <g${hl("peer")}>
    <rect class="node" x="668" y="268" width="264" height="38" rx="7"></rect>
    <text class="boxlabel" x="800" y="292" text-anchor="middle">peer box 2 (same software)</text>
    <rect class="node" x="668" y="314" width="264" height="38" rx="7"></rect>
    <text class="boxlabel" x="800" y="338" text-anchor="middle">peer box 3 (same software)</text>
  </g>

  <!-- wires -->
  <line class="wire" x1="134" y1="186" x2="200" y2="110" marker-end="url(#arr)"></line>
  <line class="wire" x1="350" y1="90" x2="420" y2="70" marker-end="url(#arr)"></line>
  <line class="wire" x1="350" y1="100" x2="420" y2="110" marker-end="url(#arr)"></line>
  <line class="wire" x1="350" y1="120" x2="420" y2="205" marker-end="url(#arr)"></line>
  <line class="wire" x1="350" y1="80" x2="668" y2="80" marker-end="url(#arr)"></line>
  <line class="wire" x1="600" y1="180" x2="668" y2="180" marker-end="url(#arr)"></line>
  <line class="wire" x1="800" y1="268" x2="800" y2="224" marker-end="url(#arr)"></line>
  <defs>
    <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor" opacity="0.55"></path>
    </marker>
  </defs>
</svg>`;
}

function renderSysmap() {
  const holder = document.querySelector(".sysmap");
  if (!holder) return;
  const highlights = (holder.dataset.highlight || "").split(/\s+/).filter(Boolean);
  holder.innerHTML = sysmapSVG(highlights);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderSysmap();
  renderHeadingAnchors();
  renderPager();
});
