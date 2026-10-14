import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { quoteHandler } from "../.prerender/entry-server.js";

const key = "mock-server-only-key";
const inquiry = { contactName: "Test Contact", organization: "Test Organization", email: "test@example.com", phone: "0000000000", facilityType: "Corporate Office", location: "Colombo", staffCount: 2, staffingType: "Long-Term Contract", startDate: "2027-01-01", requirements: "Test inquiry with all details. No live delivery.", website: "" };
const response = () => ({ code: 0, body: null, headers: {}, setHeader(name, value) { this.headers[name] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test.beforeEach(t => {
  const original = process.env.WEB3FORMS_ACCESS_KEY;
  process.env.WEB3FORMS_ACCESS_KEY = key;
  t.after(() => { if (original === undefined) delete process.env.WEB3FORMS_ACCESS_KEY; else process.env.WEB3FORMS_ACCESS_KEY = original; });
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Unmocked provider request is forbidden in tests."); });
  t.mock.method(console, "warn", () => {});
});

test("success sends every inquiry detail and cannot override key, recipient or provider options", async t => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls++;
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(options.method, "POST");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Accept, "application/json");
    assert.ok(options.signal instanceof AbortSignal);
    const payload = JSON.parse(options.body);
    assert.equal(payload.access_key, key);
    assert.equal(payload.email, inquiry.email);
    assert.equal(payload.replyto, inquiry.email);
    assert.equal(payload.botcheck, false);
    for (const reserved of ["to", "ccemail", "webhook", "redirect"]) assert.equal(payload[reserved], undefined);
    for (const [field, value] of Object.entries(inquiry)) if (field !== "website") assert.ok(payload.message.includes(String(value)), field);
    return { ok: true, status: 200, json: async () => ({ success: true, body: { data: { access_key: key }, message: "Provider reply" } }) };
  });
  const res = response();
  await quoteHandler({ method: "POST", body: { ...inquiry, access_key: "attacker-key", to: "other@example.com", ccemail: "other@example.com", webhook: "https://example.com", redirect: "https://example.com", replyto: "other@example.com" } }, res);
  assert.equal(calls, 1);
  assert.equal(res.code, 200);
  assert.equal(JSON.stringify(res.body).includes(key), false);
});

test("missing key produces a safe 503 and never contacts Web3Forms", async t => {
  delete process.env.WEB3FORMS_ACCESS_KEY;
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; });
  const res = response();
  await quoteHandler({ method: "POST", body: inquiry }, res);
  assert.equal(res.code, 503);
  assert.equal(calls, 0);
  assert.match(res.body.message, /info@workbridgesolution.com/);
  assert.equal(res.body.message.includes("ACCESS_KEY"), false);
});

test("invalid fields, honeypot, nonfinite counts and oversized field values are rejected", async t => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => { calls++; });
  for (const body of [{}, { ...inquiry, email: "invalid" }, { ...inquiry, website: "spam" }, { ...inquiry, staffCount: Infinity }, { ...inquiry, requirements: "a".repeat(5001) }]) {
    const res = response();
    await quoteHandler({ method: "POST", body }, res);
    assert.equal(res.code, 400);
  }
  assert.equal(calls, 0);
});

test("large UTF-8 payloads and declared oversized requests are rejected", async () => {
  for (const request of [{ body: { ...inquiry, requirements: "\u20ac".repeat(6000) } }, { body: inquiry, headers: { "content-length": "16001" } }]) {
    const res = response();
    await quoteHandler({ method: "POST", ...request }, res);
    assert.equal(res.code, 413);
  }
});

test("unsupported methods and content types are rejected", async () => {
  const method = response();
  await quoteHandler({ method: "GET" }, method);
  assert.equal(method.code, 405);
  assert.equal(method.headers.Allow, "POST");
  const type = response();
  await quoteHandler({ method: "POST", body: inquiry, headers: { "content-type": "text/plain" } }, type);
  assert.equal(type.code, 415);
});

test("unrelated browser origins are rejected; production and current preview origins are accepted", async t => {
  const saved = { VERCEL_URL: process.env.VERCEL_URL, VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL };
  t.after(() => { for (const [name, value] of Object.entries(saved)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; } });
  process.env.VERCEL_URL = "work-bridge-preview.vercel.app";
  t.mock.method(globalThis, "fetch", async () => ({ ok: true, status: 200, json: async () => ({ success: true }) }));
  const blocked = response();
  await quoteHandler({ method: "POST", body: inquiry, headers: { origin: "https://other.example.com" } }, blocked);
  assert.equal(blocked.code, 403);
  for (const origin of ["https://www.workbridgesolution.com", "https://work-bridge-preview.vercel.app"]) {
    const res = response();
    await quoteHandler({ method: "POST", body: inquiry, headers: { origin, "content-type": "application/json; charset=utf-8" } }, res);
    assert.equal(res.code, 200);
  }
});

for (const status of [400, 403, 500]) test(`provider HTTP ${status} becomes a safe 502`, async t => {
  t.mock.method(globalThis, "fetch", async () => ({ ok: false, status }));
  const res = response();
  await quoteHandler({ method: "POST", body: inquiry }, res);
  assert.equal(res.code, 502);
  assert.equal(JSON.stringify(res.body).includes(key), false);
});

for (const data of [{ success: false, message: key }, { message: "Missing success flag" }, { success: "true" }]) test(`invalid or unsuccessful provider JSON is never treated as success: ${JSON.stringify(data)}`, async t => {
  t.mock.method(globalThis, "fetch", async () => ({ ok: true, status: 200, json: async () => data }));
  const res = response();
  await quoteHandler({ method: "POST", body: inquiry }, res);
  assert.equal(res.code, 502);
  assert.equal(JSON.stringify(res.body).includes(key), false);
});

test("malformed provider JSON and network errors are safely handled", async t => {
  for (const mock of [async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError("Invalid JSON"); } }), async () => { throw new Error(`Network failure containing ${key}`); }]) {
    t.mock.method(globalThis, "fetch", mock);
    const res = response();
    await quoteHandler({ method: "POST", body: inquiry }, res);
    assert.equal(res.code, 502);
    assert.equal(JSON.stringify(res.body).includes(key), false);
  }
});

test("upstream rate limiting returns a safe 429", async t => {
  t.mock.method(globalThis, "fetch", async () => ({ ok: false, status: 429 }));
  const res = response();
  await quoteHandler({ method: "POST", body: inquiry }, res);
  assert.equal(res.code, 429);
});

test("provider requests are aborted at the configured timeout", async t => {
  const controller = new AbortController();
  t.mock.method(AbortSignal, "timeout", milliseconds => { assert.equal(milliseconds, 10000); return controller.signal; });
  t.mock.method(globalThis, "fetch", async (_url, options) => new Promise((_, reject) => {
    options.signal.addEventListener("abort", () => reject(options.signal.reason), { once: true });
    setTimeout(() => controller.abort(new DOMException("Timed out", "TimeoutError")), 5);
  }));
  const res = response();
  await quoteHandler({ method: "POST", body: inquiry }, res);
  assert.equal(res.code, 504);
  assert.equal(res.body.message.includes(key), false);
});

test("client build contains no rollback-only environment access or server test key", async () => {
  for (const file of await readdir("dist/assets")) {
    if (!file.endsWith(".js")) continue;
    const source = await readFile(`dist/assets/${file}`, "utf8");
    for (const rollbackMarker of ["process.env.WEB3FORMS_ACCESS_KEY", key]) {
      assert.equal(source.includes(rollbackMarker), false, `${rollbackMarker} leaked into ${file}`);
    }
  }
});
