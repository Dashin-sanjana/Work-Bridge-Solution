import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parse } from "parse5";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { publicRoutes, servicePages, contactNumbers, contactLinks } from "../.prerender/entry-server.js";
import { createPreviewServer } from "../scripts/preview.mjs";

const origin = "https://www.workbridgesolution.com";
const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const text = node => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");
const fileFor = path => `dist/${path === "/" ? "index" : path.slice(1)}.html`;
const unpublished = ["/services/security-staff-supply", "/services/general-labour-supply"];

test("only four approved cleaning services are registered", () => {
  assert.equal(servicePages.length, 4);
  assert.equal(publicRoutes.length, 11);
  for (const path of unpublished) assert.equal(publicRoutes.includes(path), false);
});

for (const page of servicePages) {
  test(`${page.path}: scope, answers, contacts, breadcrumbs and connected schema`, async () => {
    const elements = walk(parse(await readFile(fileFor(page.path), "utf8")));
    const main = elements.find(node => node.tagName === "main");
    const content = walk(main);
    const links = content.filter(node => node.tagName === "a");
    assert.equal(text(content.find(node => node.tagName === "h1")), page.title);
    for (const item of page.scope) assert.ok(text(main).includes(item));
    for (const answer of page.answers) {
      assert.ok(text(main).includes(answer.question));
      assert.ok(text(main).includes(answer.answer));
    }
    assert.match(text(main), /Colombo/);
    assert.match(text(main), /island-wide/i);
    assert.ok(links.some(node => attr(node, "href") === contactLinks.email));
    for (const contact of contactNumbers) for (const channel of ["phone", "whatsapp"]) assert.ok(links.some(node => attr(node, "href") === contact[channel]));
    const schemas = elements.filter(node => attr(node, "type") === "application/ld+json").map(node => JSON.parse(text(node)));
    const service = schemas.find(schema => schema["@type"] === "Service");
    const webPage = schemas.find(schema => schema["@type"] === "WebPage");
    const breadcrumb = schemas.find(schema => schema["@type"] === "BreadcrumbList");
    assert.equal(service.url, origin + page.path);
    assert.equal(service.provider["@id"], origin + "/#organization");
    assert.equal(service.mainEntityOfPage["@id"], webPage["@id"]);
    assert.equal(webPage.mainEntity["@id"], service["@id"]);
    assert.deepEqual(breadcrumb.itemListElement.map(item => item.item), [origin + "/", origin + "/services", origin + page.path]);
    assert.equal(new Set(schemas.map(schema => schema["@id"])).size, schemas.length);
    assert.equal(content.some(node => node.tagName === "form"), false);
    assert.equal(attr(elements.find(node => attr(node, "name") === "robots"), "content").includes("noindex"), false);
  });
}

test("generated sitemap is valid XML and excludes drafts", async () => {
  const xml = await readFile("dist/sitemap.xml", "utf8");
  assert.equal(XMLValidator.validate(xml), true);
  const sitemap = new XMLParser({ ignoreAttributes: false }).parse(xml);
  assert.equal(sitemap.urlset["@_xmlns"], "http://www.sitemaps.org/schemas/sitemap/0.9");
  assert.deepEqual(sitemap.urlset.url.map(item => item.loc), publicRoutes.map(path => origin + path));
  for (const path of unpublished) assert.equal(xml.includes(path), false);
});

test("all public pages have connected WebPage and breadcrumb entities without unapproved services", async () => {
  for (const path of publicRoutes) {
    const html = await readFile(fileFor(path), "utf8");
    const elements = walk(parse(html));
    const schemas = elements.filter(node => attr(node, "type") === "application/ld+json").map(node => JSON.parse(text(node)));
    const webPage = schemas.find(schema => schema["@type"] === "WebPage");
    assert.equal(webPage.url, origin + path);
    assert.equal(webPage.publisher["@id"], origin + "/#organization");
    if (path !== "/") assert.ok(schemas.some(schema => schema["@id"] === webPage.breadcrumb["@id"]));
    for (const draft of unpublished) assert.equal(html.includes(draft), false);
    for (const image of elements.filter(node => node.tagName === "img")) assert.ok(attr(image, "alt"));
    const list = schemas.find(schema => schema["@type"] === "ItemList");
    if (list) assert.deepEqual(list.itemListElement.map(entry => entry.item.url).sort(), servicePages.map(page => origin + page.path).sort());
  }
});

test("public pages do not publish the removed operational claims", async () => {
  const unsupportedClaims = [
    "Professional Supervision",
    "Clear coordination and practical oversight",
    "Coordination of onboarding and supervision expectations",
    "Review of attendance and quality concerns",
    "Vetted & Trained Staff",
    "Trained Workforce"
  ];
  for (const path of publicRoutes) {
    const html = await readFile(fileFor(path), "utf8");
    for (const claim of unsupportedClaims) assert.equal(html.includes(claim), false, `${path} contains ${claim}`);
  }
});

test("nested redirects, draft 404s, legacy anchors and optimized images work", async t => {
  const server = createPreviewServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of unpublished) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
    assert.match(await response.text(), /noindex,follow/);
  }
  for (const page of servicePages) {
    for (const suffix of ["/", ".html"]) {
      const response = await fetch(base + page.path + suffix, { redirect: "manual" });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), page.path);
    }
  }
  const hub = await (await fetch(base + "/services")).text();
  for (const page of servicePages) assert.ok(hub.includes(`id="${page.legacySlug}"`));
  for (const width of [640, 1280, 1536]) {
    const response = await fetch(base + `/hospitality-hero-${width}.webp`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/webp");
  }
});
