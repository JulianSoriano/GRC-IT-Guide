// Watches network requests (read-only, nothing is blocked or sent anywhere)
// and remembers which known trackers each tab has contacted.
importScripts("trackers.js");

const tabData = {};          // tabId -> { pageHost, trackers: { domain: {company, category, count} } }
let loaded = false;
let saveTimer = null;

async function load() {
  if (loaded) return;
  const stored = await chrome.storage.session.get("tabData");
  Object.assign(tabData, stored.tabData || {});
  loaded = true;
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => chrome.storage.session.set({ tabData }), 400);
}

function updateBadge(tabId) {
  const d = tabData[tabId];
  const n = d ? Object.keys(d.trackers).length : 0;
  chrome.action.setBadgeText({ tabId, text: n ? String(n) : "" }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ tabId, color: n >= 10 ? "#d9534f" : n >= 4 ? "#e0a020" : "#3c8d5a" }).catch(() => {});
}

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.tabId < 0) return;
    load().then(() => {
      const tabId = details.tabId;
      if (details.type === "main_frame") {
        tabData[tabId] = { pageHost: hostOf(details.url), trackers: {} };
        scheduleSave();
        updateBadge(tabId);
        return;
      }
      const host = hostOf(details.url);
      if (!host) return;
      const tracker = lookupTracker(host);
      if (!tracker) return;
      if (!tabData[tabId]) tabData[tabId] = { pageHost: hostOf(details.initiator || ""), trackers: {} };
      const d = tabData[tabId];
      if (d.pageHost && isFirstParty(tracker, d.pageHost)) return;
      const entry = d.trackers[tracker.domain] || { company: tracker.company, category: tracker.category, count: 0 };
      entry.count++;
      d.trackers[tracker.domain] = entry;
      scheduleSave();
      updateBadge(tabId);
    });
  },
  { urls: ["<all_urls>"] }
);

chrome.tabs.onRemoved.addListener((tabId) => {
  load().then(() => { delete tabData[tabId]; scheduleSave(); });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "getTab") {
    load().then(() => sendResponse(tabData[msg.tabId] || null));
    return true;
  }
});
