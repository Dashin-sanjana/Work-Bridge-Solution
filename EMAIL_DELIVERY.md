# Quotation Form Email Delivery

The website includes a Vercel serverless function at `api/quote.ts`.

To connect real email delivery:

1. Create an HTTPS endpoint with your email provider, CRM, or automation service.
2. Configure that endpoint to send quotation inquiries to `info@workbridgesolution.com`.
3. Add the endpoint URL as a Vercel environment variable named `EMAIL_WEBHOOK_URL`.
4. Redeploy the site.

Until `EMAIL_WEBHOOK_URL` is configured, the form validates user input but returns a clear setup message instead of pretending the inquiry was sent.
