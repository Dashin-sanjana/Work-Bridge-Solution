import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "parse5";
import { publicRoutes, quoteHandler } from "../.prerender/entry-server.js";
import { createPreviewServer } from "../scripts/preview.mjs";

const origin = "https://www.workbridgesolution.com";
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attribute = (node, name) => node.attrs?.find(attr => attr.name === name)?.value;
const text = node => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");
const pages = new Map();
for (const path of publicRoutes) {
  pages.set(path, nodes(parse(await readFile(`dist/${path === "/" ? "index" : path.slice(1)}.html`, "utf8"))));
}

for (const [path, elements] of pages) {
  test(`${path}: initial HTML has content, unique metadata, canonical and schema`, () => {
    const find = (tag, attr, value) => elements.filter(node => node.tagName === tag && attribute(node, attr) === value);
    assert.equal(find("link", "rel", "canonical").length, 1);
    assert.equal(attribute(find("link", "rel", "canonical")[0], "href"), origin + path);
    assert.equal(find("meta", "name", "description").length, 1);
    assert.ok(attribute(find("meta", "name", "description")[0], "content").length > 50);
    assert.equal(attribute(find("meta", "property", "og:url")[0], "content"), origin + path);
    assert.equal(attribute(find("meta", "name", "twitter:card")[0], "content"), "summary");
    assert.equal(elements.filter(node => node.tagName === "h1").length, 1);
    assert.ok(text(elements.find(node => node.tagName === "main")).length > 300);
    const schemas = find("script", "type", "application/ld+json").map(node => JSON.parse(text(node)));
    const organization = schemas.find(schema => schema["@type"] === "Organization");
    assert.equal(organization.url, origin);
    assert.equal(organization.areaServed.name, "Sri Lanka");
    assert.ok(organization.description.includes("Colombo"));
    for (const node of elements.filter(node => node.tagName === "a")) {
      const url = new URL(attribute(node, "href"), origin + path);
      if (url.origin !== origin) continue;
      assert.ok(publicRoutes.includes(url.pathname), `Broken internal link ${url}`);
      if (url.hash) assert.ok(pages.get(url.pathname).some(element => attribute(element, "id") === url.hash.slice(1)), `Broken anchor ${url}`);
    }
  });
}

test("every public route has a distinct title and description", () => {
  const titles = [...pages.values()].map(elements => text(elements.find(node => node.tagName === "title")));
  const descriptions = [...pages.values()].map(elements => attribute(elements.find(node => attribute(node, "name") === "description"), "content"));
  assert.equal(new Set(titles).size, publicRoutes.length);
  assert.equal(new Set(descriptions).size, publicRoutes.length);
});

test("404 is crawlable, noindex, and does not claim a homepage canonical", async () => {
  const elements = nodes(parse(await readFile("dist/404.html", "utf8")));
  assert.equal(attribute(elements.find(node => attribute(node, "name") === "robots"), "content"), "noindex,follow");
  assert.equal(elements.filter(node => attribute(node, "rel") === "canonical").length, 0);
  assert.match(text(elements.find(node => node.tagName === "h1")), /couldn't be found/);
});

test("no-JavaScript HTML keeps essential text and links and exposes reveal content", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const elements = nodes(parse(html, { scriptingEnabled: false }));
  const fallback = elements.find(node => node.tagName === "noscript");
  assert.ok(fallback);
  assert.match(text(fallback), /opacity:1!important/);
  assert.match(text(fallback), /animation:none!important/);
  assert.match(text(elements.find(node => node.tagName === "main")), /Colombo focus\. Island-wide coverage/);
  assert.ok(elements.filter(node => node.tagName === "a" && attribute(node, "href") === "/services").length > 0);
});

test("sitemap and robots match the preferred domain and public routes", async () => {
  const xml = await readFile("dist/sitemap.xml", "utf8");
  const urls = nodes(parse(xml)).filter(node => node.tagName === "loc").map(text);
  assert.deepEqual(urls, publicRoutes.map(path => origin + path));
  assert.match(await readFile("dist/robots.txt", "utf8"), /Sitemap: https:\/\/www\.workbridgesolution\.com\/sitemap\.xml/);
});

test("preview HTTP statuses, redirects, assets and API are preserved", async t => {
  const server = createPreviewServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of publicRoutes) assert.equal((await fetch(base + path)).status, 200, path);
  for (const path of ["/missing", "/services/missing", "/assets/missing.js"]) assert.equal((await fetch(base + path)).status, 404, path);
  for (const [from, to] of [["/about/", "/about"], ["/about.html", "/about"], ["/index", "/"], ["/index.html", "/"]]) {
    const response = await fetch(base + from, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), to);
  }
  assert.equal((await fetch(base + "/work-bridge-logo.jpg")).status, 200);
  assert.equal((await fetch(base + "/api/quote")).status, 405);
  assert.equal((await fetch(base + "/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, 400);
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  assert.equal(config.cleanUrls, true);
  assert.equal(config.trailingSlash, false);
  assert.equal(config.outputDirectory, "dist");
  assert.equal(config.rewrites, undefined);
});

const validInquiry = { contactName: "Test Contact", organization: "Test Organization", email: "test@example.com", phone: "0000000000", facilityType: "Corporate Office", location: "Colombo", staffCount: 2, staffingType: "Long-Term Contract", startDate: "2027-01-01", requirements: "Local test inquiry; not delivered.", website: "" };
function captureResponse() {
  return { code: 0, body: null, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

test("quote handler retains spam rejection, missing-provider feedback and delivery behavior", async t => {
  t.mock.method(console, "warn", () => {});
  const original = process.env.WEB3FORMS_ACCESS_KEY;
  t.after(() => { if (original === undefined) delete process.env.WEB3FORMS_ACCESS_KEY; else process.env.WEB3FORMS_ACCESS_KEY = original; });
  delete process.env.WEB3FORMS_ACCESS_KEY;
  const missing = captureResponse();
  await quoteHandler({ method: "POST", body: validInquiry }, missing);
  assert.equal(missing.code, 503);
  const spam = captureResponse();
  await quoteHandler({ method: "POST", body: { ...validInquiry, website: "spam" } }, spam);
  assert.equal(spam.code, 400);
  process.env.WEB3FORMS_ACCESS_KEY = "mock-web3forms-access-key";
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(JSON.parse(options.body).access_key, "mock-web3forms-access-key");
    return { ok: true, json: async () => ({ success: true }) };
  });
  const success = captureResponse();
  await quoteHandler({ method: "POST", body: validInquiry }, success);
  assert.equal(success.code, 200);
  t.mock.method(globalThis, "fetch", async () => ({ ok: false, status: 500 }));
  const failed = captureResponse();
  await quoteHandler({ method: "POST", body: validInquiry }, failed);
  assert.equal(failed.code, 502);
});
