import { readFile } from "node:fs/promises";
import Ajv from "ajv";

const response = await fetch("https://openapi.vercel.sh/vercel.json", { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Vercel schema could not be fetched: ${response.status}`);
const schema = await response.json();
const config = JSON.parse(await readFile("vercel.json", "utf8"));
// The published document mixes draft conventions in unused experimental fields.
// Validate every configured field against its unchanged official definition.
const properties = {};
for (const key of Object.keys(config)) {
  if (!schema.properties[key]) throw new Error(`Unknown Vercel configuration field: ${key}`);
  properties[key] = schema.properties[key];
}
const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false });
const validate = ajv.compile({ type: "object", additionalProperties: false, properties });
if (!validate(config)) throw new Error(JSON.stringify(validate.errors, null, 2));
console.log("All configured vercel.json fields pass their official Vercel schema definitions.");
