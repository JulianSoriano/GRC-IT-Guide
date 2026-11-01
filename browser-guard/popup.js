// ---------- helpers ----------
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LEVEL_LABEL = { ok: "Looks fine", warn: "Worth a look", bad: "Red flag" };

// ---------- what each permission means, in plain English ----------
// level: "info" = shown, doesn't change the verdict; "warn" = worth a look; "bad" = red flag
const PERMS = {
  debugger:          ["bad",  "Can take full control of web pages, including reading passwords as you type them. Almost no normal extension needs this."],
  nativeMessaging:   ["warn", "Can talk to a program installed on your computer. Password managers use this; most other extensions shouldn't."],
  proxy:             ["warn", "Can route all your internet traffic through another server. Normal for VPN extensions, suspicious for anything else."],
  desktopCapture:    ["warn", "Can record your screen."],
  tabCapture:        ["warn", "Can record what's showing in your tabs."],
  clipboardRead:     ["warn", "Can read whatever you've copied (passwords, bank numbers, etc.)."],
  history:           ["warn", "Can see every website you've ever visited in this browser."],
  cookies:           ["warn", "Can read your website log-ins (cookies), which could let someone sign in as you."],
  webRequest:        ["info", "Can watch the traffic between your browser and websites. Ad blockers use this."],
  webRequestBlocking:["warn", "Can change the traffic between your browser and websites."],
  management:        ["warn", "Can see, turn off or remove your other extensions (including security ones)."],
  privacy:           ["warn", "Can change your browser's privacy settings."],
  contentSettings:   ["warn", "Can change which sites get your camera, microphone, location and pop-ups."],
  browsingData:      ["warn", "Can delete your history and cookies, which can be used to hide its tracks."],
  geolocation:       ["warn", "Can see your location."],
  topSites:          ["info", "Can see the sites you visit most."],
  sessions:          ["info", "Can see tabs you recently closed, including on your other devices."],
  tabs:              ["info", "Can see the titles and addresses of your open tabs."],
  webNavigation:     ["info", "Gets told every time you go to a new page."],
  downloads:         ["info", "Can see and start downloads."],
  scripting:         ["info", "Can add its own code to web pages it has access to."],
  identity:          ["info", "Can ask to sign in with your Google account."],
  "identity.email":  ["warn", "Can see the email address of your Google account."],
  declarativeNetRequest: ["info", "Can block or redirect web requests (ad blockers use this)."],
  declarativeNetRequestWithHostAccess: ["info", "Can block or redirect web requests on the sites it has access to."],
  enterprise:        ["warn", "Uses features meant for company-managed computers."]
};
const ALL_SITES = ["<all_urls>", "*://*/*", "http://*/*", "https://*/*", "*://*/", "http://*/", "https://*/"];
const STORE_UPDATE_HOSTS = ["clients2.google.com", "update.googleapis.com", "chrome.google.com"];

function scanExtension(ext) {
  const reasons = []; // {level, text}
  const perms = ext.permissions || [];
  const hosts = ext.hostPermissions || [];
  const allSites = hosts.some((h) => ALL_SITES.includes(h));

  // Where did it come from?
  if (ext.installType === "sideload") {
    reasons.push({ level: "bad", text: "Installed by another program on your computer, not by you through the Chrome Web Store. This is how a lot of adware and spyware gets in." });
  } else if (ext.installType === "admin") {
    reasons.push({ level: "bad", text: "Forced on by a computer policy, so you can't remove it normally. Fine on a work computer; on a personal computer this is a classic hijacker trick." });
  } else if (ext.installType === "development") {
    reasons.push({ level: "warn", text: "Loaded manually from a folder (developer mode). Fine if you added it yourself, like this one." });
  }
  if (ext.updateUrl && ext.installType !== "development") {
    let host = "";
    try { host = new URL(ext.updateUrl).hostname; } catch {}
    if (!STORE_UPDATE_HOSTS.includes(host)) {
      reasons.push({ level: "bad", text: `Gets its updates from ${host || "an unknown server"} instead of the Chrome Web Store, so Google never checks them.` });
    }
  }
  if (ext.disabledReason === "permissions_increase") {
    reasons.push({ level: "warn", text: "Chrome turned it off because an update asked for more access than before." });
  }

  // What can it do?
  if (allSites) {
    reasons.push({ level: "warn", text: "Can read and change everything on every website you visit, including what you type." });
  } else if (hosts.length) {
    reasons.push({ level: "info", text: `Has access to ${hosts.length} specific site${hosts.length > 1 ? "s" : ""}.` });
  }
  for (const p of perms) {
    if (PERMS[p]) reasons.push({ level: PERMS[p][0], text: PERMS[p][1] });
  }
  if (allSites && perms.includes("cookies") && (perms.includes("webRequest") || perms.includes("history"))) {
    reasons.push({ level: "warn", text: "This mix of access (all sites + log-ins + traffic or history) is what spyware extensions usually ask for. Make sure you trust who made it." });
  }

  let level = "ok";
  if (reasons.some((r) => r.level === "bad")) level = "bad";
  else if (reasons.some((r) => r.level === "warn")) level = "warn";

  const order = { bad: 0, warn: 1, info: 2 };
  reasons.sort((a, b) => order[a.level] - order[b.level]);
  return { level, reasons };
}

