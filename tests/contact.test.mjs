import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { parse } from "parse5";
import { contactLinks, contactNumbers, getContactLinks, inquirySubject, whatsappInquiry, publicRoutes } from "../.prerender/entry-server.js";

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const text = node => node.nodeName === "#text" ? node.value : (node.childNodes ?? []).map(text).join("");

test("email action uses the verified address and prefilled business subject", () => {
  const url = new URL(contactLinks.email);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "info@workbridgesolution.com");
  assert.equal(url.searchParams.get("subject"), inquirySubject);
  assert.equal(inquirySubject, "Business Inquiry - Work Bridge Solution");
});

test("WhatsApp and phone actions use the user-supplied number in international form", () => {
  assert.equal(contactLinks.phone, "tel:+94763568325");
  const url = new URL(contactLinks.whatsapp);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/94763568325");
  assert.equal(url.searchParams.get("text"), whatsappInquiry);
});

test("both official numbers have distinct call and WhatsApp links", () => {
  assert.deepEqual(contactNumbers.map(contact => contact.number), ["+94 76 356 8325", "+94 77 618 0810"]);
  for (const [index, digits] of ["94763568325", "94776180810"].entries()) {
    const contact = contactNumbers[index];
    assert.equal(contact.phone, `tel:+${digits}`);
    const url = new URL(contact.whatsapp);
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, `/${digits}`);
    assert.equal(url.searchParams.get("text"), whatsappInquiry);
  }
});

test("missing and malformed numbers never create fake contact links", () => {
  for (const value of ["", "not supplied", "0763568325", "javascript:alert(1)"]) {
    const links = getContactLinks({ email: "info@workbridgesolution.com", phone: value, whatsapp: value });
    assert.equal(links.phone, null);
    assert.equal(links.whatsapp, null);
  }
});

test("prerendered contact page contains all three working actions, no form, and copy control", async () => {
  const elements = walk(parse(await readFile("dist/contact.html", "utf8")));
  const main = elements.find(n => n.tagName === "main");
  const content = walk(main);
  assert.equal(content.some(n => ["form", "input", "textarea", "select"].includes(n.tagName)), false);
  const anchors = content.filter(n => n.tagName === "a");
  for (const href of Object.values(contactLinks)) assert.equal(anchors.filter(n => attr(n, "href") === href).length, 1);
  const whatsapp = anchors.find(n => attr(n, "href") === contactLinks.whatsapp);
  assert.equal(attr(whatsapp, "target"), "_blank");
  assert.match(attr(whatsapp, "rel"), /noopener/);
  assert.ok(content.some(n => n.tagName === "button" && attr(n, "aria-label") === "Copy email address"));
  assert.match(text(main), /info@workbridgesolution.com/);
  assert.match(text(main), /Colombo focus/);
  const schema = elements.filter(n => attr(n, "type") === "application/ld+json").map(n => JSON.parse(text(n))).find(s => s["@type"] === "Organization");
  assert.equal(schema.telephone, "+94763568325");
  assert.deepEqual(schema.contactPoint.map(point => point.telephone), ["+94763568325", "+94776180810"]);
  for (const contact of contactNumbers) {
    for (const channel of ["phone", "whatsapp"]) {
      const matches = anchors.filter(n => attr(n, "href") === contact[channel]);
      assert.equal(matches.length, 1);
      assert.match(attr(matches[0], "aria-label"), new RegExp(contact.number.replace(/[+]/g, "\\+")));
      assert.ok(text(matches[0]).includes(contact.number));
      if (channel === "whatsapp") {
        assert.equal(attr(matches[0], "target"), "_blank");
        assert.match(attr(matches[0], "rel"), /noopener/);
      }
    }
  }
});

test("header and footer use the same email subject and verified phone links", async () => {
  const elements = walk(parse(await readFile("dist/contact.html", "utf8")));
  const footer = elements.find(n => n.tagName === "footer");
  const links = walk(footer).filter(n => n.tagName === "a").map(n => attr(n, "href"));
  for (const href of Object.values(contactLinks)) assert.ok(links.includes(href));
  for (const contact of contactNumbers) {
    assert.equal(links.filter(href => href === contact.phone).length, 1);
    assert.equal(links.filter(href => href === contact.whatsapp).length, 1);
  }
});

test("every prerendered public page exposes both numbers in its footer and schema", async () => {
  for (const path of publicRoutes) {
    const file = `${path === "/" ? "index" : path.slice(1)}.html`;
    const elements = walk(parse(await readFile(`dist/${file}`, "utf8")));
    const footer = walk(elements.find(n => n.tagName === "footer"));
    for (const contact of contactNumbers) {
      assert.ok(text(footer[0]).includes(contact.number), file);
      for (const channel of ["phone", "whatsapp"]) assert.equal(footer.filter(n => attr(n, "href") === contact[channel]).length, 1, file);
    }
    const organization = elements.filter(n => attr(n, "type") === "application/ld+json").map(n => JSON.parse(text(n))).find(s => s["@type"] === "Organization");
    assert.deepEqual(organization.contactPoint.map(point => point.telephone), ["+94763568325", "+94776180810"], file);
  }
});

test("active client build has no form service or obsolete frontend access key", async () => {
  for (const file of await readdir("dist/assets")) {
    if (!file.endsWith(".js")) continue;
    const code = await readFile(`dist/assets/${file}`, "utf8");
    assert.equal(code.includes("https://api.web3forms.com/submit"), false);
    assert.equal(code.includes("VITE_WEB3FORMS_ACCESS_KEY"), false);
    assert.equal(code.includes("/api/quote"), false);
  }
});
