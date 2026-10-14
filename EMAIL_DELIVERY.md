# Direct Business Contact

The visible inquiry form has been replaced by three direct-contact actions.
No Web3Forms frontend integration or frontend access key is required.

## Verified Details

- Email: `info@workbridgesolution.com`
- Phone and WhatsApp: `0763568325`, supplied by the owner for both channels.
- International display: `+94 76 356 8325`.

`src/config/company.ts` owns the verified details. `src/config/contact.ts`
creates shared links used by the contact page, header and footer:

- Email opens the customer's email app with subject
  `Business Inquiry - Work Bridge Solution`. The address is visible/selectable
  and a copy button is available when the browser permits clipboard access.
- WhatsApp opens `https://wa.me/94763568325` with a short business inquiry draft.
  The visitor still chooses whether to send it.
- Phone opens `tel:+94763568325`; the visitor chooses whether to place the call.

No email is sent by the website itself, and no call or message is sent
automatically. Missing or malformed numbers produce unavailable actions,
never fake links. No external service or payment is required for these links.

## Removed Frontend Form

`QuoteForm`, the browser-side Web3Forms helper and their browser integration
tests are removed. `react-hook-form` and `@hookform/resolvers` were used only
by that form and are removed. The obsolete Vite access-key declaration and
example are removed; an existing Vercel `VITE_WEB3FORMS_ACCESS_KEY` setting can
be removed manually when reviewing the next approved release. No Vercel settings
were changed automatically.

## Retained Legacy API

`api/quote.ts` is retained without edits because the production-preview tooling
and automated API tests depend on it. Existing external callers have not been
ruled out. It is not invoked by the active website.

The optional server-side `WEB3FORMS_ACCESS_KEY` in `.env.example` applies only
to that legacy endpoint. Leave it unset if the endpoint should remain inactive;
valid submissions then return 503 rather than pretending email was sent.
Any future restoration must meet Web3Forms' documented server-side requirements.
Zod remains installed for the endpoint's existing server validation.

## Verification And Release

Run `npm run build`, `npm run lint`, and `npm test`. The tests check contact
URLs, subject/message encoding, international formatting, missing-number
handling, prerendered actions, schema consistency, frontend service removal,
Phase 1 metadata/routing, and the unchanged legacy API behavior.

Contact links can be verified without sending a message or placing a call.
Clipboard, mobile layouts and console diagnostics should also be checked in
the browser. The existing prerendered build, canonical URLs, sitemap and robots
rules remain intact. Deployment and Git push require separate approval.
