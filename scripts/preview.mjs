import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const config = JSON.parse(await readFile("vercel.json", "utf8"));
const { publicRoutes, quoteHandler } = await import(pathToFileURL(resolve(".prerender/entry-server.js")));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".xml": "application/xml", ".txt": "text/plain", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };

export function createPreviewServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      const path = url.pathname;
      if (path === "/api/quote") {
        let body = "";
        for await (const chunk of request) {
          body += chunk;
          if (body.length > 100000) { response.writeHead(413).end(); return; }
        }
        try { request.body = body ? JSON.parse(body) : {}; }
        catch { response.writeHead(400, { "Content-Type": "application/json" }).end(JSON.stringify({ message: "Invalid JSON." })); return; }
        response.status = code => { response.statusCode = code; return response; };
        response.json = data => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(data)); return response; };
        await quoteHandler(request, response);
        return;
      }
      let redirect = config.redirects?.find(rule => rule.source === path)?.destination;
      if (!redirect && config.trailingSlash === false && path !== "/" && /\/$/.test(path)) redirect = path.replace(/\/+$/, "");
      if (!redirect && config.cleanUrls && path.endsWith(".html")) redirect = path === "/index.html" ? "/" : path.slice(0, -5);
      if (redirect) { response.writeHead(308, { Location: redirect + url.search }).end(); return; }

      let file = publicRoutes.includes(path) ? `${path === "/" ? "/index" : path}.html` : path;
      let status = 200;
      const candidate = resolve(dist, `.${file}`);
      if (!candidate.startsWith(dist + "/")) { response.writeHead(400).end(); return; }
      let content;
      try { content = await readFile(candidate); }
      catch { file = "/404.html"; status = 404; content = await readFile(resolve(dist, "404.html")); }
      response.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch (error) {
      console.error(error);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === resolve("scripts/preview.mjs")) {
  const index = process.argv.indexOf("--port");
  const port = index >= 0 ? Number(process.argv[index + 1]) : 4173;
  createPreviewServer().listen(port, "0.0.0.0", () => console.log(`Production build preview: http://localhost:${port}`));
}