// ---------- panels ----------
let extResults = [];
let extFilter = "issues";
let proxyState = null;
let pageInfo = null;

async function loadExtensions() {
  const all = await chrome.management.getAll();
  extResults = all
    .filter((e) => e.id !== chrome.runtime.id && e.type !== "theme")
    .map((e) => ({ ext: e, ...scanExtension(e) }))
    .sort((a, b) => ({ bad: 0, warn: 1, ok: 2 }[a.level] - { bad: 0, warn: 1, ok: 2 }[b.level]) || a.ext.name.localeCompare(b.ext.name));
}

function renderExtensions() {
  const el = $("#ext");
  if (!extResults.length) {
    el.innerHTML = `<div class="empty">You have no other extensions installed. 👍</div>`;
    return;
  }
  const shown = extFilter === "issues" ? extResults.filter((r) => r.level !== "ok") : extResults;
  const counts = { bad: 0, warn: 0, ok: 0 };
  extResults.forEach((r) => counts[r.level]++);

  let html = `
    <div class="filter">
      <button class="btn ${extFilter === "issues" ? "on" : ""}" data-filter="issues">Needs attention (${counts.bad + counts.warn})</button>
      <button class="btn ${extFilter === "all" ? "on" : ""}" data-filter="all">All (${extResults.length})</button>
    </div>
    <p class="small muted" style="margin:0 0 10px">Tip: if you don't recognize an extension or don't remember installing it, remove it.</p>`;

  if (!shown.length) html += `<div class="empty">Nothing needs your attention. All ${extResults.length} extensions look fine.</div>`;

  for (const r of shown) {
    const e = r.ext;
    const canAct = e.mayDisable !== false;
    html += `
      <div class="card">
        <div class="row">
          <span class="name" title="${esc(e.name)}">${esc(e.name)}${e.enabled ? "" : ' <span class="muted small">(turned off)</span>'}</span>
          <span class="pill ${r.level}">${LEVEL_LABEL[r.level]}</span>
        </div>
        ${r.reasons.length ? `<ul class="reasons">${r.reasons.map((x) => `<li class="${x.level === "bad" ? "bad" : ""}">${esc(x.text)}</li>`).join("")}</ul>` : `<p class="small muted" style="margin:6px 0 0">Asks for very little access.</p>`}
        <div class="actions">
          ${canAct && e.enabled ? `<button class="btn" data-act="disable" data-id="${e.id}">Turn off</button>` : ""}
          ${canAct && !e.enabled ? `<button class="btn" data-act="enable" data-id="${e.id}">Turn on</button>` : ""}
          ${canAct ? `<button class="btn danger" data-act="remove" data-id="${e.id}">Remove</button>` : `<span class="small muted">Locked by a policy. See the Settings tab.</span>`}
          <button class="btn" data-act="details" data-id="${e.id}">Details</button>
        </div>
      </div>`;
  }
  el.innerHTML = html;
}

