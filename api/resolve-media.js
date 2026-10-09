const ALLOWED_HOSTS = [
  "science.nasa.gov","www.nasa.gov","nasa.gov","plus.nasa.gov",
  "www.jpl.nasa.gov","jpl.nasa.gov","science.jpl.nasa.gov",
  "www.pbs.org","pbs.org","player.pbs.org",
  "www.biointeractive.org","biointeractive.org",
  "pdb101.rcsb.org","www.si.edu","si.edu"
];

function allowedHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return ALLOWED_HOSTS.some(x => h === x || h.endsWith("." + x));
}

function cleanHtmlEscapes(s) {
  return String(s || "")
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&#0*38;/g, "&");
}

function isDirectVideo(u) {
  try {
    const x = new URL(u);
    return /\.(mp4|m4v|webm)$/i.test(x.pathname);
  } catch {
    return false;
  }
}

function extractDirectVideos(html, pageUrl) {
  const src = cleanHtmlEscapes(html);
  const found = [];
  const seen = new Set();
  const add = raw => {
    if (!raw) return;
    const value = cleanHtmlEscapes(raw).trim().replace(/^['"]|['"]$/g, "");
    try {
      const abs = new URL(value, pageUrl).href;
      if (!isDirectVideo(abs) || seen.has(abs)) return;
      seen.add(abs);
      found.push(abs);
    } catch {}
  };

  const patterns = [
    /<(?:source|video)[^>]+\bsrc\s*=\s*["']([^"']+)["']/gi,
    /<a[^>]+\bhref\s*=\s*["']([^"']+\.(?:mp4|m4v|webm)(?:\?[^"']*)?)["']/gi,
    /<meta[^>]+(?:property|name)\s*=\s*["'](?:og:video(?::secure_url)?|twitter:player:stream)["'][^>]+content\s*=\s*["']([^"']+)["']/gi,
    /<meta[^>]+content\s*=\s*["']([^"']+)["'][^>]+(?:property|name)\s*=\s*["'](?:og:video(?::secure_url)?|twitter:player:stream)["']/gi,
    /["'](?:contentUrl|content_url|downloadUrl|download_url|fileUrl|file_url)["']\s*:\s*["']([^"']+)["']/gi
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src))) add(m[1]);
  }

  const absolute = /https?:\\?\/\\?\/[^"'<>\s]+?\.(?:mp4|m4v|webm)(?:\?[^"'<>\s]*)?/gi;
  let m;
  while ((m = absolute.exec(src))) add(m[0]);

  return found.slice(0, 8);
}

function extractEmbeddedPlayers(html, rawUrl) {
  const src = cleanHtmlEscapes(html);
  const out = [];
  const seen = new Set();
  const add = (provider, id, url) => {
    const key = provider + ":" + (id || url || "");
    if (!id && !url || seen.has(key)) return;
    seen.add(key);
    out.push({ provider, id: id || null, url: url || null });
  };

  try {
    const p = new URL(rawUrl);
    const si = p.pathname.match(/\/object\/yt_([A-Za-z0-9_-]{6,})/);
    if (si) add("youtube", si[1], null);
  } catch {}

  const ytPatterns = [
    /(?:youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/watch\?[^"'<>\s]*?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/gi,
    /["'](?:youtubeId|youtube_id|videoId|video_id)["']\s*:\s*["']([A-Za-z0-9_-]{8,})["']/gi
  ];
  for (const re of ytPatterns) {
    let m;
    while ((m = re.exec(src))) add("youtube", m[1], null);
  }

  let m;
  const vimeo = /(?:player\.)?vimeo\.com\/(?:video\/)?(\d{6,})/gi;
  while ((m = vimeo.exec(src))) add("vimeo", m[1], null);

  const pbs = /https?:\/\/player\.pbs\.org\/(?:stationplayer|viralplayer)\/\d+\/?[^"'<>\s]*/gi;
  while ((m = pbs.exec(src))) add("pbs", null, m[0]);

  return out.slice(0, 8);
}

async function resolveOne(rawUrl) {
  let page;
  try {
    page = new URL(rawUrl);
  } catch {
    return { source: rawUrl, ok: false, reason: "invalid-url", media: [], embeds: [] };
  }
  if (page.protocol !== "https:" || !allowedHost(page.hostname)) {
    return { source: rawUrl, ok: false, reason: "host-not-allowed", media: [], embeds: [] };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(page.href, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "CosmosToLife/1.1 (+https://cosmos-to-life.vercel.app/)",
        "accept": "text/html,application/xhtml+xml"
      }
    });
    if (!r.ok) return { source: rawUrl, ok: false, reason: "source-http-" + r.status, media: [], embeds: [] };
    const type = (r.headers.get("content-type") || "").toLowerCase();
    if (!type.includes("text/html") && !type.includes("application/xhtml")) {
      return { source: rawUrl, ok: false, reason: "not-html", media: [], embeds: [] };
    }

    const html = await r.text();
    const media = extractDirectVideos(html, r.url || page.href);
    const embeds = extractEmbeddedPlayers(html, rawUrl);
    const ok = media.length > 0 || embeds.length > 0;
    return { source: rawUrl, ok, reason: ok ? null : "no-playable-source", media, embeds };
  } catch (e) {
    return { source: rawUrl, ok: false, reason: e && e.name === "AbortError" ? "timeout" : "fetch-failed", media: [], embeds: [] };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");

  let urls = [];
  if (req.method === "GET") {
    if (typeof req.query.url === "string") urls = [req.query.url];
  } else if (req.method === "POST") {
    const body = typeof req.body === "string"
      ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
      : (req.body || {});
    if (Array.isArray(body.urls)) urls = body.urls;
  } else {
    res.status(405).json({ error: "method-not-allowed" });
    return;
  }

  urls = [...new Set(urls.filter(x => typeof x === "string" && x.length < 2000))].slice(0, 50);
  if (!urls.length) {
    res.status(400).json({ error: "no-urls" });
    return;
  }

  const results = await Promise.all(urls.map(resolveOne));
  res.status(200).json({ results });
};
