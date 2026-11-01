// Known tracker domains, grouped by what they do.
// A request matches if its host equals the domain or is a subdomain of it.
// Format: domain: [company, category]
const TRACKERS = {
  // ---- Advertising ----
  "doubleclick.net": ["Google", "Advertising"],
  "googlesyndication.com": ["Google", "Advertising"],
  "googleadservices.com": ["Google", "Advertising"],
  "googletagservices.com": ["Google", "Advertising"],
  "adservice.google.com": ["Google", "Advertising"],
  "2mdn.net": ["Google", "Advertising"],
  "adnxs.com": ["Microsoft (Xandr)", "Advertising"],
  "bat.bing.com": ["Microsoft", "Advertising"],
  "ads.linkedin.com": ["LinkedIn", "Advertising"],
  "amazon-adsystem.com": ["Amazon", "Advertising"],
  "criteo.com": ["Criteo", "Advertising"],
  "criteo.net": ["Criteo", "Advertising"],
  "taboola.com": ["Taboola", "Advertising"],
  "outbrain.com": ["Outbrain", "Advertising"],
  "pubmatic.com": ["PubMatic", "Advertising"],
  "rubiconproject.com": ["Magnite", "Advertising"],
  "openx.net": ["OpenX", "Advertising"],
  "casalemedia.com": ["Index Exchange", "Advertising"],
  "adsrvr.org": ["The Trade Desk", "Advertising"],
  "smartadserver.com": ["Equativ", "Advertising"],
  "teads.tv": ["Teads", "Advertising"],
  "sharethrough.com": ["Sharethrough", "Advertising"],
  "33across.com": ["33Across", "Advertising"],
  "media.net": ["Media.net", "Advertising"],
  "yieldmo.com": ["Yieldmo", "Advertising"],
  "triplelift.com": ["TripleLift", "Advertising"],
  "3lift.com": ["TripleLift", "Advertising"],
  "bidswitch.net": ["BidSwitch", "Advertising"],
  "contextweb.com": ["PulsePoint", "Advertising"],
  "advertising.com": ["Yahoo", "Advertising"],
  "ads.yahoo.com": ["Yahoo", "Advertising"],
  "adform.net": ["Adform", "Advertising"],
  "mathtag.com": ["MediaMath", "Advertising"],
  "demdex.net": ["Adobe", "Advertising"],
  "everesttech.net": ["Adobe", "Advertising"],
  "rlcdn.com": ["LiveRamp", "Advertising"],
  "liveramp.com": ["LiveRamp", "Advertising"],
  "bluekai.com": ["Oracle", "Advertising"],
  "krxd.net": ["Salesforce", "Advertising"],
  "tapad.com": ["Tapad", "Advertising"],
  "agkn.com": ["Neustar", "Advertising"],
  "quantserve.com": ["Quantcast", "Advertising"],
  "quantcount.com": ["Quantcast", "Advertising"],
  "scorecardresearch.com": ["Comscore", "Advertising"],
  "moatads.com": ["Oracle Moat", "Advertising"],
  "doubleverify.com": ["DoubleVerify", "Advertising"],
  "adsafeprotected.com": ["Integral Ad Science", "Advertising"],
  "zemanta.com": ["Outbrain", "Advertising"],
  "revcontent.com": ["Revcontent", "Advertising"],
  "mgid.com": ["MGID", "Advertising"],
  "popads.net": ["PopAds", "Advertising"],
  "propellerads.com": ["PropellerAds", "Advertising"],
  "adroll.com": ["AdRoll", "Advertising"],
  "ads-twitter.com": ["X (Twitter)", "Advertising"],
  "ads.reddit.com": ["Reddit", "Advertising"],
  "ads.tiktok.com": ["TikTok", "Advertising"],
  "analytics.tiktok.com": ["TikTok", "Advertising"],
  "ct.pinterest.com": ["Pinterest", "Advertising"],
  "sc-static.net": ["Snapchat", "Advertising"],
  "tr.snapchat.com": ["Snapchat", "Advertising"],

  // ---- Analytics (measures what you do on the site) ----
  "google-analytics.com": ["Google", "Analytics"],
  "analytics.google.com": ["Google", "Analytics"],
  "googletagmanager.com": ["Google", "Analytics"],
  "clarity.ms": ["Microsoft Clarity", "Session recording"],
  "hotjar.com": ["Hotjar", "Session recording"],
  "hotjar.io": ["Hotjar", "Session recording"],
  "fullstory.com": ["FullStory", "Session recording"],
  "mouseflow.com": ["Mouseflow", "Session recording"],
  "smartlook.com": ["Smartlook", "Session recording"],
  "luckyorange.com": ["Lucky Orange", "Session recording"],
  "logrocket.com": ["LogRocket", "Session recording"],
  "lr-ingest.io": ["LogRocket", "Session recording"],
  "inspectlet.com": ["Inspectlet", "Session recording"],
  "crazyegg.com": ["Crazy Egg", "Session recording"],
  "contentsquare.net": ["Contentsquare", "Session recording"],
  "quantummetric.com": ["Quantum Metric", "Session recording"],
  "mixpanel.com": ["Mixpanel", "Analytics"],
  "segment.com": ["Segment", "Analytics"],
  "segment.io": ["Segment", "Analytics"],
  "amplitude.com": ["Amplitude", "Analytics"],
  "heap.io": ["Heap", "Analytics"],
  "heapanalytics.com": ["Heap", "Analytics"],
  "chartbeat.com": ["Chartbeat", "Analytics"],
  "chartbeat.net": ["Chartbeat", "Analytics"],
  "newrelic.com": ["New Relic", "Analytics"],
  "nr-data.net": ["New Relic", "Analytics"],
  "omtrdc.net": ["Adobe", "Analytics"],
  "2o7.net": ["Adobe", "Analytics"],
  "kissmetrics.com": ["Kissmetrics", "Analytics"],
  "matomo.cloud": ["Matomo", "Analytics"],
  "statcounter.com": ["StatCounter", "Analytics"],
  "mc.yandex.ru": ["Yandex", "Analytics"],
  "hubspot.com": ["HubSpot", "Analytics"],
  "hs-analytics.net": ["HubSpot", "Analytics"],
  "hs-scripts.com": ["HubSpot", "Analytics"],
  "branch.io": ["Branch", "Analytics"],
  "appsflyer.com": ["AppsFlyer", "Analytics"],
  "adjust.com": ["Adjust", "Analytics"],
  "optimizely.com": ["Optimizely", "Analytics"],
  "parsely.com": ["Parse.ly", "Analytics"],
  "cxense.com": ["Piano", "Analytics"],

  // ---- Social (follows you across sites via share/like buttons and pixels) ----
  "connect.facebook.net": ["Meta (Facebook)", "Social"],
  "facebook.com": ["Meta (Facebook)", "Social"],
  "facebook.net": ["Meta (Facebook)", "Social"],
  "instagram.com": ["Meta (Instagram)", "Social"],
  "platform.twitter.com": ["X (Twitter)", "Social"],
  "analytics.twitter.com": ["X (Twitter)", "Social"],
  "static.ads-twitter.com": ["X (Twitter)", "Social"],
  "platform.linkedin.com": ["LinkedIn", "Social"],
  "snap.licdn.com": ["LinkedIn", "Social"],
  "px.ads.linkedin.com": ["LinkedIn", "Social"],
  "pinimg.com": ["Pinterest", "Social"],
  "addthis.com": ["Oracle AddThis", "Social"],
  "sharethis.com": ["ShareThis", "Social"],
  "disqus.com": ["Disqus", "Social"],
  "disquscdn.com": ["Disqus", "Social"],

  // ---- Fingerprinting (identifies your device without cookies) ----
  "fingerprintjs.com": ["FingerprintJS", "Fingerprinting"],
  "fpjs.io": ["FingerprintJS", "Fingerprinting"],
  "iovation.com": ["TransUnion", "Fingerprinting"],
  "threatmetrix.com": ["LexisNexis", "Fingerprinting"],
  "online-metrix.net": ["LexisNexis", "Fingerprinting"],
  "id5-sync.com": ["ID5", "Fingerprinting"],
  "permutive.com": ["Permutive", "Fingerprinting"],
  "lotame.com": ["Lotame", "Fingerprinting"],
  "crwdcntrl.net": ["Lotame", "Fingerprinting"],
  "zeotap.com": ["Zeotap", "Fingerprinting"],
  "pippio.com": ["LiveRamp", "Fingerprinting"]
};

