import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

const quoteSchema = z.object({
  contactName: z.string().min(2).max(100),
  organization: z.string().min(2).max(200),
  email: z.string().email().max(254),
  phone: z.string().min(6).max(50),
  facilityType: z.string().min(1).max(100),
  location: z.string().min(2).max(300),
  staffCount: z.coerce.number().min(1).finite(),
  staffingType: z.string().min(1).max(100),
  startDate: z.string().min(1).max(40),
  requirements: z.string().min(10).max(5000),
  website: z.string().max(0).optional()
});
const providerResponseSchema = z.object({ success: z.boolean() });
const unavailableMessage = "Your inquiry could not be sent right now. Please try again later or email info@workbridgesolution.com.";
const maxBodyBytes = 16000;

function allowedOrigin(origin: string) {
  const allowed = new Set(["https://www.workbridgesolution.com", "https://workbridgesolution.com"]);
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) allowed.add(`https://${host}`);
  }
  if (allowed.has(origin)) return true;
  if (!process.env.VERCEL) {
    try { return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname); }
    catch { return false; }
  }
  return false;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }
  const contentType = request.headers?.["content-type"];
  if (contentType && (typeof contentType !== "string" || contentType.split(";")[0].trim().toLowerCase() !== "application/json")) {
    return response.status(415).json({ message: "Please submit the inquiry as JSON." });
  }
  const origin = request.headers?.origin;
  if (origin && (typeof origin !== "string" || !allowedOrigin(origin))) {
    return response.status(403).json({ message: "This submission origin is not allowed." });
  }
  try {
    if (Number(request.headers?.["content-length"] ?? 0) > maxBodyBytes || Buffer.byteLength(JSON.stringify(request.body) ?? "", "utf8") > maxBodyBytes) {
      return response.status(413).json({ message: "The inquiry is too large. Please shorten your requirements." });
    }
  } catch {
    return response.status(400).json({ message: "Please check the form fields and try again." });
  }
  const parsed = quoteSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ message: "Please check the form fields and try again." });

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) return response.status(503).json({ message: unavailableMessage });

  const inquiry = parsed.data;
  const message = [
    "Work Bridge Solution - Business Quotation Inquiry",
    `Contact Person Name: ${inquiry.contactName}`,
    `Company / Organization Name: ${inquiry.organization}`,
    `Business Email: ${inquiry.email}`,
    `Phone Number: ${inquiry.phone}`,
    `Property / Facility Type: ${inquiry.facilityType}`,
    `Property Location: ${inquiry.location}`,
    `Required Cleaning Staff Count: ${inquiry.staffCount}`,
    `Type of Staffing Requirement: ${inquiry.staffingType}`,
    `Preferred Starting Date: ${inquiry.startDate}`,
    "Additional Requirements:",
    inquiry.requirements
  ].join("\n");

  try {
    // The server's key determines the recipient; client provider options are never forwarded.
    const delivery = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Quotation request from ${inquiry.organization.replace(/[\r\n]/g, " ")}`,
        from_name: "Work Bridge Solution Website",
        name: inquiry.contactName,
        email: inquiry.email,
        replyto: inquiry.email,
        botcheck: false,
        message
      })
    });
    if (delivery.status === 429) {
      return response.status(429).json({ message: "Too many inquiries. Please wait a few minutes before trying again." });
    }
    if (!delivery.ok) {
      console.warn("Web3Forms rejected quotation submission", { status: delivery.status });
      return response.status(502).json({ message: unavailableMessage });
    }
    const result = providerResponseSchema.safeParse(await delivery.json());
    if (!result.success || !result.data.success) return response.status(502).json({ message: unavailableMessage });
  } catch (error) {
    const timedOut = error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name);
    console.warn("Web3Forms quotation submission could not be confirmed", { reason: timedOut ? "timeout" : "provider_failure" });
    return response.status(timedOut ? 504 : 502).json({ message: unavailableMessage });
  }
  return response.status(200).json({ message: "Inquiry sent." });
}
