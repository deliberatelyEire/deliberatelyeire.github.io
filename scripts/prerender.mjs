// Prerender each sitemap route to static HTML.
//
// The site is a client-rendered SPA, so dist/index.html ships an empty
// <div id="root"> and every crawler that does not execute JavaScript sees
// nothing: no article text, no meta tags, no JSON-LD. Googlebot renders JS,
// but AI crawlers and social scrapers generally do not.
//
// This serves dist/ locally, loads each route in headless Chrome, and writes
// the rendered DOM back to dist/<route>/index.html. The SPA still hydrates on
// top of it.

import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const DIST = resolve("dist");

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".xml": "application/xml",
  ".txt": "text/plain",
};

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((c) => existsSync(c)) || null;
}

async function routesFromSitemap() {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs.map((u) => new URL(u).pathname.replace(/\/$/, "") || "/");
}

function serve(port) {
  const server = http.createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = join(DIST, urlPath);
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (!existsSync(file) || !extname(file)) {
      // SPA fallback: the router resolves the route client-side.
      file = join(DIST, "index.html");
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(port, "127.0.0.1", () => ok(server)));
}

const chrome = findChrome();
if (!chrome) {
  console.error(
    "prerender: no Chrome binary found. Set CHROME_PATH, or install Chrome/Chromium.\n" +
    "Refusing to ship a client-only build: article HTML and meta tags would be\n" +
    "invisible to AI crawlers and social scrapers."
  );
  process.exit(1);
}

const port = 4183 + (process.pid % 500);
const server = await serve(port);
const routes = await routesFromSitemap();
let failures = 0;

for (const route of routes) {
  const url = `http://127.0.0.1:${port}${route}`;
  try {
    const { stdout } = await run(chrome, [
      "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
      "--virtual-time-budget=8000", "--dump-dom", url,
    ], { maxBuffer: 64 * 1024 * 1024 });

    if (!stdout.includes("</html>")) throw new Error("no complete document returned");

    const out = route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, stdout, "utf8");
    console.log(`prerender: ${route} -> ${out.replace(DIST + "/", "dist/")} (${Math.round(stdout.length / 1024)} KB)`);
  } catch (err) {
    failures++;
    console.error(`prerender: FAILED ${route}: ${err.message}`);
  }
}

server.close();
if (failures) {
  console.error(`prerender: ${failures} route(s) failed`);
  process.exit(1);
}
console.log(`prerender: ${routes.length} route(s) written`);