const CATEGORY_INFO = {
  "Advertising": "Builds a profile of you to target ads, often shared between many companies.",
  "Analytics": "Measures what you click and read on this site.",
  "Session recording": "Can record your mouse movements, clicks and typing on the page, like a video.",
  "Social": "Lets social networks see you visited this page, even if you never click their buttons.",
  "Fingerprinting": "Tries to recognize your device without cookies, so clearing cookies doesn't stop it."
};

function lookupTracker(host) {
  host = host.toLowerCase();
  let h = host;
  while (h.includes(".")) {
    if (TRACKERS[h]) return { domain: h, company: TRACKERS[h][0], category: TRACKERS[h][1] };
    h = h.slice(h.indexOf(".") + 1);
  }
  return null;
}

// Rough "main site" of a host, e.g. www.news.bbc.co.uk -> bbc.co.uk
const TWO_PART_SUFFIXES = new Set(["co.uk", "org.uk", "ac.uk", "gov.uk", "com.au", "net.au", "org.au", "co.nz", "co.jp", "com.br", "co.in", "com.mx", "co.za", "com.cn", "com.tr", "on.ca", "qc.ca", "bc.ca"]);
function baseDomain(host) {
  const parts = host.toLowerCase().split(".");
  if (parts.length <= 2) return parts.join(".");
  const lastTwo = parts.slice(-2).join(".");
  return TWO_PART_SUFFIXES.has(lastTwo) ? parts.slice(-3).join(".") : lastTwo;
}

// Same company owning both the site and the "tracker" (e.g. facebook.com on facebook.com) isn't third-party.
const SAME_OWNER = {
  "Meta (Facebook)": ["facebook.com", "facebook.net", "instagram.com", "messenger.com", "whatsapp.com"],
  "Meta (Instagram)": ["facebook.com", "facebook.net", "instagram.com"],
  "X (Twitter)": ["twitter.com", "x.com", "twimg.com"],
  "LinkedIn": ["linkedin.com", "licdn.com"],
  "Pinterest": ["pinterest.com", "pinterest.ca", "pinimg.com"],
  "Disqus": ["disqus.com"]
};
function isFirstParty(tracker, pageHost) {
  const pageBase = baseDomain(pageHost);
  if (baseDomain(tracker.domain) === pageBase) return true;
  const owned = SAME_OWNER[tracker.company];
  return owned ? owned.includes(pageBase) : false;
}

if (typeof self !== "undefined") Object.assign(self, { TRACKERS, CATEGORY_INFO, lookupTracker, baseDomain, isFirstParty });