async function loadProxy() {
  try {
    proxyState = await chrome.proxy.settings.get({ incognito: false });
  } catch {
    proxyState = null;
  }
}

function proxyVerdict() {
  if (!proxyState) return { level: "warn", title: "Couldn't check", text: "Couldn't read the connection settings." };
  const mode = proxyState.value?.mode;
  const byExt = proxyState.levelOfControl === "controlled_by_other_extensions";
  if (mode === "fixed_servers" || mode === "pac_script") {
    const where = proxyState.value?.rules?.singleProxy?.host || proxyState.value?.rules?.proxyForHttps?.host || proxyState.value?.rules?.proxyForHttp?.host || proxyState.value?.pacScript?.url || "another server";
    return {
      level: byExt ? "warn" : "bad",
      title: "Your traffic is being redirected",
      text: `Your browsing is going through ${esc(where)}${byExt ? ", set by one of your extensions. That's normal if you use a VPN extension and it's switched on." : ". If you didn't set this up (for example a work or school network), something may be spying on your traffic."}`
    };
  }
  return { level: "ok", title: "Connection settings look normal", text: "Your browser connects to websites directly (or uses your computer's normal network settings)." };
}

function renderSettings() {
  const v = proxyVerdict();
  const allSitesCount = extResults.filter((r) => (r.ext.hostPermissions || []).some((h) => ALL_SITES.includes(h)) && r.ext.enabled).length;
  $("#settings").innerHTML = `
    <div class="card">
      <div class="row"><span class="name">Internet connection (proxy)</span><span class="pill ${v.level}">${LEVEL_LABEL[v.level]}</span></div>
      <p class="small muted" style="margin:6px 0 0"><b style="color:var(--text)">${esc(v.title)}.</b> ${v.text}</p>
    </div>
    <div class="card">
      <div class="row"><span class="name">Extensions that can see every site</span><span class="pill ${allSitesCount > 5 ? "warn" : "ok"}">${allSitesCount}</span></div>
      <p class="small muted" style="margin:6px 0 0">The fewer the better. Each one could read anything you type on any website.</p>
    </div>
    <p class="small muted" style="margin:12px 0 6px">Some checks only Chrome itself can do. These buttons open the right page:</p>
    <div class="card">
      <div class="row"><span class="name">Chrome Safety Check</span><button class="btn" data-open="chrome://settings/safetyCheck">Open</button></div>
      <p class="small muted" style="margin:6px 0 0">Checks for leaked passwords, harmful software and updates.</p>
    </div>
    <div class="card">
      <div class="row"><span class="name">Policies on this computer</span><button class="btn" data-open="chrome://policy">Open</button></div>
      <p class="small muted" style="margin:6px 0 0">On a personal computer this page should say <i>No policies set</i>. If it lists policies you didn't set, a program may have taken control of Chrome.</p>
    </div>
    <div class="card">
      <div class="row"><span class="name">Site permissions</span><button class="btn" data-open="chrome://settings/content">Open</button></div>
      <p class="small muted" style="margin:6px 0 0">See which websites can use your camera, mic, location or send you notifications. Spammy notifications are a common trick.</p>
    </div>
    <div class="card">
      <div class="row"><span class="name">Search engine &amp; start page</span><button class="btn" data-open="chrome://settings/search">Open</button></div>
      <p class="small muted" style="margin:6px 0 0">Hijackers often swap your search engine for one that tracks you. Make sure it's one you picked.</p>
    </div>`;
}

async function loadPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || "";
  if (!/^https?:/.test(url)) { pageInfo = { notWeb: true }; return; }
  const data = await chrome.runtime.sendMessage({ type: "getTab", tabId: tab.id });
  pageInfo = { host: new URL(url).hostname, data };
}

function trackerCount() {
  return pageInfo?.data ? Object.keys(pageInfo.data.trackers).length : 0;
}

