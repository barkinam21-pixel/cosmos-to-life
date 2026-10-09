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
    .replace(/&#0*38;/g, "&")
    .replace(/&quot;|&#0*34;/g, '"')
    .replace(/&#x0*22;/gi, '"');
}

function isDirectVideo(u) {
  try {
    const x = new URL(u);
    const p = x.pathname.toLowerCase();
    if (p.includes("/favicons/") || /\/favicon[^/]*$/i.test(p) || /\/site\.webm$/i.test(p)) return false;
    return /\.(mp4|m4v|webm)$/i.test(p);
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

function extractHlsStreams(html, pageUrl) {
  const src = cleanHtmlEscapes(html);
  const found = [];
  const seen = new Set();
  const add = raw => {
    if (!raw) return;
    const value = cleanHtmlEscapes(raw).trim().replace(/^['"]|['"]$/g, "");
    try {
      const abs = new URL(value, pageUrl).href;
      if (!/\.m3u8(?:$|\?)/i.test(abs) || seen.has(abs)) return;
      seen.add(abs);
      found.push(abs);
    } catch {}
  };
  const patterns = [
    /https?:\\?\/\\?\/[^"'<>\s]+?\.m3u8(?:\?[^"'<>\s]*)?/gi,
    /["'](?:url|src|file|hls|stream)["']\s*:\s*["']([^"']+\.m3u8(?:\?[^"']*)?)["']/gi
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src))) add(m[1] || m[0]);
  }
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


async function resolvePbsEncodings(rawUrl) {
  let id = null;
  try {
    const p = new URL(rawUrl);
    if (p.hostname !== "player.pbs.org") return { media: [], hls: [] };
    const m = p.pathname.match(/\/(?:viralplayer|stationplayer|portalplayer)\/(\d+)/);
    if (!m) return { media: [], hls: [] };
    id = m[1];
  } catch {
    return { media: [], hls: [] };
  }

  const portal = "https://player.pbs.org/portalplayer/" + id + "/";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const r = await fetch(portal, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "CosmosToLife/1.2 (+https://cosmos-to-life.vercel.app/)",
        "accept": "text/html,application/xhtml+xml"
      }
    });
    if (!r.ok) return { media: [], hls: [] };
    const html = cleanHtmlEscapes(await r.text());
    const m = html.match(/window\.videoBridge\s*=\s*(\{[\s\S]*?\})\s*;/);
    if (!m) return { media: [], hls: [] };

    let bridge;
    try { bridge = JSON.parse(m[1]); } catch { return { media: [], hls: [] }; }
    const encodings = Array.isArray(bridge.encodings) ? bridge.encodings : [];
    const media = [];
    const hls = [];
    const seen = new Set();

    for (const enc of encodings.slice(0, 6)) {
      if (typeof enc !== "string" || !/^https:\/\//i.test(enc)) continue;
      try {
        let rr;
        try {
          rr = await fetch(enc, {
            method: "HEAD",
            redirect: "follow",
            headers: { "user-agent": "CosmosToLife/1.2 (+https://cosmos-to-life.vercel.app/)" }
          });
        } catch {}
        if (!rr || !rr.url) {
          rr = await fetch(enc, {
            method: "GET",
            redirect: "follow",
            headers: {
              "user-agent": "CosmosToLife/1.2 (+https://cosmos-to-life.vercel.app/)",
              "range": "bytes=0-0"
            }
          });
        }
        const finalUrl = rr && rr.url ? rr.url : enc;
        const type = rr && rr.headers ? String(rr.headers.get("content-type") || "").toLowerCase() : "";
        if (seen.has(finalUrl)) continue;
        seen.add(finalUrl);
        if (/\.m3u8(?:$|\?)/i.test(finalUrl) || /mpegurl/.test(type)) hls.push(finalUrl);
        else if (/\.(?:mp4|m4v|webm)(?:$|\?)/i.test(finalUrl) || /^video\//.test(type)) media.push(finalUrl);
      } catch {}
    }
    return { media, hls };
  } catch {
    return { media: [], hls: [] };
  } finally {
    clearTimeout(timer);
  }
}

async function resolveOne(rawUrl) {
  let page;
  try {
    page = new URL(rawUrl);
  } catch {
    return { source: rawUrl, ok: false, reason: "invalid-url", media: [], hls: [], embeds: [] };
  }
  if (page.protocol !== "https:" || !allowedHost(page.hostname)) {
    return { source: rawUrl, ok: false, reason: "host-not-allowed", media: [], hls: [], embeds: [] };
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
    if (!r.ok) return { source: rawUrl, ok: false, reason: "source-http-" + r.status, media: [], hls: [], embeds: [] };
    const type = (r.headers.get("content-type") || "").toLowerCase();
    if (!type.includes("text/html") && !type.includes("application/xhtml")) {
      return { source: rawUrl, ok: false, reason: "not-html", media: [], hls: [], embeds: [] };
    }

    const html = await r.text();
    let media = extractDirectVideos(html, r.url || page.href);
    let hls = extractHlsStreams(html, r.url || page.href);
    const embeds = extractEmbeddedPlayers(html, rawUrl);

    const pbsDirect = await resolvePbsEncodings(rawUrl);
    media = [...new Set([...pbsDirect.media, ...media])];
    hls = [...new Set([...pbsDirect.hls, ...hls])];

    if (!media.length && !hls.length) {
      for (const embed of embeds) {
        if (embed.provider === "pbs" && embed.url) {
          const nested = await resolvePbsEncodings(embed.url);
          media = [...new Set([...nested.media, ...media])];
          hls = [...new Set([...nested.hls, ...hls])];
          if (media.length || hls.length) break;
        }
      }
    }

    const ok = media.length > 0 || hls.length > 0 || embeds.length > 0;
    return { source: rawUrl, ok, reason: ok ? null : "no-playable-source", media, hls, embeds };
  } catch (e) {
    return { source: rawUrl, ok: false, reason: e && e.name === "AbortError" ? "timeout" : "fetch-failed", media: [], hls: [], embeds: [] };
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
