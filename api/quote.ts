import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

const quoteSchema = z.object({
  contactName: z.string().min(2),
  organization: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  facilityType: z.string().min(1),
  location: z.string().min(2),
  staffCount: z.coerce.number().min(1),
  staffingType: z.string().min(1),
  startDate: z.string().min(1),
  requirements: z.string().min(10),
  website: z.string().max(0).optional()
});

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  const parsed = quoteSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ message: "Please check the form fields and try again." });
  }

  if (!process.env.EMAIL_WEBHOOK_URL) {
    return response.status(503).json({
      message:
        "Quotation email delivery is not configured yet. Add EMAIL_WEBHOOK_URL in Vercel to send inquiries to info@workbridgesolution.com."
    });
  }

  const delivery = await fetch(process.env.EMAIL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "info@workbridgesolution.com",
      subject: `Quotation request from ${parsed.data.organization}`,
      ...parsed.data
    })
  });

  if (!delivery.ok) {
    return response.status(502).json({ message: "Email delivery failed. Please try again later." });
  }

  return response.status(200).json({ message: "Inquiry sent." });
}