function renderPage() {
  const el = $("#page");
  if (pageInfo.notWeb) {
    el.innerHTML = `<div class="empty">Open a regular website to see which trackers it uses.</div>`;
    return;
  }
  if (!pageInfo.data) {
    el.innerHTML = `<div class="empty">No information for this page yet.<br><br><button class="btn" id="reload">Reload page to scan it</button></div>`;
    return;
  }
  const trackers = Object.entries(pageInfo.data.trackers);
  if (!trackers.length) {
    el.innerHTML = `<div class="empty"><b style="color:var(--ok)">No known trackers found</b> on ${esc(pageInfo.host)}.</div>`;
    return;
  }
  const byCat = {};
  for (const [domain, t] of trackers) (byCat[t.category] ||= []).push({ domain, ...t });
  const order = ["Session recording", "Fingerprinting", "Advertising", "Social", "Analytics"];
  let html = `<p class="small muted" style="margin:0 0 8px">Companies <b style="color:var(--text)">${esc(pageInfo.host)}</b> shared your visit with:</p>`;
  for (const cat of order) {
    if (!byCat[cat]) continue;
    const companies = new Set(byCat[cat].map((t) => t.company));
    html += `<div class="card">
      <div class="cat-head"><b>${esc(cat)}</b><span class="small muted">${companies.size} compan${companies.size > 1 ? "ies" : "y"}</span></div>
      <p class="cat-desc">${esc(CATEGORY_INFO[cat])}</p>
      ${byCat[cat].sort((a, b) => b.count - a.count).map((t) => `<div class="tracker"><span>${esc(t.company)} <span class="muted">${esc(t.domain)}</span></span><span class="muted">${t.count}×</span></div>`).join("")}
    </div>`;
  }
  html += `<p class="small muted">Trackers aren't viruses, but they build a profile of you. A blocker like uBlock Origin Lite stops most of them.</p>`;
  el.innerHTML = html;
}

function renderSummary() {
  const bad = extResults.filter((r) => r.level === "bad").length;
  const warn = extResults.filter((r) => r.level === "warn").length;
  const pv = proxyVerdict();
  const n = trackerCount();
  let level = "ok", title = "No signs of spyware", detail = [];

  if (bad || pv.level === "bad") { level = "bad"; title = "Found something to deal with"; }
  else if (warn || pv.level === "warn") { level = "warn"; title = "Nothing alarming, a few things to review"; }

  if (bad) detail.push(`${bad} extension${bad > 1 ? "s" : ""} flagged red`);
  if (warn) detail.push(`${warn} worth a look`);
  if (pv.level !== "ok") detail.push("connection is being redirected");
  if (!pageInfo?.notWeb && pageInfo?.data) detail.push(`${n} tracker${n === 1 ? "" : "s"} on this site`);
  if (!detail.length) detail.push("Extensions and connection settings look clean");

  const s = $("#summary");
  s.className = `summary ${level}`;
  s.innerHTML = `<strong>${esc(title)}</strong><span>${esc(detail.join(" · "))}</span>`;
}

async function refreshAll() {
  await Promise.all([loadExtensions(), loadProxy(), loadPage()]);
  renderSummary();
  renderPage();
  renderExtensions();
  renderSettings();
}

// ---------- events ----------
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button");
  if (!t) return;

  if (t.classList.contains("tab")) {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === t));
    document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === t.dataset.panel));
    return;
  }
  if (t.dataset.filter) { extFilter = t.dataset.filter; renderExtensions(); return; }
  if (t.dataset.open) { chrome.tabs.create({ url: t.dataset.open }); return; }
  if (t.id === "reload") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.reload(tab.id);
    window.close();
    return;
  }
  const id = t.dataset.id;
  try {
    if (t.dataset.act === "disable") await chrome.management.setEnabled(id, false);
    if (t.dataset.act === "enable") await chrome.management.setEnabled(id, true);
    if (t.dataset.act === "remove") await chrome.management.uninstall(id, { showConfirmDialog: true });
    if (t.dataset.act === "details") { chrome.tabs.create({ url: `chrome://extensions/?id=${id}` }); return; }
  } catch (e) {
    // user cancelled the remove dialog, or the extension is locked
  }
  await loadExtensions();
  renderSummary();
  renderExtensions();
  renderSettings();
});

refreshAll();
